var kPiOver180 = kPi / 180
  , __hasProp = {}.hasOwnProperty
  , __extends = function (child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }
  , __matrix
  ;


__extends(CSSMatrix, Matrix4x3);

function CSSMatrix(transform) {
  if (typeof transform === 'string') {
    var components
      ;
    if (transform.indexOf('matrix3d') === 0) {
      components = transform.substring(9, transform.length - 1).split(',');
    } else if (transform.indexOf('matrix') === 0) {
      components = transform.substring(7, transform.length - 1).split(',');
      components = [
        components[0], components[1], 0,
        components[2], components[3], 0,
        0, 0, 1,
        components[4], components[5], 0
      ];
    }
    CSSMatrix.__super__.constructor.apply(this, components);
    return;
  }
  CSSMatrix.__super__.constructor.apply(this, arguments);
}

CSSMatrix.prototype.translate = function (x, y, z) {
  x = x != null ? x : 0;
  y = y != null ? y : 0;
  z = z != null ? z : 0;

  __matrix.setupTranslation(new Vector3(x, y, z));
  this.concat(__matrix);

  return this;
};

CSSMatrix.prototype.scale = function (scaleX, scaleY, scaleZ) {
  scaleX = scaleX != null ? scaleX : 1;
  scaleY = scaleY != null ? scaleY : 1;
  scaleZ = scaleZ != null ? scaleZ : 1;

  __matrix.setupScale(new Vector3(scaleX, scaleY, scaleZ));
  this.concat(__matrix);

  return this;
};

CSSMatrix.prototype.rotate = function (rotX, rotY, rotZ) {
  rotX = rotX != null ? rotX * kPiOver180 : 0;
  rotY = rotY != null ? rotY * kPiOver180 : 0;
  rotZ = rotZ != null ? rotZ * kPiOver180 : 0;

  __matrix.setupRotateX(rotX);
  this.concat(__matrix);
  __matrix.setupRotateY(rotY);
  this.concat(__matrix);
  __matrix.setupRotateZ(rotZ);
  this.concat(__matrix);

  return this;
};

CSSMatrix.prototype.toString = function () {
  var components = [
      this.m11, this.m12, this.m13, 0,
      this.m21, this.m22, this.m23, 0,
      this.m31, this.m32, this.m33, 0,
      this.tx, this.ty, this.tz, 1
    ]
    , i, len
    ;
  for (i = 0, len = components.length; i < len; i++) {
    if (components[i] > -EPSILON && components[i] < EPSILON) {
      components[i] = 0;
    }
  }
//  if (this.m13 === 0
//    && this.m23 === 0
//    && this.m31 === 0 && this.m32 === 0 && this.m33 === 1
//    && this.tz === 0) {
//    components = [
//      this.m11, this.m12,
//      this.m21, this.m22,
//      this.tx, this.ty
//    ];
//    return 'matrix(' + components.join(', ') + ')';
//  }
  return 'matrix3d(' + components.join(', ') + ')';
};

__matrix = new CSSMatrix();