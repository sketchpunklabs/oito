var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _vec3 = class {
  static lenSq(a, b) {
    if (b === void 0)
      return a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  }
  static len(a, b) {
    if (b === void 0)
      return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
  }
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  static angle(a, b) {
    const d = this.dot(a, b), c = this.cross(a, b, [0, 0, 0]);
    return Math.atan2(this.len(c), d);
  }
  static equal(a, b) {
    return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
  }
  static fromStruct(v, out) {
    out[0] = v.x;
    out[1] = v.y;
    out[2] = v.z;
    return out;
  }
  static isZero(a) {
    return a[0] == 0 && a[1] == 0 && a[2] == 0;
  }
  static toString(a, rnd = 0) {
    if (rnd == 0)
      return "[" + a.join(",") + "]";
    else {
      let s = "[";
      for (let i = 0; i < 3; i++) {
        switch (a[i]) {
          case 0:
            s += "0,";
            break;
          case 1:
            s += "1,";
            break;
          default:
            s += a[i].toFixed(rnd) + ",";
            break;
        }
      }
      return s.slice(0, -1) + "]";
    }
  }
  static toKey(a, place = 0) {
    return place == 0 ? a[0] + "_" + a[1] + "_" + a[2] : a[0].toFixed(place) + "_" + a[1].toFixed(place) + "_" + a[2].toFixed(place);
  }
  static minAxis(a) {
    if (a[0] < a[1] && a[0] < a[2])
      return 0;
    if (a[1] < a[2])
      return 1;
    return 2;
  }
  static maxAxis(a) {
    if (a[0] > a[1] && a[0] > a[2])
      return 0;
    if (a[1] > a[2])
      return 1;
    return 2;
  }
  static createVecArray(len) {
    const ary = new Array(len);
    for (let i = 0; i < len; i++)
      ary[i] = [0, 0, 0];
    return ary;
  }
  static flattenVecArray(ary) {
    const len = ary.length;
    const rtn = new Array(len * 3);
    let i = 0;
    let v;
    for (v of ary) {
      rtn[i++] = v[0];
      rtn[i++] = v[1];
      rtn[i++] = v[2];
    }
    return rtn;
  }
  static reset(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  static copy(a, out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  static fromVec2(v, useZ = false, out) {
    out[0] = v[0];
    if (useZ) {
      out[1] = 0;
      out[2] = v[1];
    } else {
      out[1] = v[1];
      out[2] = 0;
    }
    return out;
  }
  static toStruct(a, out) {
    out.x = a[0];
    out.y = a[1];
    out.z = a[2];
    return out;
  }
  static rnd(x0 = 0, x1 = 1, y0 = 0, y1 = 1, z0 = 0, z1 = 1, out) {
    let t;
    t = Math.random();
    out[0] = x0 * (1 - t) + x1 * t;
    t = Math.random();
    out[1] = y0 * (1 - t) + y1 * t;
    t = Math.random();
    out[2] = z0 * (1 - t) + z1 * t;
    return out;
  }
  static fromBuf(ary, idx, out) {
    out[0] = ary[idx];
    out[1] = ary[idx + 1];
    out[2] = ary[idx + 2];
    return out;
  }
  static toBuf(a, ary, idx) {
    ary[idx] = a[0];
    ary[idx + 1] = a[1];
    ary[idx + 2] = a[2];
  }
  static pushTo(a, ary) {
    const idx = ary.length;
    ary.push(a[0], a[1], a[2]);
    return idx;
  }
  static bufIter(buf) {
    let i = 0;
    const result = { value: [0, 0, 0], done: false }, len = buf.length, next = () => {
      if (i >= len)
        result.done = true;
      else {
        _vec3.fromBuf(buf, i, result.value);
        i += 3;
      }
      return result;
    };
    return { [Symbol.iterator]() {
      return { next };
    } };
  }
  static bufMap(buf, fn, startIdx = 0, endIdx = 0) {
    const end = endIdx == 0 ? buf.length : endIdx;
    const v = [0, 0, 0];
    let i = startIdx;
    for (i; i < end; i += 3) {
      v[0] = buf[i];
      v[1] = buf[i + 1];
      v[2] = buf[i + 2];
      fn(v, i);
      buf[i] = v[0];
      buf[i + 1] = v[1];
      buf[i + 2] = v[2];
    }
  }
  static lerp(a, b, t, out) {
    const ti = 1 - t;
    out = out || [0, 0, 0];
    out[0] = a[0] * ti + b[0] * t;
    out[1] = a[1] * ti + b[1] * t;
    out[2] = a[2] * ti + b[2] * t;
    return out;
  }
  static nlerp(a, b, t, out) {
    const ti = 1 - t;
    out[0] = a[0] * ti + b[0] * t;
    out[1] = a[1] * ti + b[1] * t;
    out[2] = a[2] * ti + b[2] * t;
    this.norm(out);
    return out;
  }
  static slerp(a, b, t, out) {
    const angle = Math.acos(Math.min(Math.max(this.dot(a, b), -1), 1));
    const sin = Math.sin(angle);
    const ta = Math.sin((1 - t) * angle) / sin;
    const tb = Math.sin(t * angle) / sin;
    out[0] = ta * a[0] + tb * b[0];
    out[1] = ta * a[1] + tb * b[1];
    out[2] = ta * a[2] + tb * b[2];
    return out;
  }
  static hermite(a, b, c, d, t, out) {
    const tt = t * t;
    const f1 = tt * (2 * t - 3) + 1;
    const f2 = tt * (t - 2) + t;
    const f3 = tt * (t - 1);
    const f4 = tt * (3 - 2 * t);
    out[0] = a[0] * f1 + b[0] * f2 + c[0] * f3 + d[0] * f4;
    out[1] = a[1] * f1 + b[1] * f2 + c[1] * f3 + d[1] * f4;
    out[2] = a[2] * f1 + b[2] * f2 + c[2] * f3 + d[2] * f4;
    return out;
  }
  static bezier(a, b, c, d, t, out) {
    const it = 1 - t;
    const it2 = it * it;
    const tt = t * t;
    const f1 = it2 * it;
    const f2 = 3 * t * it2;
    const f3 = 3 * tt * it;
    const f4 = tt * t;
    out[0] = a[0] * f1 + b[0] * f2 + c[0] * f3 + d[0] * f4;
    out[1] = a[1] * f1 + b[1] * f2 + c[1] * f3 + d[1] * f4;
    out[2] = a[2] * f1 + b[2] * f2 + c[2] * f3 + d[2] * f4;
    return out;
  }
  static cubic(a, b, c, d, t, out) {
    const t2 = t * t, t3 = t * t2, a0 = d[0] - c[0] - a[0] + b[0], a1 = d[1] - c[1] - a[1] + b[1], a2 = d[2] - c[2] - a[2] + b[2];
    out[0] = a0 * t3 + (a[0] - b[0] - a0) * t2 + (c[0] - a[0]) * t + b[0];
    out[1] = a1 * t3 + (a[1] - b[1] - a1) * t2 + (c[1] - a[1]) * t + b[1];
    out[2] = a2 * t3 + (a[2] - b[2] - a2) * t2 + (c[2] - a[2]) * t + b[2];
    return out;
  }
  static rotate(a, rad, axis = "x", out) {
    const sin = Math.sin(rad), cos = Math.cos(rad), x = a[0], y = a[1], z = a[2];
    out = out || a;
    switch (axis) {
      case "y":
        out[0] = z * sin + x * cos;
        out[2] = z * cos - x * sin;
        break;
      case "x":
        out[1] = y * cos - z * sin;
        out[2] = y * sin + z * cos;
        break;
      case "z":
        out[0] = x * cos - y * sin;
        out[1] = x * sin + y * cos;
        break;
    }
    return out;
  }
  static axisAngle(v, axis, rad, out) {
    const cp = this.cross(axis, v, [0, 0, 0]), dot = this.dot(axis, v), s = Math.sin(rad), c = Math.cos(rad), ci = 1 - c;
    out = out || v;
    out[0] = v[0] * c + cp[0] * s + axis[0] * dot * ci;
    out[1] = v[1] * c + cp[1] * s + axis[1] * dot * ci;
    out[2] = v[2] * c + cp[2] * s + axis[2] * dot * ci;
    return out;
  }
  static transformQuat(v, q, out) {
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3], vx = v[0], vy = v[1], vz = v[2], x1 = qy * vz - qz * vy, y1 = qz * vx - qx * vz, z1 = qx * vy - qy * vx, x2 = qw * x1 + qy * z1 - qz * y1, y2 = qw * y1 + qz * x1 - qx * z1, z2 = qw * z1 + qx * y1 - qy * x1;
    out = out || v;
    out[0] = vx + 2 * x2;
    out[1] = vy + 2 * y2;
    out[2] = vz + 2 * z2;
    return out;
  }
  static transformMat3(a, m, out) {
    const x = a[0], y = a[1], z = a[2];
    out = out || a;
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  static transformMat4(a, m, out) {
    const x = a[0], y = a[1], z = a[2], w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
    out = out || a;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  static add(a, b, out) {
    out = out || a;
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  static sub(a, b, out) {
    out = out || a;
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  static mul(a, b, out) {
    out = out || a;
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  static div(a, b, out) {
    out = out || a;
    out[0] = b[0] != 0 ? a[0] / b[0] : 0;
    out[1] = b[1] != 0 ? a[1] / b[1] : 0;
    out[2] = b[2] != 0 ? a[2] / b[2] : 0;
    return out;
  }
  static scale(a, s, out) {
    out = out || a;
    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;
    return out;
  }
  static scaleThenAdd(v, s, add, out) {
    out = out || v;
    out[0] = v[0] * s + add[0];
    out[1] = v[1] * s + add[1];
    out[2] = v[2] * s + add[2];
    return out;
  }
  static divScale(a, s, out) {
    out = out || a;
    if (s != 0) {
      out[0] = a[0] / s;
      out[1] = a[1] / s;
      out[2] = a[2] / s;
    }
    return out;
  }
  static norm(a, out) {
    out = out || a;
    let mag = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2);
    if (mag != 0) {
      mag = 1 / mag;
      out[0] = a[0] * mag;
      out[1] = a[1] * mag;
      out[2] = a[2] * mag;
    }
    return out;
  }
  static invert(a, out) {
    out = out || a;
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  static negate(a, out) {
    out = out || a;
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  static cross(a, b, out = [0, 0, 0]) {
    const ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  static reflect(dir, norm, out) {
    const factor = -2 * this.dot(norm, dir);
    out[0] = factor * norm[0] + dir[0];
    out[1] = factor * norm[1] + dir[1];
    out[2] = factor * norm[2] + dir[2];
    return out;
  }
  static abs(a, out) {
    out = out || a;
    out[0] = Math.abs(a[0]);
    out[1] = Math.abs(a[1]);
    out[2] = Math.abs(a[2]);
    return out;
  }
  static floor(a, out) {
    out = out || a;
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  static ceil(a, out) {
    out = out || a;
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  static min(a, b, out) {
    out = out || a;
    out[0] = Math.min(b[0], a[0]);
    out[1] = Math.min(b[1], a[1]);
    out[2] = Math.min(b[2], a[2]);
    return out;
  }
  static max(a, b, out) {
    out = out || a;
    out[0] = Math.max(b[0], a[0]);
    out[1] = Math.max(b[1], a[1]);
    out[2] = Math.max(b[2], a[2]);
    return out;
  }
  static clamp(a, min, max, out) {
    out = out || a;
    out[0] = Math.min(Math.max(a[0], min[0]), max[0]);
    out[1] = Math.min(Math.max(a[1], min[1]), max[1]);
    out[2] = Math.min(Math.max(a[2], min[2]), max[2]);
    return out;
  }
  static nearZero(a, out) {
    out = out || a;
    out[0] = Math.abs(a[0]) <= 1e-6 ? 0 : a[0];
    out[1] = Math.abs(a[1]) <= 1e-6 ? 0 : a[1];
    out[2] = Math.abs(a[2]) <= 1e-6 ? 0 : a[2];
    return out;
  }
  static snap(a, s, out) {
    out = out || a;
    out[0] = s[0] != 0 ? Math.floor(a[0] / s[0]) * s[0] : 0;
    out[1] = s[1] != 0 ? Math.floor(a[1] / s[1]) * s[1] : 0;
    out[2] = s[2] != 0 ? Math.floor(a[2] / s[2]) * s[2] : 0;
    return out;
  }
  static damp(a, b, lambda, dt, out) {
    const t = 1 - Math.exp(-lambda * dt);
    const ti = 1 - t;
    out[0] = a[0] * t + b[0] * ti;
    out[1] = a[1] * t + b[1] * ti;
    out[2] = a[2] * t + b[2] * ti;
    return out;
  }
  static project(from, to, out) {
    const denom = this.dot(to, to);
    if (denom < 1e-6) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      return out;
    }
    const scl = this.dot(from, to) / denom;
    out[0] = to[0] * scl;
    out[1] = to[1] * scl;
    out[2] = to[2] * scl;
    return out;
  }
  static projectScale(from, to) {
    const denom = this.dot(to, to);
    return denom < 1e-6 ? 0 : this.dot(from, to) / denom;
  }
  static planeProj(v, planeNorm, planePos, out) {
    const planeConst = -this.dot(planePos, planeNorm);
    const scl = this.dot(planeNorm, v) + planeConst;
    this.scale(planeNorm, -scl, out);
    this.add(out, v);
    return out;
  }
  static triNorm(a, b, c, out) {
    const ab = this.sub(b, a, [0, 0, 0]);
    const ac = this.sub(c, a, [0, 0, 0]);
    this.cross(ab, ac, out);
    this.norm(out);
    return out;
  }
  static polar(lon, lat, out) {
    const phi = (90 - lat) * 0.01745329251, theta = lon * 0.01745329251, sp = Math.sin(phi);
    out[0] = -sp * Math.sin(theta);
    out[1] = Math.cos(phi);
    out[2] = sp * Math.cos(theta);
    return out;
  }
  static orthogonal(a, out) {
    const x = a[0], y = a[1], z = a[2];
    out = out || a;
    if (x >= 0.57735026919) {
      out[0] = y;
      out[1] = -x;
      out[2] = 0;
    } else {
      out[0] = 0;
      out[1] = z;
      out[2] = -y;
    }
    return out;
  }
  static clone(a) {
    return [a[0], a[1], a[2]];
  }
  static xp(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = x;
    o[1] = -z;
    o[2] = y;
    return o;
  }
  static xn(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = x;
    o[1] = z;
    o[2] = -y;
    return o;
  }
  static x2(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = x;
    o[1] = -y;
    o[2] = -z;
    return o;
  }
  static yp(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = -z;
    o[1] = y;
    o[2] = x;
    return o;
  }
  static yn(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = z;
    o[1] = y;
    o[2] = -x;
    return o;
  }
  static y2(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = -x;
    o[1] = y;
    o[2] = -z;
    return o;
  }
  static zp(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = y;
    o[1] = -x;
    o[2] = z;
    return o;
  }
  static zn(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = -y;
    o[1] = x;
    o[2] = z;
    return o;
  }
  static z2(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = -x;
    o[1] = -y;
    o[2] = z;
    return o;
  }
  static xp_yn(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = -y;
    o[1] = -z;
    o[2] = x;
    return o;
  }
  static xp_yp(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = y;
    o[1] = -z;
    o[2] = -x;
    return o;
  }
  static xp_yp_yp(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = -x;
    o[1] = -z;
    o[2] = -y;
    return o;
  }
  static xp_xp(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = x;
    o[1] = -y;
    o[2] = -z;
    return o;
  }
  static yn2(v, o) {
    const x = v[0], y = v[1], z = v[2];
    o[0] = -x;
    o[1] = y;
    o[2] = -z;
    return o;
  }
};
let vec3 = _vec3;
__publicField(vec3, "AXIS", [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
__publicField(vec3, "UP", [0, 1, 0]);
__publicField(vec3, "DOWN", [0, -1, 0]);
__publicField(vec3, "LEFT", [-1, 0, 0]);
__publicField(vec3, "RIGHT", [1, 0, 0]);
__publicField(vec3, "FORWARD", [0, 0, 1]);
__publicField(vec3, "BACK", [0, 0, -1]);
__publicField(vec3, "ZERO", [0, 0, 0]);
class quat {
  static reset(a) {
    a[0] = 0;
    a[1] = 0;
    a[2] = 0;
    a[3] = 1;
    return a;
  }
  static copy(a, out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  static fromStruct(v, out = [0, 0, 0, 0]) {
    out[0] = v.x;
    out[1] = v.y;
    out[2] = v.z;
    out[3] = v.w;
    return out;
  }
  static toStruct(a, v) {
    v.x = a[0];
    v.y = a[1];
    v.z = a[2];
    v.w = a[3];
    return v;
  }
  static fromPolar(lon, lat, up, out = [0, 0, 0, 1]) {
    lat = Math.max(Math.min(lat, 89.999999), -89.999999);
    const phi = (90 - lat) * 0.01745329251, theta = lon * 0.01745329251, phi_s = Math.sin(phi), v = [
      -(phi_s * Math.sin(theta)),
      Math.cos(phi),
      phi_s * Math.cos(theta)
    ];
    this.look(v, up, out);
    return out;
  }
  static toPolar(a, out = [0, 0]) {
    const fwd = vec3.transformQuat(vec3.FORWARD, a);
    const flat = vec3.norm([fwd[0], 0, fwd[2]]);
    let lon = vec3.angle(vec3.FORWARD, flat);
    let lat = vec3.angle(flat, fwd);
    const d_side = vec3.dot(fwd, vec3.RIGHT);
    const d_up = vec3.dot(fwd, vec3.UP);
    if (d_side < 0)
      lon = -lon;
    if (d_up < 0)
      lat = -lat;
    if (d_up > 0.999 || d_up <= -0.999)
      lon = 0;
    const to_deg = 180 / Math.PI;
    out[0] = lon * to_deg;
    out[1] = lat * to_deg;
    return out;
  }
  static fromAxis(xAxis, yAxis, zAxis, out) {
    const m00 = xAxis[0], m01 = xAxis[1], m02 = xAxis[2], m10 = yAxis[0], m11 = yAxis[1], m12 = yAxis[2], m20 = zAxis[0], m21 = zAxis[1], m22 = zAxis[2], t = m00 + m11 + m22;
    let x, y, z, w, s;
    if (t > 0) {
      s = Math.sqrt(t + 1);
      w = s * 0.5;
      s = 0.5 / s;
      x = (m12 - m21) * s;
      y = (m20 - m02) * s;
      z = (m01 - m10) * s;
    } else if (m00 >= m11 && m00 >= m22) {
      s = Math.sqrt(1 + m00 - m11 - m22);
      x = 0.5 * s;
      s = 0.5 / s;
      y = (m01 + m10) * s;
      z = (m02 + m20) * s;
      w = (m12 - m21) * s;
    } else if (m11 > m22) {
      s = Math.sqrt(1 + m11 - m00 - m22);
      y = 0.5 * s;
      s = 0.5 / s;
      x = (m10 + m01) * s;
      z = (m21 + m12) * s;
      w = (m20 - m02) * s;
    } else {
      s = Math.sqrt(1 + m22 - m00 - m11);
      z = 0.5 * s;
      s = 0.5 / s;
      x = (m20 + m02) * s;
      y = (m21 + m12) * s;
      w = (m01 - m10) * s;
    }
    out = out || [0, 0, 0, 0];
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  static unitVecs(a, b, out = [0, 0, 0, 1]) {
    const dot = vec3.dot(a, b);
    if (dot < -0.999999) {
      const tmp = vec3.cross(vec3.LEFT, a);
      if (vec3.len(tmp) < 1e-6)
        vec3.cross(vec3.UP, a, tmp);
      this.axisAngle(vec3.norm(tmp), Math.PI, out);
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
    } else {
      const v = vec3.cross(a, b);
      out[0] = v[0];
      out[1] = v[1];
      out[2] = v[2];
      out[3] = 1 + dot;
      this.norm(out);
    }
    return out;
  }
  static fromMat3(m, out = [0, 0, 0, 1]) {
    let fRoot;
    const fTrace = m[0] + m[4] + m[8];
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      let i = 0;
      if (m[4] > m[0])
        i = 1;
      if (m[8] > m[i * 3 + i])
        i = 2;
      const j = (i + 1) % 3;
      const k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
  }
  static fromMat4(m, out = [0, 0, 0, 1]) {
    const trace = m[0] + m[5] + m[10];
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (m[6] - m[9]) / S;
      out[1] = (m[8] - m[2]) / S;
      out[2] = (m[1] - m[4]) / S;
    } else if (m[0] > m[5] && m[0] > m[10]) {
      S = Math.sqrt(1 + m[0] - m[5] - m[10]) * 2;
      out[3] = (m[6] - m[9]) / S;
      out[0] = 0.25 * S;
      out[1] = (m[1] + m[4]) / S;
      out[2] = (m[8] + m[2]) / S;
    } else if (m[5] > m[10]) {
      S = Math.sqrt(1 + m[5] - m[0] - m[10]) * 2;
      out[3] = (m[8] - m[2]) / S;
      out[0] = (m[1] + m[4]) / S;
      out[1] = 0.25 * S;
      out[2] = (m[6] + m[9]) / S;
    } else {
      S = Math.sqrt(1 + m[10] - m[0] - m[5]) * 2;
      out[3] = (m[1] - m[4]) / S;
      out[0] = (m[8] + m[2]) / S;
      out[1] = (m[6] + m[9]) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  static lenSq(a) {
    return a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + a[3] ** 2;
  }
  static len(a) {
    return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + a[3] ** 2);
  }
  static toString(a, rnd = 0) {
    if (rnd == 0)
      return "[" + a.join(",") + "]";
    else {
      let s = "[";
      for (let i = 0; i < 4; i++) {
        switch (a[i]) {
          case 0:
            s += "0,";
            break;
          case 1:
            s += "1,";
            break;
          default:
            s += a[i].toFixed(rnd) + ",";
            break;
        }
      }
      return s.slice(0, -1) + "]";
    }
  }
  static isZero(a) {
    return a[0] == 0 && a[1] == 0 && a[2] == 0 && a[3] == 0;
  }
  static random(out = [0, 0, 0, 1]) {
    const u1 = Math.random(), u2 = Math.random(), u3 = Math.random(), r1 = Math.sqrt(1 - u1), r2 = Math.sqrt(u1);
    out[0] = r1 * Math.sin(6.283185307179586 * u2);
    out[1] = r1 * Math.cos(6.283185307179586 * u2);
    out[2] = r2 * Math.sin(6.283185307179586 * u3);
    out[3] = r2 * Math.cos(6.283185307179586 * u3);
    return out;
  }
  fromBuf(ary, idx, out = [0, 0, 0, 0]) {
    out[0] = ary[idx];
    out[1] = ary[idx + 1];
    out[2] = ary[idx + 2];
    out[3] = ary[idx + 3];
    return out;
  }
  toBuf(a, ary, idx) {
    ary[idx] = a[0];
    ary[idx + 1] = a[1];
    ary[idx + 2] = a[2];
    ary[idx + 3] = a[3];
  }
  pushTo(a, ary) {
    ary.push(a[0], a[1], a[2], a[3]);
  }
  static axisAngle(axis, angle, out = [0, 0, 0, 1]) {
    const half = angle * 0.5, s = Math.sin(half);
    out[0] = axis[0] * s;
    out[1] = axis[1] * s;
    out[2] = axis[2] * s;
    out[3] = Math.cos(half);
    return out;
  }
  static getAxisAngle(a, out = [0, 0, 0, 0]) {
    if (a[3] > 1)
      a = this.norm(a, [0, 0, 0, 0]);
    const angle = 2 * Math.acos(a[3]), s = Math.sqrt(1 - a[3] * a[3]);
    if (s < 1e-3) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    } else {
      out[0] = a[0] / s;
      out[1] = a[1] / s;
      out[2] = a[2] / s;
      out[3] = angle;
    }
    return out;
  }
  static getAngle(a) {
    if (a[3] > 1)
      a = this.norm(a, [0, 0, 0, 0]);
    return 2 * Math.acos(a[3]);
  }
  static getAxis(a, out = [0, 0, 0]) {
    if (a[3] > 1)
      a = this.norm(a, [0, 0, 0, 0]);
    const s = Math.sqrt(1 - a[3] ** 2);
    if (s < 1e-3) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
    } else {
      out[0] = a[0] / s;
      out[1] = a[1] / s;
      out[2] = a[2] / s;
    }
    return out;
  }
  static mul(a, b, out) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out = out || a;
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  static norm(q, out) {
    let len = q[0] ** 2 + q[1] ** 2 + q[2] ** 2 + q[3] ** 2;
    out = out || q;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out[0] = q[0] * len;
      out[1] = q[1] * len;
      out[2] = q[2] * len;
      out[3] = q[3] * len;
    }
    return out;
  }
  static invert(q, out) {
    const a0 = q[0], a1 = q[1], a2 = q[2], a3 = q[3], dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    out = out || q;
    if (dot == 0) {
      out[0] = out[1] = out[2] = out[3] = 0;
    } else {
      const invDot = 1 / dot;
      out[0] = -a0 * invDot;
      out[1] = -a1 * invDot;
      out[2] = -a2 * invDot;
      out[3] = a3 * invDot;
    }
    return out;
  }
  static look(vDir, vUp, out = [0, 0, 0, 0]) {
    const zAxis = vec3.clone(vDir), xAxis = vec3.cross(vUp, zAxis), yAxis = vec3.cross(zAxis, xAxis);
    vec3.norm(xAxis);
    vec3.norm(yAxis);
    vec3.norm(zAxis);
    const m00 = xAxis[0], m01 = xAxis[1], m02 = xAxis[2], m10 = yAxis[0], m11 = yAxis[1], m12 = yAxis[2], m20 = zAxis[0], m21 = zAxis[1], m22 = zAxis[2], t = m00 + m11 + m22;
    let x, y, z, w, s;
    if (t > 0) {
      s = Math.sqrt(t + 1);
      w = s * 0.5;
      s = 0.5 / s;
      x = (m12 - m21) * s;
      y = (m20 - m02) * s;
      z = (m01 - m10) * s;
    } else if (m00 >= m11 && m00 >= m22) {
      s = Math.sqrt(1 + m00 - m11 - m22);
      x = 0.5 * s;
      s = 0.5 / s;
      y = (m01 + m10) * s;
      z = (m02 + m20) * s;
      w = (m12 - m21) * s;
    } else if (m11 > m22) {
      s = Math.sqrt(1 + m11 - m00 - m22);
      y = 0.5 * s;
      s = 0.5 / s;
      x = (m10 + m01) * s;
      z = (m21 + m12) * s;
      w = (m20 - m02) * s;
    } else {
      s = Math.sqrt(1 + m22 - m00 - m11);
      z = 0.5 * s;
      s = 0.5 / s;
      x = (m20 + m02) * s;
      y = (m21 + m12) * s;
      w = (m01 - m10) * s;
    }
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  static negate(q, out) {
    out = out || q;
    out[0] = -q[0];
    out[1] = -q[1];
    out[2] = -q[2];
    out[3] = -q[3];
    return out;
  }
  static dotNegate(q, by, out) {
    out = out || q;
    if (this.dot(q, by) < 0)
      this.negate(q, out);
    return out;
  }
  static conjugate(q, out) {
    out = out || q;
    out[0] = -q[0];
    out[1] = -q[1];
    out[2] = -q[2];
    out[3] = q[3];
    return out;
  }
  static mirrorX(q, out) {
    out = out || q;
    out[0] = q[0];
    out[1] = -q[1];
    out[2] = -q[2];
    return out;
  }
  static scaleAngle(q, scl, out) {
    if (q[3] > 1)
      q = this.norm(q);
    const angle = 2 * Math.acos(q[3]), len = 1 / Math.sqrt(q[0] ** 2 + q[1] ** 2 + q[2] ** 2), half = angle * scl * 0.5, s = Math.sin(half);
    out = out || q;
    out[0] = q[0] * len * s;
    out[1] = q[1] * len * s;
    out[2] = q[2] * len * s;
    out[3] = Math.cos(half);
    return out;
  }
  static transformVec3(q, v, out) {
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3], vx = v[0], vy = v[1], vz = v[2], x1 = qy * vz - qz * vy, y1 = qz * vx - qx * vz, z1 = qx * vy - qy * vx, x2 = qw * x1 + qy * z1 - qz * y1, y2 = qw * y1 + qz * x1 - qx * z1, z2 = qw * z1 + qx * y1 - qy * x1;
    out = out || v;
    out[0] = vx + 2 * x2;
    out[1] = vy + 2 * y2;
    out[2] = vz + 2 * z2;
    return out;
  }
  static rotX(q, rad, out) {
    rad *= 0.5;
    const ax = q[0], ay = q[1], az = q[2], aw = q[3], bx = Math.sin(rad), bw = Math.cos(rad);
    out = out || q;
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  static rotY(q, rad, out) {
    rad *= 0.5;
    const ax = q[0], ay = q[1], az = q[2], aw = q[3], by = Math.sin(rad), bw = Math.cos(rad);
    out = out || q;
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  static rotZ(q, rad, out) {
    rad *= 0.5;
    const ax = q[0], ay = q[1], az = q[2], aw = q[3], bz = Math.sin(rad), bw = Math.cos(rad);
    out = out || q;
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  static rotDeg(q, deg, axis = "y", out) {
    const rad = deg * Math.PI / 180;
    out = out || q;
    switch (axis) {
      case "x":
        this.rotX(q, rad, out);
        break;
      case "y":
        this.rotY(q, rad, out);
        break;
      case "z":
        this.rotZ(q, rad, out);
        break;
    }
    return out;
  }
  static mulAxisAngle(q, axis, angle, out) {
    const half = angle * 0.5, s = Math.sin(half), bx = axis[0] * s, by = axis[1] * s, bz = axis[2] * s, bw = Math.cos(half), ax = q[0], ay = q[1], az = q[2], aw = q[3];
    out = out || q;
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  static pmulAxisAngle(q, axis, angle, out) {
    const half = angle * 0.5, s = Math.sin(half), ax = axis[0] * s, ay = axis[1] * s, az = axis[2] * s, aw = Math.cos(half), bx = q[0], by = q[1], bz = q[2], bw = q[3];
    out = out || q;
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  static pmulInvert(q, inv, out) {
    let ax = inv[0], ay = inv[1], az = inv[2], aw = inv[3];
    const dot = ax * ax + ay * ay + az * az + aw * aw;
    if (dot == 0) {
      ax = ay = az = aw = 0;
    } else {
      const dot_inv = 1 / dot;
      ax = -ax * dot_inv;
      ay = -ay * dot_inv;
      az = -az * dot_inv;
      aw = aw * dot_inv;
    }
    const bx = q[0], by = q[1], bz = q[2], bw = q[3];
    out = out || q;
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  static mulUnitVecs(q, a, b, out) {
    const dot = vec3.dot(a, b);
    const ax = q[0], ay = q[1], az = q[2], aw = q[3];
    let bx, by, bz, bw;
    if (dot < -0.999999) {
      const axis = vec3.cross(vec3.LEFT, a);
      if (vec3.len(axis) < 1e-6)
        vec3.cross(vec3.UP, a, axis);
      vec3.norm(axis);
      const half = Math.PI * 0.5, s = Math.sin(half);
      bx = axis[0] * s;
      by = axis[1] * s;
      bz = axis[2] * s;
      bw = Math.cos(half);
    } else if (dot > 0.999999) {
      bx = 0;
      by = 0;
      bz = 0;
      bw = 1;
    } else {
      const v = vec3.cross(a, b);
      bx = v[0];
      by = v[1];
      bz = v[2];
      bw = 1 + dot;
      let len = bx ** 2 + by ** 2 + bz ** 2 + bw ** 2;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
        bx *= len;
        by *= len;
        bz *= len;
        bw *= len;
      }
    }
    out = out || q;
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  static getEuler(q, out = [0, 0, 0], inDeg = false) {
    let pitch = 0, yaw = 0, roll = 0;
    const x = q[0], y = q[1], z = q[2], w = q[3], test = x * y + z * w;
    if (test > 0.499) {
      pitch = 2 * Math.atan2(x, w);
      yaw = Math.PI / 2;
      roll = 0;
    }
    if (test < -0.499) {
      pitch = -2 * Math.atan2(x, w);
      yaw = -Math.PI / 2;
      roll = 0;
    }
    if (isNaN(pitch)) {
      const sqz = z * z;
      roll = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * x * x - 2 * sqz);
      pitch = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * y * y - 2 * sqz);
      yaw = Math.asin(2 * test);
    }
    const deg = inDeg ? 180 / Math.PI : 1;
    out[0] = roll * deg;
    out[1] = pitch * deg;
    out[2] = yaw * deg;
    return out;
  }
  static fromEuler(v, out = [0, 0, 0, 1]) {
    const xx = v[0] * 0.01745329251 * 0.5;
    const yy = v[1] * 0.01745329251 * 0.5;
    const zz = v[2] * 0.01745329251 * 0.5;
    const c1 = Math.cos(xx), c2 = Math.cos(yy), c3 = Math.cos(zz), s1 = Math.sin(xx), s2 = Math.sin(yy), s3 = Math.sin(zz);
    out[0] = s1 * c2 * c3 + c1 * s2 * s3;
    out[1] = c1 * s2 * c3 - s1 * c2 * s3;
    out[2] = c1 * c2 * s3 - s1 * s2 * c3;
    out[3] = c1 * c2 * c3 + s1 * s2 * s3;
    return this.norm(out);
  }
  static fromEulerXY(x, y, out = [0, 0, 0, 1]) {
    const xx = x * 0.01745329251 * 0.5, yy = y * 0.01745329251 * 0.5, c1 = Math.cos(xx), c2 = Math.cos(yy), s1 = Math.sin(xx), s2 = Math.sin(yy);
    out[0] = s1 * c2;
    out[1] = c1 * s2;
    out[2] = -s1 * s2;
    out[3] = c1 * c2;
    return this.norm(out);
  }
  static fromEulerOrder(x, y, z, out = [0, 0, 0, 1], order = "YXZ") {
    const c1 = Math.cos(x * 0.5), c2 = Math.cos(y * 0.5), c3 = Math.cos(z * 0.5), s1 = Math.sin(x * 0.5), s2 = Math.sin(y * 0.5), s3 = Math.sin(z * 0.5);
    switch (order) {
      case "XYZ":
        out[0] = s1 * c2 * c3 + c1 * s2 * s3;
        out[1] = c1 * s2 * c3 - s1 * c2 * s3;
        out[2] = c1 * c2 * s3 + s1 * s2 * c3;
        out[3] = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "YXZ":
        out[0] = s1 * c2 * c3 + c1 * s2 * s3;
        out[1] = c1 * s2 * c3 - s1 * c2 * s3;
        out[2] = c1 * c2 * s3 - s1 * s2 * c3;
        out[3] = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "ZXY":
        out[0] = s1 * c2 * c3 - c1 * s2 * s3;
        out[1] = c1 * s2 * c3 + s1 * c2 * s3;
        out[2] = c1 * c2 * s3 + s1 * s2 * c3;
        out[3] = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "ZYX":
        out[0] = s1 * c2 * c3 - c1 * s2 * s3;
        out[1] = c1 * s2 * c3 + s1 * c2 * s3;
        out[2] = c1 * c2 * s3 - s1 * s2 * c3;
        out[3] = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "YZX":
        out[0] = s1 * c2 * c3 + c1 * s2 * s3;
        out[1] = c1 * s2 * c3 + s1 * c2 * s3;
        out[2] = c1 * c2 * s3 - s1 * s2 * c3;
        out[3] = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "XZY":
        out[0] = s1 * c2 * c3 - c1 * s2 * s3;
        out[1] = c1 * s2 * c3 - s1 * c2 * s3;
        out[2] = c1 * c2 * s3 + s1 * s2 * c3;
        out[3] = c1 * c2 * c3 + s1 * s2 * s3;
        break;
    }
    return this.norm(out);
  }
  static fromAngularVec(v, out = [0, 0, 0, 1]) {
    let len = vec3.len(v);
    if (len < 1e-6) {
      this.reset(out);
    } else {
      const h = 0.5 * len;
      const s = Math.sin(h);
      const c = Math.cos(h);
      len = 1 / len;
      out[0] = s * (v[0] * len);
      out[1] = s * (v[1] * len);
      out[2] = s * (v[2] * len);
      out[3] = c;
    }
    return out;
  }
  static toAngularVec(q, out = [0, 0, 0]) {
    const v = this.getAxisAngle(q);
    out[0] = v[0] * v[3];
    out[1] = v[1] * v[3];
    out[2] = v[2] * v[3];
    return out;
  }
  static lerp(a, b, t, out = [0, 0, 0, 1]) {
    const ti = 1 - t;
    out[0] = a[0] * ti + b[0] * t;
    out[1] = a[1] * ti + b[1] * t;
    out[2] = a[2] * ti + b[2] * t;
    out[3] = a[3] * ti + b[3] * t;
    return out;
  }
  static nlerp(a, b, t, out = [0, 0, 0, 1]) {
    const ti = 1 - t;
    out[0] = a[0] * ti + b[0] * t;
    out[1] = a[1] * ti + b[1] * t;
    out[2] = a[2] * ti + b[2] * t;
    out[3] = a[3] * ti + b[3] * t;
    return this.norm(out);
  }
  static nblend(a, b, t, out = [0, 0, 0, 1]) {
    const a_x = a[0], a_y = a[1], a_z = a[2], a_w = a[3], b_x = b[0], b_y = b[1], b_z = b[2], b_w = b[3], dot = a_x * b_x + a_y * b_y + a_z * b_z + a_w * b_w, ti = 1 - t;
    let s = 1;
    if (dot < 0)
      s = -1;
    out[0] = ti * a_x + t * b_x * s;
    out[1] = ti * a_y + t * b_y * s;
    out[2] = ti * a_z + t * b_z * s;
    out[3] = ti * a_w + t * b_w * s;
    return this.norm(out);
  }
  static slerp(a, b, t, out = [0, 0, 0, 1]) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > 1e-6) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  static cubic(a, b, c, d, t, out = [0, 0, 0, 1]) {
    const t2 = t * t, t3 = t * t2, a0 = d[0] - c[0] - a[0] + b[0], a1 = d[1] - c[1] - a[1] + b[1], a2 = d[2] - c[2] - a[2] + b[2], a3 = d[3] - c[3] - a[3] + b[3];
    out[0] = a0 * t3 + (a[0] - b[0] - a0) * t2 + (c[0] - a[0]) * t + b[0];
    out[1] = a1 * t3 + (a[1] - b[1] - a1) * t2 + (c[1] - a[1]) * t + b[1];
    out[2] = a2 * t3 + (a[2] - b[2] - a2) * t2 + (c[2] - a[2]) * t + b[2];
    out[3] = a3 * t3 + (a[3] - b[3] - a3) * t2 + (c[3] - a[3]) * t + b[3];
    return this.norm(out);
  }
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
}
class mat4 {
  static identity(out) {
    out = out || new Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  static clearTranslation(m, out) {
    out = out || m;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  static copy(mat, out) {
    for (let i = 0; i < 16; i++)
      out[i] = mat[i];
    return out;
  }
  static determinant(m) {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3], a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7], a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11], a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15], b0 = a00 * a11 - a01 * a10, b1 = a00 * a12 - a02 * a10, b2 = a01 * a12 - a02 * a11, b3 = a20 * a31 - a21 * a30, b4 = a20 * a32 - a22 * a30, b5 = a21 * a32 - a22 * a31, b6 = a00 * b5 - a01 * b4 + a02 * b3, b7 = a10 * b5 - a11 * b4 + a12 * b3, b8 = a20 * b2 - a21 * b1 + a22 * b0, b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  static frob(m) {
    return Math.hypot(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
  }
  static perspective(fovy, aspect, near, far, out) {
    const f = 1 / Math.tan(fovy * 0.5), nf = 1 / (near - far);
    out = out || new Array(16);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
  }
  static orthographic(left, right, bottom, top, near, far, out) {
    const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
    out = out || new Array(16);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  static frustum(left, right, bottom, top, near, far, out) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const nf = 1 / (near - far);
    out = out || new Array(16);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  static fromQuatTranScale(q, v, s, out) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2, sx = s[0], sy = s[1], sz = s[2];
    out = out || new Array(16);
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  static fromQuatTran(q, v, out) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    out = out || new Array(16);
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  static fromQuat(q, out) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    out = out || new Array(16);
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  static fromQuatTranScaleOrigin(q, v, s, o, out) {
    const x = q[0], y = q[1], z = q[2], w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = s[0];
    const sy = s[1];
    const sz = s[2];
    const ox = o[0];
    const oy = o[1];
    const oz = o[2];
    const out0 = (1 - (yy + zz)) * sx;
    const out1 = (xy + wz) * sx;
    const out2 = (xz - wy) * sx;
    const out4 = (xy - wz) * sy;
    const out5 = (1 - (xx + zz)) * sy;
    const out6 = (yz + wx) * sy;
    const out8 = (xz + wy) * sz;
    const out9 = (yz - wx) * sz;
    const out10 = (1 - (xx + yy)) * sz;
    out = out || new Array(16);
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  static fromDualQuat(a, out) {
    const bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    const translation = [0, 0, 0];
    let magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      magnitude = 1 / magnitude;
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 * magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 * magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 * magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    out = out || new Array(16);
    return this.fromQuatTran(a, translation, out);
  }
  static fromLook(eye, center, up, out) {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];
    out = out || new Array(16);
    if (Math.abs(eyex - centerx) < 1e-6 && Math.abs(eyey - centery) < 1e-6 && Math.abs(eyez - centerz) < 1e-6) {
      return this.identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  static fromTarget(eye, target, up, out) {
    const eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    let z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2], len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }
    let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    out = out || new Array(16);
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  static fromAxisAngle(axis, rad, out) {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.hypot(x, y, z);
    out = out || this.identity();
    if (len < 1e-6)
      return out;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  static fromRotX(rad, out) {
    const s = Math.sin(rad), c = Math.cos(rad);
    out = out || new Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  static fromRotY(rad, out) {
    const s = Math.sin(rad), c = Math.cos(rad);
    out = out || new Array(16);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  static fromRotZ(rad, out) {
    const s = Math.sin(rad), c = Math.cos(rad);
    out = out || new Array(16);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  static fromBuf(ary, idx, out) {
    out = out || new Array(16);
    out[0] = ary[idx];
    out[1] = ary[idx + 1];
    out[2] = ary[idx + 2];
    out[3] = ary[idx + 3];
    out[4] = ary[idx + 4];
    out[5] = ary[idx + 5];
    out[6] = ary[idx + 6];
    out[7] = ary[idx + 7];
    out[8] = ary[idx + 8];
    out[9] = ary[idx + 9];
    out[10] = ary[idx + 10];
    out[11] = ary[idx + 11];
    out[12] = ary[idx + 12];
    out[13] = ary[idx + 13];
    out[14] = ary[idx + 14];
    out[15] = ary[idx + 15];
    return out;
  }
  static toBuf(ary, idx, m) {
    ary[idx] = m[0];
    ary[idx + 1] = m[1];
    ary[idx + 2] = m[2];
    ary[idx + 3] = m[3];
    ary[idx + 4] = m[4];
    ary[idx + 5] = m[5];
    ary[idx + 6] = m[6];
    ary[idx + 7] = m[7];
    ary[idx + 8] = m[8];
    ary[idx + 9] = m[9];
    ary[idx + 10] = m[10];
    ary[idx + 11] = m[11];
    ary[idx + 12] = m[12];
    ary[idx + 13] = m[13];
    ary[idx + 14] = m[14];
    ary[idx + 15] = m[15];
  }
  static add(a, b, out) {
    out = out || a;
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  static sub(a, b, out) {
    out = out || a;
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  static mul(a, b, out) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out = out || a;
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  static invert(mat, out) {
    const a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    out = out || mat;
    if (!det)
      return out;
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  static translate(a, v, out) {
    const xx = v[0];
    const yy = v[1];
    const zz = v[2];
    out = out || a;
    out[12] = a[0] * xx + a[4] * yy + a[8] * zz + a[12];
    out[13] = a[1] * xx + a[5] * yy + a[9] * zz + a[13];
    out[14] = a[2] * xx + a[6] * yy + a[10] * zz + a[14];
    out[15] = a[3] * xx + a[7] * yy + a[11] * zz + a[15];
    return out;
  }
  static scale(a, v, out) {
    const x = v[0];
    const y = v[1];
    const z = v[2];
    out = out || a;
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    return out;
  }
  static transpose(m, out) {
    const a01 = m[1], a02 = m[2], a03 = m[3], a12 = m[6], a13 = m[7], a23 = m[11];
    out = out || m;
    out[1] = m[4];
    out[2] = m[8];
    out[3] = m[12];
    out[4] = a01;
    out[6] = m[9];
    out[7] = m[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = m[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
    return out;
  }
  static adjugate(a, out) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    out = out || a;
    out[0] = a11 * b11 - a12 * b10 + a13 * b09;
    out[1] = a02 * b10 - a01 * b11 - a03 * b09;
    out[2] = a31 * b05 - a32 * b04 + a33 * b03;
    out[3] = a22 * b04 - a21 * b05 - a23 * b03;
    out[4] = a12 * b08 - a10 * b11 - a13 * b07;
    out[5] = a00 * b11 - a02 * b08 + a03 * b07;
    out[6] = a32 * b02 - a30 * b05 - a33 * b01;
    out[7] = a20 * b05 - a22 * b02 + a23 * b01;
    out[8] = a10 * b10 - a11 * b08 + a13 * b06;
    out[9] = a01 * b08 - a00 * b10 - a03 * b06;
    out[10] = a30 * b04 - a31 * b02 + a33 * b00;
    out[11] = a21 * b02 - a20 * b04 - a23 * b00;
    out[12] = a11 * b07 - a10 * b09 - a12 * b06;
    out[13] = a00 * b09 - a01 * b07 + a02 * b06;
    out[14] = a31 * b01 - a30 * b03 - a32 * b00;
    out[15] = a20 * b03 - a21 * b01 + a22 * b00;
    return out;
  }
  static rotX(m, rad, out) {
    const s = Math.sin(rad), c = Math.cos(rad), a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7], a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    out = out || m;
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  static rotY(m, rad, out) {
    const s = Math.sin(rad), c = Math.cos(rad), a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3], a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    out = out || m;
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  static rotZ(m, rad, out) {
    const s = Math.sin(rad), c = Math.cos(rad), a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3], a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    out = out || m;
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  static rotAxisAngle(m, axis, rad, out) {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z);
    out = out || m;
    if (Math.abs(len) < 1e-6)
      return out;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    const a00 = m[0];
    const a01 = m[1];
    const a02 = m[2];
    const a03 = m[3];
    const a10 = m[4];
    const a11 = m[5];
    const a12 = m[6];
    const a13 = m[7];
    const a20 = m[8];
    const a21 = m[9];
    const a22 = m[10];
    const a23 = m[11];
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return out;
  }
  static transformVec3(m, v, out) {
    const x = v[0], y = v[1], z = v[2];
    out = out || v;
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
  }
  static transformVec4(m, v, out) {
    const x = v[0], y = v[1], z = v[2], w = v[3];
    out = out || v;
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
  }
  static toNormalMat3(m, out) {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3], a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7], a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11], a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    out = out || [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (!det)
      return out;
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return out;
  }
  static getTranslation(m, out) {
    out = out || [0, 0, 0];
    out[0] = m[12];
    out[1] = m[13];
    out[2] = m[14];
    return out;
  }
  static getScale(m, out) {
    const m11 = m[0], m12 = m[1], m13 = m[2], m21 = m[4], m22 = m[5], m23 = m[6], m31 = m[8], m32 = m[9], m33 = m[10];
    out = out || [0, 0, 0];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  static getQuaternion(m, out) {
    const trace = m[0] + m[5] + m[10];
    let S = 0;
    out = out || [0, 0, 0, 1];
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (m[6] - m[9]) / S;
      out[1] = (m[8] - m[2]) / S;
      out[2] = (m[1] - m[4]) / S;
    } else if (m[0] > m[5] && m[0] > m[10]) {
      S = Math.sqrt(1 + m[0] - m[5] - m[10]) * 2;
      out[3] = (m[6] - m[9]) / S;
      out[0] = 0.25 * S;
      out[1] = (m[1] + m[4]) / S;
      out[2] = (m[8] + m[2]) / S;
    } else if (m[5] > m[10]) {
      S = Math.sqrt(1 + m[5] - m[0] - m[10]) * 2;
      out[3] = (m[8] - m[2]) / S;
      out[0] = (m[1] + m[4]) / S;
      out[1] = 0.25 * S;
      out[2] = (m[6] + m[9]) / S;
    } else {
      S = Math.sqrt(1 + m[10] - m[0] - m[5]) * 2;
      out[3] = (m[1] - m[4]) / S;
      out[0] = (m[8] + m[2]) / S;
      out[1] = (m[6] + m[9]) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  static decompose(m, out_r, out_t, out_s) {
    out_t[0] = m[12];
    out_t[1] = m[13];
    out_t[2] = m[14];
    const m11 = m[0];
    const m12 = m[1];
    const m13 = m[2];
    const m21 = m[4];
    const m22 = m[5];
    const m23 = m[6];
    const m31 = m[8];
    const m32 = m[9];
    const m33 = m[10];
    out_s[0] = Math.hypot(m11, m12, m13);
    out_s[1] = Math.hypot(m21, m22, m23);
    out_s[2] = Math.hypot(m31, m32, m33);
    const is1 = 1 / out_s[0];
    const is2 = 1 / out_s[1];
    const is3 = 1 / out_s[2];
    const sm11 = m11 * is1;
    const sm12 = m12 * is2;
    const sm13 = m13 * is3;
    const sm21 = m21 * is1;
    const sm22 = m22 * is2;
    const sm23 = m23 * is3;
    const sm31 = m31 * is1;
    const sm32 = m32 * is2;
    const sm33 = m33 * is3;
    const trace = sm11 + sm22 + sm33;
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out_r[3] = 0.25 * S;
      out_r[0] = (sm23 - sm32) / S;
      out_r[1] = (sm31 - sm13) / S;
      out_r[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out_r[3] = (sm23 - sm32) / S;
      out_r[0] = 0.25 * S;
      out_r[1] = (sm12 + sm21) / S;
      out_r[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out_r[3] = (sm31 - sm13) / S;
      out_r[0] = (sm12 + sm21) / S;
      out_r[1] = 0.25 * S;
      out_r[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out_r[3] = (sm12 - sm21) / S;
      out_r[0] = (sm31 + sm13) / S;
      out_r[1] = (sm23 + sm32) / S;
      out_r[2] = 0.25 * S;
    }
  }
}
export { mat4, quat, vec3 };
