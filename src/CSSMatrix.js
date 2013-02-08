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
  , zeroEpsilon = function (n) {
    if (n > -EPSILON && n < EPSILON) {
      return 0;
    }
    return n;
  }
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

CSSMatrix.UNIT = new CSSMatrix();

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
  var m11 = zeroEpsilon(this.m11)
    , m12 = zeroEpsilon(this.m12)
    , m13 = zeroEpsilon(this.m13)
    , m21 = zeroEpsilon(this.m21)
    , m22 = zeroEpsilon(this.m22)
    , m23 = zeroEpsilon(this.m23)
    , m31 = zeroEpsilon(this.m31)
    , m32 = zeroEpsilon(this.m32)
    , m33 = zeroEpsilon(this.m33)
    , tx = zeroEpsilon(this.tx)
    , ty = zeroEpsilon(this.ty)
    , tz = zeroEpsilon(this.tz)
    ;
  if (m13 === 0
    && m23 === 0
    && m31 === 0 && m32 === 0 && m33 === 1
    && tz === 0) {
    return 'matrix(' +
      [
        m11, m12,
        m21, m22,
        tx, ty
      ].join(', ') +
      ')';
  }
  return 'matrix3d(' +
    [
      m11, m12, m13, 0,
      m21, m22, m23, 0,
      m31, m32, m33, 0,
      tx, ty, tz, 1
    ].join(', ') +
    ')';
};

__matrix = new CSSMatrix();