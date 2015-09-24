if (typeof module !== 'undefined' && typeof require === 'function') {
  var myanmarSort = require('myanmar-sort');
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

  function trim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
  }

  return namelist.sort(function(a, b) {
    if (namefinder && typeof namefinder === 'function') {
      a = namefinder(a);
      b = namefinder(b);
    }
    a = trim("" + a);
    b = trim("" + b);
    for (var p = 0; p < prefixes.length; p++) {
      if (a.indexOf(prefixes[p]) === 0) {
        a = trim(a.replace(prefixes[p], ''));
      }
      if (b.indexOf(prefixes[p]) === 0) {
        b = trim(b.replace(prefixes[p], ''));
      }
    }
    if (collator) {
      return collator.compare(a, b);
    } else {
      return myanmarSort(a, b);
    }
  });
}

if (typeof module !== "undefined") {
  module.exports = myanmarNameSort;
}
