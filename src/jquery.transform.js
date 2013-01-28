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
//      , matrix = function ($elem) {
//        var transform = $elem.css(Prop.TRANSFORM)
//          , matrix, i
//          ;
//        if (transform.indexOf('matrix3d(') === 0) {
//          matrix = transform.substring(9, transform.length - 1).split(',');
//        } else if (transform.indexOf('matrix(') === 0) {
//          matrix = transform.substring(7, transform.length - 1).split(',');
//          matrix = [
//            matrix[0], matrix[1], 0, 0,
//            matrix[2], matrix[3], 0, 0,
//            0, 0, 1, 0,
//            matrix[4], matrix[5], 0, 1
//          ];
//        } else {
//          matrix = [
//            1, 0, 0, 0,
//            0, 1, 0, 0,
//            0, 0, 1, 0,
//            0, 0, 0, 1
//          ];
//        }
//        i = matrix.length;
//        while (i--) {
//          matrix[i] = +matrix[i];
//        }
//        if (matrix.length === 6) {
//        }
//        return matrix;
//      }
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
          if (typeof value === 'string') {
            //TODO Transformオブジェクトに変更して格納が必要
            $(elem).css(Prop.TRANSFORM, value);
            return;
          }
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
        this.each(function () {
          var $self = $(this)
            , animate3 = $._data(this, 'animate3')
            , matrix, ratio, transform
            ;
          if (animate3 == null) {
            return;
          }


          matrix = animate3.$dummy.css(Prop.TRANSFORM);
          matrix = matrix.substring(7, matrix.length - 1).split(',');
          ratio = +matrix[4];
//          transform = animate3.from.interpolate(animate3.to, ratio);

          var fromMatrix = new Matrix()
            .rotate(animate3.from.rotationX, animate3.from.rotationY, animate3.from.rotationZ)
            .translate(animate3.from.x, animate3.from.y, animate3.from.z)
            .scale(animate3.from.scaleX, animate3.from.scaleY, animate3.from.scaleZ);
//          var fromQuat = Quaternion.createFromRotationMatrix(fromMatrix);
          var toMatrix = new Matrix()
            .rotate(animate3.to.rotationX, animate3.to.rotationY, animate3.to.rotationZ)
            .translate(animate3.to.x, animate3.to.y, animate3.to.z)
            .scale(animate3.to.scaleX, animate3.to.scaleY, animate3.to.scaleZ);
//          var toQuat = Quaternion.createFromRotationMatrix(toMatrix);
//          console.log(animate3.from, animate3.to, ratio);
//          var slerpQuat = Quaternion.slerp(fromQuat, toQuat, ratio);
//          var matrix = slerpQuat.toMatrix();
//          fromMatrix.concat(matrix);
//          console.log(fromMatrix.toString(), Matrix.slerp(fromMatrix, toMatrix, ratio));
          console.log(Matrix.slerp(fromMatrix, toMatrix, ratio));

          animate3.$dummy.css('transition', '');
          $self
            .css({
              transition: '',
              transform : Matrix.slerp(fromMatrix, toMatrix, ratio).toString()
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