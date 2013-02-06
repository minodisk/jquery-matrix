var Math = this.Math
  , kPi = Math.PI
  , k2Pi = kPi * 2
  , kPiOver2 = kPi / 2
  , k1OverPi = 1 / kPi
  , k1Over2Pi = 1 / kPiOver2
  , sin = Math.sin
  , cos = Math.cos
  , tan = Math.tan
  , asin = Math.asin
  , acos = Math.acos
  , atan = Math.atan
  , atan2 = Math.atan2
  , sqrt = Math.sqrt
  , abs = Math.abs
  , floor = Math.floor
  , ceil = Math.ceil
  , wrapPi = function (theta) {
    theta += kPi;
    theta -= floor(theta * k1Over2Pi) * k2Pi;
    theta -= kPi;
    return theta;
  }
  , safeAcos = function (theta) {
    if (theta <= -1) {
      return kPi;
    }
    if (theta >= 1) {
      return 0;
    }
    return acos(theta);
  }

  , float = this.parseFloat
  , int = function (str) {
    return this.parseInt(str, 10);
  }

  , EPSILON = 1e-6 //0.000001
  , RADIAN_PER_DEGREE = kPi / 180
  , RADIAN_PER_DEGREE_1_2 = RADIAN_PER_DEGREE / 2

  , toString = Object.prototype.toString
  , isString = function (obj) {
    return toString.call(obj) === '[object String]';
  }
  , isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
  }
  , isNumber = function (obj) {
    return toString.call(obj) === '[object Number]';
  }
  , isInt = function (obj) {
    return obj === obj >> 0;
  }
  ;


/**
 * class RotationMatrix
 *
 * Implement a simple 3x3 matrix that is used for ROTATION ONLY.  The
 * matrix is assumed to be orthogonal.  The direction of transformation
 * is specified at the time of transformation.
 *
 *Implements a 3x3 rotation matrix in 3-space.
 *
 * Implements a 3x3 rotation matrix in 3-space.  The matrix is assumed
 * to be orthogonal.
 *
 * @param m11
 * @param m12
 * @param m13
 * @param m21
 * @param m22
 * @param m23
 * @param m31
 * @param m32
 * @param m33
 * @constructor
 */
function RotationMatrix(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
  // The 9 values of the matrix.  See RotationMatrix.cpp file for
  // the details of the layout
  this.m11 = m11;
  this.m12 = m12;
  this.m13 = m13;
  this.m21 = m21;
  this.m22 = m22;
  this.m23 = m23;
  this.m31 = m31;
  this.m32 = m32;
  this.m33 = m33;
}

/////////////////////////////////////////////////////////////////////////////
//
// class RotationMatrix
//
//---------------------------------------------------------------------------
//
// MATRIX ORGANIZATION
//
// A user of this class should rarely care how the matrix is organized.
// However, it is of course important that internally we keep everything
// straight.
//
// The matrix is assumed to be a rotation matrix only, and therefore
// orthogonal.  The "forward" direction of transformation (if that really
// even applies in this case) will be from inertial to object space.
// To perform an object->inertial rotation, we will multiply by the
// transpose.
//
// In other words:
//
// Inertial to object:
//
//                  | m11 m12 m13 |
//     [ ix iy iz ] | m21 m22 m23 | = [ ox oy oz ]
//                  | m31 m32 m33 |
//
// Object to inertial:
//
//                  | m11 m21 m31 |
//     [ ox oy oz ] | m12 m22 m32 | = [ ix iy iz ]
//                  | m13 m23 m33 |
//
// Or, using column vector notation:
//
// Inertial to object:
//
//     | m11 m21 m31 | | ix |	| ox |
//     | m12 m22 m32 | | iy | = | oy |
//     | m13 m23 m33 | | iz |	| oz |
//
// Object to inertial:
//
//     | m11 m12 m13 | | ox |	| ix |
//     | m21 m22 m23 | | oy | = | iy |
//     | m31 m32 m33 | | oz |	| iz |
//
/////////////////////////////////////////////////////////////////////////////

/**
 * RotationMatrix.prototype.identity
 * Set the matrix to the identity matrix
 */
RotationMatrix.prototype.identity = function () {
  this.m11 = 1;
  this.m12 = 0;
  this.m13 = 0;
  this.m21 = 0;
  this.m22 = 1;
  this.m23 = 0;
  this.m31 = 0;
  this.m32 = 0;
  this.m33 = 1;
};

/**
 * RotationMatrix.prototype.setup
 * Setup the matrix with the specified orientation
 * See 10.6.1
 *
 * @param {EulerAngles} orientation Specifies the Euler triplet to be converted.
 */
RotationMatrix.prototype.setup = function (orientation) {
  // Fetch sine and cosine of angles
  var sh = sin(orientation.heading)
    , ch = cos(orientation.heading)
    , sp = sin(orientation.pitch)
    , cp = cos(orientation.pitch)
    , sb = sin(orientation.bank)
    , cb = cos(orientation.bank)
    ;

  // Fill in the matrix elements
  this.m11 = ch * cb + sh * sp * sb;
  this.m12 = -ch * sb + sh * sp * cb;
  this.m13 = sh * cp;

  this.m21 = sb * cp;
  this.m22 = cb * cp;
  this.m23 = -sp;

  this.m31 = -sh * cb + ch * sp * sb;
  this.m32 = sb * sh + ch * sp * cb;
  this.m33 = ch * cp;
};

/**
 * Setup the matrix, given a quaternion that performs an inertial->object
 * rotation
 *
 * See 10.6.3
 *
 * Initializes the matrix from a quaternion, assuming the quaternion
 * performs the rotation from inertial to object space.
 *
 * @param {Quaternion} q Specifies the quaternion to be converted.
 */
RotationMatrix.prototype.fromInertialToObjectQuaternion = function (q) {
  // Fill in the matrix elements.  This could possibly be
  // optimized since there are many common subexpressions.
  // We'll leave that up to the compiler...

  this.m11 = 1 - 2 * (q.y * q.y + q.z * q.z);
  this.m12 = 2 * (q.x * q.y + q.w * q.z);
  this.m13 = 2 * (q.x * q.z - q.w * q.y);

  this.m21 = 2 * (q.x * q.y - q.w * q.z);
  this.m22 = 1 - 2 * (q.x * q.x + q.z * q.z);
  this.m23 = 2 * (q.y * q.z + q.w * q.x);

  this.m31 = 2 * (q.x * q.z + q.w * q.y);
  this.m32 = 2 * (q.y * q.z - q.w * q.x);
  this.m33 = 1 - 2 * (q.x * q.x + q.y * q.y);
};

