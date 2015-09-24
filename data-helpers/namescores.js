var fs = require('fs');
var sqlite3 = require('sqlite3');

// candidate final db
var db = new sqlite3.Database('./official.sqlite3');

// original db
var matches = new sqlite3.Database('./database.sqlite3');

var removePrefixes = require('../myanmar.names.js').removePrefixes;

db.all('SELECT full_name, best_entry_id, best_consensus_id FROM candidates WHERE best_entry_id IS NOT NULL or best_consensus_id IS NOT NULL', function (err, ppl) {
  if (err) {
    throw err;
  }

  var letterScores = {};

  function checkNameMatch (p) {
    if (p >= ppl.length) {
      return fs.writeFile('./letterScores.json', JSON.stringify(letterScores), function (err) {
        if (err) {
          throw err;
        }
        console.log('done');
      });
    }

    var uec_person = ppl[p];

    function processCandidate (err, npt_person) {
      if (err) {
        throw err;
      }

      if (!uec_person || !uec_person.full_name || !npt_person || !npt_person.full_name) {
        return checkNameMatch(p + 1);
      }

      uec_person = removePrefixes(uec_person.full_name.replace(/\s+/g, ''));
      npt_person = removePrefixes(npt_person.full_name.replace(/\s+/g, ''));

      if (uec_person === npt_person || Math.abs(uec_person.length - npt_person.length) > 5) {
        // these names are perfectly equal, or completely different
        return checkNameMatch(p + 1);
      }

      if (uec_person.length > npt_person.length) {
        var offset = 0;
        for (var c = 0; c < uec_person.length; c++) {
          if (c + offset >= npt_person.length || uec_person[c] != npt_person[c]) {
            var symbol = uec_person[c] + ' ';
            if (!letterScores[symbol]) {
              letterScores[symbol] = 0;
            }
            letterScores[symbol]++;

            // allow one or two chars to be failed in a row
            // but after that it's going off course
            offset++;
            if (offset >= 2) {
              break;
            }
          } else {
            offset = Math.max(0, offset - 1);
          }
        }
      } else if (uec_person.length < npt_person.length) {
        // npt added characters?
        console.log(uec_person + " written longer as " + npt_person);
      } else {
        for (var c = 0; c < uec_person.length; c++) {
          if (uec_person[c] !== npt_person[c]) {
            var symbol = uec_person[c] + npt_person[c];
            if (!letterScores[symbol]) {
              letterScores[symbol] = 0;
            }
            letterScores[symbol]++;
          }
        }
      }
      return checkNameMatch(p + 1);
    }

    if (uec_person.best_entry_id) {
      matches.get('SELECT full_name FROM entries WHERE id = ?', uec_person.best_entry_id, processCandidate);
    } else {
      matches.get('SELECT full_name FROM consensus_forms WHERE id = ?', uec_person.best_consensus_id, processCandidate);
    }
  }

  checkNameMatch(0);
});
