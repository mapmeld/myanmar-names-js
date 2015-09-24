if (typeof module !== 'undefined' && typeof require === 'function') {
  var myanmarSort = require('myanmar-sort');
}

function trim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}

function removePrefixes (name) {
  var prefixes = [
    "အရှင်",
    "အသျှင်",
    "ဗညား",
    "ဗညာ",
    "ဗိုလ်ချုပ်",
    "ဗိုလ်",
    "ဒေါ်",
    "ဒူးဝါး",
    "ကြီး",
    "ခွန်",
    "ဦး",
    "နိုင်",
    "မယ်",
    "မန်း",
    "နန်း",
    "နော်",
    "စိုင်း",
    "ဆလိုင်း",
    "စဝ်",
    "စော",
    "စော်ဘွား",
    "ဒေါက်တာ",
    "ဆရာတော်",
    "ဆရာမ",
    "ဆရာ",
    "ရှင်",
    "သျှင်",
    "တက္ကသိုလ်",
    "သခင်",
    "သိပ္ပံ",
    "Dr.",
    "Dr",
    "MD"
  ];
  for (var p = 0; p < prefixes.length; p++) {
    if (name.indexOf(prefixes[p]) === 0) {
      name = trim(name.replace(prefixes[p], ''));
    }
  }
  return name;
}

function myanmarNameSort(namelist, namefinder) {
  var collator = null;
  if (typeof myanmarSort === 'undefined') {
    if (typeof Intl === "undefined" || typeof Intl.Collator === "undefined") {
      throw "Intl.Collator and myanmar-sort module not available";
    } else {
      // Intl.Collator available on the client side
      collator = new Intl.Collator("my-MM");
    }
  }

  return namelist.sort(function(a, b) {
    if (namefinder && typeof namefinder === 'function') {
      a = namefinder(a);
      b = namefinder(b);
    }
    a = removePrefixes(trim("" + a));
    b = removePrefixes(trim("" + b));
    if (collator) {
      return collator.compare(a, b);
    } else {
      return myanmarSort(a, b);
    }
  });
}

function calculateScore(name, testName, secondEdition) {
  var letterScores = {"​ ":40,"ဦ ":4,"ဒ ":40,"ဂဝ":5,"ာါ":9,"​အ":1,"ဒေ":1,"ော":1,"ါင":1,"စ ":4,"ထတ":2,"အ ":1,"ဝဂ":1,"ခ ":14,"ွ ":12,"ကတ":2,"ခန":3,"ီ ":2,"ဥဉ":30,"တ ":1,"ာ ":1,"န ":2,"် ":2,"တက":2,"ါာ":2,"ထလ":2};

  for (var symbol in letterScores) {
    if (symbol[1] === ' ') {
      // removing the character
      var replacer = new RegExp(symbol[0], 'g');
      if (testName.replace(replacer, '') === name) {
        return letterScores[symbol] / 40;
      }
    } else {
      // changing the character
      var replacer = new RegExp(symbol[0], 'g');
      if (testName.replace(replacer, symbol[1]) === name || name.replace(replacer, symbol[1]) === testName) {
        return letterScores[symbol] / 40;
      }
    }
  }

  if (!secondEdition) {
    // ok one replace doesn't work - try recursion
    for (var symbol in letterScores) {
      if (symbol[1] === ' ') {
        // removing the character
        var replacer = new RegExp(symbol[0], 'g');
        testName2 = testName.replace(replacer, '');
        var score2 = calculateScore(name, testName2, true);
        if (score2 > 0) {
          return (score2 * letterScores[symbol] / 40);
        }
      } else {
        // changing the character
        var replacer = new RegExp(symbol[0], 'g');
        testName2 = testName.replace(replacer, symbol[1]);
        var score2 = calculateScore(name, testName2, true);
        if (score2 > 0) {
          return (score2 * letterScores[symbol] / 40);
        }
        var name2 = name.replace(replacer, symbol[1]);
        var score2 = calculateScore(name2, testName2, true);
        if (score2 > 0) {
          return (score2 * letterScores[symbol] / 40);
        }
      }
    }
  } else {
    // didn't find on second level
    return 0;
  }
}

function myanmarNameMatch (name, nameList, namefinder) {
  // prepare name
  if (namefinder && typeof namefinder === 'function') {
    name = namefinder(name);
  }
  name = name.replace(/\s/g, '').replace(/့်/g, '့်');

  // tally best names
  var foundExact = [];
  var foundPrefixless = [];
  var foundPartial = [];
  var foundScored = [];

  for (var n = 0; n < nameList.length; n++) {
    // prepare testName
    var testName = nameList[n];
    if (namefinder && typeof namefinder === 'function') {
      testName = namefinder(testName);
    }
    testName = testName.replace(/\s/g, '').replace(/့်/g, '့်');

    if (testName === name) {
      foundExact.push(nameList[n]);
    } else if (removePrefixes(testName) === removePrefixes(name)) {
      foundPrefixless.push(nameList[n]);
    } else if (testName.indexOf(removePrefixes(name)) > -1 || name.indexOf(testName) > -1) {
      foundPartial.push(nameList[n]);
    } else {
      var score = calculateScore(name, testName);
      if (score > 0) {
        foundScored.push({
          name: nameList[n],
          score: score
        });
      }
    }
  }

  // return best list of best matches
  if (foundExact.length) {
    return foundExact;
  }
  if (foundPrefixless.length) {
    return foundPrefixless;
  }
  if (foundPartial.length) {
    foundPartial = foundPartial.sort(function (a, b) {
      return b.length - a.length;
    });
    return foundPartial;
  }
  if (foundScored.length) {
    foundScored = foundScored.sort(function (a, b) {
      return b.score - a.score;
    });
    var scored = [];
    for (var a = 0; a < foundScored.length; a++) {
      scored.push(foundScored[a].name);
    }
    return scored;
  }
  // no matches
  return [];
}

if (typeof module !== "undefined") {
  module.exports = {
    sort: myanmarNameSort,
    match: myanmarNameMatch,
    removePrefixes: removePrefixes,
    calculateScore: calculateScore
  };
}
