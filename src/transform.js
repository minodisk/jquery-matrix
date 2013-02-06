(function () {
  'use strict';

  var normalize = function (num) {
      if (num < 1e-6 && num > -1e-6) {
        return 0;
      }
      return num;
    }
    ;

  function Transform(matrix, perspective) {
    this.matrix = matrix != null ? matrix : new Matrix();
    this.perspective = perspective != null ? perspective : 0;
  }

  Transform.prototype.toString = function () {
    var transforms = []
      , perspective = normalize(this.perspective)
      ;

    // Mozillaのperspectiveの特徴
    // - 0で設定するとtransformプロパティ自体が解釈されない
    // - matrixの後に設定するとperspectiveが解釈されない
    // - 単位(px)は必須
    if (perspective !== 0) {
      transforms.push('perspective(' + perspective + 'px)');
    }

    if (!Matrix.isIdentity(this.matrix)) {
      transforms.push(this.matrix.toString());
    }

    transforms.join(' ');
  };

  this.Transform = Transform;

}).call(this);