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



/////////////////////////////////////////////////////////////////////////////
//
// class Vector3 - a simple 3D vector class
//
/////////////////////////////////////////////////////////////////////////////

/**
 * A representation of a three-dimensional vector.
 *
 * Constructs a vector with the specified coordinates, when three values are given.
 * Constructs a deep copy of a vector, when one vector is given.
 *
 * @param {Number|Vector3} [x=0] Specifies the x-coordinate or the vector to be copied.
 * @param {Number} [y=0]         Specifies the y-coordinate.
 * @param {Number} [z=0]         Specifies the z-coordinate.
 * @constructor
 */
function Vector3(x, y, z) {
  var v
    ;

  // type coercion
  if (!(this instanceof Vector3)) {
    if (isArray(x)) {
      return new Vector3(x[0], x[1], x[2]);
    }
    throw new TypeError('TypeError: Type Coercion failed: cannot convert ' + x + ' to Vector');
  }

  // clone
  if (x instanceof Vector3) {
    v = x;
    x = v.x;
    y = v.y;
    z = v.z;
  }

  this.x = x != null ? x : 0;
  this.y = y != null ? y : 0;
  this.z = z != null ? z : 0;
}


/////////////////////////////////////////////////////////////////////////////
//
// Global variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * The zero vector.
 * @type {Vector3}
 */
Vector3.kZeroVector = new Vector3(0, 0, 0);

/**
 * The x unit vector.
 * @type {Vector3}
 */
Vector3.kRightVector = new Vector3(1, 0, 0);

/**
 * The y unit vector.
 * @type {Vector3}
 */
Vector3.kUpVector = new Vector3(0, 1, 0);

/**
 * The z unit vector.
 * @type {Vector3}
 */
Vector3.kForwardVector = new Vector3(0, 0, 1);

/////////////////////////////////////////////////////////////////////////////
//
// Nonmember functions
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Computes the crossproduct of two vectors.
 * @param {Vector3} a Specifies the first factor.
 * @param {Vector3} b Specifies the second factor.
 * @return {Vector3}  The cross product of the two vectors.
 */
Vector3.crossProduct = function (a, b) {
  return a.crossProduct(b);
};

/**
 * Computes the dot product of two vectors.
 * @param {Vector3} a Specifies the first factor.
 * @param {Vector3} b Specifies the second factor.
 * @return {number}   The dot product of the two vectors.
 */
Vector3.dotProduct = function (a, b) {
  return a.dotProduct(b);
};

/**
 * Computes the distance between two vectors.
 * @param {Vector3} a Specifies the first vector.
 * @param {Vector3} b Specifies the second vector.
 * @return {Number} The distance between the two vectors.
 */
Vector3.distance = function (a, b) {
  return a.distance(b);
};

/**
 * Computes the squared distance between two vectors.
 * @param {Vector3} a Specifies the first vector.
 * @param {Vector3} b Specifies the second vector.
 * @return {Number} The squared distance between the two vectors.
 */
Vector3.distanceSquared = function (a, b) {
  return a.distanceSquared(b);
};

Vector3.isUnit = function (a) {
  return abs(Vector3.dotProduct(a, a) - 1) > .01;
};

/////////////////////////////////////////////////////////////////////////////
//
// Member functions
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Assigns a deep copy of a vector to this.
 * @param {Vector3} a  Specifies the vector to be copied.
 */
Vector3.prototype.assign = function (a) {
  this.x = a.x;
  this.y = a.y;
  this.z = a.z;
};

/**
 * Checks this vector and another for equality.
 * @param {Vector3} a Specifies the vector to be compared.
 * @return {boolean} true iff the two vectors are equivalent.
 */
Vector3.prototype.equals = function (a) {
  return this.x === a.x && this.y === a.y && this.z === a.z;
};

/**
 * Checks this vector and another for strict inequality.
 * @param {Vector3} a Specifies the vector to be compared.
 * @return {boolean} true iff the two vectors are not equivalent.
 */
Vector3.prototype.notEquals = function (a) {
  return this.x !== a.x || this.y !== a.y || this.z !== a.z;
};

/**
 * Sets this vector to the zero vector.
 */
Vector3.prototype.zero = function () {
  this.x = this.y = this.z = 0;
};

/**
 * Negates the vector
 * @return {Vector3} The additive inverse (negation) of this vector.
 */
Vector3.prototype.minus = function () {
  return Vector3(-this.x, -this.y, -this.z);
};

/**
 * Adds a vector to this vector.
 * @param a Specifies the vector to be added to this.
 * @return {Vector3} The sum of the two vectors.
 */
Vector3.prototype.add = function (a) {
  return new Vector3(this.x + a.x, this.y + a.y, this.z + a.z);
};

/**
 * Subtracts a vector from this vector.
 * @param a Specifies the vector to be subtracted from this.
 * @return {Vector3} The difference of the two vectors.
 */
Vector3.prototype.subtract = function (a) {
  return new Vector3(this.x - a.x, this.y - a.y, this.z - a.z);
};

/**
 * Multiplies this vector by a scalar.
 * @param a Specifies the scalar factor.
 * @return {Vector3} The product of the scalar and vector.
 */
Vector3.prototype.multiply = function (a) {
  return new Vector3(this.x * a, this.y * a, this.z * a);
};

/**
 * Divides this vector by a scalar.
 *
 * @warning An attempt to pass zero into this operator will
 *          result in a divide-by-zero error.
 *
 * @param a Specifies the scalar divisor, which must not be zero.
 * @return {Vector3} The quotient of the vector and scalar.
 */
Vector3.prototype.divide = function (a) {
  var oneOverA = 1 / a    // NOTE: no check for divide by zero here
    ;
  return new Vector3(this.x * oneOverA, this.y * oneOverA, this.z * oneOverA);
};

/**
 * Sets the vector's components.
 * @param {Number|Vector3} x  Specifies the x-coordinate or the vector to be copied.
 * @param {Number} y          Specifies the y-coordinate.
 * @param {Number} z          Specifies the z-coordinate.
 * @return {Vector3}          A reference to the vector.
 */
Vector3.prototype.set = function (x, y, z) {
  if (x instanceof Vector3) {
    var v = x
      ;
    x = v.x;
    y = v.y;
    z = v.z;
  }
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};

/**
 * Normalizes the vector to unit length.
 * If this vector is the zero vector, does nothing.
 */
Vector3.prototype.normalize = function () {
  var magSq = this.x * this.x + this.y * this.y + this.z * this.z
    , oneOverMag
    ;
  if (magSq > 0) { // check for divide-by-zero
    oneOverMag = 1 / sqrt(magSq);
    this.x *= oneOverMag;
    this.y *= oneOverMag;
    this.z *= oneOverMag;
  }
};

/**
 * Queries the vector for its magnitude.
 * @return {Number} The magnitude of the vector.
 * @remark Since a square root is required, use this function
 *         only when exact magnitudes are needed.  Otherwise, use
 *         magnitude squared.
 */