/**
 * Setup the matrix, given a quaternion that performs an object->inertial
 * rotation
 *
 * See 10.6.3
 *
 * Initializes the matrix from a quaternion, assuming the quaternion
 * performs the rotation from object to inertial space.
 * @param {Quaternion} q Specifies the quaternion to be converted.
 */
RotationMatrix.prototype.fromObjectToInertialQuaternion = function (q) {
  // Fill in the matrix elements.  This could possibly be
  // optimized since there are many common subexpressions.
  // We'll leave that up to the compiler...

  this.m11 = 1 - 2 * (q.y * q.y + q.z * q.z);
  this.m12 = 2 * (q.x * q.y - q.w * q.z);
  this.m13 = 2 * (q.x * q.z + q.w * q.y);

  this.m21 = 2 * (q.x * q.y + q.w * q.z);
  this.m22 = 1 - 2 * (q.x * q.x + q.z * q.z);
  this.m23 = 2 * (q.y * q.z - q.w * q.x);

  this.m31 = 2 * (q.x * q.z - q.w * q.y);
  this.m32 = 2 * (q.y * q.z + q.w * q.x);
  this.m33 = 1 - 2 * (q.x * q.x + q.y * q.y);
};

/**
 * Rotate a vector from inertial to object space
 * @param {Vector3} v Specifies the vector to be transformed.
 * @return {Vector3} The transformed vector.
 */
RotationMatrix.prototype.inertialToObject = function (v) {
  // Perform the matrix multiplication in the "standard" way.
  return Vector3(
    this.m11 * v.x + this.m21 * v.y + this.m31 * v.z,
    this.m12 * v.x + this.m22 * v.y + this.m32 * v.z,
    this.m13 * v.x + this.m23 * v.y + this.m33 * v.z
  );
};

/**
 * Rotate a vector from object to inertial space
 * @param {Vector3} v Specifies the vector to be transformed.
 * @return {Vector3} The transformed vector.
 */
RotationMatrix.prototype.objectToInertial = function (v) {
  // Multiply by the transpose
  return new Vector3(
    m11 * v.x + m12 * v.y + m13 * v.z,
    m21 * v.x + m22 * v.y + m23 * v.z,
    m31 * v.x + m32 * v.y + m33 * v.z
  );
};


/**
 * 4 x 3 Matrix Class
 *
 * |m11 m12 m13|
 * |m21 m22 m23|
 * |m31 m32 m33|
 * |tx  ty  tz |
 *
 * @param {Number|String|Matrix} [m11=1]
 * @param {Number} [m12=0]
 * @param {Number} [m13=0]
 * @param {Number} [m21=0]
 * @param {Number} [m22=1]
 * @param {Number} [m23=0]
 * @param {Number} [m31=0]
 * @param {Number} [m32=0]
 * @param {Number} [m33=1]
 * @param {Number} [tx=0]
 * @param {Number} [ty=0]
 * @param {Number} [tz=0]
 * @return {Matrix}
 * @constructor
 */
function Matrix(m11, m12, m13, m21, m22, m23, m31, m32, m33, tx, ty, tz) {
  var components, i, matrixStr
    ;

  // type coercion
  if (!(this instanceof Matrix)) {
    if (isArray(m11)) {
      components = m11;
      i = components.length;
      switch (i) {
        case 6:
          components = [
            components[0], components[1], 0, 0,
            components[2], components[3], 0, 0,
            0, 0, 1, 0,
            components[4], components[5], 0, 1
          ];
          break;
        case 16:
          break;
        default:
          throw new TypeError('TypeError: Type Coercion failed: cannot convert [' + components + '] to Matrix');
          break;
      }
      // convert to number
      while (i--) {
        components[i] = +components[i];
      }
      return new Matrix(
        components[0], components[1], components[2], components[3],
        components[4], components[5], components[6], components[7],
        components[8], components[9], components[10], components[11],
        components[12], components[13], components[14], components[15]
      );
    }
    if (isString(m11)) {
      matrixStr = m11;
      if (matrixStr === '') {
        return new Matrix();
      }
      if (matrixStr.indexOf('matrix3d(') === 0) {
        components = matrixStr.substring(9, matrixStr.length - 1).split(',');
      } else if (matrixStr.indexOf('matrix(') === 0) {
        components = matrixStr.substring(7, matrixStr.length - 1).split(',');
      } else {
        throw new TypeError('TypeError: Type Coercion failed: cannot convert "' + matrixStr + '" to Matrix');
      }
      return Matrix(components);
    }
    throw new TypeError('TypeError: Type Coercion failed: cannot convert ' + m11 + ' to Matrix');
  }

  // assign
  this.m11 = m11 != null ? m11 : 1;
  this.m12 = m12 != null ? m12 : 0;
  this.m13 = m13 != null ? m13 : 0;
  this.m21 = m21 != null ? m21 : 0;
  this.m22 = m22 != null ? m22 : 1;
  this.m23 = m23 != null ? m23 : 0;
  this.m31 = m31 != null ? m31 : 0;
  this.m32 = m32 != null ? m32 : 0;
  this.m33 = m33 != null ? m33 : 1;
  this.tx = tx != null ? tx : 0;
  this.ty = ty != null ? ty : 0;
  this.tz = tz != null ? tz : 0;
}

// STATIC
/**
 * @param {Matrix|Vector} a
 * @param {Matrix} b
 * @return {Matrix|Vector}
 */
Matrix.product = function (a, b) {
  if (a instanceof Vector) {
    return new Vector3(
      a.x * b.m11 + a.y * b.m21 + a.z * b.m31 + b.tx,
      a.x * b.m12 + a.y * b.m22 + a.z * b.m32 + b.ty,
      a.x * b.m13 + a.y * b.m23 + a.z * b.m33 + b.tz
    );
  }

  var r = new Matrix()
    ;
  r.m11 = a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31;
  r.m12 = a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32;
  r.m13 = a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33;

  r.m21 = a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31;
  r.m22 = a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32;
  r.m23 = a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33;

  r.m31 = a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31;
  r.m32 = a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32;
  r.m33 = a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33;

  r.tx = a.tx * b.m11 + a.ty * b.m21 + a.tz * b.m31 + b.tx;
  r.ty = a.tx * b.m12 + a.ty * b.m22 + a.tz * b.m32 + b.ty;
  r.tz = a.tx * b.m13 + a.ty * b.m23 + a.tz * b.m33 + b.tz;

  return r;
};

