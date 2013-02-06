(function (window, document, $) {
  'use strict';

  var VENDOR = $.browser.webkit ? 'webkit' : $.browser.mozilla ? 'moz' : null

    , Prop = {
      TRANSFORM       : '-' + VENDOR + '-transform',
      TRANSFORM_ORIGIN: '-' + VENDOR + '-transform-origin'
    }
    ;

  $.extend($.cssHooks, {
    matrix: {
      get: function (elem, coputed) {
        return Matrix(elem.style[Prop.TRANSFORM]);
      },
      set: function (elem, value) {
        elem.style[Prop.TRANSFORM] = value.toString();
        console.log(value, value.toString(), elem.style);
      }
    },
    x     : {
      get: function (elem, computed) {
        var matrix = $(elem).css('matrix')
          ;
        return matrix.m41;
      },
      set: function (elem, value) {
        var matrix = $(elem).css('matrix')
          ;
        matrix.m41 = parseFloat(value);
        $(elem).css('matrix', matrix);
      }
    },
    y     : {
      get: function (elem, computed) {
        var matrix = $(elem).css('matrix')
          ;
        return matrix.m42;
      },
      set: function (elem, value) {
        var matrix = $(elem).css('matrix')
          ;
        matrix.m42 = parseFloat(value);
        $(elem).css('matrix', matrix);
      }
    },
    scaleX: {
      get: function (elem, computed) {
        var matrix = $(elem).css('matrix')
          ;
        return matrix.m41;
      },
      set: function (elem, value) {
        var matrix = $(elem).css('matrix')
          ;
        matrix.m41 = parseFloat(value);
        $(elem).css('matrix', matrix);
      }
    },
    scaleY: {
      get: function (elem, computed) {
        var matrix = $(elem).css('matrix')
          ;
        return matrix.m42;
      },
      set: function (elem, value) {
        var matrix = $(elem).css('matrix')
          ;
        matrix.m42 = parseFloat(value);
        $(elem).css('matrix', matrix);
      }
    },
    rotate: {
      get: function (elem, computed) {
        var matrix = $(elem).css('matrix')
          ;
        return matrix.m42;
      },
      set: function (elem, value) {
        var matrix = $(elem).css('matrix')
          ;
        matrix.m42 = parseFloat(value);
        $(elem).css('matrix', matrix);
      }
    },
//    transform: {
//      get: function (elem, computed) {
//        var transform = $._data(elem, 'transform')
//          ;
//        if (transform != null) {
//          return transform;
//        }
//        transform = Transform();
//        $._data(elem, 'transform', transform);
//        return transform;
//      },
//      set: function (elem, value) {
//        if (typeof value === 'string') {
//          //TODO Transformオブジェクトに変更して格納が必要
//          $(elem).css(Prop.TRANSFORM, value);
//          return;
//        }
//        var transform = Transform(value)
//          ;
//        $._data(elem, 'transform', transform);
//        $(elem).css(Prop.TRANSFORM, transform.toString());
//      }
//    },
    origin: {
      get: function (elem, computed) {
        return $(elem).css(Prop.TRANSFORM_ORIGIN);
      },
      set: function (elem, value) {
        $(elem).css(Prop.TRANSFORM_ORIGIN, [value.x + 'px', value.y + 'px'].join(' '));
      }
    }
  });


})(window, document, jQuery);