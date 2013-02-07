(function () {
  'use strict';

  var SRC = 'src'
    , FILES = [
      'MathUtil.js',
      'Vector3.js',
      'EulerAngles.js',
      'Quaternion.js',
      'RotationMatrix.js',
      'Matrix4x3.js'
    ]
    , EXPORTS = [
      'Vector3',
      'EulerAngles',
      'Quaternion',
      'RotationMatrix',
      'Matrix4x3'
    ]
    , DST = 'lib'
    , NAME = 'math3'

    , fs = require('fs')
    , path = require('path')

    , changed = (function () {
      var id
        ;
      return function () {
        clearTimeout(id);
        id = setTimeout(function () {
          compile()
        }, 100);
      };
    })()
    , compile = function () {
      var codes = []
        , exports = []
        , code
        ;
      FILES.forEach(function (filename) {
        var lines = fs.readFileSync(path.join(SRC, filename), 'utf8')
            .split(/\r?\n/)
          ;
        lines.forEach(function (line, i) {
          lines[i] = '  ' + line;
        });
        codes.push(lines.join('\n'));
      });
      EXPORTS.forEach(function (exp) {
        exports.push('  this.' + exp + ' = ' + exp + ';');
      });
      codes.push(exports.join('\n'));

      code = [
        '(function () {',
        codes.join('\n\n\n'),
        '}).call(this);'
      ].join('\n');

      fs.writeFileSync(path.join(DST, NAME + '.js'), code);
    }
    ;

  fs.watch(SRC, changed);
  compile();

})();