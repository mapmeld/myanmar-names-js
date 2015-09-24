var assert = require("assert");
var myanmarNameSort = require("../myanmar.names.js");

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
});