Vector3.prototype.magnitude = function () {
  return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

/**
 * Queries the vector for its squared magnitude.
 * @return {Number} The squared magnitude of the vector.
 * @remark Since no square root is required, use this function
 *         when only relative magnitudes are needed (such as when
 *         sorting vectors by magnitude).
 */
Vector3.prototype.magnitudeSquared = function () {
  return this.x * this.x + this.y * this.y + this.z * this.z;
};

/**
 * Computes the cross product of this vector and another.
 * @param {Vector3}   a Specifies the second factor.
 * @return {Vector3}  The cross product of the two vectors.
 */
Vector3.prototype.crossProduct = function (a) {
  return Vector3(
    this.y * a.z - this.z * a.y,
    this.z * a.x - this.x * a.z,
    this.x * a.y - this.y * a.x
  );
};

/**
 * Computes the dot product of this vector and another.
 * @param {Vector3} a Specifies the second factor.
 * @return {Number} The dot product of the two vectors.
 */
Vector3.prototype.dotProduct = function (a) {
  return this.x * a.x + this.y * a.y + this.z * a.z;
};

/**
 * Computes the distance between this vector and another.
 * @param {Vector3} a Specifies the other vector.
 * @return {Number} The distance between the two vectors.
 */
Vector3.prototype.distance = function (a) {
  var dx = this.x - a.x
    , dy = this.y - a.y
    , dz = this.z - a.z
    ;
  return sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * Computes the squared distance between this vector and another.
 * @param {Vector3} a Specifies the other vector.
 * @return {Number} The squared distance between the two vectors.
 */
Vector3.prototype.distanceSquared = function (a) {
  var dx = this.x - a.x
    , dy = this.y - a.y
    , dz = this.z - a.z
    ;
  return dx * dx + dy * dy + dz * dz;
};


/**
 * class EulerAngles
 *
 * This class represents a heading-pitch-bank Euler angle triple.
 *
 * An Euler-angle-based representation of orientation.
 *
 * Straightforward representation.  Store the three angles, in radians
 */

/////////////////////////////////////////////////////////////////////////////
//
// Notes:
//
// See Chapter 11 for more information on class design decisions.
//
// See section 10.3 for more information on the Euler angle conventions
// assumed.
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Constructs an Euler angle triple with the given angles.
 * @param heading Specifies the heading (yaw) angle.
 * @param pitch   Specifies the pitch angle.
 * @param bank    Specifies the bank (roll) angle.
 * @constructor
 */
function EulerAngles(heading, pitch, bank) {
  // Straightforward representation.  Store the three angles, in
  // radians
  this.heading = heading != null ? heading : 0;
  this.pitch = pitch != null ? pitch : 0;
  this.bank = bank != null ? bank : 0;
}

EulerAngles.kEulerAnglesIdentity = new EulerAngles(0, 0, 0);

/////////////////////////////////////////////////////////////////////////////
//
// class EulerAngles Implementation
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Sets this to the identity orientation (all zeros).
 */
EulerAngles.prototype.identity = function () {
  this.heading = this.pitch = this.bank = 0;
};

/**
 * Sets the angles to given values or copies another set of Euler angles.
 * @param {Number|EulerAngles} heading Specifies the heading angle or the angles to be copied.
 * @param {Number} pitch Specifies the pitch angle
 * @param {Number} bank Specifies the bank angle
 * @return {EulerAngles} A reference to the angles.
 */
EulerAngles.prototype.set = function (heading, pitch, bank) {
  if (heading instanceof EulerAngles) {
    var ea = heading
      ;
    heading = ea.heading;
    pitch = ea.pitch;
    bank = ea.bank;
  }
  this.heading = heading;
  this.pitch = pitch;
  this.bank = bank;
  return this;
};

/**
 * Determines the canonical Euler angle triple for this
 * set of angles and canonizes it.  Note that while this
 * doesn't affect the rotation represented by the triplet,
 * if your code uses the angles for some other purpose
 *  (e.g., angular velocity), the results may be unexpected.
 * @note See section 10.3 for more information.
 */
EulerAngles.prototype.canonize = function () {

  // First, wrap pitch in range -pi ... pi

  this.pitch = wrapPi(this.pitch);

  // Now, check for "the back side" of the matrix, pitch outside
  // the canonical range of -pi/2 ... pi/2

  if (this.pitch < -kPiOver2) {
    this.pitch = -kPi - this.pitch;
    this.heading += kPi;
    this.bank += kPi;
  } else if (this.pitch > kPiOver2) {
    this.pitch = kPi - this.pitch;
    this.heading += kPi;
    this.bank += kPi;
  }

  // OK, now check for the gimbal lock case (within a slight
  // tolerance)

  if (abs(this.pitch) > kPiOver2 - 1e-4) {

    // We are in gimbal lock.  Assign all rotation
    // about the vertical axis to heading

    this.heading += this.bank;
    this.bank = 0;

  } else {

    // Not in gimbal lock.  Wrap the bank angle in
    // canonical range

    this.bank = wrapPi(this.bank);
  }

  // Wrap heading in canonical range

  this.heading = wrapPi(this.heading);
};

/**
 * @param {Quaternion} q Specifies the quaternion to be converted.
 * @note See 10.6.6.
 */
EulerAngles.prototype.fromObjectToInertialQuaternion = function (q) {

  // Extract sin(pitch)

  var sp = -2 * (q.y * q.z - q.w * q.x)
    ;

  // Check for gimbal lock, giving slight tolerance for numerical imprecision

  if (abs(sp) > 0.9999) {

    // Looking straight up or down

    this.pitch = kPiOver2 * sp;

    // Compute heading, slam bank to zero

    this.heading = atan2(-q.x * q.z + q.w * q.y, 0.5 - q.y * q.y - q.z * q.z);
    this.bank = 0;

  } else {

    // Compute angles.  We don't have to use the "safe" asin
    // function because we already checked for range errors when
    // checking for gimbal lock

    this.pitch = asin(sp);
    this.heading = atan2(q.x * q.z + q.w * q.y, 0.5 - q.x * q.x - q.y * q.y);
    this.bank = atan2(q.x * q.y + q.w * q.z, 0.5 - q.x * q.x - q.z * q.z);
  }
};

/**
 * @param {Quaternion} q Specifies the quaternion to be converted.
 * @note See 10.6.6.
 */
EulerAngles.prototype.fromInertialToObjectQuaternion = function (q) {

  // Extract sin(pitch)

  var sp = -2 * (q.y * q.z + q.w * q.x)
    ;

  // Check for gimbal lock, giving slight tolerance for numerical imprecision

  if (abs(sp) > 0.9999) {

    // Looking straight up or down

    this.pitch = kPiOver2 * sp;

    // Compute heading, slam bank to zero

    this.heading = atan2(-q.x * q.z - q.w * q.y, 0.5 - q.y * q.y - q.z * q.z);
    this.bank = 0;

  } else {

    // Compute angles.  We don't have to use the "safe" asin
    // function because we already checked for range errors when
    // checking for gimbal lock

    this.pitch = asin(sp);
    this.heading = atan2(q.x * q.z - q.w * q.y, 0.5 - q.x * q.x - q.y * q.y);
    this.bank = atan2(q.x * q.y - q.w * q.z, 0.5 - q.x * q.x - q.z * q.z);
  }
};

/**
 * @param {Matrix4x3} m Specifies the matrix to be converted.
 * @remarks The translation portion of the matrix is ignored, and the
 *     matrix is assumed to be orthogonal.
 */
EulerAngles.prototype.fromObjectToWorldMatrix = function (m) {

  // Extract sin(pitch) from m32.

  var sp = -m.m32
    ;

  // Check for gimbal lock

  if (abs(sp) > 9.99999) {

    // Looking straight up or down

    this.pitch = kPiOver2 * sp;

    // Compute heading, slam bank to zero

    this.heading = atan2(-m.m23, m.m11);
    this.bank = 0;

  } else {

    // Compute angles.  We don't have to use the "safe" asin
    // function because we already checked for range errors when
    // checking for gimbal lock

    this.heading = atan2(m.m31, m.m33);
    this.pitch = asin(sp);
    this.bank = atan2(m.m12, m.m22);
  }
};

/**
 * @param {Matrix4x3} m Specifies the matrix to be converted.
 * @remarks The translation portion of the matrix is ignored, and the
 *     matrix is assumed to be orthogonal.
 */
EulerAngles.prototype.fromWorldToObjectMatrix = function (m) {

  // Extract sin(pitch) from m23.

  var sp = -m.m23
    ;

  // Check for gimbal lock

  if (abs(sp) > 9.99999) {

    // Looking straight up or down

    this.pitch = kPiOver2 * sp;

    // Compute heading, slam bank to zero

    this.heading = atan2(-m.m31, m.m11);
    this.bank = 0;

  } else {

    // Compute angles.  We don't have to use the "safe" asin
    // function because we already checked for range errors when
    // checking for gimbal lock

    this.heading = atan2(m.m13, m.m33);
    this.pitch = asin(sp);
    this.bank = atan2(m.m21, m.m22);
  }
};

/**
 * @param {RotationMatrix} m Specifies the matrix to be converted.
 * @remarks The matrix is assumed to be orthogonal.
 */
EulerAngles.prototype.fromRotationMatrix = function (m) {

  // Extract sin(pitch) from m23.

  var sp = -m.m32
    ;

  // Check for gimbal lock

  if (abs(sp) > 9.99999) {

    // Looking straight up or down

    this.pitch = kPiOver2 * sp;

    // Compute heading, slam bank to zero

    this.heading = atan2(-m.m13, m.m11);
    this.bank = 0;

  } else {

    // Compute angles.  We don't have to use the "safe" asin
    // function because we already checked for range errors when
    // checking for gimbal lock

    this.heading = atan2(m.m31, m.m33);
    this.pitch = asin(sp);
    this.bank = atan2(m.m12, m.m22);
  }
};


/////////////////////////////////////////////////////////////////////////////
//
// Operator
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Adds two Euler angles together.
 * @param {EulerAngles} a Euler angle to add.
 * @return {EulerAngles} Sum of the two Euler angles.
 */
EulerAngles.prototype.add = function (a) {
  return new EulerAngles(
    this.heading + a.heading,
    this.pitch + a.pitch,
    this.bank + a.bank
  );
};

/**
 * Subtract a Euler angle from the other.
 * @param {EulerAngles} a Euler angle to subtract.
 * @return {EulerAngles} Difference between two Euler angles.
 */
EulerAngles.prototype.subtract = function (a) {
  return new EulerAngles(
    this.heading - a.heading,
    this.pitch - a.pitch,
    this.bank - a.bank
  );
};

/**
 * Multiplies a Euler angle by a scalar.
 * @param {Number} a Specifies the scalar factor.
 * @return {EulerAngles} The Euler angle scaled by the scalar.
 */
EulerAngles.prototype.multiply = function (a) {
  return new EulerAngles(
    this.heading * a,
    this.pitch * a,
    this.bank * a
  );
};

/**
 * Divides a Euler angle by a scalar.
 * @param {Number} a Specifies the scalar factor.
 * @return {EulerAngles} The Euler angle divided by the scalar.
 * @warning An attempt to pass zero into this operator will
 *          result in a divide-by-zero error.
 */
EulerAngles.prototype.divide = function (a) {
  return new EulerAngles(
    this.heading / a,
    this.pitch / a,
    this.bank / a
  );
};


/////////////////////////////////////////////////////////////////////////////
//
// 3D Math Primer for Games and Graphics Development
//
// Quaternion.h - Declarations for class Quaternion
//
// For more details, see Quaternion.cpp
//
/////////////////////////////////////////////////////////////////////////////

/**
 * A quaternion-based representation of an orientation in 3-space.
 * @param {Number} [w=1] Specifies the w-coordinate.
 * @param {Number} [x=0] Specifies the x-coordinate.
 * @param {Number} [y=0] Specifies the y-coordinate.
 * @param {Number} [z=0] Specifies the z-coordinate.
 * @constructor
 */
function Quaternion(w, x, y, z) {
  // The 4 values of the quaternion.  Normally, it will not
  // be necessary to manipulate these directly.  However,
  // we leave them public, since prohibiting direct access
  // makes some operations, such as file I/O, unnecessarily
  // complicated.
  this.w = w != null ? w : 1;
  this.x = x != null ? x : 0;
  this.y = y != null ? y : 0;
  this.z = z != null ? z : 0;
}

/**
 * Set to identity
 * Sets this to the identity quaternion.
 */
Quaternion.prototype.identity = function () {
  this.w = 1;
  this.x = this.y = this.z = 0;
};


/**
 * Computes the dot product of two quaternions.
 * @param {Quaternion} a Specifies the first factor.
 * @param {Quaternion} b Specifies the second factor.
 * @return {Number} The dot product of the two quaternions.
 */
Quaternion.dotProduct = function (a, b) {
  return a.dotProduct(b);
};

/**
 * Computes the cross product of two quaternions.
 * @param {Quaternion} a Specifies the first factor.
 * @param {Quaternion} b Specifies the second factor.
 * @return {Quaternion} The cross product of the two quaternions.
 */
Quaternion.crossProduct = function (a, b) {
  return a.crossProduct(b);
};

/**
 * @param {Quaternion} q
 * @return {Quaternion}
 */
Quaternion.conjugate = function (q) {
  return q.conjugate();
};

/**
 * Performs quaternion exponentiation.
 * @param {Quaternion} q Specifies the base quaternion to be raised.
 * @param {Number} exponent Specifies the exponent.
 * @return {Quaternion} The quaternion \p q raised to the exponent \p exponent.
 */
Quaternion.pow = function (q, exponent) {
  return q.pow(exponent);
};

////////////////////////////////////////////////////////////////////////////
//
// 3D Math Primer for Games and Graphics Development
//
// Quaternion.cpp - Quaternion implementation
//
// For more details see section 11.3.
//
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
//
// Static variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * The identity quaternion.  Notice that there are no constructors
 * to the Quaternion class, since we really don't need any.
 * @type {Quaternion}
 */
Quaternion.kQuaternionIdentity = new Quaternion(1, 0, 0, 0);

/////////////////////////////////////////////////////////////////////////////
//
// class Quaternion members
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Setup the quaternion to rotate about the specified axis
 * @param {Number} theta Specifies the angle of rotation.
 */
Quaternion.prototype.setToRotateAboutX = function (theta) {
  // Compute the half angle
  var thetaOver2 = theta * .5
    ;

  // Set the values
  this.w = cos(thetaOver2);
  this.x = sin(thetaOver2);
  this.y = 0;
  this.z = 0;
};

/**
 * Setup the quaternion to rotate about the specified axis
 * @param {Number} theta Specifies the angle of rotation.
 */
Quaternion.prototype.setToRotateAboutY = function (theta) {
  // Compute the half angle
  var thetaOver2 = theta * .5
    ;

  // Set the values
  this.w = cos(thetaOver2);
  this.x = 0;
  this.y = sin(thetaOver2);
  this.z = 0;
};

/**
 * Setup the quaternion to rotate about the specified axis
 * @param {Number} theta Specifies the angle of rotation.
 */
Quaternion.prototype.setToRotateAboutZ = function (theta) {
  // Compute the half angle
  var thetaOver2 = theta * .5
    ;

  // Set the values
  this.w = cos(thetaOver2);
  this.x = 0;
  this.y = 0;
  this.z = sin(thetaOver2);
};

/**
 * Setup the quaternion to rotate about the specified axis
 * @param {Vector3} axis Specifies the axis of rotation.
 * @param {Number} theta Specifies the angle of rotation.
 */
Quaternion.prototype.setToRotateAboutAxis = function (axis, theta) {
  // The axis of rotation must be normalized
  if (!(abs(axis.magnitude() - 1) < .01)) {
    throw new TypeError('The axis of rotation must be normalized');
  }

  // Compute the half angle and its sin
  var thetaOver2 = theta * .5
    , sinThetaOver2 = sin(thetaOver2)
    ;

  // Set the values
  this.w = cos(thetaOver2);
  this.x = axis.x * sinThetaOver2;
  this.y = axis.y * sinThetaOver2;
  this.z = axis.z * sinThetaOver2;
};

/**
 * Setup the quaternion to perform an object->inertial rotation, given the
 * orientation in Euler angle format
 *
 * See 10.6.5 for more information.
 * @param {EulerAngles} orientation Represents the rotation in Euler angle form.
 */
Quaternion.prototype.setToRotateObjectToInertial = function (orientation) {
  // Compute sine and cosine of the half angles
  var headingOver2 = orientation.heading * 0.5
    , pitchOver2 = orientation.pitch * 0.5
    , bankOver2 = orientation.bank * 0.5
    , sh = sin(headingOver2)
    , sp = sin(pitchOver2)
    , sb = sin(bankOver2)
    , ch = cos(headingOver2)
    , cp = cos(pitchOver2)
    , cb = cos(bankOver2)
    ;

  // Compute values
  this.w = ch * cp * cb + sh * sp * sb;
  this.x = ch * sp * cb + sh * cp * sb;
  this.y = -ch * sp * sb + sh * cp * cb;
  this.z = -sh * sp * cb + ch * cp * sb;
};

/**
 * Setup the quaternion to perform an inertial->object rotation, given the
 * orientation in Euler angle format
 *
 * See 10.6.5 for more information.
 * @param {EulerAngles} orientation Represents the rotation in Euler angle form.
 */
Quaternion.prototype.setToRotateInertialToObject = function (orientation) {
  // Compute sine and cosine of the half angles
  var headingOver2 = orientation.heading * 0.5
    , pitchOver2 = orientation.pitch * 0.5
    , bankOver2 = orientation.bank * 0.5
    , sh = sin(headingOver2)
    , sp = sin(pitchOver2)
    , sb = sin(bankOver2)
    , ch = cos(headingOver2)
    , cp = cos(pitchOver2)
    , cb = cos(bankOver2)
    ;

  // Compute values
  this.w = ch * cp * cb + sh * sp * sb;
  this.x = -ch * sp * cb - sh * cp * sb;
  this.y = ch * sp * sb - sh * cb * cp;
  this.z = sh * sp * cb - ch * cp * sb;
};

/**
 * "Normalize" a quaternion.  Note that normally, quaternions
 * are always normalized (within limits of numerical precision).
 * See section 10.4.6 for more information.
 *
 * This function is provided primarily to combat floating point "error
 * creep," which can occur when many successive quaternion operations
 * are applied.
 * Normalizes the quaternion to unit length.
 */
Quaternion.prototype.normalize = function () {
  // Compute magnitude of the quaternion
  var mag = sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z)
    ;

  // Check for bogus length, to protect against divide by zero
  if (mag > 0) {
    // Normalize it
    var oneOverMag = 1 / mag;
    this.w *= oneOverMag;
    this.x *= oneOverMag;
    this.y *= oneOverMag;
    this.z *= oneOverMag;
  } else {
    // Houston, we have a problem
//    throw new Error();
    // In a release build, just slam it to something
    this.identity();
  }
};

/**
 * Return the rotation angle theta
 * @return {Number} The angle component of the quaternion.
 */
Quaternion.prototype.getRotationAngle = function () {
  // Compute the half angle.  Remember that w = cos(theta / 2)
  var thetaOver2 = safeAcos(this.w)
    ;

  // Return the rotation angle
  return thetaOver2 * 2;
};

/**
 * Return the rotation axis
 * @return {Vector3} The axis component of the quaternion.
 */
Quaternion.prototype.getRotationAxis = function () {
  // Compute sin^2(theta/2).  Remember that w = cos(theta/2),
  // and sin^2(x) + cos^2(x) = 1
  var sinThetaOver2Sq = 1 - this.w * this.w
    ;

  // Protect against numerical imprecision
  if (sinThetaOver2Sq <= 0) {
    // Identity quaternion, or numerical imprecision.  Just
    // return any valid vector, since it doesn't matter
    return new Vector3(1, 0, 0);
  }

  // Compute 1 / sin(theta/2)
  var oneOverSinThetaOver2 = 1 / sqrt(sinThetaOver2Sq)
    ;

  // Return axis of rotation
  return new Vector3(
    this.x * oneOverSinThetaOver2,
    this.y * oneOverSinThetaOver2,
    this.z * oneOverSinThetaOver2
  );
};

/**
 * Quaternion dot product.  We use a nonmember function so we can
 * pass quaternion expressions as operands without having "funky syntax"
 *
 * See 10.4.10
 * @param {Quaternion} a Specifies the second factor.
 * @return {Number} The dot product of the two quaternions
 */
Quaternion.prototype.dotProduct = function (a) {
  return this.w * a.w + this.x * a.x + this.y * a.y + this.z * a.z;
};

/**
 * Quaternion cross product, which concatenates multiple angular
 * displacements.  The order of multiplication, from left to right,
 * corresponds to the order that the angular displacements are
 * applied.  This is backwards from the *standard* definition of
 * quaternion multiplication.  See section 10.4.8 for the rationale
 * behind this deviation from the standard.
 * @param {Quaternion} a Specifies the second factor.
 * @return {Quaternion} The cross product of the two quaternions
 */
Quaternion.prototype.crossProduct = function (a) {
  var result = new Quaternion()
    ;

  result.w = this.w * a.w - this.x * a.x - this.y * a.y - this.z * a.z;
  result.x = this.w * a.x + this.x * a.w + this.z * a.y - this.y * a.z;
  result.y = this.w * a.y + this.y * a.w + this.x * a.z - this.z * a.x;
  result.z = this.w * a.z + this.z * a.w + this.y * a.x - this.x * a.y;

  return result;
};

/**
 * Spherical linear interpolation.
 *
 * See 10.4.13
 * @param {Quaternion} q0 Specifies the initial quaternion.
 * @param {Quaternion} q1 Specifies the final quaternion.
 * @param {Number} t Specifies the parametric time.
 * @return {Quaternion} The interpolated quaternion at the given time.
 */
Quaternion.slerp = function (q0, q1, t) {
  // Check for out-of range parameter and return edge points if so
  if (t <= 0) return q0;
  if (t >= 1) return q1;

  // Compute "cosine of angle between quaternions" using dot product
  var cosOmega = Quaternion.prototype.dotProduct(q0, q1)
    ;

  // If negative dot, use -q1.  Two quaternions q and -q
  // represent the same rotation, but may produce
  // different slerp.  We chose q or -q to rotate using
  // the acute angle.
  var q1w = q1.w
    , q1x = q1.x
    , q1y = q1.y
    , q1z = q1.z
    ;
  if (cosOmega < 0) {
    q1w = -q1w;
    q1x = -q1x;
    q1y = -q1y;
    q1z = -q1z;
    cosOmega = -cosOmega;
  }

  // We should have two unit quaternions, so dot should be <= 1.0
  if (!(cosOmega < 1.1)) {
    throw new TypeError('We should have two unit quaternions, so dot should be <= 1.0');
  }

  // Compute interpolation fraction, checking for quaternions
  // almost exactly the same
  var k0, k1
    ;
  if (cosOmega > 0.9999) {
    // Very close - just use linear interpolation,
    // which will protect against a divide by zero
    k0 = 1 - t;
    k1 = t;
  } else {
    // Compute the sin of the angle using the
    // trig identity sin^2(omega) + cos^2(omega) = 1
    var sinOmega = sqrt(1 - cosOmega * cosOmega)
      ;

    // Compute the angle from its sin and cosine
    var omega = atan2(sinOmega, cosOmega)
      ;

    // Compute inverse of denominator, so we only have
    // to divide once
    var oneOverSinOmega = 1 / sinOmega
      ;

    // Compute interpolation parameters
    k0 = sin((1 - t) * omega) * oneOverSinOmega;
    k1 = sin(t * omega) * oneOverSinOmega;
  }

  // Interpolate
  var result = new Quaternion()
    ;
  result.x = k0 * q0.x + k1 * q1x;
  result.y = k0 * q0.y + k1 * q1y;
  result.z = k0 * q0.z + k1 * q1z;
  result.w = k0 * q0.w + k1 * q1w;

  // Return it
  return result;
};

/**
 * Compute the quaternion conjugate.  This is the quaternion
 * with the opposite rotation as the original quaternion.  See 10.4.7
 * @return {Quaternion} The conjugate of the quaternion.
 */
Quaternion.prototype.conjugate = function () {
  var result = new Quaternion()
    ;

  // Same rotation amount
  result.w = this.w;

  // Opposite axis of rotation
  result.x = -this.x;
  result.y = -this.y;
  result.z = -this.z;

  // Return it
  return result;
};

/**
 * Quaternion exponentiation.
 *
 * See 10.4.12
 * @param {Number} exponent Specifies the exponent.
 * @return {Quaternion} The quaternion raised to the exponent.
 */
Quaternion.prototype.pow = function (exponent) {
  // Check for the case of an identity quaternion.
  // This will protect against divide by zero
  if (abs(this.w) > .9999) {
    return this;
  }

  // Extract the half angle alpha (alpha = theta/2)
  var alpha = acos(this.w)
    ;

  // Compute new alpha value
  var newAlpha = alpha * exponent
    ;

  // Compute new w value
  var result = new Quaternion()
    ;
  result.w = cos(newAlpha);

  // Compute new xyz values
  var mul = sin(newAlpha) / sin(alpha)
    ;
  result.x = this.x * mul;
  result.y = this.y * mul;
  result.z = this.z * mul;

  // Return it
  return result;
};


/**
 * class RotationMatrix
 *
 * Implement a simple 3x3 matrix that is used for ROTATION ONLY.  The
 * matrix is assumed to be orthogonal.  The direction of transformation
 * is specified at the time of transformation.
 *
 * For more details see section 11.4.
 */

/**
 * Implements a 3x3 rotation matrix in 3-space.
 * The matrix is assumed to be orthogonal.
 * @param {Number} m11 Specifies row one, column one
 * @param {Number} m12 Specifies row one, column two
 * @param {Number} m13 Specifies row one, column three
 * @param {Number} m21 Specifies row two, column one
 * @param {Number} m22 Specifies row two, column two
 * @param {Number} m23 Specifies row two, column three
 * @param {Number} m31 Specifies row three, column one
 * @param {Number} m32 Specifies row three, column two
 * @param {Number} m33 Specifies row three, column three
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
//     | m11 m21 m31 | | ix |   | ox |
//     | m12 m22 m32 | | iy | = | oy |
//     | m13 m23 m33 | | iz |   | oz |
//
// Object to inertial:
//
//     | m11 m12 m13 | | ox |   | ix |
//     | m21 m22 m23 | | oy | = | iy |
//     | m31 m32 m33 | | oz |   | iz |
//
/////////////////////////////////////////////////////////////////////////////

/**
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
 * Setup the matrix with the specified orientation
 *
 * See 10.6.1
 *
 * @param {EulerAngles} orientation Specifies the Euler triplet to be converted.
 */
RotationMatrix.prototype.setup = function (orientation) {
  // Fetch sine and cosine of angles
  var sh = sin(orientation.heading)
    , sp = sin(orientation.pitch)
    , sb = sin(orientation.bank)
    , ch = cos(orientation.heading)
    , cp = cos(orientation.pitch)
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
 *
 * @param {Vector3} v Specifies the vector to be transformed.
 * @return {Vector3} The transformed vector.
 */
RotationMatrix.prototype.inertialToObject = function (v) {
  // Perform the matrix multiplication in the "standard" way.
  return new Vector3(
    this.m11 * v.x + this.m21 * v.y + this.m31 * v.z,
    this.m12 * v.x + this.m22 * v.y + this.m32 * v.z,
    this.m13 * v.x + this.m23 * v.y + this.m33 * v.z
  );
};

/**
 * Rotate a vector from object to inertial space
 *
 * @param {Vector3} v Specifies the vector to be transformed.
 * @return {Vector3} The transformed vector.
 */
RotationMatrix.prototype.objectToInertial = function (v) {
  // Multiply by the transpose
  return new Vector3(
    this.m11 * v.x + this.m12 * v.y + this.m13 * v.z,
    this.m21 * v.x + this.m22 * v.y + this.m23 * v.z,
    this.m31 * v.x + this.m32 * v.y + this.m33 * v.z
  );
};


/////////////////////////////////////////////////////////////////////////////
//
// 3D Math Primer for Games and Graphics Development
//
// Matrix4x3.h - Declarations for class Matrix4x3
//
// For more details, see Matrix4x3.cpp
//
/////////////////////////////////////////////////////////////////////////////

/**
 * class Matrix4x3
 *
 * Implement a 4x3 transformation matrix.  This class can represent
 * any 3D affine transformation.

 * Implements a 4x3 transformation matrix in 3-space.
 *
 * Implements a 4x3 transformation matrix--more accurately, a 4x4
 * transformation matrix with an implied right column of [0,0,0,1]^T.
 * Can represent any 3D affine transformation.
/**
 *
 * @param {Number} m11 Specifies row one, column one
 * @param {Number} m12 Specifies row one, column two
 * @param {Number} m13 Specifies row one, column three
 * @param {Number} m21 Specifies row two, column one
 * @param {Number} m22 Specifies row two, column two
 * @param {Number} m23 Specifies row two, column three
 * @param {Number} m31 Specifies row three, column one
 * @param {Number} m32 Specifies row three, column two
 * @param {Number} m33 Specifies row three, column three
 * @param {Number} tx  Specifies row four, column one.
 * @param {Number} ty  Specifies row four, column two.
 * @param {Number} tz  Specifies row four, column three.
 * @constructor
 */
function Matrix4x3(m11, m12, m13, m21, m22, m23, m31, m32, m33, tx, ty, tz) {
  // The values of the matrix.  Basically the upper 3x3 portion
  // contains a linear transformation, and the last row is the
  // translation portion.  See the Matrix4x3.cpp for more
  // details.
  this.m11 = m11;
  this.m12 = m12;
  this.m13 = m13;
  this.m21 = m21;
  this.m22 = m22;
  this.m23 = m23;
  this.m31 = m31;
  this.m32 = m32;
  this.m33 = m33;
  this.tx = tx;
  this.ty = ty;
  this.tz = tz;
}


/////////////////////////////////////////////////////////////////////////////
//
// 3D Math Primer for Games and Graphics Development
//
// Matrix4x3.cpp - Implementation of class Matrix4x3
//
// For more details see section 11.5.
//
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
//
// Notes:
//
// See Chapter 11 for more information on class design decisions.
//
/**
 *
 * MATRIX ORGANIZATION
 *
 * The purpose of this class is so that a user might perform transformations
 * without fiddling with plus or minus signs or transposing the matrix
 * until the output "looks right."  But of course, the specifics of the
 * internal representation is important.  Not only for the implementation
 * in this file to be correct, but occasionally direct access to the
 * matrix variables is necessary, or beneficial for optimization.  Thus,
 * we document our matrix conventions here.
 *
 * We use row vectors, so multiplying by our matrix looks like this:
 *
 *               | m11 m12 m13 |
 *     [ x y z ] | m21 m22 m23 | = [ x' y' z' ]
 *               | m31 m32 m33 |
 *               | tx  ty  tz  |
 *
 * Strict adherance to linear algebra rules dictates that this
 * multiplication is actually undefined.  To circumvent this, we can
 * consider the input and output vectors as having an assumed fourth
 * coordinate of 1.  Also, since we cannot technically invert a 4x3 matrix
 * according to linear algebra rules, we will also assume a rightmost
 * column of [ 0 0 0 1 ].  This is shown below:
 *
 *                 | m11 m12 m13 0 |
 *     [ x y z 1 ] | m21 m22 m23 0 | = [ x' y' z' 1 ]
 *                 | m31 m32 m33 0 |
 *                 | tx  ty  tz  1 |
 *
 * In case you have forgotten your linear algebra rules for multiplying
 * matrices (which are described in section 7.1.6 and 7.1.7), see the
 * definition of operator* for the expanded computations.
 *
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
//
// Matrix4x3 class members
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Matrix4x3.prototype.identity
 *
 * Set the matrix to identity
 */
Matrix4x3.prototype.identity = function () {
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
}

/**
 * Matrix4x3.prototype.zeroTranslation
 *
 * Zero the 4th row of the matrix, which contains the translation portion.
 */
Matrix4x3.prototype.zeroTranslation = function () {
  this.tx = this.ty = this.tz = 0;
}

/**
 * Matrix4x3.prototype.setTranslation
 *
 * Sets the translation portion of the matrix in vector form

 * @param {Vector3} d Specifies the vector to be assigned.
 */
Matrix4x3.prototype.setTranslation = function (d) {
  this.tx = d.x;
  this.ty = d.y;
  this.tz = d.z;
}

/**
 * Matrix4x3.prototype.setTranslation
 *
 * Sets the translation portion of the matrix in vector form

 * @param {Vector3} d Specifies the vector to be assigned as translation.
 */
Matrix4x3.prototype.setupTranslation = function (d) {
  // Set the linear transformation portion to identity
  this.m11 = 1;
  this.m12 = 0;
  this.m13 = 0;
  this.m21 = 0;
  this.m22 = 1;
  this.m23 = 0;
  this.m31 = 0;
  this.m32 = 0;
  this.m33 = 1;

  // Set the translation portion
  this.tx = d.x;
  this.ty = d.y;
  this.tz = d.z;
}

/**
 * Matrix4x3.prototype.setupLocalToParent
 *
 * Setup the matrix to perform a local -> parent transformation, given
 * the position and orientation of the local reference frame within the
 * parent reference frame.
 *
 * A very common use of this will be to construct a object -> world matrix.
 * As an example, the transformation in this case is straightforward.  We
 * first rotate from object space into inertial space, then we translate
 * into world space.
 *
 * We allow the orientation to be specified using either euler angles,
 * or a RotationMatrix

 * @param {Vector3} pos Specifies the position of the local space within the
 *     parent space.
 * @param {EulerAngles} orient Specifies the orientation of the local space within
 *     the parent space as an Euler angle triplet.
 */
Matrix4x3.prototype.setupLocalToParent = function (pos, orient) {
  // Create a rotation matrix.
  var orientMatrix = new RotationMatrix()
    ;
  orientMatrix.setup(orient);

  // Setup the 4x3 matrix.  Note: if we were really concerned with
  // speed, we could create the matrix directly into these variables,
  // without using the temporary RotationMatrix object.  This would
  // save us a function call and a few copy operations.
  this.setupLocalToParent(pos, orientMatrix);
};

/**
 * @param {Vector3} pos Specifies the position of the local space within the
 *     parent space.
 * @param {RotationMatrix} orient Specifies the orientation of the local space within
 *     the parent space as a rotation matrix.
 */
Matrix4x3.prototype.setupLocalToParent = function (pos, orient) {
  // Copy the rotation portion of the matrix.  According to
  // the comments in RotationMatrix.cpp, the rotation matrix
  // is "normally" an inertial->object matrix, which is
  // parent->local.  We want a local->parent rotation, so we
  // must transpose while copying
  this.m11 = orient.m11;
  this.m12 = orient.m21;
  this.m13 = orient.m31;
  this.m21 = orient.m12;
  this.m22 = orient.m22;
  this.m23 = orient.m32;
  this.m31 = orient.m13;
  this.m32 = orient.m23;
  this.m33 = orient.m33;

  // Now set the translation portion.  Translation happens "after"
  // the 3x3 portion, so we can simply copy the position
  // field directly
  this.tx = pos.x;
  this.ty = pos.y;
  this.tz = pos.z;
}

/**
 * Matrix4x3.prototype.setupParentToLocal
 *
 * Setup the matrix to perform a parent -> local transformation, given
 * the position and orientation of the local reference frame within the
 * parent reference frame.
 *
 * A very common use of this will be to construct a world -> object matrix.
 * To perform this transformation, we would normally FIRST transform
 * from world to inertial space, and then rotate from inertial space into
 * object space.  However, out 4x3 matrix always translates last.  So
 * we think about creating two matrices T and R, and then concatenating
 * M = TR.
 *
 * We allow the orientation to be specified using either euler angles,
 * or a RotationMatrix

 * @param {Vector3} pos Specifies the position of the local space within the
 *     parent space.
 * @param {EulerAngles} orient Specifies the orientation of the local space within
 *     the parent space as an Euler angle triplet.
 */
Matrix4x3.prototype.setupParentToLocal = function (pos, orient) {
  // Create a rotation matrix.
  var orientMatrix = new RotationMatrix()
    ;
  orientMatrix.setup(orient);

  // Setup the 4x3 matrix.
  this.setupParentToLocal(pos, orientMatrix);
}

/**
 * @param {Vector3} pos Specifies the position of the local space within the
 *     parent space.
 * @param {RotationMatrix} orient Specifies the orientation of the local space within
 *     the parent space as a rotation matrix.
 */
Matrix4x3.prototype.setupParentToLocal = function (pos, orient) {
  // Copy the rotation portion of the matrix.  We can copy the
  // elements directly (without transposing) according
  // to the layout as commented in RotationMatrix.cpp
  this.m11 = orient.m11;
  this.m12 = orient.m12;
  this.m13 = orient.m13;
  this.m21 = orient.m21;
  this.m22 = orient.m22;
  this.m23 = orient.m23;
  this.m31 = orient.m31;
  this.m32 = orient.m32;
  this.m33 = orient.m33;

  // Now set the translation portion.  Normally, we would
  // translate by the negative of the position to translate
  // from world to inertial space.  However, we must correct
  // for the fact that the rotation occurs "first."  So we
  // must rotate the translation portion.  This is the same
  // as create a translation matrix T to translate by -pos,
  // and a rotation matrix R, and then creating the matrix
  // as the concatenation of TR
  this.tx = -(pos.x * this.m11 + pos.y * this.m21 + pos.z * this.m31);
  this.ty = -(pos.x * this.m12 + pos.y * this.m22 + pos.z * this.m32);
  this.tz = -(pos.x * this.m13 + pos.y * this.m23 + pos.z * this.m33);
}

/**
 * @param {Number} theta Specifies the angle of rotation.
 */
Matrix4x3.prototype.setupRotateX = function (theta) {
  // Get sin and cosine of rotation angle
  var s = sin(theta)
    , c = cos(theta)
    ;
  this.m11 = 1;
  this.m12 = 0;
  this.m13 = 0;
  this.m21 = 0;
  this.m22 = c;
  this.m23 = s;
  this.m31 = 0;
  this.m32 = -s;
  this.m33 = c;
  this.tx = this.ty = this.tz = 0;
}

/**
 * @param {Number} theta Specifies the angle of rotation.
 */
Matrix4x3.prototype.setupRotateY = function (theta) {
  // Get sin and cosine of rotation angle
  var s = sin(theta)
    , c = cos(theta)
    ;
  this.m11 = c;
  this.m12 = 0;
  this.m13 = -s;
  this.m21 = 0;
  this.m22 = 1;
  this.m23 = 0;
  this.m31 = s;
  this.m32 = 0;
  this.m33 = c;
  this.tx = this.ty = this.tz = 0;
}

/**
 * @param {Number} theta Specifies the angle of rotation.
 */
Matrix4x3.prototype.setupRotateZ = function (theta) {
  // Get sin and cosine of rotation angle
  var s = sin(theta)
    , c = cos(theta)
    ;
  this.m11 = c;
  this.m12 = s;
  this.m13 = 0;
  this.m21 = -s;
  this.m22 = c;
  this.m23 = 0;
  this.m31 = 0;
  this.m32 = 0;
  this.m33 = 1;
  this.tx = this.ty = this.tz = 0;
}

/**
 * Matrix4x3.prototype.setupRotate
 *
 * Setup the matrix to perform a rotation about an arbitrary axis.
 * The axis of rotation must pass through the origin.
 *
 * axis defines the axis of rotation, and must be a unit vector.
 *
 * theta is the amount of rotation, in radians.  The left-hand rule is
 * used to define "positive" rotation.
 *
 * The translation portion is reset.
 *
 * See 8.2.3 for more info.

 * @param {Vector3} axis Specifies the axis of rotation.
 * @param {Number} theta Specifies the angle of rotation.
 */
Matrix4x3.prototype.setupRotate = function (axis, theta) {
  // Quick sanity check to make sure they passed in a unit vector
  // to specify the axis
  assert(abs(axis * axis - 1) < 1);

  // Get sin and cosine of rotation angle
  var s = sin(theta)
    , c = cos(theta)
    ;

  // Compute 1 - cos(theta) and some common subexpressions
  var a = 1 - c
    , ax = a * axis.x
    , ay = a * axis.y
    , az = a * axis.z
    ;

  // Set the matrix elements.  There is still a little more
  // opportunity for optimization due to the many common
  // subexpressions.  We'll let the compiler handle that...

  this.m11 = ax * axis.x + c;
  this.m12 = ax * axis.y + axis.z * s;
  this.m13 = ax * axis.z - axis.y * s;

  this.m21 = ay * axis.x - axis.z * s;
  this.m22 = ay * axis.y + c;
  this.m23 = ay * axis.z + axis.x * s;

  this.m31 = az * axis.x + axis.y * s;
  this.m32 = az * axis.y - axis.x * s;
  this.m33 = az * axis.z + c;

  // Reset the translation portion
  this.tx = this.ty = this.tz = 0;
};

/**
 * Matrix4x3.prototype.fromQuaternion
 *
 * Setup the matrix to perform a rotation, given the angular displacement
 * in quaternion form.
 *
 * The translation portion is reset.
 *
 * See 10.6.3 for more info.

 * @param {Quaternion} q Specifies the quaternion to be converted.
 */
Matrix4x3.prototype.fromQuaternion = function (q) {
  // Compute a few values to optimize common subexpressions
  var ww = 2 * q.w
    , xx = 2 * q.x
    , yy = 2 * q.y
    , zz = 2 * q.z
    ;

  // Set the matrix elements.  There is still a little more
  // opportunity for optimization due to the many common
  // subexpressions.  We'll let the compiler handle that...

  this.m11 = 1 - yy * q.y - zz * q.z;
  this.m12 = xx * q.y + ww * q.z;
  this.m13 = xx * q.z - ww * q.x;

  this.m21 = xx * q.y - ww * q.z;
  this.m22 = 1 - xx * q.x - zz * q.z;
  this.m23 = yy * q.z + ww * q.x;

  this.m31 = xx * q.z + ww * q.y;
  this.m32 = yy * q.z - ww * q.x;
  this.m33 = 1 - xx * q.x - yy * q.y;

  // Reset the translation portion

  this.tx = this.ty = this.tz = 0;
};

/**
 * Matrix4x3.prototype.setupScale
 *
 * Setup the matrix to perform scale on each axis.  For uniform scale by k,
 * use a vector of the form Vector3(k,k,k)
 *
 * The translation portion is reset.
 *
 * See 8.3.1 for more info.

 * @param {Vector3} s Specifies the scaling factor on each axis.
 */
Matrix4x3.prototype.setupScale = function (s) {
  // Set the matrix elements.  Pretty straightforward
  this.m11 = s.x;
  this.m12 = 0;
  this.m13 = 0;
  this.m21 = 0;
  this.m22 = s.y;
  this.m23 = 0;
  this.m31 = 0;
  this.m32 = 0;
  this.m33 = s.z;

  // Reset the translation portion
  this.tx = this.ty = this.tz = 0;
};

/**
 * Matrix4x3.prototype.setupScaleAlongAxis
 *
 * Setup the matrix to perform scale along an arbitrary axis.
 *
 * The axis is specified using a unit vector.
 *
 * The translation portion is reset.
 *
 * See 8.3.2 for more info.

 * @param {Vector3} axis Specifies the axis of scaling.
 * @param {Number} k Specifies the scaling factor.
 */
Matrix4x3.prototype.setupScaleAlongAxis = function (axis, k) {
  // Quick sanity check to make sure they passed in a unit vector
  // to specify the axis
  assert(abs(axis * axis - 1) < 1);

  // Compute k-1 and some common subexpressions
  var a = k - 1
    , ax = a * axis.x
    , ay = a * axis.y
    , az = a * axis.z
    ;

  // Fill in the matrix elements.  We'll do the common
  // subexpression optimization ourselves here, since diagonally
  // opposite matrix elements are equal
  this.m11 = ax * axis.x + 1;
  this.m22 = ay * axis.y + 1;
  this.m32 = az * axis.z + 1;

  this.m12 = this.m21 = ax * axis.y;
  this.m13 = this.m31 = ax * axis.z;
  this.m23 = this.m32 = ay * axis.z;

  // Reset the translation portion
  this.tx = this.ty = this.tz = 0;
}

/**
 * Matrix4x3.prototype.setupShear
 *
 * Setup the matrix to perform a shear
 *
 * The type of shear is specified by the 1-based "axis" index.  The effect
 * of transforming a point by the matrix is described by the pseudocode
 * below:
 *
 *	axis == 1  =>  y += s*x, z += t*x
 *	axis == 2  =>  x += s*y, z += t*y
 *	axis == 3  =>  x += s*z, y += t*z
 *
 * The translation portion is reset.
 *
 * See 8.6 for more info.

 * @param {int} axis Specifies the axis as follows:
 *   <ul>
 *     <li>1 -- Shears along the x-axis (y += s*x; z += t*x)</li>
 *     <li>2 -- Shears along the y-axis (x += s*y; z += t*y)</li>
 *     <li>3 -- Shears along the z-axis (x += s*z; y += t*z)</li>
 *   </ul>
 * @param {Number} s Specifies the first shearing coefficient.
 * @param {Number} t Specifies the second shearing coefficient.
 * @warning Asserts that axis is 1, 2, or 3.  Recommend splitting
 *     into three functions, as I see no benefit from specifying
 *     the axis numerically and using an assert.
 */
Matrix4x3.prototype.setupShear = function (axis, s, t) {
  // Check which type of shear they want
  switch (axis) {

    case 1: // Shear y and z using x
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

    case 2: // Shear x and z using y
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

    case 3: // Shear x and y using z
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
      // bogus axis index
      assert(false);
  }

  // Reset the translation portion
  this.tx = this.ty = this.tz = 0;
}

/**
 * Matrix4x3.prototype.setupProject
 *
 * Setup the matrix to perform a projection onto a plane passing
 * through the origin.  The plane is perpendicular to the
 * unit vector n.
 *
 * See 8.4.2 for more info.

 * @param {Vector3} n Specifies the normal to the plane.
 */
Matrix4x3.prototype.setupProject = function (n) {
  // Quick sanity check to make sure they passed in a unit vector
  // to specify the axis
  assert(abs(n * n - 1) < 1);

  // Fill in the matrix elements.  We'll do the common
  // subexpression optimization ourselves here, since diagonally
  // opposite matrix elements are equal
  this.m11 = 1 - n.x * n.x;
  this.m22 = 1 - n.y * n.y;
  this.m33 = 1 - n.z * n.z;

  this.m12 = this.m21 = -n.x * n.y;
  this.m13 = this.m31 = -n.x * n.z;
  this.m23 = this.m32 = -n.y * n.z;

  // Reset the translation portion
  this.tx = this.ty = this.tz = 0;
};

/**
 * Matrix4x3.prototype.setupReflect
 *
 * Setup the matrix to perform a reflection about a plane parallel
 * to a cardinal plane.
 *
 * axis is a 1-based index which specifies the plane to project about:
 *
 *	1 => reflect about the plane x=k
 *	2 => reflect about the plane y=k
 *	3 => reflect about the plane z=k
 *
 * The translation is set appropriately, since translation must occur if
 * k != 0
 *
 * See 8.5 for more info.

 * @param {int} axis Specifies the axis as follows:
 *   <ul>
 *     <li>1 -- Reflect about the plane x=k
 *     <li>2 -- Reflect about the plane y=k
 *     <li>3 -- Reflect about the plane z=k
 *   </ul>
 * @param {Number} k Specifies the plane displacement along the axis.
 * @warning Asserts that axis is 1, 2, or 3.  Recommend splitting
 *     into three functions, as I see no benefit from specifying
 *     the axis numerically and using an assert.
 */
Matrix4x3.prototype.setupReflect = function (axis, k) {
  if (k == null) {
    k = 0;
  }

  // Check which plane they want to reflect about
  switch (axis) {

    case 1: // Reflect about the plane x=k
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

    case 2: // Reflect about the plane y=k
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

    case 3: // Reflect about the plane z=k
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
      // bogus axis index
      assert(false);
  }

};

/**
 * Matrix4x3.prototype.setupReflect
 *
 * Setup the matrix to perform a reflection about an arbitrary plane
 * through the origin.  The unit vector n is perpendicular to the plane.
 *
 * The translation portion is reset.
 *
 * See 8.5 for more info.

 * @param {Vector3} n Specifies the normal to the plane.
 */
Matrix4x3.prototype.setupReflect = function (n) {
  // Quick sanity check to make sure they passed in a unit vector
  // to specify the axis
  assert(abs(n * n - 1) < 1);

  // Compute common subexpressions
  var ax = -2 * n.x
    , ay = -2 * n.y
    , az = -2 * n.z
    ;

  // Fill in the matrix elements.  We'll do the common
  // subexpression optimization ourselves here, since diagonally
  // opposite matrix elements are equal
  this.m11 = 1 + ax * n.x;
  this.m22 = 1 + ay * n.y;
  this.m32 = 1 + az * n.z;

  this.m12 = this.m21 = ax * n.y;
  this.m13 = this.m31 = ax * n.z;
  this.m23 = this.m32 = ay * n.z;

  // Reset the translation portion
  this.tx = this.ty = this.tz = 0;
};

/**
 * Matrix4x3.prototype.setupReflect
 *
 * Setup the matrix to perform a reflection over a given plane
 * in quaternion form.

 * @param {Plane} plane Plane to reflect over.
 */
Matrix4x3.prototype.setupReflect = function (plane) {
  this.m11 = -2 * plane.a * plane.a + 1;
  this.m12 = -2 * plane.b * plane.a;
  this.m13 = -2 * plane.c * plane.a;

  this.m21 = -2 * plane.a * plane.b;
  this.m22 = -2 * plane.b * plane.b + 1;
  this.m23 = -2 * plane.c * plane.b;

  this.m31 = -2 * plane.a * plane.c;
  this.m32 = -2 * plane.b * plane.c;
  this.m33 = -2 * plane.c * plane.c + 1;

  this.tx = -2 * plane.a * plane.d;
  this.ty = -2 * plane.b * plane.d;
  this.tz = -2 * plane.c * plane.d;
};

/**
 * determinant
 *
 * Compute the determinant of the 3x3 portion of the matrix.
 *
 * See 9.1.1 for more info.

 * @return {Number} The determinant of the matrix.
 */
Matrix4x3.prototype.determinant = function () {
  return this.m11 * (this.m22 * this.m33 - this.m23 * this.m32)
    + this.m12 * (this.m23 * this.m31 - this.m21 * this.m33)
    + this.m13 * (this.m21 * this.m32 - this.m22 * this.m31);
};

/**
 * inverse
 *
 * Compute the inverse of a matrix.  We use the classical adjoint divided
 * by the determinant method.
 *
 * See 9.2.1 for more info.

 * @return {Matrix4x3} The inverse of the matrix.
 */
Matrix4x3.prototype.inverse = function () {
  // Compute the determinant
  var det = this.determinant()
    ;

// If we're singular, then the determinant is zero and there's
// no inverse

  assert(abs(det) > 0.000001);

// Compute one over the determinant, so we divide once and
// can *multiply* per element

  var oneOverDet = 1 / det
    ;

// Compute the 3x3 portion of the inverse, by
// dividing the adjoint by the determinant
  var r = new Matrix4x3()
    ;

  r.m11 = (this.m22 * this.m33 - this.m23 * this.m32) * oneOverDet;
  r.m12 = (this.m13 * this.m32 - this.m12 * this.m33) * oneOverDet;
  r.m13 = (this.m12 * this.m23 - this.m13 * this.m22) * oneOverDet;

  r.m21 = (this.m23 * this.m31 - this.m21 * this.m33) * oneOverDet;
  r.m22 = (this.m11 * this.m33 - this.m13 * this.m31) * oneOverDet;
  r.m23 = (this.m13 * this.m21 - this.m11 * this.m23) * oneOverDet;

  r.m31 = (this.m21 * this.m32 - this.m22 * this.m31) * oneOverDet;
  r.m32 = (this.m12 * this.m31 - this.m11 * this.m32) * oneOverDet;
  r.m33 = (this.m11 * this.m22 - this.m12 * this.m21) * oneOverDet;

// Compute the translation portion of the inverse

  r.tx = -(this.tx * r.m11 + this.ty * r.m21 + this.tz * r.m31);
  r.ty = -(this.tx * r.m12 + this.ty * r.m22 + this.tz * r.m32);
  r.tz = -(this.tx * r.m13 + this.ty * r.m23 + this.tz * r.m33);

// Return it.  Ouch - involves a copy constructor call.  If speed
// is critical, we may need a separate function which places the
// result where we want it...

  return r;
};

/**
 * getTranslation
 *
 * Return the translation row of the matrix in vector form

 * @return {Vector3} The translation vector of the matrix.
 */
Matrix4x3.prototype.getTranslation = function () {
  return new Vector3(this.tx, this.ty, this.tz);
}

/**
 * getPositionFromParentToLocalMatrix
 *
 * Extract the position of an object given a parent -> local transformation
 * matrix (such as a world -> object matrix)
 *
 * We assume that the matrix represents a rigid transformation.  (No scale,
 * skew, or mirroring)

 * @return {Vector3} The position portion of the matrix.
 */
Matrix4x3.prototype.getPositionFromParentToLocalMatrix = function () {
  // Multiply negative translation value by the
  // transpose of the 3x3 portion.  By using the transpose,
  // we assume that the matrix is orthogonal.  (This function
  // doesn't really make sense for non-rigid transformations...)
  return new Vector3(
    -(this.tx * this.m11 + this.ty * this.m12 + this.tz * this.m13),
    -(this.tx * this.m21 + this.ty * this.m22 + this.tz * this.m23),
    -(this.tx * this.m31 + this.ty * this.m32 + this.tz * this.m33)
  );
};

/**
 * getPositionFromLocalToParentMatrix
 *
 * Extract the position of an object given a local -> parent transformation
 * matrix (such as an object -> world matrix)

 * @return {Vector3} The position portion of the matrix.
 */
Matrix4x3.prototype.getPositionFromLocalToParentMatrix = function () {
  // Position is simply the translation portion
  return new Vector3(this.tx, this.ty, this.tz);
}

/**
 * Vector * Matrix4x3
 *
 * Transform the point.  This makes using the vector class look like it
 * does with linear algebra notation on paper.
 *
 * See 7.1.7
 *
 * @param {Vector3} p Specifies the vector multiplicand.
 * @param {Matrix4x3} m Specifies the matrix multiplicator.
 * @return {Vector3} The vector transformed by the matrix.
 */
Matrix4x3.multiply = function (p, m) {
  // Grind through the linear algebra.
  return new Vector3(
    p.x * m.m11 + p.y * m.m21 + p.z * m.m31 + m.tx,
    p.x * m.m12 + p.y * m.m22 + p.z * m.m32 + m.ty,
    p.x * m.m13 + p.y * m.m23 + p.z * m.m33 + m.tz
  );
};

/**
 * Matrix4x3 * Matrix4x3
 *
 * Matrix concatenation.  This makes using the vector class look like it
 * does with linear algebra notation on paper.
 *
 * We also provide a *= operator, as per C convention.
 *
 * See 7.1.6
 *
 * @param {Matrix4x3} a Specifies the first matrix.
 * @param {Matrix4x3} b Specifies the second matrix.
 * @return {Matrix4x3} The product of the two matrices.
 */
Matrix4x3.concat = function (a, b) {
  var r = new Matrix4x3()
    ;

  // Compute the upper 3x3 (linear transformation) portion

  r.m11 = a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31;
  r.m12 = a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32;
  r.m13 = a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33;

  r.m21 = a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31;
  r.m22 = a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32;
  r.m23 = a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33;

  r.m31 = a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31;
  r.m32 = a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32;
  r.m33 = a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33;

  // Compute the translation portion
  r.tx = a.tx * b.m11 + a.ty * b.m21 + a.tz * b.m31 + b.tx;
  r.ty = a.tx * b.m12 + a.ty * b.m22 + a.tz * b.m32 + b.ty;
  r.tz = a.tx * b.m13 + a.ty * b.m23 + a.tz * b.m33 + b.tz;

  // Return it.  Ouch - involves a copy constructor call.  If speed
  // is critical, we may need a separate function which places the
  // result where we want it...
  return r;
};


this.Vector3 = Vector3;
this.EulerAngles = EulerAngles;
this.Quaternion = Quaternion;
this.RotationMatrix = RotationMatrix;
this.Matrix4x3 = Matrix4x3;