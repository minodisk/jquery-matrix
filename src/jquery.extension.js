var VENDOR = $.browser.webkit ? 'webkit'
//    : $.browser.mozilla ? 'moz'
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
  , MATRIX_X1 = new CSSMatrix().translate(1).toString()
  , stop = $.fn.stop
  ;


$.extend($.cssHooks, {
  perspective: {
    get: function (elem, computed) {
      return elem.style[Prop.PERSPECTIVE];
    },
    set: function (elem, value) {
      elem.style[Prop.PERSPECTIVE] = value;
    }
  },
  transform  : {
    get: function (elem, computed) {
      return elem.style[Prop.TRANSFORM];
    },
    set: function (elem, value) {
      elem.style[Prop.TRANSFORM] = value;
    }
  },
  matrix     : {
    get: function (elem, computed) {
      return new CSSMatrix(elem.style[Prop.TRANSFORM]);
    },
    set: function (elem, value) {
      if (value === '' || value == null) {
        elem.style[Prop.TRANSFORM] = '';
        return;
      }

      elem.style[Prop.TRANSFORM] = value.toString();
    }
  },
  origin     : {
    get: function (elem, computed) {
      elem.style[Prop.TRANSFORM_ORIGIN];
    },
    set: function (elem, value) {
      if (value === '' || value == null) {
        elem.style[Prop.TRANSFORM_ORIGIN] = '';
        return;
      }

      elem.style[Prop.TRANSFORM_ORIGIN] = [value.x + 'px', value.y + 'px'].join(' ');
    }
  },
  transition : {
    get: function (elem, computed) {
      return elem.style[Prop.TRANSITION];
    },
    set: function (elem, value) {
      if (value === '' || value == null) {
        elem.style[Prop.TRANSITION] = '';
        return;
      }

      // parse properties
      var transitions = []
        , i, l, v, prop, duration, easing
        ;
      if (!$.isArray(value)) {
        value = [value];
      }
      for (i = 0, l = value.length; i < l; i++) {
        v = value[i];

        prop = v.prop;
        switch (prop) {
          case 'transform':
          case 'matrix':
            prop = Prop.TRANSFORM;
            break;
        }

        duration = v.duration;

        easing = v.easing;
        if (typeof easing === 'object') {
          easing = easing[prop];
        }
        if (TRANSITION_TIMING_FUNCTIONS[easing] != null) {
          easing = TRANSITION_TIMING_FUNCTIONS[easing];
        }

        transitions[i] = [prop, duration + 'ms', easing].join(' ');
      }

      // apply transition
      elem.style[Prop.TRANSITION] = transitions.join(', ');
    }
  }
});

$.fn.extend({
  transit: function (props, duration, easing, callback) {
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
        , css = {}
        , transitions = []
        , prop, value
        ;

      $._data(this, '$dummy', $dummy);

      for (prop in props) {
        if (props.hasOwnProperty(prop)) {
          value = props[prop];
          if (prop === 'matrix') {
            prop = 'matrix';
          }
          css[prop] = value;
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
      css.transition = transitions;

      // CSS 適用直後に transit を叩くケースに対応するために、
      // Transition の適用は次のイベントサイクルに持ち越す。
      setTimeout(function () {
        // ダミー要素にイベントを貼ることで、既に目標値に到達していた場合に
        // transitionEnd イベントが trigger されない問題に対応する。
        $dummy
          .css({
            transition: {
              prop    : Prop.TRANSFORM,
              duration: duration,
              easing  : easing
            },
            transform : MATRIX_X1
          })
          .one(Event.TRANSITION_END, function () {
            $dummy.remove();
            $self.css('transition', '');
            if (callback != null) {
              callback();
            }
          });
        $self
          .css(css)
      }, 0);
    });
  },
  stop   : function (clearQueue, jumpToEnd) {
    return this.each(function () {
      var $self = $(this)
        , $dummy = $._data(this, '$dummy')
        ;

      if ($dummy) {
        $dummy
          .css('transition', '');
        if (jumpToEnd) {
          $dummy.trigger(Event.TRANSITION_END);
        }
        $dummy
          .remove();

        $self
          .css({
            transition: '',
            transform : $self.css('transform')
          });
      }
    });
  }
});