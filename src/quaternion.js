(function () {
  'use strict';

  var EPSILON = 0.000001;

  Quaternion.createRotate = function (vector, rotation) {
    var rad = rotation * (Math.PI / 180) / 2
      , s = Math.sin(rad)
      ;
    return new Quaternion(vector.x * s, vector.y * s, vector.z * s, Math.cos(rad));
  };

  Quaternion.createFromRotationMatrix = function (matrix) {
    var tr = matrix.m11 + matrix.m22 + matrix.m33
      , s
      ;

    if (tr > 0) {
      s = 0.5 / Math.sqrt(tr + 1);
      return new Quaternion((matrix.m32 - matrix.m23) * s, (matrix.m13 - matrix.m31) * s, (matrix.m21 - matrix.m12) * s, 0.25 / s);
    }

    if (matrix.m11 > matrix.m22 && matrix.m11 > matrix.m33) {
      s = 2 * Math.sqrt(1 + matrix.m11 - matrix.m22 - matrix.m33);
      return new Quaternion(0.25 * s, (matrix.m12 + matrix.m21) / s, (matrix.m13 + matrix.m31) / s, (matrix.m32 - matrix.m23) / s);
    }

    if (matrix.m22 > matrix.m33) {
      s = 2 * Math.sqrt(1 + matrix.m22 - matrix.m11 - matrix.m33);
      return new Quaternion((matrix.m12 + matrix.m21) / s, 0.25 * s, (matrix.m23 + matrix.m32) / s, (matrix.m13 - matrix.m31) / s);
    }

    s = 2 * Math.sqrt(1 + matrix.m33 - matrix.m11 - matrix.m22);
    return new Quaternion((matrix.m13 + matrix.m31) / s, (matrix.m23 + matrix.m32) / s, 0.25 * s, (matrix.m21 - matrix.m12) / s);
  };

  Quaternion.lerp = function (q1, q2, t) {
    return q1.clone().scale(1 - t).add(q2.clone().scale(t)).normalize();
  }

  Quaternion.slerp = function (qa, qb, alpha) {
    var angle = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;

    if (angle < 0) {
      qa.x *= -1;
      qa.y *= -1;
      qa.z *= -1;
      qa.w *= -1;
      angle *= -1;
    }

    var scale;
    var invscale;

    if ((angle + 1) > EPSILON) // Take the shortest path
    {
      if ((1 - angle) >= EPSILON)  // spherical interpolation
      {
        var theta = Math.acos(angle);
        var invsintheta = 1 / Math.sin(theta);
        scale = Math.sin(theta * (1 - alpha)) * invsintheta;
        invscale = Math.sin(theta * alpha) * invsintheta;
      }
      else // linear interploation
      {
        scale = 1 - alpha;
        invscale = alpha;
      }
    }
    else // long way to go...
    {
      qb.y = -qa.y;
      qb.x = qa.x;
      qb.w = -qa.w;
      qb.z = qa.z;

      scale = Math.sin(Math.PI * (0.5 - alpha));
      invscale = Math.sin(Math.PI * alpha);
    }

    return new Quaternion(
      scale * qa.x + invscale * qb.x,
      scale * qa.y + invscale * qb.y,
      scale * qa.z + invscale * qb.z,
      scale * qa.w + invscale * qb.w
    );
  };


  function Quaternion(x, y, z, w) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    this.z = z != null ? z : 0;
    this.w = w != null ? w : 0;
  }

  Quaternion.prototype.clone = function clone() {
    return new Quaternion(this.x, this.y, this.z, this.w);
  };

  Quaternion.prototype.multiply = function (q) {
    var x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y
      , y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x
      , z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
      , w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
      ;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  };

  Quaternion.prototype.add = function (q) {
    this.x += q.x;
    this.y += q.y;
    this.z += q.z;
    this.w += q.w;
    return this;
  };

  Quaternion.prototype.sub = function (q) {
    this.w -= q.w;
    this.x -= q.x;
    this.y -= q.y;
    this.z -= q.z;
    return this;
  };

  Quaternion.prototype.scale = function (s) {
    this.w *= s;
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  };

  Quaternion.prototype.transformVector = function (vector) {
    var w = -this.x * vector.x - this.y * vector.y - this.z * vector.z;
    var x = this.y * vector.z - this.z * vector.y + this.w * vector.x;
    var y = this.z * vector.x - this.x * vector.z + this.w * vector.y;
    var z = this.x * vector.y - this.y * vector.x + this.w * vector.z;
    return {
      x: y * -this.z + z * this.y - w * this.x + x * this.w,
      y: z * -this.x + x * this.z - w * this.y + y * this.w,
      z: x * -this.y + y * this.x - w * this.z + z * this.w
    };
  };

  Quaternion.prototype.identity = function () {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
    return this;
  };

  Quaternion.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  };

  Quaternion.prototype.lengthSquared = function () {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  };

  Quaternion.prototype.normalize = function () {
    return this.scale(1 / this.length());
  };

  Quaternion.prototype.toMatrix = function () {
    var xx = this.x * this.x
      , xy = this.x * this.y
      , xz = this.x * this.z
      , xw = this.x * this.w
      , yy = this.y * this.y
      , yz = this.y * this.z
      , yw = this.y * this.w
      , zz = this.z * this.z
      , zw = this.z * this.w
      ;
    return new Matrix(
      1 - 2 * (yy + zz), 2 * (xy + zw), 2 * (xz - yw), 0,
      2 * (xy - zw), 1 - 2 * (xx + zz), 2 * (yz + xw), 0,
      2 * (xz + yw), 2 * (yz - xw), 1 - 2 * (xx + yy), 0,
      0, 0, 0, 1
    );
  };

  Quaternion.prototype.toRotationMatrix = function () {
    var s = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z)
      ;
    s = 2 / (s * s);
    var vx = this.x * s
      , vy = this.y * s
      , vz = this.z * s
      , wx = vx * this.w
      , wy = vy * this.w
      , wz = vz * this.w
      , sx = this.x * vx
      , sy = this.y * vy
      , sz = this.z * vz
      , cx = this.y * vz
      , cy = this.z * vx
      , cz = this.x * vy
      ;
    return new Matrix(
      1 - sy - sz, cz + wz, cy - wy, 0,
      cz - wz, 1 - sx - sz, cx + wx, 0,
      cy + wy, cx - wx, 1 - sx - sy, 0,
      0, 0, 0, 1
    );
  };

  this.Quaternion = Quaternion;

}).call(this);