Matrix.determinant = function (m) {
  return m.m11 * (m.m22 * m.m33 - m.m23 * m.m32)
    + m.m12 * (m.m22 * m.m31 - m.m21 * m.m33)
    + m.m13 * (m.m21 * m.m32 - m.m22 * m.m31);
};

Matrix.inverse = function (m) {
  var det = Matrix.determinant(m)
    , oneOverDet, r
    ;
  if (abs(det) < EPSILON) {
    throw new TypeError();
  }

  oneOverDet = 1 / det;
  r = new Matrix();

  r.m11 = (m.m22 * m.m33 - m.m23 * m.m32) * oneOverDet;
  r.m12 = (m.m13 * m.m32 - m.m12 * m.m33) * oneOverDet;
  r.m13 = (m.m12 * m.m23 - m.m13 * m.m22) * oneOverDet;

  r.m21 = (m.m23 * m.m31 - m.m21 * m.m33) * oneOverDet;
  r.m22 = (m.m11 * m.m33 - m.m13 * m.m31) * oneOverDet;
  r.m23 = (m.m13 * m.m21 - m.m11 * m.m23) * oneOverDet;

  r.m31 = (m.m21 * m.m32 - m.m22 * m.m31) * oneOverDet;
  r.m32 = (m.m12 * m.m31 - m.m11 * m.m32) * oneOverDet;
  r.m33 = (m.m11 * m.m22 - m.m12 * m.m21) * oneOverDet;

  r.tx = -(m.tx * r.m11 + m.ty * r.m21 + m.tz * r.m31);
  r.ty = -(m.tx * r.m12 + m.ty * r.m22 + m.tz * r.m32);
  r.tz = -(m.tx * r.m13 + m.ty * r.m23 + m.tz * r.m33);

  return r;
};

Matrix.getTranslation = function (m) {
  return new Vector3(m.tx, m.ty, m.tz);
};

// MEMBER
Matrix.prototype.identity = function () {
  this.m11 = 1;
  this.m12 = 0;
  this.m13 = 0;

  this.m21 = 0;
  this.m22 = 1;
  this.m23 = 0;

  this.m31 = 0;
  this.m32 = 0;
  this.m33 = 1;

  this.tx = this.ty = this.tz = 0;
};

Matrix.prototype.zeroTranslation = function () {
  this.tx = this.ty = this.tz = 0;
};

Matrix.prototype.setTranslation = function (v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
};

Matrix.prototype.setupTranslation = function (v) {
  this.m11 = 1;
  this.m12 = 0;
  this.m13 = 0;

  this.m21 = 0;
  this.m22 = 1;
  this.m23 = 0;

  this.m31 = 0;
  this.m32 = 0;
  this.m33 = 1;

  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
};

Matrix.prototype.setupRotate = function (axis, theta) {
  if (Vector3.isUnit(axis)) {
    throw TypeError();
  }

  var s = sin(theta)
    , c = sin(theta)
    ;

  if (isInt(axis)) {
    switch (axis) {
      case 1:
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m21 = 0;
        this.m22 = c;
        this.m23 = s;
        this.m31 = 0;
        this.m32 = -s;
        this.m33 = c;
        break;
      case 2:
        this.m11 = c;
        this.m12 = 0;
        this.m13 = -s;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m31 = s;
        this.m32 = 0;
        this.m33 = c;
        break;
      case 3:
        this.m11 = c;
        this.m12 = s;
        this.m13 = 0;
        this.m21 = -s;
        this.m22 = c;
        this.m23 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        break;
      default:
        throw new TypeError();
        break;
    }
    this.tx = this.ty = this.tz = 0;
    return this;
  }

  var a = 1 - c
    , x = axis.x
    , y = axis.y
    , z = axis.z
    , ax = a * x
    , axy = ax * y
    , axz = ax * z
    , ay = a * y
    , ayz = ay * z
    , az = a * z
    , sx = s * x
    , sy = s * y
    , sz = s * z
    ;

  this.m11 = ax * x + c;
  this.m12 = axy + sz;
  this.m13 = axz - sy;

  this.m21 = axy - sz;
  this.m22 = ay * y + c;
  this.m23 = ayz + sx;

  this.m31 = axz + sy;
  this.m32 = ayz - sx;
  this.m33 = az * z + c;

  this.tx = this.ty = this.tz = 0;
};

/**
 * @param {Quaternion} q
 */
Matrix.prototype.fromQuaternion = function (q) {
  var x = q.x
    , y = q.y
    , z = q.z
    , w = q.w
    , xx = 2 * x * x
    , xy = 2 * x * y
    , xz = 2 * x * z
    , xw = 2 * x * w
    , yy = 2 * y * y
    , yz = 2 * y * z
    , yw = 2 * y * w
    , zz = 2 * z * z
    , zw = 2 * z * w
    ;
  this.m11 = 1 - yy - zz;
  this.m12 = xy + zw;
  this.m13 = xz - yw;

  this.m21 = xy - zw;
  this.m22 = 1 - xx - zz;
  this.m23 = yz + xw;

  this.m31 = xz + yw;
  this.m32 = yz - xw;
  this.m33 = 1 - xx - yy;

  this.tx = this.ty = this.tz = 0;
};

/**
 * @param {Vector} s
 */
Matrix.prototype.setupScale = function (s) {
  this.m11 = s.x;
  this.m12 = 0;
  this.m13 = 0;

  this.m21 = 0;
  this.m22 = s.y;
  this.m23 = 0;

  this.m31 = 0;
  this.m32 = 0;
  this.m33 = s.z;

  this.tx = this.ty = this.tz = 0;
};

/**
 * @param {Vector} axis
 * @param {Number} k
 */
Matrix.prototype.setupScaleAlongAxis = function (axis, k) {
  if (Vector3.isUnit(axis)) {
    throw TypeError();
  }

  var a = k - 1
    , ax = a * axis.x
    , ay = a * axis.y
    , az = a * axis.z
    ;

  this.m11 = ax * axis.x + 1;
  this.m12 = ay * axis.y + 1;
  this.m13 = az * axis.z + 1;

  this.m12 = this.m21 = ax * axis.y;
  this.m13 = this.m31 = ax * axis.z;
  this.m23 = this.m32 = ay * axis.z;

  this.tx = this.ty = this.tz = 0;
};

