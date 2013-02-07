var VENDOR = $.browser.webkit ? 'webkit'
    : $.browser.mozilla ? 'moz'
    : $.browser.msie ? 'ms'
    : $.browser.opera ? 'op'
    : null
  , Prop = (function () {
    var join = (VENDOR == null) ? function (name) {
        return name;
      } : function (name) {
        return '-' + VENDOR + '-' + name;
      }
      ;
    return {
      PERSPECTIVE     : join('perspective'),
      TRANSFORM       : join('transform'),
      TRANSFORM_ORIGIN: join('transform-origin'),
      TRANSITION      : join('transition')
    };
  })()
  , TRANSITION_TIMING_FUNCTIONS = {
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
  , Event = {
    TRANSITION_END: 'webkitTransitionEnd MozTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd transitionEnd transitionend'
  }
  ;


$.extend($.cssHooks, {
  perspective: {
    get: function (elem, computed) {
      return elem.style[Prop.PERSPECTIVE];
    },
    set: function (elem, value) {
      console.log(value);
      elem.style[Prop.PERSPECTIVE] = value;
    }
  },
  matrix     : {
    get: function (elem, computed) {
      return new CSSMatrix(elem.style[Prop.TRANSFORM]);
    },
    set: function (elem, value) {
      elem.style[Prop.TRANSFORM] = value.toString();
    }
  },
  origin     : {
    get: function (elem, computed) {
      elem.style[Prop.TRANSFORM_ORIGIN];
    },
    set: function (elem, value) {
      elem.style[Prop.TRANSFORM_ORIGIN] = [value.x + 'px', value.y + 'px'].join(' ');
    }
  }
});

$.extend($.cssHooks, {

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
        // ダミー要素にイベントを貼ることで
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
        , matrix = new Matrix($self.css(Prop.TRANSFORM))
        , animate3 = $._data(this, 'animate3')
        , transform = $._data(this, 'transform')
        ;
      if (animate3 == null) {
        return;
      }

      $._data(this, 'matrix', matrix);

      animate3.$dummy.css('transition', '');
      $self
        .css({
          transition: '',
          transform : matrix
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