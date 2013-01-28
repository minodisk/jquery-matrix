var PROPS = Object.keys(new WebKitCSSMatrix())
  , SMALL_NUMBER = 1e-8
  , isSmallNumber = function (num) {
    return num > -SMALL_NUMBER && num < SMALL_NUMBER;
  }
  , assertDeepEqual = function (msg, expected, actual) {
    if (arguments.length < 3) {
      actual = expected;
      expected = msg;
    }
    var i = PROPS.length
      ;
    while (i--) {
      if (expected[PROPS[i]] !== actual[PROPS[i]]
        && !(isSmallNumber(expected[PROPS[i]]) && isSmallNumber(actual[PROPS[i]]))
        && !(isSmallNumber(expected[PROPS[i]] - actual[PROPS[i]]))) {
        console.log(expected.toString(), actual.toString());
        fail([msg, '"' + PROPS[i] + '"', 'expected', expected[PROPS[i]], 'but was', actual[PROPS[i]]].join(' '));
        return;
      }
    }
    assert(msg, true);
  }
  ;

//TODO NaNチェック

TestCase('test-CSSMatrix', {

  'test constructor': function () {
    assertDeepEqual(new WebKitCSSMatrix(), new CSSMatrix());
  },

  'test translate': function () {
    var x, y, z
      ;
    for (x = -10; x < 10; x++) {
      assertDeepEqual('translate(' + x + ')', new WebKitCSSMatrix().translate(x), new CSSMatrix().translate(x));
      for (y = -10; y < 10; y++) {
        assertDeepEqual('translate(' + [x, y].join(', ') + ')', new WebKitCSSMatrix().translate(x, y), new CSSMatrix().translate(x, y));
        for (z = -10; z < 10; z++) {
          assertDeepEqual('translate(' + [x, y, z].join(', ') + ')', new WebKitCSSMatrix().translate(x, y, z), new CSSMatrix().translate(x, y, z));
        }
      }
    }
  },

  'test scale': function () {
    var x, y, z
      ;
    for (x = -10; x < 10; x++) {
      assertDeepEqual('scale(' + x + ')', new WebKitCSSMatrix().scale(x), new CSSMatrix().scale(x));
      for (y = -10; y < 10; y++) {
        assertDeepEqual('scale(' + [x, y].join(', ') + ')', new WebKitCSSMatrix().scale(x, y), new CSSMatrix().scale(x, y));
        for (z = -10; z < 10; z++) {
          assertDeepEqual('scale(' + [x, y, z].join(', ') + ')', new WebKitCSSMatrix().scale(x, y, z), new CSSMatrix().scale(x, y, z));
        }
      }
    }
  },

  'test rotate': function () {
    var x, y, z
      ;
    for (x = -10; x < 10; x++) {
      assertDeepEqual('rotate(' + x + ')', new WebKitCSSMatrix().rotate(x), new CSSMatrix().rotate(x));
      for (y = -10; y < 10; y++) {
        assertDeepEqual('rotate(' + [x, y].join(', ') + ')', new WebKitCSSMatrix().rotate(x, y), new CSSMatrix().rotate(x, y));
        for (z = -10; z < 10; z++) {
          assertDeepEqual('rotate(' + [x, y, z].join(', ') + ')', new WebKitCSSMatrix().rotate(x, y, z), new CSSMatrix().rotate(x, y, z));
        }
      }
    }
  },

  'test skew': function () {
    var x, y
      ;
    for (x = -10; x < 10; x++) {
      assertDeepEqual('skew(' + x + ')', new WebKitCSSMatrix().skewX(x), new CSSMatrix().skewX(x));
      assertDeepEqual('skew(' + x + ')', new WebKitCSSMatrix().skewY(x), new CSSMatrix().skewY(x));
      for (y = -10; y < 10; y++) {
        assertDeepEqual('skew(' + [x, y].join(', ') + ')', new WebKitCSSMatrix().skewX(x).skewY(y), new CSSMatrix().skewX(x).skewY(y));
      }
    }
  }

});