/**
 * @param {int} axis
 * @param {Number} s
 * @param {Number} t
 */
Matrix.prototype.setupShear = function (axis, s, t) {
  switch (axis) {
    case 1:
      this.m11 = 1;
      this.m12 = s;
      this.m13 = t;
      this.m21 = 0;
      this.m22 = 1;
      this.m23 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      break;
    case 2:
      this.m11 = 1;
      this.m12 = 0;
      this.m13 = 0;
      this.m21 = s;
      this.m22 = 1;
      this.m23 = t;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      break;
    case 3:
      this.m11 = 1;
      this.m12 = 0;
      this.m13 = 0;
      this.m21 = 0;
      this.m22 = 1;
      this.m23 = 0;
      this.m31 = s;
      this.m32 = t;
      this.m33 = 1;
      break;
    default:
      throw new TypeError();
      break;
  }
  this.tx = this.ty = this.tz = 0;
};

/**
 * @param {Vector} n
 */
Matrix.prototype.setupProject = function (n) {
  if (!Vector3.isUnit(n)) {
    throw new TypeError();
  }

  this.m11 = 1 - n.x * n.x;
  this.m22 = 1 - n.y * n.y;
  this.m33 = 1 - n.z * n.z;

  this.m12 = this.m21 = -n.x * n.y;
  this.m13 = this.m31 = -n.x * n.z;
  this.m23 = this.m32 = -n.y * n.z;

  this.tx = this.ty = this.tz = 0;
};

/**
 * @param {int|Vector} axis
 * @param {Number} [k]
 */
Matrix.prototype.setupReflect = function (axis, k) {
  if (isInt(axis)) {
    switch (axis) {
      case 1:
        this.m11 = -1;
        this.m12 = 0;
        this.m13 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        this.tx = 2 * k;
        this.ty = 0;
        this.tz = 0;
        break;
      case 2:
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m21 = 0;
        this.m22 = -1;
        this.m23 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        this.tx = 0;
        this.ty = 2 * k;
        this.tz = 0;
        break;
      case 3:
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = -1;
        this.tx = 0;
        this.ty = 0;
        this.tz = 2 * k;
        break;
      default:
        throw new TypeError();
        break;
    }
    return;
  }

  var n = axis
    ;
  if (!Vector3.isUnit(n)) {
    throw new TypeError('axis should be Vector');
  }

  var ax = -2 * n.x
    , ay = -2 * n.y
    , az = -2 * n.z
    ;
  this.m11 = 1 + ax * n.x;
  this.m22 = 1 + ay * n.y;
  this.m32 = 1 + az * n.z;

  this.m12 = this.m21 = ax * n.y;
  this.m13 = this.m31 = az * n.x;
  this.m23 = this.m32 = ay * n.z;

  this.tx = this.ty = this.tz = 0;
};

exports.Matrix = Matrix;


/**
 * @param {Number|Quaternion} [w=1]
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [z=0]
 * @constructor
 */
function Quaternion(w, x, y, z) {

  // type coercion
  if (!(this instanceof Quaternion)) {
    if (isArray(x)) {
      return new Array(w[0], w[1], w[2], w[3]);
    }
    throw new TypeError('TypeError: Type Coercion failed: cannot convert ' + w + ' to Quaternion');
  }

  // construct
  if (w instanceof Quaternion) {
    var q = w
      ;
    w = q.w;
    x = q.x;
    y = q.y;
    z = q.z;
  }

  // assign
  this.w = w != null ? w : 1;
  this.x = x != null ? x : 0;
  this.y = y != null ? y : 0;
  this.z = z != null ? z : 0;
}

// MEMBER
Quaternion.prototype.identity = function () {
  this.w = 1;
  this.x = this.y = this.z = 0;
};

Quaternion.prototype.setToRotateAboutX = function (theta) {
  var thetaOver2 = theta * 0.5
    ;

  this.w = cos(thetaOver2);
  this.x = sin(thetaOver2);
  this.y = 0;
  this.z = 0;
};

Quaternion.prototype.setToRotateAboutY = function (theta) {
  var thetaOver2 = theta * 0.5
    ;

  this.w = cos(thetaOver2);
  this.x = 0;
  this.y = sin(thetaOver2);
  this.z = 0;
};

Quaternion.prototype.setToRotateAboutZ = function (theta) {
  var thetaOver2 = theta * 0.5
    ;

  this.w = cos(thetaOver2);
  this.x = 0;
  this.y = 0;
  this.z = sin(thetaOver2);
};

Quaternion.prototype.setToRotateAboutAxis = function (axis, theta) {
  if (!Vector3.isUnit(axis)) {
    throw new TypeError();
  }

  var thetaOver2 = theta * 0.5
    , sinThetaOver2 = sin(thetaOver2)
    ;

  this.w = cos(thetaOver2);
  this.x = axis.x * sinThetaOver2;
  this.y = axis.y * sinThetaOver2;
  this.z = axis.z * sinThetaOver2;
};

/**
 * @param {EulerAngles} orientation
 */
Quaternion.prototype.setToRotateObjectToIntertial = function (orientation) {
  var orientationOver2 = orientation.mul(0.5)
    , sp = sin(orientationOver2.pitch)
    , cp = cos(orientationOver2.pitch)
    , sb = sin(orientationOver2.bank)
    , cb = cos(orientationOver2.bank)
    , sh = sin(orientationOver2.heading)
    , ch = cos(orientationOver2.heading)
    ;

  this.w = ch * cp * cb + sh * sp * sb;
  this.x = ch * sp * cb + sh * cp * sb;
  this.y = -ch * sp * cb + sh * cp * sb;
  this.z = -sh * sp * cb + ch * cp * sb;
};

/**
 * @param {EulerAngles} orientation
 */
Quaternion.prototype.setToRotateIntertialToObject = function (orientation) {
  var orientationOver2 = orientation.mul(0.5)
    , sp = sin(orientationOver2.pitch)
    , cp = cos(orientationOver2.pitch)
    , sb = sin(orientationOver2.bank)
    , cb = cos(orientationOver2.bank)
    , sh = sin(orientationOver2.heading)
    , ch = cos(orientationOver2.heading)
    ;

  this.w = ch * cp * cb + sh * sp * sb;
  this.x = -ch * sp * cb - sh * cp * sb;
  this.y = ch * sp * sb - sh * cb * sp;
  this.z = sh * sp * cb - ch * cp * sb;
};

