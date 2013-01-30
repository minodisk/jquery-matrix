(function (window, document, $) {
  'use strict';

  var vendor = $.browser.webkit ? 'webkit' : $.browser.mozilla ? 'moz' : null
    ;

  (function () {
    var TRANSITION_TIMING_FUNCTIONS = {
        linear   : 'linear',
        'default': 'default',

        ease     : 'ease',
        easeIn   : 'ease-in',
        easeOut  : 'ease-out',
        easeInOut: 'ease-in-out',

        easeInBack   : 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
        easeOutBack  : 'cubic-bezier(0.175,  0.885, 0.320, 1.275)',
        easeInOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',

        easeInCirc   : 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
        easeOutCirc  : 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
        easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',

        easeInCubic   : 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
        easeOutCubic  : 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
        easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',

        easeInExpo   : 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
        easeOutExpo  : 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
        easeInOutExpo: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',

        easeInQuad   : 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
        easeOutQuad  : 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        easeInOutQuad: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',

        easeInQuart   : 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
        easeOutQuart  : 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
        easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',

        easeInQuint   : 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
        easeOutQuint  : 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
        easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',

        easeInSine   : 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
        easeOutSine  : 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
      }
      , Prop = {
        PERSPECTIVE     : '-' + vendor + '-perspective',
        TRANSFORM       : '-' + vendor + '-transform',
        TRANSFORM_ORIGIN: '-' + vendor + '-transform-origin',
        TRANSITION      : '-' + vendor + '-transition'
      }
      , Event = {
        TRANSITION_END: 'webkitTransitionEnd MozTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd transitionEnd transitionend'
      }
      , Transform = (function () {
        var KEYS = ['x', 'y', 'z', 'scaleX', 'scaleY', 'scaleZ', 'rotationX', 'rotationY', 'rotationZ']
          , construct = function () {
            this.interpolate = interpolate;
            this.merge = merge;
            this.toString = toString;
            return this;
          }
          , interpolate = function (t1, t2, ratio) {
            var t = Transform()
              , i = KEYS.length
              , key
              ;
            while (i--) {
              key = KEYS[i];
              t[key] += (t2[key] - t1[key]) * ratio;
            }
            return t;
          }
          , merge = function (transform) {
            var index, from, to, delta
              ;
            var i = KEYS.length
              , key
              ;
            while (i--) {
              key = KEYS[i];
              if (transform.hasOwnProperty(key)) {
                if (i >= 6) {
                  from = this[key];
                  to = transform[key];
                  delta = to - from;
                  while (delta < -180) {
                    delta += 360;
                  }
                  while (delta > 180) {
                    delta -= 360;
                  }
                  this[key] = from + delta;
                } else {
                  this[key] = transform[key];
                }
              }
            }
            return this;
          }
          , toString = function () {
            var transforms = []
              ;
            // Mozillaのperspectiveの特徴
            // - 0で設定するとtransformプロパティ自体が解釈されない
            // - matrixの後に設定するとperspectiveが解釈されない
            // - 単位(px)は必須
            if (this.perspective != null && this.perspective !== 0) {
              transforms.push('perspective(' + this.perspective + 'px)');
            }
            if (this.x != null || this.y != null || this.z != null) {
              // translate はモバイルでのチラツキの原因となるので使わない
              transforms.push('translate3d(' +
                (this.x != null ? this.x : 0) + 'px, ' +
                (this.y != null ? this.y : 0) + 'px, ' +
                (this.z != null ? this.z : 0) + 'px)');
            }
            if (this.scale != null) {
              transforms.push('scale(' + this.scale + ')');
            } else if (this.scaleX != null || this.scaleY != null || this.scaleZ != null) {
              transforms.push('scale3d(' +
                (this.scaleX != null ? this.scaleX : 1) + ', ' +
                (this.scaleY != null ? this.scaleY : 1) + ', ' +
                (this.scaleZ != null ? this.scaleZ : 1) + ')');
            }
            if (this.rotation != null) {
              transforms.push('rotate(' + this.rotation + 'deg)');
            } else {
              if (this.rotationX != null && this.rotationX !== 0) {
                transforms.push('rotateX(' + this.rotationX + 'deg)');
              }
              if (this.rotationY != null && this.rotationY !== 0) {
                transforms.push('rotateY(' + this.rotationY + 'deg)');
              }
              if (this.rotationZ != null && this.rotationZ !== 0) {
                transforms.push('rotateZ(' + this.rotationZ + 'deg)');
              }
            }
            if (this.skewX != null && this.skewX !== 0) {
              transforms.push('skewX(' + this.skewX + 'deg)');
            }
            if (this.skewY != null && this.skewY !== 0) {
              transforms.push('skewY(' + this.skewY + 'deg)');
            }
            if (this.rotateAxisAngle != null) {
              transforms.push('rotate3d(' + this.rotateAxisAngle.join(', ') + 'deg)');
            }
            return transforms.join(' ');
          }
          ;
        return function (value) {
          return construct.call($.extend(
            {
              x        : 0,
              y        : 0,
              z        : 0,
              scaleX   : 1,
              scaleY   : 1,
              scaleZ   : 1,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0
            },
            value
          ));
        };
      })()
      , getTransition = function (elem) {
        var transition = $._data(elem, 'transition')
          ;
        return transition;
      }
      , getTransform = function (elem) {
        var transform = $._data(elem, 'transform')
          ;
        if (transform != null) {
          return transform;
        }
        transform = Transform();
        $._data(elem, 'transform', transform);
        return transform;
      }
      , updateTransform = function (elem, transform) {
        $(elem).css(Prop.TRANSFORM, transform.toString());
      }
      ;

    // hook CSS3
    $.extend($.cssHooks, {
      x         : {
        get: function (elem, computed) {
          var transform = getTransform(elem)
            ;
          return;
        },
        set: function (elem, value) {
          var transform = getTransform(elem)
            ;
          transform.x = value;
          updateTransform(elem, transform);
        }
      },
      y         : {
        get: function (elem, computed) {
          return;
        },
        set: function (elem, value) {
        }
      },
      z         : {
        get: function (elem, computed) {
          return;
        },
        set: function (elem, value) {
        }
      },
      scaleX    : {
        get: function (elem, computed) {
          return;
        },
        set: function (elem, value) {
        }
      },
      scaleY    : {
        get: function (elem, computed) {
          return;
        },
        set: function (elem, value) {
        }
      },
      scaleZ    : {
        get: function (elem, computed) {
          return;
        },
        set: function (elem, value) {
        }
      },
      rotateX   : {
        get: function (elem, computed) {
          return;
        },
        set: function (elem, value) {
        }
      },
      rotateY   : {
        get: function (elem, computed) {
          return;
        },
        set: function (elem, value) {
        }
      },
      rotateZ   : {
        get: function (elem, computed) {
          return;
        },
        set: function (elem, value) {
        }
      },
      transform : {
        get: function (elem, computed) {
          var transform = $._data(elem, 'transform')
            ;
          if (transform != null) {
            return transform;
          }
          transform = Transform();
          $._data(elem, 'transform', transform);
          return transform;
        },
        set: function (elem, value) {
//          if (typeof value === 'string') {
//            //TODO Transformオブジェクトに変更して格納が必要
//            $(elem).css(Prop.TRANSFORM, value);
//            return;
//          }
          var transform = Transform(value)
            ;
          $._data(elem, 'transform', transform);
          $(elem).css(Prop.TRANSFORM, transform.toString());
        }
      },
      origin    : {
        get: function (elem, computed) {
          return $(elem).css(Prop.TRANSFORM_ORIGIN);
        },
        set: function (elem, value) {
          $(elem).css(Prop.TRANSFORM_ORIGIN, [value.x + 'px', value.y + 'px'].join(' '));
        }
      },
      transition: {
        get: function (elem, computed) {
          return $(elem).css(Prop.TRANSITION);
        },
        set: function (elem, value) {
          if (!value) {
            $(elem).css(Prop.TRANSITION, '');
            return;
          }

          var transitions = []
            , i, l, v, prop, duration, easing
            ;
          if (!$.isArray(value)) {
            value = [value];
          }
          for (i = 0, l = value.length; i < l; i++) {
            v = value[i];
            prop = v.prop === 'transform' ? Prop.TRANSFORM : v.prop;
            duration = v.duration;
            easing = v.easing;
            if (typeof easing === 'object') {
              easing = easing[prop];
            }
            if (TRANSITION_TIMING_FUNCTIONS[easing] != null) {
              easing = TRANSITION_TIMING_FUNCTIONS[easing];
            }
            transitions[i] = [prop, duration + 's', easing].join(' ');
          }
          $(elem).css(Prop.TRANSITION, transitions.join(', '));
        }
      }
    });


    Matrix.createFromElem = function ($elem) {
      var transform = $elem.css(Prop.TRANSFORM)
        , arr, i
        ;
      if (transform.indexOf('matrix3d(') === 0) {
        arr = transform.substring(9, transform.length - 1).split(',');
      } else if (transform.indexOf('matrix(') === 0) {
        arr = transform.substring(7, transform.length - 1).split(',');
      } else {
        return new Matrix(
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        );
      }
      i = arr.length;
      while (i--) {
        arr[i] = +arr[i];
      }
      if (arr.length === 16) {
        return Matrix(arr);
      }
      return new Matrix(
        arr[0], arr[1], 0, 0,
        arr[2], arr[3], 0, 0,
        0, 0, 1, 0,
        arr[4], arr[5], 0, 1
      );
    };

    function Matrix(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
      if (!(this instanceof Matrix)) {
        return new Matrix(
          m11[0],m11[1],m11[2],m11[3],
          m11[4],m11[5],m11[6],m11[7],
          m11[8],m11[9],m11[10],m11[11],
          m11[12],m11[13],m11[14],m11[15]
        );
      }
      this.m11 = m11;
      this.m12 = m12;
      this.m13 = m13;
      this.m14 = m14;
      this.m21 = m21;
      this.m22 = m22;
      this.m23 = m23;
      this.m24 = m24;
      this.m31 = m31;
      this.m32 = m32;
      this.m33 = m33;
      this.m34 = m34;
      this.m41 = m41;
      this.m42 = m42;
      this.m43 = m43;
      this.m44 = m44;
    }

    Matrix.prototype.concat = function (_m11, _m12, _m13, _m14, _m21, _m22, _m23, _m24, _m31, _m32, _m33, _m34, _m41, _m42, _m43, _m44) {
      if (_m11 instanceof Matrix) {
        var matrix = _m11
          ;
        _m11 = matrix.m11;
        _m12 = matrix.m12;
        _m13 = matrix.m13;
        _m14 = matrix.m14;
        _m21 = matrix.m21;
        _m22 = matrix.m22;
        _m23 = matrix.m23;
        _m24 = matrix.m24;
        _m31 = matrix.m31;
        _m32 = matrix.m32;
        _m33 = matrix.m33;
        _m34 = matrix.m34;
        _m41 = matrix.m41;
        _m42 = matrix.m42;
        _m43 = matrix.m43;
        _m44 = matrix.m44;
      }
      var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14
        , m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24
        , m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34
        , m41 = this.m41, m42 = this.m42, m43 = this.m43, m44 = this.m44
        ;
      this.m11 = m11 * _m11 + m21 * _m12 + m31 * _m13 + m41 * _m14;
      this.m12 = m12 * _m11 + m22 * _m12 + m32 * _m13 + m42 * _m14;
      this.m13 = m13 * _m11 + m23 * _m12 + m33 * _m13 + m43 * _m14;
      this.m14 = m14 * _m11 + m24 * _m12 + m34 * _m13 + m44 * _m14;
      this.m21 = m11 * _m21 + m21 * _m22 + m31 * _m23 + m41 * _m24;
      this.m22 = m12 * _m21 + m22 * _m22 + m32 * _m23 + m42 * _m24;
      this.m23 = m13 * _m21 + m23 * _m22 + m33 * _m23 + m43 * _m24;
      this.m24 = m14 * _m21 + m24 * _m22 + m34 * _m23 + m44 * _m24;
      this.m31 = m11 * _m31 + m21 * _m32 + m31 * _m33 + m41 * _m34;
      this.m32 = m12 * _m31 + m22 * _m32 + m32 * _m33 + m42 * _m34;
      this.m33 = m13 * _m31 + m23 * _m32 + m33 * _m33 + m43 * _m34;
      this.m34 = m14 * _m31 + m24 * _m32 + m34 * _m33 + m44 * _m34;
      this.m41 = m11 * _m41 + m21 * _m42 + m31 * _m43 + m41 * _m44;
      this.m42 = m12 * _m41 + m22 * _m42 + m32 * _m43 + m42 * _m44;
      this.m43 = m13 * _m41 + m23 * _m42 + m33 * _m43 + m43 * _m44;
      this.m44 = m14 * _m41 + m24 * _m42 + m34 * _m43 + m44 * _m44;
      return this;
    };

    Matrix.prototype.scale = function (scaleX, scaleY, scaleZ) {
      scaleX = scaleX != null ? scaleX : 1;
      scaleY = scaleY != null ? scaleY : scaleX;
      scaleZ = scaleZ != null ? scaleZ : 1;
      return this.concat(
        scaleX, 0, 0, 0,
        0, scaleY, 0, 0,
        0, 0, scaleZ, 0,
        0, 0, 0, 1
      );
    };

    Matrix.prototype.getEulers = function () {
      var xx = this.m11, xy = this.m12, xz = this.m13
        , yx = this.m21, yy = this.m22, yz = this.m23
        , zx = this.m31, zy = this.m32, zz = this.m33
        ;
      var c = Math.atan2(zy, zz)
        , b = -Math.asin(zx)
        , a = Math.asin(yx / Math.cos(b))
        ;
      if (xx < 0) a = Math.PI - a;
      if (Math.abs(Math.cos(b)) < 1e-6) {
        c = Math.atan2(yz, yy);
        b = -Math.asin(zx);
        a = 0;
      }
      var z = a
        , y = b
        , x = c
        ;
      return [x * 180 / Math.PI, y * 180 / Math.PI, z * 180 / Math.PI];
    };


    // animation methods
    $.fn.extend({
      animate3          : function (props, duration, easing, callback) {
        return this.each(function () {
          var $self = $(this)
            , $dummy = $('<div>')
              .css({
                visibility: 'hidden',
                overflow  : 'hidden',
                width     : 0,
                height    : 0
              })
              .appendTo('body')
            , transitions = []
            , from = $(this).css('transform')
            , to = Transform(from).merge(props.transform)
            , prop
            ;

          $._data(this, 'animate3', {
            $dummy: $dummy,
            from  : from,
            to    : to
          });

          for (prop in props) {
            if (props.hasOwnProperty(prop)) {
              transitions.push({
                prop    : prop,
                duration: duration,
                easing  : easing
              });
            }
          }
          if (transitions.length === 0) {
            setTimeout(function () {
              callback();
            }, 0);
            return;
          }

          // CSS 適用直後に animate3 を叩くケースに対応するために、
          // Transition の適用は次のイベントサイクルに持ち越す。
          setTimeout(function () {
            // ダミー要素にイベントを貼ることで　//複数のTransitionに対応する。
            // はじめから目標値に設定されていた場合はtransitionEndがtriggerされない
            // 問題に対応する。
            $dummy
              .css({
                transition: {
                  prop    : '-webkit-transform',
                  duration: duration,
                  easing  : easing
                },
                transform : 'matrix(1, 0, 0, 1, 1, 0)'
              })
              .one(Event.TRANSITION_END, function () {
                $self.css('transition', '');
                if (callback != null) {
                  callback();
                }
              });
            $self
              .css({
                transform : to,
                transition: transitions
              })
          }, 0);
        });
      },
      stop3             : function () {
        return this.each(function () {
          var $self = $(this)
            , animate3 = $._data(this, 'animate3')
            , transform = $._data(this, 'transform')
            ;
          if (animate3 == null) {
            return;
          }

          var matrix = Matrix.createFromElem($self)
            , eulers
            , size = function (vector) {
              return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
            }
            ;
          console.log(matrix);
          transform.x = matrix.m41;
          transform.y = matrix.m42;
          transform.z = matrix.m43;
          transform.scaleX = size([matrix.m11, matrix.m21, matrix.m31]);
          transform.scaleY = size([matrix.m12, matrix.m22, matrix.m32]);
          transform.scaleZ = size([matrix.m13, matrix.m23, matrix.m33]);
          matrix.scale(1/transform.scaleX, 1/transform.scaleY, 1/transform.scaleZ);
          eulers = matrix.getEulers();
          transform.rotationX = eulers[0];
          transform.rotationY = eulers[1];
          transform.rotationZ = eulers[2];

          animate3.$dummy.css('transition', '');
          $self
            .css({
              transition: '',
              transform : transform//$self.css(Prop.TRANSFORM)
            });
          animate3.$dummy.remove();
        });
      },
      slideUp3          : function (duration, callback) {
        var self = this
          ;

        return self
          .css({
            overflow: 'hidden'
          })
          .height(self.height())
          .animate3({
            height: 0
          }, duration, 'linear', function () {
            self
              .css({
                display : 'none',
                overflow: '',
                height  : ''
              });
            if (callback != null) {
              callback();
            }
          });
      },
      slideDown3        : function (duration, callback) {
        var self = this
          , height = this.height()
          ;

        return self
          .css({
            height  : 0,
            display : 'block',
            overflow: 'hidden'
          })
          .animate3({
            height: height
          }, duration, 'linear', function () {
            self
              .css({
                height  : '',
                overflow: ''
              });
            if (callback != null) {
              callback();
            }
          });
      },
      fadeIn3           : function (duration, callback) {
        var self = this
          ;

        return self
          .css({
            opacity: 0,
            display: 'block'
          })
          .animate3({
            opacity: 1
          }, duration, 'linear', function () {
            if (callback != null) {
              callback();
            }
          });
      },
      fadeOut3          : function (duration, callback) {
        var self = this
          ;

        return self
          .animate3({
            opacity: 0
          }, duration, 'linear', function () {
            self
              .css({
                display: 'none'
              });
            if (callback != null) {
              callback();
            }
          });
      },
      animate3Deferred  : function (props, duration, easing) {
        var d = new Deferred()
          ;
        $.fn.animate3.call(this, props, duration, easing, function () {
          d.call();
        });
        return d;
      },
      slideUp3Deferred  : function (duration) {
        var d = new Deferred()
          ;
        $.fn.slideUp3.call(this, duration, function () {
          d.call();
        });
        return d;
      },
      slideDown3Deferred: function (duration) {
        var d = new Deferred()
          ;
        $.fn.slideDown3.call(this, duration, function () {
          d.call();
        });
        return d;
      },
      fadeIn3Deferred   : function (duration) {
        var d = new Deferred()
          ;
        $.fn.fadeIn3.call(this, duration, function () {
          d.call();
        });
        return d;
      },
      fadeOut3Deferred  : function (duration) {
        var d = new Deferred()
          ;
        $.fn.fadeOut3.call(this, duration, function () {
          d.call();
        });
        return d;
      }
    });

  })();

//  (function () {
//    $.fn.extend({
//      animate3          : function (props, duration, easing, callback) {
//        $.fn.animate.call(this, props, duration * 1000, easing, callback);
//      },
//      stop3             : function (clearQueue, jumpToEnd) {
//        $.fn.stop.call(this, clearQueue, jumpToEnd);
//      },
//      slideUp3          : function (duration, callback) {
//        $.fn.slideUp.call(this, duration * 1000, callback)
//      },
//      slideDown3        : function (duration, callback) {
//        $.fn.slideDown.call(this, duration * 1000, callback)
//      },
//      fadeIn3           : function (duration, callback) {
//        $.fn.fadeIn.call(this, duration * 1000, callback)
//      },
//      fadeOut3          : function (duration, callback) {
//        $.fn.fadeOut.call(this, duration * 1000, callback)
//      },
//      animate3Deferred  : $.fn.animateDeferred,
//      slideUp3Deferred  : $.fn.slideUpDeferred,
//      slideDown3Deferred: $.fn.slideDownDeferred,
//      fadeIn3Deferred   : $.fn.fadeInDeferred,
//      fadeOut3Deferred  : $.fn.fadeOutDeferred
//    });
//  })();

})(window, document, jQuery);