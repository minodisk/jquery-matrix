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

// Public representation:  Not many options here.

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