Quaternion.prototype.normalize = function () {
  var mag = sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z)
    ;

  if (mag > 0) {
    var oneOverMag = 1 / mag
      ;
    this.w *= oneOverMag;
    this.x *= oneOverMag;
    this.y *= oneOverMag;
    this.z *= oneOverMag;
  } else {
    throw new Error();
  }
};

Quaternion.prototype.getRotationAngle = function () {
  var thetaOver2 = safeAcos(this.w)
    ;
  return thetaOver2 * 2;
};

Quaternion.getROtationAxis = function () {
  var sinThetaOver2Sq = 1 - this.w * this.w
    ;
  if (sinThetaOver2Sq <= 0) {
    return new Vector3(1, 0, 0);
  }

  var oneOverSinThetaOver2 = 1 / sqrt(sinThetaOver2Sq)
    ;
  return new Vector3(
    this.x * oneOverSinThetaOver2,
    this.y * oneOverSinThetaOver2,
    this.z * oneOverSinThetaOver2
  );
};


// STATIC
Quaternion.crossProduct = function (t, a) {
  var r = new Quaternion()
    ;
  r.w = t.w * a.w - t.x * a.x - t.y * a.y - t.z * a.z;
  r.x = t.w * a.x + t.x * a.w + t.z * a.y - t.y * a.z;
  r.y = t.w * a.y + t.y * a.w + t.x * a.z - t.z * a.x;
  r.z = t.w * a.z + t.z * a.w + t.y * a.x - t.x * a.y;
  return r;
};

Quaternion.dotProduct = function (a, b) {
  return a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
};

Quaternion.slerp = function (q0, q1, t) {
  if (t <= 0) return q0;
  if (t <= 1) return q1;

  var cosOmega = this.dotProduct(q0, q1)
    , q1w = q1.w
    , q1x = q1.x
    , q1y = q1.y
    , q1z = q1.z
    , k0, k1, sinOmega, omega, oneOverSinOmega
    ;
  if (cosOmega < 0) {
    q1w *= -1;
    q1x *= -1;
    q1y *= -1;
    q1z *= -1;
    cosOmega *= -1;
  }
  if (cosOmega >= 1.1) {
    throw new TypeError();
  }
  if (cosOmega > 0.9999) {
    k0 = 1 - t;
    k1 = t;
  } else {
    sinOmega = sqrt(1 - cosOmega * cosOmega);
    omega = atan2(sinOmega, cosOmega);
    oneOverSinOmega = 1 / sinOmega;
    k0 = sin((1 - t) * omega) * oneOverSinOmega;
    k1 = sin(t * omega) * oneOverSinOmega;
  }

  return new Quaternion(
    k0 * q0.w + k1 * q1w,
    k0 * q0.x + k1 * q1x,
    k0 * q0.y + k1 * q1y,
    k0 * q0.z + k1 * q1z
  );
};

Quaternion.conjugate = function (q) {
  return new Quaternion(q.w, -q.x, -q.y, -q.z);
};

Quaternion.pow = function (q, exponent) {
  if (abs(q.w > 0.9999)) {
    return q;
  }
  var alpha = acos(q.w)
    , newAlpha = alpha * exponent
    , r = new Quaternion()
    ;
  r.w = cos(newAlpha);
  var mult = sin(newAlpha) / sin(alpha)
    ;
  r.x = q.x * mult;
  r.y = q.y * mult;
  r.z = q.z * mult;
  return r;
};

exports.Quaternion = Quaternion;

