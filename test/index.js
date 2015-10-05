var assert = require("assert");
var myanmarNameSort = require("../myanmar.names.js").sort;
var candidates = require("./names.json");

describe("sort", function() {
  it("handles a name sort", function() {
    var ret = myanmarNameSort(['ဦးလှမြင့်', 'ဦးမော']);    assert.equal(ret[0], 'ဦးမော');
    assert.equal(ret[1], 'ဦးလှမြင့်');
  });

  it("ignores prefixes in a name sort", function() {
    var ret = myanmarNameSort(['ဒေါက်တာလှမြင့်', 'ဦးမော']);
    assert.equal(ret[0], 'ဦးမော');
    assert.equal(ret[1], 'ဒေါက်တာလှမြင့်');
  });
  
  it("sorts all names", function() {
    myanmarNameSort(candidates);
  });
});

var myanmarNameMatch = require("../myanmar.names.js").match;


describe("match", function() {
  it("handles an exact match", function() {
    var ret = myanmarNameMatch('ဦးလှမြင့်', ["ဦးလှမြင့်","ဦးမော"]);
    assert.equal(ret.length, 1);
    assert.equal(ret[0], 'ဦးလှမြင့်');
  });

  it("handles a different-prefix match", function() {
    var ret = myanmarNameMatch('ဦးလှမြင့်', ["ဒေါက်တာလှမြင့်","ဦးမော"]);
    assert.equal(ret.length, 1);
    assert.equal(ret[0], 'ဒေါက်တာလှမြင့်');
  });

  it("handles one rough match", function() {
    var ret = myanmarNameMatch('မော်နီတး', ["မော်နီကး","ဦးမော"]);
    assert.equal(ret.length, 1);
    assert.equal(ret[0], 'မော်နီကး');
  });

  it("handles two rough matches", function() {
    var ret = myanmarNameMatch('မောနီတး', ["မော်နီကး","ဦးမော"]);
    assert.equal(ret.length, 1);
    assert.equal(ret[0], 'မော်နီကး');
  });
});
