(function (window, document) {
  'use strict';

  var Event = {
      READY: 'DOMContentLoaded'
    }

    , WebKitCSSMatrix = window.WebKitCSSMatrix

    , ready = function () {
      document.removeEventListener(Event.READY, ready, false);

      var div = document.createElement('div')
        , webkit = document.createElement('div')
        , original = document.createElement('div')
        , p, textNode
        ;

      p = document.createElement('p');
      p.appendChild(document.createTextNode('WebKitCSSMatrix'));
      webkit.appendChild(p);
      webkit.className = 'box webkit';
      div.appendChild(webkit);

      p = document.createElement('p');
      p.appendChild(document.createTextNode('CSSMatrix'));
      original.appendChild(p);
      original.className = 'box original';
      div.appendChild(original);

      textNode = document.createTextNode();
      div.appendChild(textNode);
      div.className = 'container';
      document.body.appendChild(div);

      if (WebKitCSSMatrix) {
        webkit.style['-webkit-transform'] = webkit.style['-moz-transform'] = [
          'perspective(100)',
          new WebKitCSSMatrix().rotate(10, 10).toString()
        ].join(' ');
      }
      original.style['-webkit-transform'] = original.style['-moz-transform'] = [
        'perspective(100)',
        new CSSMatrix().rotate(10, 10).toString()
      ].join(' ');

      textNode.data = 'rotate(10, 10)';
    }
    ;

  document.addEventListener(Event.READY, ready, false);

})(window, document);