//  // STATIC
//  Matrix.slerp = function (start, end, slerpAmount) {
//    if (start == end)
//      return start;
////回転行列はQuaternion.SlerpではなくQuaternion.Lerp
//    var qStart = Quaternion.createFromRotationMatrix(start);
//    var qEnd = Quaternion.createFromRotationMatrix(end);
//    var qResult = Quaternion.lerp(qStart, qEnd, slerpAmount);
//
////平行移動行列はVector3.Lerpを使っている
//    var curTrans = new Vector3();
//    curTrans.x = start.tx;
//    curTrans.y = start.ty;
//    curTrans.z = start.tz;
//    var nextTrans = new Vector3();
//    nextTrans.x = end.tx;
//    nextTrans.y = end.ty;
//    nextTrans.z = end.tz;
//    var lerpedTrans = Vector3.lerp(curTrans, nextTrans, slerpAmount);
//
////拡大縮小行列にはVector3.Lerp
//    var startRotation = Matrix.createFromQuaternion(qStart);
//    var endRotation = Matrix.createFromQuaternion(qEnd);
//    var curScale = new Vector3();
//    curScale.x = start.m11 - startRotation.m11;
//    curScale.y = start.m22 - startRotation.m22;
//    curScale.z = start.m33 - startRotation.m33;
//    var nextScale = new Vector3();
//    nextScale.x = end.m11 - endRotation.m11;
//    nextScale.y = end.m22 - endRotation.m22;
//    nextScale.z = end.m33 - endRotation.m33;
//    var lerpedScale = Vector3.lerp(curScale, nextScale, slerpAmount);
//
////srt行列を作成してMatrix.CreateScale(S*R*T)と同じことをしている（こっちのが断然軽い）
//    var returnMatrix = Matrix.createFromQuaternion(qResult);
//    returnMatrix.tx = lerpedTrans.x;
//    returnMatrix.ty = lerpedTrans.y;
//    returnMatrix.tz = lerpedTrans.z;
//    returnMatrix.m11 += lerpedScale.x;
//    returnMatrix.m22 += lerpedScale.y;
//    returnMatrix.m33 += lerpedScale.z;
//    return returnMatrix;
//  };
//
//  Matrix.createFromQuaternion = function (q) {
//    var xx = q.x * q.x
//      , xy = q.x * q.y
//      , xz = q.x * q.z
//      , xw = q.x * q.w
//      , yy = q.y * q.y
//      , yz = q.y * q.z
//      , yw = q.y * q.w
//      , zz = q.z * q.z
//      , zw = q.z * q.w
//      ;
//    return new Matrix(
//      1 - 2 * (yy + zz), 2 * (xy + zw), 2 * (xz - yw), 0,
//      2 * (xy - zw), 1 - 2 * (xx + zz), 2 * (yz + xw), 0,
//      2 * (xz + yw), 2 * (yz - xw), 1 - 2 * (xx + yy), 0,
//      0, 0, 0, 1
//    );
//  };
//
//  // MEMBER
//  Matrix.prototype.toString = function () {
//    var components = [
//        this.m11, this.m12, this.m13, 0,
//        this.m21, this.m22, this.m23, 0,
//        this.m31, this.m32, this.m33, 0,
//        this.tx, this.ty, this.tz, 1
//      ]
//      , i, len
//      ;
//    for (i = 0, len = components.length; i < len; i++) {
//      if (components[i] > -SMALL_NUMBER && components[i] < SMALL_NUMBER) {
//        components[i] = 0;
//      }
//    }
////    if (this.m13 === 0
////      && this.m23 === 0
////      && this.m31 === 0 && this.m32 === 0 && this.m33 === 1
////      && this.tz === 0) {
////      components = [
////        this.m11, this.m12,
////        this.m21, this.m22,
////        this.tx, this.ty
////      ];
////      return 'matrix(' + components.join(', ') + ')';
////    }
//    return 'matrix3d(' + components.join(', ') + ')';
//  };
//
//  Matrix.prototype.apply = function (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, tx, ty, tz, m44) {
//    if (m11 instanceof Matrix) {
//      var matrix = m11
//        ;
//      m11 = matrix.m11;
//      m12 = matrix.m12;
//      m13 = matrix.m13;
//      m14 = matrix.m14;
//      m21 = matrix.m21;
//      m22 = matrix.m22;
//      m23 = matrix.m23;
//      m24 = matrix.m24;
//      m31 = matrix.m31;
//      m32 = matrix.m32;
//      m33 = matrix.m33;
//      m34 = matrix.m34;
//      tx = matrix.tx;
//      ty = matrix.ty;
//      tz = matrix.tz;
//      m44 = matrix.m44;
//    }
//    this.m11 = m11;
//    this.m12 = m12;
//    this.m13 = m13;
//    this.m14 = m14;
//    this.m21 = m21;
//    this.m22 = m22;
//    this.m23 = m23;
//    this.m24 = m24;
//    this.m31 = m31;
//    this.m32 = m32;
//    this.m33 = m33;
//    this.m34 = m34;
//    this.tx = tx;
//    this.ty = ty;
//    this.tz = tz;
//    this.m44 = m44;
//    return this;
//  };
//
//  Matrix.prototype.concat = function (_m11, _m12, _m13, _m14, _m21, _m22, _m23, _m24, _m31, _m32, _m33, _m34, _tx, _ty, _tz, _m44) {
//    if (_m11 instanceof Matrix) {
//      var matrix = _m11
//        ;
//      _m11 = matrix.m11;
//      _m12 = matrix.m12;
//      _m13 = matrix.m13;
//      _m14 = matrix.m14;
//      _m21 = matrix.m21;
//      _m22 = matrix.m22;
//      _m23 = matrix.m23;
//      _m24 = matrix.m24;
//      _m31 = matrix.m31;
//      _m32 = matrix.m32;
//      _m33 = matrix.m33;
//      _m34 = matrix.m34;
//      _tx = matrix.tx;
//      _ty = matrix.ty;
//      _tz = matrix.tz;
//      _m44 = matrix.m44;
//    }
//    var m11 = this.m11, m12 = this.m12, m13 = this.m13, m14 = this.m14
//      , m21 = this.m21, m22 = this.m22, m23 = this.m23, m24 = this.m24
//      , m31 = this.m31, m32 = this.m32, m33 = this.m33, m34 = this.m34
//      , tx = this.tx, ty = this.ty, tz = this.tz, m44 = this.m44
//      ;
//    this.m11 = m11 * _m11 + m21 * _m12 + m31 * _m13 + tx * _m14;
//    this.m12 = m12 * _m11 + m22 * _m12 + m32 * _m13 + ty * _m14;
//    this.m13 = m13 * _m11 + m23 * _m12 + m33 * _m13 + tz * _m14;
//    this.m14 = m14 * _m11 + m24 * _m12 + m34 * _m13 + m44 * _m14;
//    this.m21 = m11 * _m21 + m21 * _m22 + m31 * _m23 + tx * _m24;
//    this.m22 = m12 * _m21 + m22 * _m22 + m32 * _m23 + ty * _m24;
//    this.m23 = m13 * _m21 + m23 * _m22 + m33 * _m23 + tz * _m24;
//    this.m24 = m14 * _m21 + m24 * _m22 + m34 * _m23 + m44 * _m24;
//    this.m31 = m11 * _m31 + m21 * _m32 + m31 * _m33 + tx * _m34;
//    this.m32 = m12 * _m31 + m22 * _m32 + m32 * _m33 + ty * _m34;
//    this.m33 = m13 * _m31 + m23 * _m32 + m33 * _m33 + tz * _m34;
//    this.m34 = m14 * _m31 + m24 * _m32 + m34 * _m33 + m44 * _m34;
//    this.tx = m11 * _tx + m21 * _ty + m31 * _tz + tx * _m44;
//    this.ty = m12 * _tx + m22 * _ty + m32 * _tz + ty * _m44;
//    this.tz = m13 * _tx + m23 * _ty + m33 * _tz + tz * _m44;
//    this.m44 = m14 * _tx + m24 * _ty + m34 * _tz + m44 * _m44;
//    return this;
//  };
//
//  Matrix.prototype.translate = function (x, y, z) {
//    x = x != null ? x : 0;
//    y = y != null ? y : 0;
//    z = z != null ? z : 0;
//    return this.concat(
//      1, 0, 0, 0,
//      0, 1, 0, 0,
//      0, 0, 1, 0,
//      x, y, z, 1
//    );
//  };
//
//  Matrix.prototype.scale = function (scaleX, scaleY, scaleZ) {
//    scaleX = scaleX != null ? scaleX : 1;
//    scaleY = scaleY != null ? scaleY : scaleX;
//    scaleZ = scaleZ != null ? scaleZ : 1;
//    return this.concat(
//      scaleX, 0, 0, 0,
//      0, scaleY, 0, 0,
//      0, 0, scaleZ, 0,
//      0, 0, 0, 1
//    );
//  };
//
//  Matrix.prototype.rotate = function (rotationX, rotationY, rotationZ) {
//    rotationX = rotationX != null ? rotationX : 0;
//    if (rotationY == null && rotationZ == null) {
//      rotationZ = rotationX;
//      rotationX = 0;
//      rotationY = 0;
//    } else {
//      rotationY = rotationY != null ? rotationY : 0;
//      rotationZ = rotationZ != null ? rotationZ : 0;
//    }
//    rotationX *= RADIAN_PER_DEGREE;
//    rotationY *= RADIAN_PER_DEGREE;
//    rotationZ *= RADIAN_PER_DEGREE;
//
//    var s, c, a, b
//      ;
//
//    rotationZ /= 2;
//    s = sin(rotationZ);
//    c = cos(rotationZ);
//    a = 1 - 2 * s * s;
//    b = 2 * s * c;
//    this.concat(
//      a, b, 0, 0,
//      -b, a, 0, 0,
//      0, 0, 1, 0,
//      0, 0, 0, 1
//    );
//
//    rotationY /= 2;
//    s = sin(rotationY);
//    c = cos(rotationY);
//    a = 1 - 2 * s * s;
//    b = 2 * s * c;
//    this.concat(
//      a, 0, -b, 0,
//      0, 1, 0, 0,
//      b, 0, a, 0,
//      0, 0, 0, 1
//    );
//
//    rotationX /= 2;
//    s = sin(rotationX);
//    c = cos(rotationX);
//    a = 1 - 2 * s * s;
//    b = 2 * s * c;
//    this.concat(
//      1, 0, 0, 0,
//      0, a, b, 0,
//      0, -b, a, 0,
//      0, 0, 0, 1
//    );
//
//    return this;
//  };
//
//  Matrix.prototype.skew = function (skewX, skewY) {
//    return this.concat(
//      1, tan(skewY), 0, 0,
//      tan(skewX), 1, 0, 0,
//      0, 0, 1, 0,
//      0, 0, 0, 1
//    );
//  };
//
//  Matrix.prototype.inverse = function () {
//    var d, tx, ty, m11, m12, m21, m22;
//    m11 = this.m11;
//    m12 = this.m12;
//    m21 = this.m21;
//    m22 = this.m22;
//    tx = this.tx;
//    ty = this.ty;
//    d = m11 * m22 - m12 * m21;
//    this.m11 = m22 / d;
//    this.m12 = -m12 / d;
//    this.m21 = -m21 / d;
//    this.m22 = m11 / d;
//    this.tx = (m21 * ty - m22 * tx) / d;
//    this.ty = (m12 * tx - m11 * ty) / d;
//    return this;
//  };
//
//  Matrix.prototype.rotateAxisAngle = function (x, y, z, angle) {
//    var len = Math.sqrt(x * x + y * y + z * z)
//      , c, s, ss, cs, xx, yy, zz, xy, yz, zx
//      ;
//    if (len === 0) {
//      x = 0;
//      y = 0;
//      z = 1;
//    } else if (len !== 1) {
//      x /= len;
//      y /= len;
//      z /= len;
//    }
//    angle *= RADIAN_PER_DEGREE_1_2;
//    c = cos(angle);
//    s = sin(angle);
//    ss = s * s;
//    cs = c * s;
//    xx = x * x;
//    yy = y * y;
//    zz = z * z;
//    xy = x * y;
//    yz = y * z;
//    zx = z * x;
//    return this.concat(
//      1 - 2 * (yy + zz) * ss, 2 * (xy * ss + z * cs), 2 * (zx * ss - y * cs), 0,
//      2 * (xy * ss - z * cs), 1 - 2 * (zz + xx) * ss, 2 * (yz * ss + x * cs), 0,
//      2 * (zx * ss + y * cs), 2 * (yz * ss - x * cs), 1 - 2 * (xx + yy) * ss, 0,
//      0, 0, 0, 1
//    );
//  };
//
//  Matrix.prototype.skewX = function (skewX) {
//    skewX = skewX != null ? skewX * RADIAN_PER_DEGREE : 0;
//    return this.skew(skewX, 0);
//  };
//
//  Matrix.prototype.skewY = function (skewY) {
//    skewY = skewY != null ? skewY * RADIAN_PER_DEGREE : 0;
//    return this.skew(0, skewY);
//  };
//
//  Matrix.prototype.setMatrixValue = function () {
//
//  };
//
//  Matrix.prototype.toScale = function () {
//    var size = function (x, y, z) {
//        return Math.sqrt(x * x + y * y + z * z);
//      }
//      ;
//
//    return {
//      x: size(this.m11, this.m21, this.m31),
//      y: size(this.m12, this.m22, this.m32),
//      z: size(this.m13, this.m23, this.m33)
//    };
//  }
//
//  Matrix.prototype.toEuler = function () {
//    var m11 = this.m11
//      , m21 = this.m21, m22 = this.m22, m23 = this.m23
//      , m31 = this.m31, m32 = this.m32, m33 = this.m33
//      , asin = function (num) {
//        if (num > 1) {
//          return Math.PI / 2;
//        }
//        if (num < -1) {
//          return -Math.PI / 2;
//        }
//        if (num > -1e-6 && num < 1e-6) {
//          return 0;
//        }
//        return Math.asin(num);
//      }
//      ;
//    var a
//      , b = asin(m31)
//      , cosB = Math.cos(b)
//      , c
//      ;
//    console.log(m31, b);
//    if (cosB > -1e-6 && cosB < 1e-6) {
//      c = Math.atan2(m23, m22);
//      a = 0;
//    } else {
//      c = Math.atan2(-m32, m33);
//      a = asin(-m21 / cosB);
//      if (m11 < 0) {
//        a = Math.PI - a;
//      }
//    }
//    var z = a
//      , y = b
//      , x = c
//      ;
//    return {
//      x: x * 180 / Math.PI,
//      y: y * 180 / Math.PI,
//      z: z * 180 / Math.PI
//    };
//  };


