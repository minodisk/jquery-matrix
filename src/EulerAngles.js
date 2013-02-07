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