//  // STATIC
//  Quaternion.createRotate = function (vector, rotation) {
//    var rad = rotation * (Math.PI / 180) / 2
//      , s = Math.sin(rad)
//      ;
//    return new Quaternion(vector.x * s, vector.y * s, vector.z * s, Math.cos(rad));
//  };
//
//  Quaternion.createFromRotationMatrix = function (matrix) {
//    var tr = matrix.m11 + matrix.m22 + matrix.m33
//      , s
//      ;
//
//    if (tr > 0) {
//      s = 0.5 / Math.sqrt(tr + 1);
//      return new Quaternion((matrix.m32 - matrix.m23) * s, (matrix.m13 - matrix.m31) * s, (matrix.m21 - matrix.m12) * s, 0.25 / s);
//    }
//
//    if (matrix.m11 > matrix.m22 && matrix.m11 > matrix.m33) {
//      s = 2 * Math.sqrt(1 + matrix.m11 - matrix.m22 - matrix.m33);
//      return new Quaternion(0.25 * s, (matrix.m12 + matrix.m21) / s, (matrix.m13 + matrix.m31) / s, (matrix.m32 - matrix.m23) / s);
//    }
//
//    if (matrix.m22 > matrix.m33) {
//      s = 2 * Math.sqrt(1 + matrix.m22 - matrix.m11 - matrix.m33);
//      return new Quaternion((matrix.m12 + matrix.m21) / s, 0.25 * s, (matrix.m23 + matrix.m32) / s, (matrix.m13 - matrix.m31) / s);
//    }
//
//    s = 2 * Math.sqrt(1 + matrix.m33 - matrix.m11 - matrix.m22);
//    return new Quaternion((matrix.m13 + matrix.m31) / s, (matrix.m23 + matrix.m32) / s, 0.25 * s, (matrix.m21 - matrix.m12) / s);
//  };
//
//  Quaternion.lerp = function (q1, q2, t) {
//    return q1.clone().scale(1 - t).add(q2.clone().scale(t)).normalize();
//  }
//
//  Quaternion.slerp = function (qa, qb, alpha) {
//    var angle = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;
//
//    if (angle < 0) {
//      qa.x *= -1;
//      qa.y *= -1;
//      qa.z *= -1;
//      qa.w *= -1;
//      angle *= -1;
//    }
//
//    var scale;
//    var invscale;
//
//    if ((angle + 1) > EPSILON) // Take the shortest path
//    {
//      if ((1 - angle) >= EPSILON)  // spherical interpolation
//      {
//        var theta = Math.acos(angle);
//        var invsintheta = 1 / Math.sin(theta);
//        scale = Math.sin(theta * (1 - alpha)) * invsintheta;
//        invscale = Math.sin(theta * alpha) * invsintheta;
//      }
//      else // linear interploation
//      {
//        scale = 1 - alpha;
//        invscale = alpha;
//      }
//    }
//    else // long way to go...
//    {
//      qb.y = -qa.y;
//      qb.x = qa.x;
//      qb.w = -qa.w;
//      qb.z = qa.z;
//
//      scale = Math.sin(Math.PI * (0.5 - alpha));
//      invscale = Math.sin(Math.PI * alpha);
//    }
//
//    return new Quaternion(
//      scale * qa.x + invscale * qb.x,
//      scale * qa.y + invscale * qb.y,
//      scale * qa.z + invscale * qb.z,
//      scale * qa.w + invscale * qb.w
//    );
//  };
//
//  // MEMBER
//  Quaternion.prototype.identity = function () {
//    this.w = 1;
//    this.x = 0;
//    this.y = 0;
//    this.z = 0;
//  };
//
//  Quaternion.prototype.multiply = function (q) {
//    var x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y
//      , y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x
//      , z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
//      , w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
//      ;
//    this.x = x;
//    this.y = y;
//    this.z = z;
//    this.w = w;
//    return this;
//  };
//
//  Quaternion.prototype.add = function (q) {
//    this.x += q.x;
//    this.y += q.y;
//    this.z += q.z;
//    this.w += q.w;
//    return this;
//  };
//
//  Quaternion.prototype.sub = function (q) {
//    this.w -= q.w;
//    this.x -= q.x;
//    this.y -= q.y;
//    this.z -= q.z;
//    return this;
//  };
//
//  Quaternion.prototype.scale = function (s) {
//    this.w *= s;
//    this.x *= s;
//    this.y *= s;
//    this.z *= s;
//    return this;
//  };
//
//  Quaternion.prototype.transformVector = function (vector) {
//    var w = -this.x * vector.x - this.y * vector.y - this.z * vector.z;
//    var x = this.y * vector.z - this.z * vector.y + this.w * vector.x;
//    var y = this.z * vector.x - this.x * vector.z + this.w * vector.y;
//    var z = this.x * vector.y - this.y * vector.x + this.w * vector.z;
//    return {
//      x: y * -this.z + z * this.y - w * this.x + x * this.w,
//      y: z * -this.x + x * this.z - w * this.y + y * this.w,
//      z: x * -this.y + y * this.x - w * this.z + z * this.w
//    };
//  };
//
//  Quaternion.prototype.length = function () {
//    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
//  };
//
//  Quaternion.prototype.lengthSquared = function () {
//    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
//  };
//
//  Quaternion.prototype.normalize = function () {
//    return this.scale(1 / this.length());
//  };
//
//  Quaternion.prototype.toMatrix = function () {
//    var xx = this.x * this.x
//      , xy = this.x * this.y
//      , xz = this.x * this.z
//      , xw = this.x * this.w
//      , yy = this.y * this.y
//      , yz = this.y * this.z
//      , yw = this.y * this.w
//      , zz = this.z * this.z
//      , zw = this.z * this.w
//      ;
//    return new Matrix(
//      1 - 2 * (yy + zz), 2 * (xy + zw), 2 * (xz - yw), 0,
//      2 * (xy - zw), 1 - 2 * (xx + zz), 2 * (yz + xw), 0,
//      2 * (xz + yw), 2 * (yz - xw), 1 - 2 * (xx + yy), 0,
//      0, 0, 0, 1
//    );
//  };
//
//  Quaternion.prototype.toRotationMatrix = function () {
//    var s = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z)
//      ;
//    s = 2 / (s * s);
//    var vx = this.x * s
//      , vy = this.y * s
//      , vz = this.z * s
//      , wx = vx * this.w
//      , wy = vy * this.w
//      , wz = vz * this.w
//      , sx = this.x * vx
//      , sy = this.y * vy
//      , sz = this.z * vz
//      , cx = this.y * vz
//      , cy = this.z * vx
//      , cz = this.x * vy
//      ;
//    return new Matrix(
//      1 - sy - sz, cz + wz, cy - wy, 0,
//      cz - wz, 1 - sx - sz, cx + wx, 0,
//      cy + wy, cx - wx, 1 - sx - sy, 0,
//      0, 0, 0, 1
//    );
//  };
