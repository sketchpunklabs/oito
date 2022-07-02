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
const _Vec2 = class extends Float32Array {
  constructor(v, y) {
    super(2);
    if (v instanceof _Vec2 || v instanceof Float32Array || v instanceof Array && v.length == 2) {
      this[0] = v[0];
      this[1] = v[1];
    } else if (typeof v === "number" && typeof y === "number") {
      this[0] = v;
      this[1] = y;
    } else if (typeof v === "number") {
      this[0] = v;
      this[1] = v;
    }
  }
  xy(x, y) {
    if (y != void 0) {
      this[0] = x;
      this[1] = y;
    } else
      this[0] = this[1] = x;
    return this;
  }
  get x() {
    return this[0];
  }
  set x(v) {
    this[0] = v;
  }
  get y() {
    return this[1];
  }
  set y(v) {
    this[1] = v;
  }
  clone() {
    return new _Vec2(this);
  }
  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    return this;
  }
  reset() {
    this[0] = 0;
    this[1] = 0;
    return this;
  }
  toString(rnd = 0) {
    if (rnd == 0)
      return "[" + this.join(",") + "]";
    else {
      let s = "[";
      for (let i = 0; i < 2; i++) {
        switch (this[i]) {
          case 0:
            s += "0,";
            break;
          case 1:
            s += "1,";
            break;
          default:
            s += this[i].toFixed(rnd) + ",";
            break;
        }
      }
      return s.slice(0, -1) + "]";
    }
  }
  toArray() {
    return [this[0], this[1]];
  }
  isZero() {
    return this[0] == 0 && this[1] == 0;
  }
  nearZero(x = 1e-6, y = 1e-6) {
    if (Math.abs(this[0]) <= x)
      this[0] = 0;
    if (Math.abs(this[1]) <= y)
      this[1] = 0;
    return this;
  }
  rnd(x0 = 0, x1 = 1, y0 = 0, y1 = 1) {
    let t;
    t = Math.random();
    this[0] = x0 * (1 - t) + x1 * t;
    t = Math.random();
    this[1] = y0 * (1 - t) + y1 * t;
    return this;
  }
  angle(v) {
    if (v) {
      return Math.acos(_Vec2.dot(this, v) / (this.len() * v.len()));
    }
    return Math.atan2(this[1], this[0]);
  }
  setLen(len) {
    return this.norm().scale(len);
  }
  len() {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
  }
  lenSqr() {
    return this[0] * this[0] + this[1] * this[1];
  }
  fromAngleLen(ang, len) {
    this[0] = len * Math.cos(ang);
    this[1] = len * Math.sin(ang);
    return this;
  }
  fromAdd(a, b) {
    this[0] = a[0] + b[0];
    this[1] = a[1] + b[1];
    return this;
  }
  fromSub(a, b) {
    this[0] = a[0] - b[0];
    this[1] = a[1] - b[1];
    return this;
  }
  fromMul(a, b) {
    this[0] = a[0] * b[0];
    this[1] = a[1] * b[1];
    return this;
  }
  fromScale(a, s) {
    this[0] = a[0] * s;
    this[1] = a[1] * s;
    return this;
  }
  fromLerp(a, b, t) {
    const tt = 1 - t;
    this[0] = a[0] * tt + b[0] * t;
    this[1] = a[1] * tt + b[1] * t;
    return this;
  }
  fromVec3(v, z_plane = true) {
    this[0] = v[0];
    this[1] = z_plane ? v[2] : v[1];
    return this;
  }
  fromMax(a, b) {
    this[0] = Math.max(a[0], b[0]);
    this[1] = Math.max(a[1], b[1]);
    return this;
  }
  fromMin(a, b) {
    this[0] = Math.min(a[0], b[0]);
    this[1] = Math.min(a[1], b[1]);
    return this;
  }
  fromFloor(v) {
    this[0] = Math.floor(v[0]);
    this[1] = Math.floor(v[1]);
    return this;
  }
  fromFract(v) {
    this[0] = v[0] - Math.floor(v[0]);
    this[1] = v[1] - Math.floor(v[1]);
    return this;
  }
  fromNegate(a) {
    this[0] = -a[0];
    this[1] = -a[1];
    return this;
  }
  fromInvert(a) {
    this[0] = a[0] != 0 ? 1 / a[0] : 0;
    this[1] = a[1] != 0 ? 1 / a[1] : 0;
    return this;
  }
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    return this;
  }
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    return this;
  }
  pushTo(ary) {
    ary.push(this[0], this[1]);
    return this;
  }
  add(v) {
    this[0] += v[0];
    this[1] += v[1];
    return this;
  }
  addRaw(x, y) {
    this[0] += x;
    this[1] += y;
    return this;
  }
  sub(v) {
    this[0] -= v[0];
    this[1] -= v[1];
    return this;
  }
  subRaw(x, y) {
    this[0] -= x;
    this[1] -= y;
    return this;
  }
  mul(v) {
    this[0] *= v[0];
    this[1] *= v[1];
    return this;
  }
  div(v) {
    this[0] = v[0] != 0 ? this[0] / v[0] : 0;
    this[1] = v[1] != 0 ? this[1] / v[1] : 0;
    return this;
  }
  scale(v) {
    this[0] *= v;
    this[1] *= v;
    return this;
  }
  divScale(v) {
    this[0] /= v;
    this[1] /= v;
    return this;
  }
  divInvScale(v, out) {
    out = out || this;
    out[0] = this[0] != 0 ? v / this[0] : 0;
    out[1] = this[1] != 0 ? v / this[1] : 0;
    return out;
  }
  floor(out) {
    out = out || this;
    out[0] = Math.floor(this[0]);
    out[1] = Math.floor(this[1]);
    return out;
  }
  negate() {
    this[0] = -this[0];
    this[1] = -this[1];
    return this;
  }
  min(a) {
    this[0] = Math.min(this[0], a[0]);
    this[1] = Math.min(this[1], a[1]);
    return this;
  }
  max(a) {
    this[0] = Math.max(this[0], a[0]);
    this[1] = Math.max(this[1], a[1]);
    return this;
  }
  norm() {
    const mag = Math.sqrt(this[0] ** 2 + this[1] ** 2);
    if (mag == 0)
      return this;
    this[0] = this[0] / mag;
    this[1] = this[1] / mag;
    return this;
  }
  lerp(v, t, out) {
    out = out || this;
    const ti = 1 - t;
    out[0] = this[0] * ti + v[0] * t;
    out[1] = this[1] * ti + v[1] * t;
    return out;
  }
  rotate(rad) {
    const cos = Math.cos(rad), sin = Math.sin(rad), x = this[0], y = this[1];
    this[0] = x * cos - y * sin;
    this[1] = x * sin + y * cos;
    return this;
  }
  rotateDeg(deg, out) {
    out = out || this;
    const rad = deg * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad), x = this[0], y = this[1];
    out[0] = x * cos - y * sin;
    out[1] = x * sin + y * cos;
    return out;
  }
  invert(out) {
    out = out || this;
    out[0] = -this[0];
    out[1] = -this[1];
    return out;
  }
  perpCW() {
    const x = this[0];
    this[0] = this[1];
    this[1] = -x;
    return this;
  }
  perpCCW() {
    const x = this[0];
    this[0] = -this[1];
    this[1] = x;
    return this;
  }
  static add(a, b) {
    return new _Vec2().fromAdd(a, b);
  }
  static sub(a, b) {
    return new _Vec2().fromSub(a, b);
  }
  static scale(v, s) {
    return new _Vec2().fromScale(v, s);
  }
  static floor(v) {
    return new _Vec2().fromFloor(v);
  }
  static fract(v) {
    return new _Vec2().fromFract(v);
  }
  static lerp(v0, v1, t) {
    return new _Vec2().fromLerp(v0, v1, t);
  }
  static len(v0, v1) {
    return Math.sqrt((v0[0] - v1[0]) ** 2 + (v0[1] - v1[1]) ** 2);
  }
  static lenSqr(v0, v1) {
    return (v0[0] - v1[0]) ** 2 + (v0[1] - v1[1]) ** 2;
  }
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  static det(a, b) {
    return a[0] * b[1] - a[1] * b[0];
  }
  static project(from, to) {
    const out = new _Vec2();
    const denom = _Vec2.dot(to, to);
    if (denom < 1e-6)
      return out;
    const scl = _Vec2.dot(from, to) / denom;
    return out.fromScale(to, scl);
  }
  static projectPlane(from, to, planeNorm) {
    const out = new _Vec2();
    const denom = _Vec2.dot(to, planeNorm);
    if (denom < 1e-6 && denom > -1e-6)
      return out;
    const t = _Vec2.dot(from, planeNorm) / denom;
    return out.fromScale(to, t);
  }
  static rotateDeg(v, deg) {
    const out = new _Vec2();
    const rad = deg * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad), x = v[0], y = v[1];
    out[0] = x * cos - y * sin;
    out[1] = x * sin + y * cos;
    return out;
  }
  static perpCW(v) {
    const out = new _Vec2();
    out[0] = v[1];
    out[1] = -v[0];
    return out;
  }
  static perpCCW(v) {
    const out = new _Vec2();
    out[0] = -v[1];
    out[1] = v[0];
    return out;
  }
  static bufIter(buf) {
    let i = 0;
    const result = { value: new _Vec2(), done: false }, len = buf.length, next = () => {
      if (i >= len)
        result.done = true;
      else {
        result.value.fromBuf(buf, i);
        i += 2;
      }
      return result;
    };
    return { [Symbol.iterator]() {
      return { next };
    } };
  }
};
let Vec2 = _Vec2;
__publicField(Vec2, "BYTESIZE", 2 * Float32Array.BYTES_PER_ELEMENT);
const _Vec3 = class extends Float32Array {
  constructor(v, y, z) {
    super(3);
    if (v instanceof _Vec3 || v instanceof Float32Array || v instanceof Array && v.length == 3) {
      this[0] = v[0];
      this[1] = v[1];
      this[2] = v[2];
    } else if (typeof v === "number" && typeof y === "number" && typeof z === "number") {
      this[0] = v;
      this[1] = y;
      this[2] = z;
    } else if (typeof v === "number") {
      this[0] = v;
      this[1] = v;
      this[2] = v;
    }
  }
  xyz(x, y, z) {
    if (y != void 0 && z != void 0) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
    } else
      this[0] = this[1] = this[2] = x;
    return this;
  }
  get x() {
    return this[0];
  }
  set x(v) {
    this[0] = v;
  }
  get y() {
    return this[1];
  }
  set y(v) {
    this[1] = v;
  }
  get z() {
    return this[2];
  }
  set z(v) {
    this[2] = v;
  }
  clone() {
    return new _Vec3(this);
  }
  reset() {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    return this;
  }
  toString(rnd = 0) {
    if (rnd == 0)
      return "[" + this.join(",") + "]";
    else {
      let s = "[";
      for (let i = 0; i < 3; i++) {
        switch (this[i]) {
          case 0:
            s += "0,";
            break;
          case 1:
            s += "1,";
            break;
          default:
            s += this[i].toFixed(rnd) + ",";
            break;
        }
      }
      return s.slice(0, -1) + "]";
    }
  }
  toArray() {
    return [this[0], this[1], this[2]];
  }
  isZero() {
    return this[0] == 0 && this[1] == 0 && this[2] == 0;
  }
  rnd(x0 = 0, x1 = 1, y0 = 0, y1 = 1, z0 = 0, z1 = 1) {
    let t;
    t = Math.random();
    this[0] = x0 * (1 - t) + x1 * t;
    t = Math.random();
    this[1] = y0 * (1 - t) + y1 * t;
    t = Math.random();
    this[2] = z0 * (1 - t) + z1 * t;
    return this;
  }
  minAxis() {
    if (this[0] < this[1] && this[0] < this[2])
      return 0;
    if (this[1] < this[2])
      return 1;
    return 2;
  }
  maxAxis() {
    if (this[0] > this[1] && this[0] > this[2])
      return 0;
    if (this[1] > this[2])
      return 1;
    return 2;
  }
  fromPolar(lon, lat) {
    const phi = (90 - lat) * 0.01745329251, theta = lon * 0.01745329251, sp = Math.sin(phi);
    this[0] = -sp * Math.sin(theta);
    this[1] = Math.cos(phi);
    this[2] = sp * Math.cos(theta);
    return this;
  }
  lenSq() {
    return this[0] ** 2 + this[1] ** 2 + this[2] ** 2;
  }
  len(v) {
    if (typeof v == "number") {
      return this;
    }
    return Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2);
  }
  fromStruct(v) {
    this[0] = v.x;
    this[1] = v.y;
    this[2] = v.z;
    return this;
  }
  toStruct(v) {
    v.x = this[0];
    v.y = this[1];
    v.z = this[2];
    return this;
  }
  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    return this;
  }
  copyTo(v) {
    v[0] = this[0];
    v[1] = this[1];
    v[2] = this[2];
    return this;
  }
  fromVec2(v, useZ = false) {
    this[0] = v[0];
    if (useZ) {
      this[1] = 0;
      this[2] = v[1];
    } else {
      this[1] = v[1];
      this[2] = 0;
    }
    return this;
  }
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    this[2] = ary[idx + 2];
    return this;
  }
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    ary[idx + 2] = this[2];
    return this;
  }
  pushTo(ary) {
    ary.push(this[0], this[1], this[2]);
    return this;
  }
  fromLerp(a, b, t) {
    const ti = 1 - t;
    this[0] = a[0] * ti + b[0] * t;
    this[1] = a[1] * ti + b[1] * t;
    this[2] = a[2] * ti + b[2] * t;
    return this;
  }
  fromNLerp(a, b, t) {
    const ti = 1 - t;
    this[0] = a[0] * ti + b[0] * t;
    this[1] = a[1] * ti + b[1] * t;
    this[2] = a[2] * ti + b[2] * t;
    this.norm();
    return this;
  }
  fromSlerp(a, b, t) {
    const angle = Math.acos(Math.min(Math.max(_Vec3.dot(a, b), -1), 1));
    const sin = Math.sin(angle);
    const ta = Math.sin((1 - t) * angle) / sin;
    const tb = Math.sin(t * angle) / sin;
    this[0] = ta * a[0] + tb * b[0];
    this[1] = ta * a[1] + tb * b[1];
    this[2] = ta * a[2] + tb * b[2];
    return this;
  }
  fromHermite(a, b, c, d, t) {
    const tt = t * t;
    const f1 = tt * (2 * t - 3) + 1;
    const f2 = tt * (t - 2) + t;
    const f3 = tt * (t - 1);
    const f4 = tt * (3 - 2 * t);
    this[0] = a[0] * f1 + b[0] * f2 + c[0] * f3 + d[0] * f4;
    this[1] = a[1] * f1 + b[1] * f2 + c[1] * f3 + d[1] * f4;
    this[2] = a[2] * f1 + b[2] * f2 + c[2] * f3 + d[2] * f4;
    return this;
  }
  fromBezier(a, b, c, d, t) {
    const it = 1 - t;
    const it2 = it * it;
    const tt = t * t;
    const f1 = it2 * it;
    const f2 = 3 * t * it2;
    const f3 = 3 * tt * it;
    const f4 = tt * t;
    this[0] = a[0] * f1 + b[0] * f2 + c[0] * f3 + d[0] * f4;
    this[1] = a[1] * f1 + b[1] * f2 + c[1] * f3 + d[1] * f4;
    this[2] = a[2] * f1 + b[2] * f2 + c[2] * f3 + d[2] * f4;
    return this;
  }
  fromCubic(a, b, c, d, t) {
    const t2 = t * t, t3 = t * t2, a0 = d[0] - c[0] - a[0] + b[0], a1 = d[1] - c[1] - a[1] + b[1], a2 = d[2] - c[2] - a[2] + b[2];
    this[0] = a0 * t3 + (a[0] - b[0] - a0) * t2 + (c[0] - a[0]) * t + b[0];
    this[1] = a1 * t3 + (a[1] - b[1] - a1) * t2 + (c[1] - a[1]) * t + b[1];
    this[2] = a2 * t3 + (a[2] - b[2] - a2) * t2 + (c[2] - a[2]) * t + b[2];
    return this;
  }
  fromAdd(a, b) {
    this[0] = a[0] + b[0];
    this[1] = a[1] + b[1];
    this[2] = a[2] + b[2];
    return this;
  }
  fromSub(a, b) {
    this[0] = a[0] - b[0];
    this[1] = a[1] - b[1];
    this[2] = a[2] - b[2];
    return this;
  }
  fromMul(a, b) {
    this[0] = a[0] * b[0];
    this[1] = a[1] * b[1];
    this[2] = a[2] * b[2];
    return this;
  }
  fromDiv(a, b) {
    this[0] = b[0] != 0 ? a[0] / b[0] : 0;
    this[1] = b[1] != 0 ? a[1] / b[1] : 0;
    this[2] = b[2] != 0 ? a[2] / b[2] : 0;
    return this;
  }
  fromScale(a, s) {
    this[0] = a[0] * s;
    this[1] = a[1] * s;
    this[2] = a[2] * s;
    return this;
  }
  fromDivScale(a, s) {
    if (s != 0) {
      this[0] = a[0] / s;
      this[1] = a[1] / s;
      this[2] = a[2] / s;
    }
    return this;
  }
  fromNorm(v) {
    let mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    if (mag == 0)
      return this;
    mag = 1 / mag;
    this[0] = v[0] * mag;
    this[1] = v[1] * mag;
    this[2] = v[2] * mag;
    return this;
  }
  fromTriNorm(a, b, c) {
    const ab = new _Vec3().fromSub(b, a);
    const ac = new _Vec3().fromSub(c, a);
    return this.fromCross(ab, ac).norm();
  }
  fromNegate(a) {
    this[0] = -a[0];
    this[1] = -a[1];
    this[2] = -a[2];
    return this;
  }
  fromInvert(a) {
    this[0] = 1 / a[0];
    this[1] = 1 / a[1];
    this[2] = 1 / a[2];
    return this;
  }
  fromCross(a, b) {
    const ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
    this[0] = ay * bz - az * by;
    this[1] = az * bx - ax * bz;
    this[2] = ax * by - ay * bx;
    return this;
  }
  fromQuat(q, v) {
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3], vx = v[0], vy = v[1], vz = v[2], x1 = qy * vz - qz * vy, y1 = qz * vx - qx * vz, z1 = qx * vy - qy * vx, x2 = qw * x1 + qy * z1 - qz * y1, y2 = qw * y1 + qz * x1 - qx * z1, z2 = qw * z1 + qx * y1 - qy * x1;
    this[0] = vx + 2 * x2;
    this[1] = vy + 2 * y2;
    this[2] = vz + 2 * z2;
    return this;
  }
  fromAxisAngle(axis, rad, v = _Vec3.FORWARD) {
    const cp = new _Vec3().fromCross(axis, v), dot = _Vec3.dot(axis, v), s = Math.sin(rad), c = Math.cos(rad), ci = 1 - c;
    this[0] = v[0] * c + cp[0] * s + axis[0] * dot * ci;
    this[1] = v[1] * c + cp[1] * s + axis[1] * dot * ci;
    this[2] = v[2] * c + cp[2] * s + axis[2] * dot * ci;
    return this;
  }
  fromOrthogonal(v) {
    if (v[0] >= 0.57735026919) {
      this[0] = v[1];
      this[1] = -v[0];
      this[2] = 0;
    } else {
      this[0] = 0;
      this[1] = v[2];
      this[2] = -v[1];
    }
    return this;
  }
  fromReflect(dir, norm) {
    const factor = -2 * _Vec3.dot(norm, dir);
    this[0] = factor * norm[0] + dir[0];
    this[1] = factor * norm[1] + dir[1];
    this[2] = factor * norm[2] + dir[2];
    return this;
  }
  fromPlaneProj(v, planeNorm, planePos) {
    const planeConst = -_Vec3.dot(planePos, planeNorm);
    const scl = _Vec3.dot(planeNorm, v) + planeConst;
    this.fromScale(planeNorm, -scl).add(v);
    return this;
  }
  add(a) {
    this[0] += a[0];
    this[1] += a[1];
    this[2] += a[2];
    return this;
  }
  sub(v) {
    this[0] -= v[0];
    this[1] -= v[1];
    this[2] -= v[2];
    return this;
  }
  mul(v) {
    this[0] *= v[0];
    this[1] *= v[1];
    this[2] *= v[2];
    return this;
  }
  div(v) {
    this[0] = v[0] != 0 ? this[0] / v[0] : 0;
    this[1] = v[1] != 0 ? this[1] / v[1] : 0;
    this[2] = v[2] != 0 ? this[2] / v[2] : 0;
    return this;
  }
  divScale(v) {
    if (v != 0) {
      this[0] /= v;
      this[1] /= v;
      this[2] /= v;
    } else {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
    }
    return this;
  }
  preDivScale(v) {
    this[0] = this[0] != 0 ? v / this[0] : 0;
    this[1] = this[1] != 0 ? v / this[1] : 0;
    this[2] = this[2] != 0 ? v / this[2] : 0;
    return this;
  }
  scale(v) {
    this[0] *= v;
    this[1] *= v;
    this[2] *= v;
    return this;
  }
  invert() {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    this[2] = 1 / this[2];
    return this;
  }
  abs() {
    this[0] = Math.abs(this[0]);
    this[1] = Math.abs(this[1]);
    this[2] = Math.abs(this[2]);
    return this;
  }
  floor() {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    this[2] = Math.floor(this[2]);
    return this;
  }
  ceil() {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    this[2] = Math.ceil(this[2]);
    return this;
  }
  min(a) {
    this[0] = Math.min(this[0], a[0]);
    this[1] = Math.min(this[1], a[1]);
    this[2] = Math.min(this[2], a[2]);
    return this;
  }
  max(a) {
    this[0] = Math.max(this[0], a[0]);
    this[1] = Math.max(this[1], a[1]);
    this[2] = Math.max(this[2], a[2]);
    return this;
  }
  nearZero() {
    if (Math.abs(this[0]) <= 1e-6)
      this[0] = 0;
    if (Math.abs(this[1]) <= 1e-6)
      this[1] = 0;
    if (Math.abs(this[2]) <= 1e-6)
      this[2] = 0;
    return this;
  }
  negate() {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    return this;
  }
  norm() {
    let mag = Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2);
    if (mag != 0) {
      mag = 1 / mag;
      this[0] *= mag;
      this[1] *= mag;
      this[2] *= mag;
    }
    return this;
  }
  clamp(min, max) {
    this[0] = Math.min(Math.max(this[0], min[0]), max[0]);
    this[1] = Math.min(Math.max(this[1], min[1]), max[1]);
    this[2] = Math.min(Math.max(this[2], min[2]), max[2]);
    return this;
  }
  reflect(norm) {
    const factor = -2 * _Vec3.dot(norm, this);
    this[0] = factor * norm[0] + this[0];
    this[1] = factor * norm[1] + this[1];
    this[2] = factor * norm[2] + this[2];
    return this;
  }
  snap(v) {
    this[0] = v[0] != 0 ? Math.floor(this[0] / v[0]) * v[0] : 0;
    this[1] = v[1] != 0 ? Math.floor(this[1] / v[1]) * v[1] : 0;
    this[2] = v[2] != 0 ? Math.floor(this[2] / v[2]) * v[2] : 0;
    return this;
  }
  dot(b) {
    return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
  }
  damp(v, lambda, dt) {
    const t = Math.exp(-lambda * dt);
    const ti = 1 - t;
    this[0] = this[0] * t + v[0] * ti;
    this[1] = this[1] * t + v[1] * ti;
    this[2] = this[2] * t + v[2] * ti;
    return this;
  }
  axisAngle(axis, rad) {
    const cp = new _Vec3().fromCross(axis, this), dot = _Vec3.dot(axis, this), s = Math.sin(rad), c = Math.cos(rad), ci = 1 - c;
    this[0] = this[0] * c + cp[0] * s + axis[0] * dot * ci;
    this[1] = this[1] * c + cp[1] * s + axis[1] * dot * ci;
    this[2] = this[2] * c + cp[2] * s + axis[2] * dot * ci;
    return this;
  }
  rotate(rad, axis = "x") {
    const sin = Math.sin(rad), cos = Math.cos(rad), x = this[0], y = this[1], z = this[2];
    switch (axis) {
      case "y":
        this[0] = z * sin + x * cos;
        this[2] = z * cos - x * sin;
        break;
      case "x":
        this[1] = y * cos - z * sin;
        this[2] = y * sin + z * cos;
        break;
      case "z":
        this[0] = x * cos - y * sin;
        this[1] = x * sin + y * cos;
        break;
    }
    return this;
  }
  transformMat3(m) {
    const x = this[0], y = this[1], z = this[2];
    this[0] = x * m[0] + y * m[3] + z * m[6];
    this[1] = x * m[1] + y * m[4] + z * m[7];
    this[2] = x * m[2] + y * m[5] + z * m[8];
    return this;
  }
  transformMat4(m) {
    const x = this[0], y = this[1], z = this[2], w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
    this[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    this[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    this[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return this;
  }
  transformQuat(q) {
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3], vx = this[0], vy = this[1], vz = this[2], x1 = qy * vz - qz * vy, y1 = qz * vx - qx * vz, z1 = qx * vy - qy * vx, x2 = qw * x1 + qy * z1 - qz * y1, y2 = qw * y1 + qz * x1 - qx * z1, z2 = qw * z1 + qx * y1 - qy * x1;
    this[0] = vx + 2 * x2;
    this[1] = vy + 2 * y2;
    this[2] = vz + 2 * z2;
    return this;
  }
  static lenSq(a, b) {
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
    const d = this.dot(a, b), c = new _Vec3().fromCross(a, b);
    return Math.atan2(c.len(), d);
  }
  static cross(a, b, out = [0, 0, 0]) {
    const ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
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
};
let Vec3 = _Vec3;
__publicField(Vec3, "BYTESIZE", 3 * Float32Array.BYTES_PER_ELEMENT);
__publicField(Vec3, "AXIS", [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
__publicField(Vec3, "UP", [0, 1, 0]);
__publicField(Vec3, "DOWN", [0, -1, 0]);
__publicField(Vec3, "LEFT", [-1, 0, 0]);
__publicField(Vec3, "RIGHT", [1, 0, 0]);
__publicField(Vec3, "FORWARD", [0, 0, 1]);
__publicField(Vec3, "BACK", [0, 0, -1]);
__publicField(Vec3, "ZERO", [0, 0, 0]);
const _Vec4 = class extends Float32Array {
  constructor(v, y, z, w) {
    super(4);
    if (v instanceof _Vec4 || v instanceof Float32Array || v instanceof Array && v.length == 4) {
      this[0] = v[0];
      this[1] = v[1];
      this[2] = v[2];
      this[3] = v[3];
    } else if (typeof v === "number" && typeof y === "number" && typeof z === "number" && typeof w === "number") {
      this[0] = v;
      this[1] = y;
      this[2] = z;
      this[3] = w;
    } else if (typeof v === "number") {
      this[0] = v;
      this[1] = v;
      this[2] = v;
      this[3] = v;
    }
  }
  xyzw(x, y, z, w) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
    return this;
  }
  get x() {
    return this[0];
  }
  set x(v) {
    this[0] = v;
  }
  get y() {
    return this[1];
  }
  set y(v) {
    this[1] = v;
  }
  get z() {
    return this[2];
  }
  set z(v) {
    this[2] = v;
  }
  get w() {
    return this[3];
  }
  set w(v) {
    this[3] = v;
  }
  clone() {
    return new _Vec4(this);
  }
  reset() {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    return this;
  }
  toString(rnd = 0) {
    if (rnd == 0)
      return "[" + this.join(",") + "]";
    else {
      let s = "[";
      for (let i = 0; i < 4; i++) {
        switch (this[i]) {
          case 0:
            s += "0,";
            break;
          case 1:
            s += "1,";
            break;
          default:
            s += this[i].toFixed(rnd) + ",";
            break;
        }
      }
      return s.slice(0, -1) + "]";
    }
  }
  get lenSqr() {
    return this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2;
  }
  len(v) {
    if (typeof v == "number") {
      return this;
    }
    return Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2);
  }
  fromStruct(v) {
    this[0] = v.x;
    this[1] = v.y;
    this[2] = v.z;
    this[3] = v.w;
    return this;
  }
  toStruct(v) {
    v.x = this[0];
    v.y = this[1];
    v.z = this[2];
    v.w = this[3];
    return this;
  }
  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    this[3] = v[3];
    return this;
  }
  copyTo(v) {
    v[0] = this[0];
    v[1] = this[1];
    v[2] = this[2];
    v[3] = this[3];
    return this;
  }
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    this[2] = ary[idx + 2];
    this[3] = ary[idx + 3];
    return this;
  }
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    ary[idx + 2] = this[2];
    ary[idx + 3] = this[3];
    return this;
  }
  pushTo(ary) {
    ary.push(this[0], this[1], this[2], this[3]);
    return this;
  }
  fromAdd(a, b) {
    this[0] = a[0] + b[0];
    this[1] = a[1] + b[1];
    this[2] = a[2] + b[2];
    this[3] = a[3] + b[3];
    return this;
  }
  fromSub(a, b) {
    this[0] = a[0] - b[0];
    this[1] = a[1] - b[1];
    this[2] = a[2] - b[2];
    this[3] = a[3] - b[3];
    return this;
  }
  fromMul(a, b) {
    this[0] = a[0] * b[0];
    this[1] = a[1] * b[1];
    this[2] = a[2] * b[2];
    this[3] = a[3] * b[3];
    return this;
  }
  fromDiv(a, b) {
    this[0] = b[0] != 0 ? a[0] / b[0] : 0;
    this[1] = b[1] != 0 ? a[1] / b[1] : 0;
    this[2] = b[2] != 0 ? a[2] / b[2] : 0;
    this[3] = b[3] != 0 ? a[3] / b[3] : 0;
    return this;
  }
  fromScale(a, s) {
    this[0] = a[0] * s;
    this[1] = a[1] * s;
    this[2] = a[2] * s;
    this[3] = a[3] * s;
    return this;
  }
  fromDivScale(a, s) {
    if (s != 0) {
      this[0] = a[0] / s;
      this[1] = a[1] / s;
      this[2] = a[2] / s;
      this[3] = a[3] / s;
    }
    return this;
  }
  fromNorm(v) {
    let mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2 + v[3] ** 2);
    if (mag == 0)
      return this;
    mag = 1 / mag;
    this[0] = v[0] * mag;
    this[1] = v[1] * mag;
    this[2] = v[2] * mag;
    this[3] = v[3] * mag;
    return this;
  }
  fromNegate(a) {
    this[0] = -a[0];
    this[1] = -a[1];
    this[2] = -a[2];
    this[3] = -a[3];
    return this;
  }
  add(a) {
    this[0] += a[0];
    this[1] += a[1];
    this[2] += a[2];
    this[3] += a[3];
    return this;
  }
  sub(v) {
    this[0] -= v[0];
    this[1] -= v[1];
    this[2] -= v[2];
    this[3] -= v[3];
    return this;
  }
  mul(v) {
    this[0] *= v[0];
    this[1] *= v[1];
    this[2] *= v[2];
    this[3] *= v[3];
    return this;
  }
  div(v) {
    this[0] = v[0] != 0 ? this[0] / v[0] : 0;
    this[1] = v[1] != 0 ? this[1] / v[1] : 0;
    this[2] = v[2] != 0 ? this[2] / v[2] : 0;
    this[3] = v[3] != 0 ? this[3] / v[3] : 0;
    return this;
  }
  divScale(v) {
    if (v != 0) {
      this[0] /= v;
      this[1] /= v;
      this[2] /= v;
      this[3] /= v;
    } else {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 0;
    }
    return this;
  }
  preDivScale(v) {
    this[0] = this[0] != 0 ? v / this[0] : 0;
    this[1] = this[1] != 0 ? v / this[1] : 0;
    this[2] = this[2] != 0 ? v / this[2] : 0;
    this[3] = this[3] != 0 ? v / this[3] : 0;
    return this;
  }
  scale(v) {
    this[0] *= v;
    this[1] *= v;
    this[2] *= v;
    this[3] *= v;
    return this;
  }
  abs() {
    this[0] = Math.abs(this[0]);
    this[1] = Math.abs(this[1]);
    this[2] = Math.abs(this[2]);
    this[3] = Math.abs(this[3]);
    return this;
  }
  floor() {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    this[2] = Math.floor(this[2]);
    this[3] = Math.floor(this[3]);
    return this;
  }
  ceil() {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    this[2] = Math.ceil(this[2]);
    this[3] = Math.ceil(this[3]);
    return this;
  }
  nearZero() {
    if (Math.abs(this[0]) <= 1e-6)
      this[0] = 0;
    if (Math.abs(this[1]) <= 1e-6)
      this[1] = 0;
    if (Math.abs(this[2]) <= 1e-6)
      this[2] = 0;
    if (Math.abs(this[3]) <= 1e-6)
      this[3] = 0;
    return this;
  }
  negate() {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    this[3] = -this[3];
    return this;
  }
  norm() {
    let mag = Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2);
    if (mag != 0) {
      mag = 1 / mag;
      this[0] *= mag;
      this[1] *= mag;
      this[2] *= mag;
      this[3] *= mag;
    }
    return this;
  }
  clamp(min, max) {
    this[0] = Math.min(Math.max(this[0], min[0]), max[0]);
    this[1] = Math.min(Math.max(this[1], min[1]), max[1]);
    this[2] = Math.min(Math.max(this[2], min[2]), max[2]);
    this[3] = Math.min(Math.max(this[3], min[3]), max[3]);
    return this;
  }
  snap(v) {
    this[0] = v[0] != 0 ? Math.floor(this[0] / v[0]) * v[0] : 0;
    this[1] = v[1] != 0 ? Math.floor(this[1] / v[1]) * v[1] : 0;
    this[2] = v[2] != 0 ? Math.floor(this[2] / v[2]) * v[2] : 0;
    this[3] = v[3] != 0 ? Math.floor(this[3] / v[3]) * v[3] : 0;
    return this;
  }
};
let Vec4 = _Vec4;
__publicField(Vec4, "BYTESIZE", 4 * Float32Array.BYTES_PER_ELEMENT);
const _Quat = class extends Float32Array {
  constructor(v) {
    super(4);
    if (v instanceof _Quat || v instanceof Float32Array || v instanceof Array && v.length == 4) {
      this[0] = v[0];
      this[1] = v[1];
      this[2] = v[2];
      this[3] = v[3];
    } else {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 1;
    }
  }
  xyzw(x, y, z, w) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
    return this;
  }
  get x() {
    return this[0];
  }
  set x(v) {
    this[0] = v;
  }
  get y() {
    return this[1];
  }
  set y(v) {
    this[1] = v;
  }
  get z() {
    return this[2];
  }
  set z(v) {
    this[2] = v;
  }
  get w() {
    return this[3];
  }
  set w(v) {
    this[3] = v;
  }
  clone() {
    return new _Quat(this);
  }
  reset() {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    return this;
  }
  toString(rnd = 0) {
    if (rnd == 0)
      return "[" + this.join(",") + "]";
    else {
      let s = "[";
      for (let i = 0; i < 4; i++) {
        switch (this[i]) {
          case 0:
            s += "0,";
            break;
          case 1:
            s += "1,";
            break;
          default:
            s += this[i].toFixed(rnd) + ",";
            break;
        }
      }
      return s.slice(0, -1) + "]";
    }
  }
  isZero() {
    return this[0] == 0 && this[1] == 0 && this[2] == 0 && this[3] == 0;
  }
  lenSqr() {
    return this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2;
  }
  len() {
    return Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2);
  }
  fromStruct(v) {
    this[0] = v.x;
    this[1] = v.y;
    this[2] = v.z;
    this[3] = v.w;
    return this;
  }
  toStruct(v) {
    v.x = this[0];
    v.y = this[1];
    v.z = this[2];
    v.w = this[3];
    return this;
  }
  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    this[3] = v[3];
    return this;
  }
  copyTo(v) {
    v[0] = this[0];
    v[1] = this[1];
    v[2] = this[2];
    v[3] = this[3];
    return this;
  }
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    this[2] = ary[idx + 2];
    this[3] = ary[idx + 3];
    return this;
  }
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    ary[idx + 2] = this[2];
    ary[idx + 3] = this[3];
    return this;
  }
  pushTo(ary) {
    ary.push(this[0], this[1], this[2], this[3]);
    return this;
  }
  getAxisAngle() {
    if (this[3] > 1)
      this.norm();
    const angle = 2 * Math.acos(this[3]), s = Math.sqrt(1 - this[3] * this[3]);
    if (s < 1e-3)
      return [1, 0, 0, 0];
    return [this[0] / s, this[1] / s, this[2] / s, angle];
  }
  getAngle() {
    if (this[3] > 1)
      this.norm();
    return 2 * Math.acos(this[3]);
  }
  getAxis(out) {
    if (this[3] > 1)
      this.norm();
    const s = Math.sqrt(1 - this[3] ** 2);
    out = out || [0, 0, 0];
    if (s < 1e-3) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
    } else {
      out[0] = this[0] / s;
      out[1] = this[1] / s;
      out[2] = this[2] / s;
    }
    return out;
  }
  fromPolar(lon, lat, up) {
    lat = Math.max(Math.min(lat, 89.999999), -89.999999);
    const phi = (90 - lat) * 0.01745329251, theta = lon * 0.01745329251, phi_s = Math.sin(phi), v = [
      -(phi_s * Math.sin(theta)),
      Math.cos(phi),
      phi_s * Math.cos(theta)
    ];
    this.fromLook(v, up || Vec3.UP);
    return this;
  }
  toPolar() {
    const fwd = new Vec3().fromQuat(this, Vec3.FORWARD);
    const flat = new Vec3(fwd.x, 0, fwd.z).norm();
    let lon = Vec3.angle(Vec3.FORWARD, flat);
    let lat = Vec3.angle(flat, fwd);
    const d_side = Vec3.dot(fwd, Vec3.RIGHT);
    const d_up = Vec3.dot(fwd, Vec3.UP);
    if (d_side < 0)
      lon = -lon;
    if (d_up < 0)
      lat = -lat;
    if (d_up > 0.999 || d_up <= -0.999)
      lon = 0;
    const to_deg = 180 / Math.PI;
    return [lon * to_deg, lat * to_deg];
  }
  fromAxis(xAxis, yAxis, zAxis) {
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
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
    return this;
  }
  fromLook(vDir, vUp) {
    const up = new Vec3(vUp), zAxis = new Vec3(vDir), xAxis = new Vec3(), yAxis = new Vec3();
    xAxis.fromCross(up, zAxis);
    yAxis.fromCross(zAxis, xAxis);
    xAxis.norm();
    yAxis.norm();
    zAxis.norm();
    const m00 = xAxis.x, m01 = xAxis.y, m02 = xAxis.z, m10 = yAxis.x, m11 = yAxis.y, m12 = yAxis.z, m20 = zAxis.x, m21 = zAxis.y, m22 = zAxis.z, t = m00 + m11 + m22;
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
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
    return this;
  }
  fromInvert(q) {
    const a0 = q[0], a1 = q[1], a2 = q[2], a3 = q[3], dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    if (dot == 0) {
      this[0] = this[1] = this[2] = this[3] = 0;
      return this;
    }
    const invDot = 1 / dot;
    this[0] = -a0 * invDot;
    this[1] = -a1 * invDot;
    this[2] = -a2 * invDot;
    this[3] = a3 * invDot;
    return this;
  }
  fromNegate(q) {
    this[0] = -q[0];
    this[1] = -q[1];
    this[2] = -q[2];
    this[3] = -q[3];
    return this;
  }
  fromAxisAngle(axis, angle) {
    const half = angle * 0.5, s = Math.sin(half);
    this[0] = axis[0] * s;
    this[1] = axis[1] * s;
    this[2] = axis[2] * s;
    this[3] = Math.cos(half);
    return this;
  }
  fromUnitVecs(a, b) {
    const dot = Vec3.dot(a, b);
    if (dot < -0.999999) {
      const tmp = Vec3.cross(Vec3.LEFT, a);
      if (Vec3.len(tmp) < 1e-6)
        Vec3.cross(Vec3.UP, a, tmp);
      this.fromAxisAngle(Vec3.norm(tmp), Math.PI);
    } else if (dot > 0.999999) {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 1;
    } else {
      const v = Vec3.cross(a, b);
      this[0] = v[0];
      this[1] = v[1];
      this[2] = v[2];
      this[3] = 1 + dot;
      this.norm();
    }
    return this;
  }
  fromMat3(m) {
    let fRoot;
    const fTrace = m[0] + m[4] + m[8];
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      this[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      this[0] = (m[5] - m[7]) * fRoot;
      this[1] = (m[6] - m[2]) * fRoot;
      this[2] = (m[1] - m[3]) * fRoot;
    } else {
      let i = 0;
      if (m[4] > m[0])
        i = 1;
      if (m[8] > m[i * 3 + i])
        i = 2;
      const j = (i + 1) % 3;
      const k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
      this[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      this[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      this[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      this[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return this;
  }
  fromMat4(mat) {
    const trace = mat[0] + mat[5] + mat[10];
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      this[3] = 0.25 * S;
      this[0] = (mat[6] - mat[9]) / S;
      this[1] = (mat[8] - mat[2]) / S;
      this[2] = (mat[1] - mat[4]) / S;
    } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
      S = Math.sqrt(1 + mat[0] - mat[5] - mat[10]) * 2;
      this[3] = (mat[6] - mat[9]) / S;
      this[0] = 0.25 * S;
      this[1] = (mat[1] + mat[4]) / S;
      this[2] = (mat[8] + mat[2]) / S;
    } else if (mat[5] > mat[10]) {
      S = Math.sqrt(1 + mat[5] - mat[0] - mat[10]) * 2;
      this[3] = (mat[8] - mat[2]) / S;
      this[0] = (mat[1] + mat[4]) / S;
      this[1] = 0.25 * S;
      this[2] = (mat[6] + mat[9]) / S;
    } else {
      S = Math.sqrt(1 + mat[10] - mat[0] - mat[5]) * 2;
      this[3] = (mat[1] - mat[4]) / S;
      this[0] = (mat[8] + mat[2]) / S;
      this[1] = (mat[6] + mat[9]) / S;
      this[2] = 0.25 * S;
    }
    return this;
  }
  getEuler(out, inDeg = false) {
    let pitch = 0, yaw = 0, roll = 0;
    const x = this[0], y = this[1], z = this[2], w = this[3], test = x * y + z * w;
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
    out = out || [0, 0, 0];
    out[0] = roll * deg;
    out[1] = pitch * deg;
    out[2] = yaw * deg;
    return out;
  }
  fromEuler(x, y, z) {
    let xx = 0, yy = 0, zz = 0;
    if (x instanceof Vec3 || x instanceof Float32Array || x instanceof Array && x.length == 3) {
      xx = x[0] * 0.01745329251 * 0.5;
      yy = x[1] * 0.01745329251 * 0.5;
      zz = x[2] * 0.01745329251 * 0.5;
    } else if (typeof x === "number" && typeof y === "number" && typeof z === "number") {
      xx = x * 0.01745329251 * 0.5;
      yy = y * 0.01745329251 * 0.5;
      zz = z * 0.01745329251 * 0.5;
    }
    const c1 = Math.cos(xx), c2 = Math.cos(yy), c3 = Math.cos(zz), s1 = Math.sin(xx), s2 = Math.sin(yy), s3 = Math.sin(zz);
    this[0] = s1 * c2 * c3 + c1 * s2 * s3;
    this[1] = c1 * s2 * c3 - s1 * c2 * s3;
    this[2] = c1 * c2 * s3 - s1 * s2 * c3;
    this[3] = c1 * c2 * c3 + s1 * s2 * s3;
    return this.norm();
  }
  fromEulerXY(x, y) {
    const xx = x * 0.01745329251 * 0.5, yy = y * 0.01745329251 * 0.5, c1 = Math.cos(xx), c2 = Math.cos(yy), s1 = Math.sin(xx), s2 = Math.sin(yy);
    this[0] = s1 * c2;
    this[1] = c1 * s2;
    this[2] = -s1 * s2;
    this[3] = c1 * c2;
    return this.norm();
  }
  fromEulerOrder(x, y, z, order = "YXZ") {
    const c1 = Math.cos(x * 0.5), c2 = Math.cos(y * 0.5), c3 = Math.cos(z * 0.5), s1 = Math.sin(x * 0.5), s2 = Math.sin(y * 0.5), s3 = Math.sin(z * 0.5);
    switch (order) {
      case "XYZ":
        this[0] = s1 * c2 * c3 + c1 * s2 * s3;
        this[1] = c1 * s2 * c3 - s1 * c2 * s3;
        this[2] = c1 * c2 * s3 + s1 * s2 * c3;
        this[3] = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "YXZ":
        this[0] = s1 * c2 * c3 + c1 * s2 * s3;
        this[1] = c1 * s2 * c3 - s1 * c2 * s3;
        this[2] = c1 * c2 * s3 - s1 * s2 * c3;
        this[3] = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "ZXY":
        this[0] = s1 * c2 * c3 - c1 * s2 * s3;
        this[1] = c1 * s2 * c3 + s1 * c2 * s3;
        this[2] = c1 * c2 * s3 + s1 * s2 * c3;
        this[3] = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "ZYX":
        this[0] = s1 * c2 * c3 - c1 * s2 * s3;
        this[1] = c1 * s2 * c3 + s1 * c2 * s3;
        this[2] = c1 * c2 * s3 - s1 * s2 * c3;
        this[3] = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "YZX":
        this[0] = s1 * c2 * c3 + c1 * s2 * s3;
        this[1] = c1 * s2 * c3 + s1 * c2 * s3;
        this[2] = c1 * c2 * s3 - s1 * s2 * c3;
        this[3] = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "XZY":
        this[0] = s1 * c2 * c3 - c1 * s2 * s3;
        this[1] = c1 * s2 * c3 - s1 * c2 * s3;
        this[2] = c1 * c2 * s3 + s1 * s2 * c3;
        this[3] = c1 * c2 * c3 + s1 * s2 * s3;
        break;
    }
    return this.norm();
  }
  fromAngularVec(v) {
    let len = Vec3.len(v);
    if (len < 1e-6) {
      this.reset();
      return this;
    }
    const h = 0.5 * len;
    const s = Math.sin(h);
    const c = Math.cos(h);
    len = 1 / len;
    this[0] = s * (v[0] * len);
    this[1] = s * (v[1] * len);
    this[2] = s * (v[2] * len);
    this[3] = c;
    return this;
  }
  toAngularVec(out) {
    const v = this.getAxisAngle();
    out = out || new Vec3();
    return out.fromScale(v, v[3]);
  }
  fromMul(a, b) {
    const ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  fromNBlend(a, b, t) {
    const a_x = a[0], a_y = a[1], a_z = a[2], a_w = a[3], b_x = b[0], b_y = b[1], b_z = b[2], b_w = b[3], dot = a_x * b_x + a_y * b_y + a_z * b_z + a_w * b_w, ti = 1 - t;
    let s = 1;
    if (dot < 0)
      s = -1;
    this[0] = ti * a_x + t * b_x * s;
    this[1] = ti * a_y + t * b_y * s;
    this[2] = ti * a_z + t * b_z * s;
    this[3] = ti * a_w + t * b_w * s;
    return this.norm();
  }
  fromLerp(a, b, t) {
    const ti = 1 - t;
    this[0] = a[0] * ti + b[0] * t;
    this[1] = a[1] * ti + b[1] * t;
    this[2] = a[2] * ti + b[2] * t;
    this[3] = a[3] * ti + b[3] * t;
    return this;
  }
  fromNLerp(a, b, t) {
    const ti = 1 - t;
    this[0] = a[0] * ti + b[0] * t;
    this[1] = a[1] * ti + b[1] * t;
    this[2] = a[2] * ti + b[2] * t;
    this[3] = a[3] * ti + b[3] * t;
    return this.norm();
  }
  fromSlerp(a, b, t) {
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
    this[0] = scale0 * ax + scale1 * bx;
    this[1] = scale0 * ay + scale1 * by;
    this[2] = scale0 * az + scale1 * bz;
    this[3] = scale0 * aw + scale1 * bw;
    return this;
  }
  norm() {
    let len = this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      this[0] *= len;
      this[1] *= len;
      this[2] *= len;
      this[3] *= len;
    }
    return this;
  }
  invert() {
    const a0 = this[0], a1 = this[1], a2 = this[2], a3 = this[3], dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    if (dot == 0) {
      this[0] = this[1] = this[2] = this[3] = 0;
      return this;
    }
    const invDot = 1 / dot;
    this[0] = -a0 * invDot;
    this[1] = -a1 * invDot;
    this[2] = -a2 * invDot;
    this[3] = a3 * invDot;
    return this;
  }
  negate() {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    this[3] = -this[3];
    return this;
  }
  dotNegate(q) {
    if (_Quat.dot(this, q) < 0)
      this.negate();
    return this;
  }
  conjugate() {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    return this;
  }
  mirrorX() {
    this[1] = -this[1];
    this[2] = -this[2];
    return this;
  }
  random() {
    const u1 = Math.random(), u2 = Math.random(), u3 = Math.random(), r1 = Math.sqrt(1 - u1), r2 = Math.sqrt(u1);
    this[0] = r1 * Math.sin(6.283185307179586 * u2);
    this[1] = r1 * Math.cos(6.283185307179586 * u2);
    this[2] = r2 * Math.sin(6.283185307179586 * u3);
    this[3] = r2 * Math.cos(6.283185307179586 * u3);
    return this;
  }
  scaleAngle(scl) {
    if (this[3] > 1)
      this.norm();
    const angle = 2 * Math.acos(this[3]), len = 1 / Math.sqrt(this[0] ** 2 + this[1] ** 2 + this[2] ** 2), half = angle * scl * 0.5, s = Math.sin(half);
    this[0] = this[0] * len * s;
    this[1] = this[1] * len * s;
    this[2] = this[2] * len * s;
    this[3] = Math.cos(half);
    return this;
  }
  transformVec3(v) {
    const qx = this[0], qy = this[1], qz = this[2], qw = this[3], vx = v[0], vy = v[1], vz = v[2], x1 = qy * vz - qz * vy, y1 = qz * vx - qx * vz, z1 = qx * vy - qy * vx, x2 = qw * x1 + qy * z1 - qz * y1, y2 = qw * y1 + qz * x1 - qx * z1, z2 = qw * z1 + qx * y1 - qy * x1;
    v[0] = vx + 2 * x2;
    v[1] = vy + 2 * y2;
    v[2] = vz + 2 * z2;
    return this;
  }
  rotX(rad) {
    rad *= 0.5;
    const ax = this[0], ay = this[1], az = this[2], aw = this[3], bx = Math.sin(rad), bw = Math.cos(rad);
    this[0] = ax * bw + aw * bx;
    this[1] = ay * bw + az * bx;
    this[2] = az * bw - ay * bx;
    this[3] = aw * bw - ax * bx;
    return this;
  }
  rotY(rad) {
    rad *= 0.5;
    const ax = this[0], ay = this[1], az = this[2], aw = this[3], by = Math.sin(rad), bw = Math.cos(rad);
    this[0] = ax * bw - az * by;
    this[1] = ay * bw + aw * by;
    this[2] = az * bw + ax * by;
    this[3] = aw * bw - ay * by;
    return this;
  }
  rotZ(rad) {
    rad *= 0.5;
    const ax = this[0], ay = this[1], az = this[2], aw = this[3], bz = Math.sin(rad), bw = Math.cos(rad);
    this[0] = ax * bw + ay * bz;
    this[1] = ay * bw - ax * bz;
    this[2] = az * bw + aw * bz;
    this[3] = aw * bw - az * bz;
    return this;
  }
  rotDeg(deg, axis = "y") {
    const rad = deg * Math.PI / 180;
    switch (axis) {
      case "x":
        this.rotX(rad);
        break;
      case "y":
        this.rotY(rad);
        break;
      case "z":
        this.rotZ(rad);
        break;
    }
    return this;
  }
  mul(q) {
    const ax = this[0], ay = this[1], az = this[2], aw = this[3], bx = q[0], by = q[1], bz = q[2], bw = q[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  pmul(q) {
    const ax = q[0], ay = q[1], az = q[2], aw = q[3], bx = this[0], by = this[1], bz = this[2], bw = this[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  mulAxisAngle(axis, angle) {
    const half = angle * 0.5, s = Math.sin(half), bx = axis[0] * s, by = axis[1] * s, bz = axis[2] * s, bw = Math.cos(half), ax = this[0], ay = this[1], az = this[2], aw = this[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  pmulAxisAngle(axis, angle) {
    const half = angle * 0.5, s = Math.sin(half), ax = axis[0] * s, ay = axis[1] * s, az = axis[2] * s, aw = Math.cos(half), bx = this[0], by = this[1], bz = this[2], bw = this[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  pmulInvert(q) {
    let ax = q[0], ay = q[1], az = q[2], aw = q[3];
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
    const bx = this[0], by = this[1], bz = this[2], bw = this[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  mulUnitVecs(a, b) {
    const dot = Vec3.dot(a, b);
    const ax = this[0], ay = this[1], az = this[2], aw = this[3];
    let bx, by, bz, bw;
    if (dot < -0.999999) {
      const axis = Vec3.cross(Vec3.LEFT, a);
      if (Vec3.len(axis) < 1e-6)
        Vec3.cross(Vec3.UP, a, axis);
      Vec3.norm(axis);
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
      const v = Vec3.cross(a, b);
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
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  static dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  static lenSqr(a, b) {
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 + (a[3] - b[3]) ** 2;
  }
};
let Quat = _Quat;
__publicField(Quat, "BYTESIZE", 4 * Float32Array.BYTES_PER_ELEMENT);
const _DualQuat = class extends Float32Array {
  constructor(q, t) {
    super(8);
    if (q && t)
      this.fromQuatTran(q, t);
    else if (q) {
      this[0] = q[0];
      this[1] = q[1];
      this[2] = q[2];
      this[3] = q[3];
    } else
      this[3] = 1;
  }
  reset() {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    this[4] = 0;
    this[5] = 0;
    this[6] = 0;
    this[7] = 0;
    return this;
  }
  clone() {
    const out = new _DualQuat();
    out[0] = this[0];
    out[1] = this[1];
    out[2] = this[2];
    out[3] = this[3];
    out[4] = this[4];
    out[5] = this[5];
    out[6] = this[6];
    out[7] = this[7];
    return out;
  }
  copy(a) {
    this[0] = a[0];
    this[1] = a[1];
    this[2] = a[2];
    this[3] = a[3];
    this[4] = a[4];
    this[5] = a[5];
    this[6] = a[6];
    this[7] = a[7];
    return this;
  }
  lenSqr() {
    return this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3];
  }
  getTranslation(out) {
    const ax = this[4], ay = this[5], az = this[6], aw = this[7], bx = -this[0], by = -this[1], bz = -this[2], bw = this[3];
    out = out || new Array(3);
    out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    return out;
  }
  getQuat(out) {
    out = out || [0, 0, 0, 0];
    out[0] = this[0];
    out[1] = this[1];
    out[2] = this[2];
    out[3] = this[3];
    return out;
  }
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    this[2] = ary[idx + 2];
    this[3] = ary[idx + 3];
    this[4] = ary[idx + 4];
    this[5] = ary[idx + 5];
    this[6] = ary[idx + 6];
    this[7] = ary[idx + 7];
    return this;
  }
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    ary[idx + 2] = this[2];
    ary[idx + 3] = this[3];
    ary[idx + 4] = this[4];
    ary[idx + 5] = this[5];
    ary[idx + 6] = this[6];
    ary[idx + 7] = this[7];
    return this;
  }
  fromQuatTran(q, t) {
    const ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5, bx = q[0], by = q[1], bz = q[2], bw = q[3];
    this[0] = bx;
    this[1] = by;
    this[2] = bz;
    this[3] = bw;
    this[4] = ax * bw + ay * bz - az * by;
    this[5] = ay * bw + az * bx - ax * bz;
    this[6] = az * bw + ax * by - ay * bx;
    this[7] = -ax * bx - ay * by - az * bz;
    return this;
  }
  fromTranslation(t) {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    this[4] = t[0] * 0.5;
    this[5] = t[1] * 0.5;
    this[6] = t[2] * 0.5;
    this[7] = 0;
    return this;
  }
  fromQuat(q) {
    this[0] = q[0];
    this[1] = q[1];
    this[2] = q[2];
    this[3] = q[3];
    this[4] = 0;
    this[5] = 0;
    this[6] = 0;
    this[7] = 0;
    return this;
  }
  fromMul(a, b) {
    const ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3], bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7];
    this[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
    this[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
    this[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
    this[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
    this[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
    this[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
    this[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
    this[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
    return this;
  }
  fromNorm(a) {
    let magnitude = a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + a[3] ** 2;
    if (magnitude == 0)
      return this;
    magnitude = 1 / Math.sqrt(magnitude);
    const a0 = a[0] * magnitude;
    const a1 = a[1] * magnitude;
    const a2 = a[2] * magnitude;
    const a3 = a[3] * magnitude;
    const b0 = a[4];
    const b1 = a[5];
    const b2 = a[6];
    const b3 = a[7];
    const a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    this[0] = a0;
    this[1] = a1;
    this[2] = a2;
    this[3] = a3;
    this[4] = (b0 - a0 * a_dot_b) * magnitude;
    this[5] = (b1 - a1 * a_dot_b) * magnitude;
    this[6] = (b2 - a2 * a_dot_b) * magnitude;
    this[7] = (b3 - a3 * a_dot_b) * magnitude;
    return this;
  }
  fromInvert(a) {
    const sqlen = 1 / a.lenSqr();
    this[0] = -a[0] * sqlen;
    this[1] = -a[1] * sqlen;
    this[2] = -a[2] * sqlen;
    this[3] = a[3] * sqlen;
    this[4] = -a[4] * sqlen;
    this[5] = -a[5] * sqlen;
    this[6] = -a[6] * sqlen;
    this[7] = a[7] * sqlen;
    return this;
  }
  fromConjugate(a) {
    this[0] = -a[0];
    this[1] = -a[1];
    this[2] = -a[2];
    this[3] = a[3];
    this[4] = -a[4];
    this[5] = -a[5];
    this[6] = -a[6];
    this[7] = a[7];
    return this;
  }
  add(q) {
    this[0] = this[0] + q[0];
    this[1] = this[1] + q[1];
    this[2] = this[2] + q[2];
    this[3] = this[3] + q[3];
    this[4] = this[4] + q[4];
    this[5] = this[5] + q[5];
    this[6] = this[6] + q[6];
    this[7] = this[7] + q[7];
    return this;
  }
  mul(q) {
    const ax0 = this[0], ay0 = this[1], az0 = this[2], aw0 = this[3], ax1 = this[4], ay1 = this[5], az1 = this[6], aw1 = this[7], bx0 = q[0], by0 = q[1], bz0 = q[2], bw0 = q[3], bx1 = q[4], by1 = q[5], bz1 = q[6], bw1 = q[7];
    this[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
    this[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
    this[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
    this[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
    this[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
    this[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
    this[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
    this[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
    return this;
  }
  pmul(q) {
    const ax0 = q[0], ay0 = q[1], az0 = q[2], aw0 = q[3], ax1 = q[4], ay1 = q[5], az1 = q[6], aw1 = q[7], bx0 = this[0], by0 = this[1], bz0 = this[2], bw0 = this[3], bx1 = this[4], by1 = this[5], bz1 = this[6], bw1 = this[7];
    this[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
    this[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
    this[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
    this[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
    this[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
    this[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
    this[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
    this[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
    return this;
  }
  scale(s) {
    this[0] = this[0] * s;
    this[1] = this[1] * s;
    this[2] = this[2] * s;
    this[3] = this[3] * s;
    this[4] = this[4] * s;
    this[5] = this[5] * s;
    this[6] = this[6] * s;
    this[7] = this[7] * s;
    return this;
  }
  norm() {
    let magnitude = this[0] ** 2 + this[1] ** 2 + this[2] ** 2 + this[3] ** 2;
    if (magnitude == 0)
      return this;
    magnitude = 1 / Math.sqrt(magnitude);
    const a0 = this[0] * magnitude;
    const a1 = this[1] * magnitude;
    const a2 = this[2] * magnitude;
    const a3 = this[3] * magnitude;
    const b0 = this[4];
    const b1 = this[5];
    const b2 = this[6];
    const b3 = this[7];
    const a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    this[0] = a0;
    this[1] = a1;
    this[2] = a2;
    this[3] = a3;
    this[4] = (b0 - a0 * a_dot_b) * magnitude;
    this[5] = (b1 - a1 * a_dot_b) * magnitude;
    this[6] = (b2 - a2 * a_dot_b) * magnitude;
    this[7] = (b3 - a3 * a_dot_b) * magnitude;
    return this;
  }
  invert() {
    const sqlen = 1 / this.lenSqr();
    this[0] = -this[0] * sqlen;
    this[1] = -this[1] * sqlen;
    this[2] = -this[2] * sqlen;
    this[3] = this[3] * sqlen;
    this[4] = -this[4] * sqlen;
    this[5] = -this[5] * sqlen;
    this[6] = -this[6] * sqlen;
    this[7] = this[7] * sqlen;
    return this;
  }
  conjugate() {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    this[4] = -this[4];
    this[5] = -this[5];
    this[6] = -this[6];
    return this;
  }
  translate(v) {
    const ax1 = this[0], ay1 = this[1], az1 = this[2], aw1 = this[3], ax2 = this[4], ay2 = this[5], az2 = this[6], aw2 = this[7], bx1 = v[0] * 0.5, by1 = v[1] * 0.5, bz1 = v[2] * 0.5;
    this[0] = ax1;
    this[1] = ay1;
    this[2] = az1;
    this[3] = aw1;
    this[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
    this[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
    this[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
    this[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
    return this;
  }
  mulQuat(q) {
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    let ax = this[0], ay = this[1], az = this[2], aw = this[3];
    this[0] = ax * qw + aw * qx + ay * qz - az * qy;
    this[1] = ay * qw + aw * qy + az * qx - ax * qz;
    this[2] = az * qw + aw * qz + ax * qy - ay * qx;
    this[3] = aw * qw - ax * qx - ay * qy - az * qz;
    ax = this[4];
    ay = this[5];
    az = this[6];
    aw = this[7];
    this[4] = ax * qw + aw * qx + ay * qz - az * qy;
    this[5] = ay * qw + aw * qy + az * qx - ax * qz;
    this[6] = az * qw + aw * qz + ax * qy - ay * qx;
    this[7] = aw * qw - ax * qx - ay * qy - az * qz;
    return this;
  }
  pmulQuat(q) {
    const qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    let bx = this[0], by = this[1], bz = this[2], bw = this[3];
    this[0] = qx * bw + qw * bx + qy * bz - qz * by;
    this[1] = qy * bw + qw * by + qz * bx - qx * bz;
    this[2] = qz * bw + qw * bz + qx * by - qy * bx;
    this[3] = qw * bw - qx * bx - qy * by - qz * bz;
    bx = this[4];
    by = this[5];
    bz = this[6];
    bw = this[7];
    this[4] = qx * bw + qw * bx + qy * bz - qz * by;
    this[5] = qy * bw + qw * by + qz * bx - qx * bz;
    this[6] = qz * bw + qw * bz + qx * by - qy * bx;
    this[7] = qw * bw - qx * bx - qy * by - qz * bz;
    return this;
  }
  rotX(rad) {
    const bbx = this[0], bby = this[1], bbz = this[2], bbw = this[3];
    let bx = -this[0], by = -this[1], bz = -this[2], bw = this[3];
    const ax = this[4], ay = this[5], az = this[6], aw = this[7];
    const ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rad *= 0.5;
    const sin = Math.sin(rad), cos = Math.cos(rad);
    bx = this[0] = bbx * cos + bbw * sin;
    by = this[1] = bby * cos + bbz * sin;
    bz = this[2] = bbz * cos - bby * sin;
    bw = this[3] = bbw * cos - bbx * sin;
    this[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    this[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    this[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    this[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return this;
  }
  rotY(rad) {
    const bbx = this[0], bby = this[1], bbz = this[2], bbw = this[3];
    let bx = -this[0], by = -this[1], bz = -this[2], bw = this[3];
    const ax = this[4], ay = this[5], az = this[6], aw = this[7];
    const ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rad *= 0.5;
    const sin = Math.sin(rad), cos = Math.cos(rad);
    bx = this[0] = bbx * cos - bbz * sin;
    by = this[1] = bby * cos + bbw * sin;
    bz = this[2] = bbz * cos + bbx * sin;
    bw = this[3] = bbw * cos - bby * sin;
    this[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    this[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    this[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    this[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return this;
  }
  rotZ(rad) {
    const bbx = this[0], bby = this[1], bbz = this[2], bbw = this[3];
    let bx = -this[0], by = -this[1], bz = -this[2], bw = this[3];
    const ax = this[4], ay = this[5], az = this[6], aw = this[7];
    const ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rad *= 0.5;
    const sin = Math.sin(rad), cos = Math.cos(rad);
    bx = this[0] = bbx * cos + bby * sin;
    by = this[1] = bby * cos - bbx * sin;
    bz = this[2] = bbz * cos + bbw * sin;
    bw = this[3] = bbw * cos - bbz * sin;
    this[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    this[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    this[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    this[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return this;
  }
  rotAxisAngle(axis, rad) {
    if (Math.abs(rad) < 1e-6)
      return this;
    const axisLength = 1 / Math.sqrt(axis[0] ** 2 + axis[1] ** 2 + axis[2] ** 2);
    rad = rad * 0.5;
    const s = Math.sin(rad);
    const bx = s * axis[0] * axisLength;
    const by = s * axis[1] * axisLength;
    const bz = s * axis[2] * axisLength;
    const bw = Math.cos(rad);
    const ax1 = this[0], ay1 = this[1], az1 = this[2], aw1 = this[3];
    const ax = this[4], ay = this[5], az = this[6], aw = this[7];
    this[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    this[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    this[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    this[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    this[4] = ax * bw + aw * bx + ay * bz - az * by;
    this[5] = ay * bw + aw * by + az * bx - ax * bz;
    this[6] = az * bw + aw * bz + ax * by - ay * bx;
    this[7] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  transformVec3(v, out) {
    const pos = this.getTranslation();
    const qx = this[0], qy = this[1], qz = this[2], qw = this[3], vx = v[0], vy = v[1], vz = v[2], x1 = qy * vz - qz * vy, y1 = qz * vx - qx * vz, z1 = qx * vy - qy * vx, x2 = qw * x1 + qy * z1 - qz * y1, y2 = qw * y1 + qz * x1 - qx * z1, z2 = qw * z1 + qx * y1 - qy * x1;
    out = out || v;
    out[0] = vx + 2 * x2 + pos[0];
    out[1] = vy + 2 * y2 + pos[1];
    out[2] = vz + 2 * z2 + pos[2];
    return out;
  }
};
let DualQuat = _DualQuat;
__publicField(DualQuat, "BYTESIZE", 8 * Float32Array.BYTES_PER_ELEMENT);
const _Transform = class {
  constructor(rot, pos, scl) {
    __publicField(this, "rot", new Quat());
    __publicField(this, "pos", new Vec3());
    __publicField(this, "scl", new Vec3(1, 1, 1));
    if (rot instanceof _Transform) {
      this.copy(rot);
    } else if (rot && pos && scl) {
      this.set(rot, pos, scl);
    }
  }
  reset() {
    this.rot.xyzw(0, 0, 0, 1);
    this.pos.xyz(0, 0, 0);
    this.scl.xyz(1, 1, 1);
    return this;
  }
  copy(t) {
    this.rot.copy(t.rot);
    this.pos.copy(t.pos);
    this.scl.copy(t.scl);
    return this;
  }
  set(r, p, s) {
    if (r)
      this.rot.copy(r);
    if (p)
      this.pos.copy(p);
    if (s)
      this.scl.copy(s);
    return this;
  }
  clone() {
    return new _Transform(this);
  }
  mul(cr, cp, cs) {
    if (cr instanceof _Transform) {
      cp = cr.pos;
      cs = cr.scl;
      cr = cr.rot;
    }
    if (cr && cp) {
      this.pos.add(new Vec3().fromMul(this.scl, cp).transformQuat(this.rot));
      if (cs)
        this.scl.mul(cs);
      this.rot.mul(cr);
    }
    return this;
  }
  pmul(pr, pp, ps) {
    if (pr instanceof _Transform) {
      pp = pr.pos;
      ps = pr.scl;
      pr = pr.rot;
    }
    if (!pr || !pp || !ps)
      return this;
    this.pos.mul(ps).transformQuat(pr).add(pp);
    if (ps)
      this.scl.mul(ps);
    this.rot.pmul(pr);
    return this;
  }
  addPos(cp, ignoreScl = false) {
    if (ignoreScl)
      this.pos.add(new Vec3().fromQuat(this.rot, cp));
    else
      this.pos.add(new Vec3().fromMul(cp, this.scl).transformQuat(this.rot));
    return this;
  }
  fromMul(tp, tc) {
    const v = new Vec3().fromMul(tp.scl, tc.pos).transformQuat(tp.rot);
    this.pos.fromAdd(tp.pos, v);
    this.scl.fromMul(tp.scl, tc.scl);
    this.rot.fromMul(tp.rot, tc.rot);
    return this;
  }
  fromInvert(t) {
    this.rot.fromInvert(t.rot);
    this.scl.fromInvert(t.scl);
    this.pos.fromNegate(t.pos).mul(this.scl).transformQuat(this.rot);
    return this;
  }
  transformVec3(v, out) {
    out = out || v;
    vec3.mul(v, this.scl, out);
    vec3.transformQuat(out, this.rot);
    vec3.add(out, this.pos);
    return out;
  }
  static mul(tp, tc) {
    return new _Transform().fromMul(tp, tc);
  }
  static invert(t) {
    return new _Transform().fromInvert(t);
  }
  static fromPos(x, y, z) {
    const t = new _Transform();
    if (x instanceof Vec3 || x instanceof Array || x instanceof Float32Array) {
      t.pos.copy(x);
    } else if (x != void 0 && y != void 0 && z != void 0) {
      t.pos.xyz(x, y, z);
    }
    return t;
  }
};
let Transform = _Transform;
__publicField(Transform, "BYTESIZE", 10 * Float32Array.BYTES_PER_ELEMENT);
class Transform2D {
  constructor(rot, pos, scl) {
    __publicField(this, "rot", 0);
    __publicField(this, "pos", new Vec2());
    __publicField(this, "scl", new Vec2(1, 1));
    if (rot instanceof Transform2D) {
      this.copy(rot);
    } else if (typeof rot === "number" && pos && scl) {
      this.set(rot, pos, scl);
    }
  }
  reset() {
    this.rot = 0;
    this.pos.xy(0, 0);
    this.scl.xy(1, 1);
    return this;
  }
  copy(t) {
    this.rot = t.rot;
    this.pos.copy(t.pos);
    this.scl.copy(t.scl);
    return this;
  }
  set(r, p, s) {
    if (r != void 0 && r != null)
      this.rot = r;
    if (p)
      this.pos.copy(p);
    if (s)
      this.scl.copy(s);
    return this;
  }
  getDeg() {
    return this.rot * 180 / Math.PI;
  }
  setDeg(d) {
    this.rot = d * Math.PI / 180;
    return this;
  }
  setScl(s) {
    this.scl.xy(s);
    return this;
  }
  setPos(x, y) {
    this.pos.xy(x, y);
    return this;
  }
  clone() {
    return new Transform2D(this);
  }
  fromInvert(t) {
    this.rot = -t.rot;
    this.scl.fromInvert(t.scl);
    this.pos.fromNegate(t.pos).mul(this.scl).rotate(this.rot);
    return this;
  }
  transformVec2(v, out) {
    return (out || v).fromMul(v, this.scl).rotate(this.rot).add(this.pos);
  }
  static invert(t) {
    return new Transform2D().fromInvert(t);
  }
}
const _Mat3 = class extends Float32Array {
  constructor() {
    super(9);
    this[0] = this[4] = this[8] = 1;
  }
  copy(mat, offset = 0) {
    for (let i = 0; i < 9; i++)
      this[i] = mat[offset + i];
    return this;
  }
  identity() {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 1;
    this[5] = 0;
    this[6] = 0;
    this[7] = 0;
    this[8] = 1;
    return this;
  }
  determinant() {
    const a00 = this[0], a01 = this[1], a02 = this[2];
    const a10 = this[3], a11 = this[4], a12 = this[5];
    const a20 = this[6], a21 = this[7], a22 = this[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }
  frob() {
    return Math.hypot(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8]);
  }
  fromTranslation(v) {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 1;
    this[5] = 0;
    this[6] = v[0];
    this[7] = v[1];
    this[8] = 1;
    return this;
  }
  fromRotation(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    this[0] = c;
    this[1] = s;
    this[2] = 0;
    this[3] = -s;
    this[4] = c;
    this[5] = 0;
    this[6] = 0;
    this[7] = 0;
    this[8] = 1;
    return this;
  }
  fromScaling(v) {
    this[0] = v[0];
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = v[1];
    this[5] = 0;
    this[6] = 0;
    this[7] = 0;
    this[8] = 1;
    return this;
  }
  fromRotTranScale(rad, tran, scl) {
    const s = Math.sin(rad), c = Math.cos(rad), sx = scl[0], sy = scl[1];
    this[0] = c * sx;
    this[1] = s * sx;
    this[2] = 0;
    this[3] = -s * sy;
    this[4] = c * sy;
    this[5] = 0;
    this[6] = tran[0];
    this[7] = tran[1];
    this[8] = 1;
    return this;
  }
  fromMat4Normal(a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det)
      return this;
    det = 1 / det;
    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return this;
  }
  fromProjection(width, height) {
    this[0] = 2 / width;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = -2 / height;
    this[5] = 0;
    this[6] = -1;
    this[7] = 1;
    this[8] = 1;
    return this;
  }
  fromAdd(a, b) {
    this[0] = a[0] + b[0];
    this[1] = a[1] + b[1];
    this[2] = a[2] + b[2];
    this[3] = a[3] + b[3];
    this[4] = a[4] + b[4];
    this[5] = a[5] + b[5];
    this[6] = a[6] + b[6];
    this[7] = a[7] + b[7];
    this[8] = a[8] + b[8];
    return this;
  }
  fromSub(a, b) {
    this[0] = a[0] - b[0];
    this[1] = a[1] - b[1];
    this[2] = a[2] - b[2];
    this[3] = a[3] - b[3];
    this[4] = a[4] - b[4];
    this[5] = a[5] - b[5];
    this[6] = a[6] - b[6];
    this[7] = a[7] - b[7];
    this[8] = a[8] - b[8];
    return this;
  }
  fromScalar(a, b) {
    this[0] = a[0] * b;
    this[1] = a[1] * b;
    this[2] = a[2] * b;
    this[3] = a[3] * b;
    this[4] = a[4] * b;
    this[5] = a[5] * b;
    this[6] = a[6] * b;
    this[7] = a[7] * b;
    this[8] = a[8] * b;
    return this;
  }
  fromMul(a, b) {
    const a00 = a[0], a01 = a[1], a02 = a[2];
    const a10 = a[3], a11 = a[4], a12 = a[5];
    const a20 = a[6], a21 = a[7], a22 = a[8];
    const b00 = b[0], b01 = b[1], b02 = b[2];
    const b10 = b[3], b11 = b[4], b12 = b[5];
    const b20 = b[6], b21 = b[7], b22 = b[8];
    this[0] = b00 * a00 + b01 * a10 + b02 * a20;
    this[1] = b00 * a01 + b01 * a11 + b02 * a21;
    this[2] = b00 * a02 + b01 * a12 + b02 * a22;
    this[3] = b10 * a00 + b11 * a10 + b12 * a20;
    this[4] = b10 * a01 + b11 * a11 + b12 * a21;
    this[5] = b10 * a02 + b11 * a12 + b12 * a22;
    this[6] = b20 * a00 + b21 * a10 + b22 * a20;
    this[7] = b20 * a01 + b21 * a11 + b22 * a21;
    this[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return this;
  }
  fromInvert(a) {
    const a00 = a[0], a01 = a[1], a02 = a[2];
    const a10 = a[3], a11 = a[4], a12 = a[5];
    const a20 = a[6], a21 = a[7], a22 = a[8];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det)
      return this;
    det = 1 / det;
    this[0] = b01 * det;
    this[1] = (-a22 * a01 + a02 * a21) * det;
    this[2] = (a12 * a01 - a02 * a11) * det;
    this[3] = b11 * det;
    this[4] = (a22 * a00 - a02 * a20) * det;
    this[5] = (-a12 * a00 + a02 * a10) * det;
    this[6] = b21 * det;
    this[7] = (-a21 * a00 + a01 * a20) * det;
    this[8] = (a11 * a00 - a01 * a10) * det;
    return this;
  }
  fromTranspose(a) {
    this[0] = a[0];
    this[1] = a[3];
    this[2] = a[6];
    this[3] = a[1];
    this[4] = a[4];
    this[5] = a[7];
    this[6] = a[2];
    this[7] = a[5];
    this[8] = a[8];
    return this;
  }
  fromAdjoint(a) {
    const a00 = a[0], a01 = a[1], a02 = a[2];
    const a10 = a[3], a11 = a[4], a12 = a[5];
    const a20 = a[6], a21 = a[7], a22 = a[8];
    this[0] = a11 * a22 - a12 * a21;
    this[1] = a02 * a21 - a01 * a22;
    this[2] = a01 * a12 - a02 * a11;
    this[3] = a12 * a20 - a10 * a22;
    this[4] = a00 * a22 - a02 * a20;
    this[5] = a02 * a10 - a00 * a12;
    this[6] = a10 * a21 - a11 * a20;
    this[7] = a01 * a20 - a00 * a21;
    this[8] = a00 * a11 - a01 * a10;
    return this;
  }
  mul(b) {
    const a00 = this[0], a01 = this[1], a02 = this[2];
    const a10 = this[3], a11 = this[4], a12 = this[5];
    const a20 = this[6], a21 = this[7], a22 = this[8];
    const b00 = b[0], b01 = b[1], b02 = b[2];
    const b10 = b[3], b11 = b[4], b12 = b[5];
    const b20 = b[6], b21 = b[7], b22 = b[8];
    this[0] = b00 * a00 + b01 * a10 + b02 * a20;
    this[1] = b00 * a01 + b01 * a11 + b02 * a21;
    this[2] = b00 * a02 + b01 * a12 + b02 * a22;
    this[3] = b10 * a00 + b11 * a10 + b12 * a20;
    this[4] = b10 * a01 + b11 * a11 + b12 * a21;
    this[5] = b10 * a02 + b11 * a12 + b12 * a22;
    this[6] = b20 * a00 + b21 * a10 + b22 * a20;
    this[7] = b20 * a01 + b21 * a11 + b22 * a21;
    this[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return this;
  }
  pmul(a) {
    const a00 = a[0], a01 = a[1], a02 = a[2];
    const a10 = a[3], a11 = a[4], a12 = a[5];
    const a20 = a[6], a21 = a[7], a22 = a[8];
    const b00 = this[0], b01 = this[1], b02 = this[2];
    const b10 = this[3], b11 = this[4], b12 = this[5];
    const b20 = this[6], b21 = this[7], b22 = this[8];
    this[0] = b00 * a00 + b01 * a10 + b02 * a20;
    this[1] = b00 * a01 + b01 * a11 + b02 * a21;
    this[2] = b00 * a02 + b01 * a12 + b02 * a22;
    this[3] = b10 * a00 + b11 * a10 + b12 * a20;
    this[4] = b10 * a01 + b11 * a11 + b12 * a21;
    this[5] = b10 * a02 + b11 * a12 + b12 * a22;
    this[6] = b20 * a00 + b21 * a10 + b22 * a20;
    this[7] = b20 * a01 + b21 * a11 + b22 * a21;
    this[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return this;
  }
  invert() {
    const a00 = this[0], a01 = this[1], a02 = this[2];
    const a10 = this[3], a11 = this[4], a12 = this[5];
    const a20 = this[6], a21 = this[7], a22 = this[8];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det)
      return this;
    det = 1 / det;
    this[0] = b01 * det;
    this[1] = (-a22 * a01 + a02 * a21) * det;
    this[2] = (a12 * a01 - a02 * a11) * det;
    this[3] = b11 * det;
    this[4] = (a22 * a00 - a02 * a20) * det;
    this[5] = (-a12 * a00 + a02 * a10) * det;
    this[6] = b21 * det;
    this[7] = (-a21 * a00 + a01 * a20) * det;
    this[8] = (a11 * a00 - a01 * a10) * det;
    return this;
  }
  transpose() {
    const a01 = this[1], a02 = this[2], a12 = this[5];
    this[1] = this[3];
    this[2] = this[6];
    this[3] = a01;
    this[5] = this[7];
    this[6] = a02;
    this[7] = a12;
    return this;
  }
  translate(v) {
    const a00 = this[0], a01 = this[1], a02 = this[2], a10 = this[3], a11 = this[4], a12 = this[5], a20 = this[6], a21 = this[7], a22 = this[8], x = v[0], y = v[1];
    this[6] = x * a00 + y * a10 + a20;
    this[7] = x * a01 + y * a11 + a21;
    this[8] = x * a02 + y * a12 + a22;
    return this;
  }
  rotate(rad) {
    const a00 = this[0], a01 = this[1], a02 = this[2], a10 = this[3], a11 = this[4], a12 = this[5], s = Math.sin(rad), c = Math.cos(rad);
    this[0] = c * a00 + s * a10;
    this[1] = c * a01 + s * a11;
    this[2] = c * a02 + s * a12;
    this[3] = c * a10 - s * a00;
    this[4] = c * a11 - s * a01;
    this[5] = c * a12 - s * a02;
    return this;
  }
  scale(v) {
    const x = v[0], y = v[1];
    this[0] = x * this[0];
    this[1] = x * this[1];
    this[2] = x * this[2];
    this[3] = y * this[3];
    this[4] = y * this[4];
    this[5] = y * this[5];
    return this;
  }
  transformVec2(v, out) {
    const x = v[0], y = v[1];
    out = out || v;
    out[0] = this[0] * x + this[3] * y + this[6];
    out[1] = this[1] * x + this[4] * y + this[7];
    return out;
  }
  static fromScale(v) {
    return new _Mat3().fromScaling(v);
  }
  static fromTranslation(v) {
    return new _Mat3().fromTranslation(v);
  }
  static fromRotation(v) {
    return new _Mat3().fromRotation(v);
  }
};
let Mat3 = _Mat3;
__publicField(Mat3, "BYTESIZE", 9 * Float32Array.BYTES_PER_ELEMENT);
const _Mat4 = class extends Float32Array {
  constructor() {
    super(16);
    this[0] = this[5] = this[10] = this[15] = 1;
  }
  identity() {
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  clearTranslation() {
    this[12] = this[13] = this[14] = 0;
    this[15] = 1;
    return this;
  }
  copy(mat, offset = 0) {
    let i;
    for (i = 0; i < 16; i++)
      this[i] = mat[offset + i];
    return this;
  }
  copyTo(out) {
    let i;
    for (i = 0; i < 16; i++)
      out[i] = this[i];
    return this;
  }
  determinant() {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11], a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15], b0 = a00 * a11 - a01 * a10, b1 = a00 * a12 - a02 * a10, b2 = a01 * a12 - a02 * a11, b3 = a20 * a31 - a21 * a30, b4 = a20 * a32 - a22 * a30, b5 = a21 * a32 - a22 * a31, b6 = a00 * b5 - a01 * b4 + a02 * b3, b7 = a10 * b5 - a11 * b4 + a12 * b3, b8 = a20 * b2 - a21 * b1 + a22 * b0, b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  frob() {
    return Math.hypot(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8], this[9], this[10], this[11], this[12], this[13], this[14], this[15]);
  }
  getTranslation(out) {
    out = out || [0, 0, 0];
    out[0] = this[12];
    out[1] = this[13];
    out[2] = this[14];
    return out;
  }
  getScale(out) {
    const m11 = this[0], m12 = this[1], m13 = this[2], m21 = this[4], m22 = this[5], m23 = this[6], m31 = this[8], m32 = this[9], m33 = this[10];
    out = out || [0, 0, 0];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  getRotation(out) {
    const trace = this[0] + this[5] + this[10];
    let S = 0;
    out = out || [0, 0, 0, 1];
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (this[6] - this[9]) / S;
      out[1] = (this[8] - this[2]) / S;
      out[2] = (this[1] - this[4]) / S;
    } else if (this[0] > this[5] && this[0] > this[10]) {
      S = Math.sqrt(1 + this[0] - this[5] - this[10]) * 2;
      out[3] = (this[6] - this[9]) / S;
      out[0] = 0.25 * S;
      out[1] = (this[1] + this[4]) / S;
      out[2] = (this[8] + this[2]) / S;
    } else if (this[5] > this[10]) {
      S = Math.sqrt(1 + this[5] - this[0] - this[10]) * 2;
      out[3] = (this[8] - this[2]) / S;
      out[0] = (this[1] + this[4]) / S;
      out[1] = 0.25 * S;
      out[2] = (this[6] + this[9]) / S;
    } else {
      S = Math.sqrt(1 + this[10] - this[0] - this[5]) * 2;
      out[3] = (this[1] - this[4]) / S;
      out[0] = (this[8] + this[2]) / S;
      out[1] = (this[6] + this[9]) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  fromPerspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy * 0.5), nf = 1 / (near - far);
    this[0] = f / aspect;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = f;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = (far + near) * nf;
    this[11] = -1;
    this[12] = 0;
    this[13] = 0;
    this[14] = 2 * far * near * nf;
    this[15] = 0;
    return this;
  }
  fromOrtho(left, right, bottom, top, near, far) {
    const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
    this[0] = -2 * lr;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = -2 * bt;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 2 * nf;
    this[11] = 0;
    this[12] = (left + right) * lr;
    this[13] = (top + bottom) * bt;
    this[14] = (far + near) * nf;
    this[15] = 1;
    return this;
  }
  fromMul(a, b) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this;
  }
  fromInvert(mat) {
    const a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3], a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7], a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11], a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det)
      return this;
    det = 1 / det;
    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return this;
  }
  fromAdjugate(a) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    this[0] = a11 * b11 - a12 * b10 + a13 * b09;
    this[1] = a02 * b10 - a01 * b11 - a03 * b09;
    this[2] = a31 * b05 - a32 * b04 + a33 * b03;
    this[3] = a22 * b04 - a21 * b05 - a23 * b03;
    this[4] = a12 * b08 - a10 * b11 - a13 * b07;
    this[5] = a00 * b11 - a02 * b08 + a03 * b07;
    this[6] = a32 * b02 - a30 * b05 - a33 * b01;
    this[7] = a20 * b05 - a22 * b02 + a23 * b01;
    this[8] = a10 * b10 - a11 * b08 + a13 * b06;
    this[9] = a01 * b08 - a00 * b10 - a03 * b06;
    this[10] = a30 * b04 - a31 * b02 + a33 * b00;
    this[11] = a21 * b02 - a20 * b04 - a23 * b00;
    this[12] = a11 * b07 - a10 * b09 - a12 * b06;
    this[13] = a00 * b09 - a01 * b07 + a02 * b06;
    this[14] = a31 * b01 - a30 * b03 - a32 * b00;
    this[15] = a20 * b03 - a21 * b01 + a22 * b00;
    return this;
  }
  fromFrustum(left, right, bottom, top, near, far) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const nf = 1 / (near - far);
    this[0] = near * 2 * rl;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = near * 2 * tb;
    this[6] = 0;
    this[7] = 0;
    this[8] = (right + left) * rl;
    this[9] = (top + bottom) * tb;
    this[10] = (far + near) * nf;
    this[11] = -1;
    this[12] = 0;
    this[13] = 0;
    this[14] = far * near * 2 * nf;
    this[15] = 0;
    return this;
  }
  fromQuatTranScale(q, v, s) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2, sx = s[0], sy = s[1], sz = s[2];
    this[0] = (1 - (yy + zz)) * sx;
    this[1] = (xy + wz) * sx;
    this[2] = (xz - wy) * sx;
    this[3] = 0;
    this[4] = (xy - wz) * sy;
    this[5] = (1 - (xx + zz)) * sy;
    this[6] = (yz + wx) * sy;
    this[7] = 0;
    this[8] = (xz + wy) * sz;
    this[9] = (yz - wx) * sz;
    this[10] = (1 - (xx + yy)) * sz;
    this[11] = 0;
    this[12] = v[0];
    this[13] = v[1];
    this[14] = v[2];
    this[15] = 1;
    return this;
  }
  fromQuatTran(q, v) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    this[0] = 1 - (yy + zz);
    this[1] = xy + wz;
    this[2] = xz - wy;
    this[3] = 0;
    this[4] = xy - wz;
    this[5] = 1 - (xx + zz);
    this[6] = yz + wx;
    this[7] = 0;
    this[8] = xz + wy;
    this[9] = yz - wx;
    this[10] = 1 - (xx + yy);
    this[11] = 0;
    this[12] = v[0];
    this[13] = v[1];
    this[14] = v[2];
    this[15] = 1;
    return this;
  }
  fromQuat(q) {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    this[0] = 1 - (yy + zz);
    this[1] = xy + wz;
    this[2] = xz - wy;
    this[3] = 0;
    this[4] = xy - wz;
    this[5] = 1 - (xx + zz);
    this[6] = yz + wx;
    this[7] = 0;
    this[8] = xz + wy;
    this[9] = yz - wx;
    this[10] = 1 - (xx + yy);
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  fromQuatTranScaleOrigin(q, v, s, o) {
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
    this[0] = out0;
    this[1] = out1;
    this[2] = out2;
    this[3] = 0;
    this[4] = out4;
    this[5] = out5;
    this[6] = out6;
    this[7] = 0;
    this[8] = out8;
    this[9] = out9;
    this[10] = out10;
    this[11] = 0;
    this[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    this[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    this[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    this[15] = 1;
    return this;
  }
  fromDualQuat(a) {
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
    this.fromQuatTran(a, translation);
    return this;
  }
  fromLook(eye, center, up) {
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
    if (Math.abs(eyex - centerx) < 1e-6 && Math.abs(eyey - centery) < 1e-6 && Math.abs(eyez - centerz) < 1e-6) {
      this.identity();
      return this;
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
    this[0] = x0;
    this[1] = y0;
    this[2] = z0;
    this[3] = 0;
    this[4] = x1;
    this[5] = y1;
    this[6] = z1;
    this[7] = 0;
    this[8] = x2;
    this[9] = y2;
    this[10] = z2;
    this[11] = 0;
    this[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    this[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    this[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    this[15] = 1;
    return this;
  }
  fromTarget(eye, target, up) {
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
    this[0] = x0;
    this[1] = x1;
    this[2] = x2;
    this[3] = 0;
    this[4] = z1 * x2 - z2 * x1;
    this[5] = z2 * x0 - z0 * x2;
    this[6] = z0 * x1 - z1 * x0;
    this[7] = 0;
    this[8] = z0;
    this[9] = z1;
    this[10] = z2;
    this[11] = 0;
    this[12] = eyex;
    this[13] = eyey;
    this[14] = eyez;
    this[15] = 1;
    return this;
  }
  fromAxisAngle(axis, rad) {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.hypot(x, y, z);
    if (len < 1e-6)
      return this;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    this[0] = x * x * t + c;
    this[1] = y * x * t + z * s;
    this[2] = z * x * t - y * s;
    this[3] = 0;
    this[4] = x * y * t - z * s;
    this[5] = y * y * t + c;
    this[6] = z * y * t + x * s;
    this[7] = 0;
    this[8] = x * z * t + y * s;
    this[9] = y * z * t - x * s;
    this[10] = z * z * t + c;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  fromRotX(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 0;
    this[4] = 0;
    this[5] = c;
    this[6] = s;
    this[7] = 0;
    this[8] = 0;
    this[9] = -s;
    this[10] = c;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  fromRotY(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    this[0] = c;
    this[1] = 0;
    this[2] = -s;
    this[3] = 0;
    this[4] = 0;
    this[5] = 1;
    this[6] = 0;
    this[7] = 0;
    this[8] = s;
    this[9] = 0;
    this[10] = c;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  fromRotZ(rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    this[0] = c;
    this[1] = s;
    this[2] = 0;
    this[3] = 0;
    this[4] = -s;
    this[5] = c;
    this[6] = 0;
    this[7] = 0;
    this[8] = 0;
    this[9] = 0;
    this[10] = 1;
    this[11] = 0;
    this[12] = 0;
    this[13] = 0;
    this[14] = 0;
    this[15] = 1;
    return this;
  }
  toNormalMat3(out) {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11], a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
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
  fromBuf(ary, idx) {
    this[0] = ary[idx];
    this[1] = ary[idx + 1];
    this[2] = ary[idx + 2];
    this[3] = ary[idx + 3];
    this[4] = ary[idx + 4];
    this[5] = ary[idx + 5];
    this[6] = ary[idx + 6];
    this[7] = ary[idx + 7];
    this[8] = ary[idx + 8];
    this[9] = ary[idx + 9];
    this[10] = ary[idx + 10];
    this[11] = ary[idx + 11];
    this[12] = ary[idx + 12];
    this[13] = ary[idx + 13];
    this[14] = ary[idx + 14];
    this[15] = ary[idx + 15];
    return this;
  }
  toBuf(ary, idx) {
    ary[idx] = this[0];
    ary[idx + 1] = this[1];
    ary[idx + 2] = this[2];
    ary[idx + 3] = this[3];
    ary[idx + 4] = this[4];
    ary[idx + 5] = this[5];
    ary[idx + 6] = this[6];
    ary[idx + 7] = this[7];
    ary[idx + 8] = this[8];
    ary[idx + 9] = this[9];
    ary[idx + 10] = this[10];
    ary[idx + 11] = this[11];
    ary[idx + 12] = this[12];
    ary[idx + 13] = this[13];
    ary[idx + 14] = this[14];
    ary[idx + 15] = this[15];
    return this;
  }
  add(b) {
    this[0] = this[0] + b[0];
    this[1] = this[1] + b[1];
    this[2] = this[2] + b[2];
    this[3] = this[3] + b[3];
    this[4] = this[4] + b[4];
    this[5] = this[5] + b[5];
    this[6] = this[6] + b[6];
    this[7] = this[7] + b[7];
    this[8] = this[8] + b[8];
    this[9] = this[9] + b[9];
    this[10] = this[10] + b[10];
    this[11] = this[11] + b[11];
    this[12] = this[12] + b[12];
    this[13] = this[13] + b[13];
    this[14] = this[14] + b[14];
    this[15] = this[15] + b[15];
    return this;
  }
  sub(b) {
    this[0] = this[0] - b[0];
    this[1] = this[1] - b[1];
    this[2] = this[2] - b[2];
    this[3] = this[3] - b[3];
    this[4] = this[4] - b[4];
    this[5] = this[5] - b[5];
    this[6] = this[6] - b[6];
    this[7] = this[7] - b[7];
    this[8] = this[8] - b[8];
    this[9] = this[9] - b[9];
    this[10] = this[10] - b[10];
    this[11] = this[11] - b[11];
    this[12] = this[12] - b[12];
    this[13] = this[13] - b[13];
    this[14] = this[14] - b[14];
    this[15] = this[15] - b[15];
    return this;
  }
  mul(b) {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11], a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this;
  }
  pmul(b) {
    const a00 = b[0], a01 = b[1], a02 = b[2], a03 = b[3], a10 = b[4], a11 = b[5], a12 = b[6], a13 = b[7], a20 = b[8], a21 = b[9], a22 = b[10], a23 = b[11], a30 = b[12], a31 = b[13], a32 = b[14], a33 = b[15];
    let b0 = this[0], b1 = this[1], b2 = this[2], b3 = this[3];
    this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = this[4];
    b1 = this[5];
    b2 = this[6];
    b3 = this[7];
    this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = this[8];
    b1 = this[9];
    b2 = this[10];
    b3 = this[11];
    this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = this[12];
    b1 = this[13];
    b2 = this[14];
    b3 = this[15];
    this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this;
  }
  invert() {
    const a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11], a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det)
      return this;
    det = 1 / det;
    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return this;
  }
  translate(v, y, z) {
    let xx, yy, zz;
    if (v instanceof Float32Array || v instanceof Array && v.length == 3) {
      xx = v[0];
      yy = v[1];
      zz = v[2];
    } else if (typeof v === "number" && typeof y === "number" && typeof z === "number") {
      xx = v;
      yy = y;
      zz = z;
    } else
      return this;
    this[12] = this[0] * xx + this[4] * yy + this[8] * zz + this[12];
    this[13] = this[1] * xx + this[5] * yy + this[9] * zz + this[13];
    this[14] = this[2] * xx + this[6] * yy + this[10] * zz + this[14];
    this[15] = this[3] * xx + this[7] * yy + this[11] * zz + this[15];
    return this;
  }
  scale(x, y, z) {
    if (y == void 0)
      y = x;
    if (z == void 0)
      z = x;
    this[0] *= x;
    this[1] *= x;
    this[2] *= x;
    this[3] *= x;
    this[4] *= y;
    this[5] *= y;
    this[6] *= y;
    this[7] *= y;
    this[8] *= z;
    this[9] *= z;
    this[10] *= z;
    this[11] *= z;
    return this;
  }
  transpose() {
    const a01 = this[1], a02 = this[2], a03 = this[3], a12 = this[6], a13 = this[7], a23 = this[11];
    this[1] = this[4];
    this[2] = this[8];
    this[3] = this[12];
    this[4] = a01;
    this[6] = this[9];
    this[7] = this[13];
    this[8] = a02;
    this[9] = a12;
    this[11] = this[14];
    this[12] = a03;
    this[13] = a13;
    this[14] = a23;
    return this;
  }
  decompose(out_r, out_t, out_s) {
    out_t[0] = this[12];
    out_t[1] = this[13];
    out_t[2] = this[14];
    const m11 = this[0];
    const m12 = this[1];
    const m13 = this[2];
    const m21 = this[4];
    const m22 = this[5];
    const m23 = this[6];
    const m31 = this[8];
    const m32 = this[9];
    const m33 = this[10];
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
    return this;
  }
  rotX(rad) {
    const s = Math.sin(rad), c = Math.cos(rad), a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
    this[4] = a10 * c + a20 * s;
    this[5] = a11 * c + a21 * s;
    this[6] = a12 * c + a22 * s;
    this[7] = a13 * c + a23 * s;
    this[8] = a20 * c - a10 * s;
    this[9] = a21 * c - a11 * s;
    this[10] = a22 * c - a12 * s;
    this[11] = a23 * c - a13 * s;
    return this;
  }
  rotY(rad) {
    const s = Math.sin(rad), c = Math.cos(rad), a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11];
    this[0] = a00 * c - a20 * s;
    this[1] = a01 * c - a21 * s;
    this[2] = a02 * c - a22 * s;
    this[3] = a03 * c - a23 * s;
    this[8] = a00 * s + a20 * c;
    this[9] = a01 * s + a21 * c;
    this[10] = a02 * s + a22 * c;
    this[11] = a03 * s + a23 * c;
    return this;
  }
  rotZ(rad) {
    const s = Math.sin(rad), c = Math.cos(rad), a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3], a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7];
    this[0] = a00 * c + a10 * s;
    this[1] = a01 * c + a11 * s;
    this[2] = a02 * c + a12 * s;
    this[3] = a03 * c + a13 * s;
    this[4] = a10 * c - a00 * s;
    this[5] = a11 * c - a01 * s;
    this[6] = a12 * c - a02 * s;
    this[7] = a13 * c - a03 * s;
    return this;
  }
  rotAxisAngle(axis, rad) {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z);
    if (Math.abs(len) < 1e-6)
      return this;
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
    this[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return this;
  }
  transformVec3(v, out) {
    const x = v[0], y = v[1], z = v[2];
    out = out || v;
    out[0] = this[0] * x + this[4] * y + this[8] * z + this[12];
    out[1] = this[1] * x + this[5] * y + this[9] * z + this[13];
    out[2] = this[2] * x + this[6] * y + this[10] * z + this[14];
    return out;
  }
  transformVec4(v, out) {
    const x = v[0], y = v[1], z = v[2], w = v[3];
    out = out || v;
    out[0] = this[0] * x + this[4] * y + this[8] * z + this[12] * w;
    out[1] = this[1] * x + this[5] * y + this[9] * z + this[13] * w;
    out[2] = this[2] * x + this[6] * y + this[10] * z + this[14] * w;
    out[3] = this[3] * x + this[7] * y + this[11] * z + this[15] * w;
    return out;
  }
  static mul(a, b) {
    return new _Mat4().fromMul(a, b);
  }
  static invert(a) {
    return new _Mat4().fromInvert(a);
  }
};
let Mat4 = _Mat4;
__publicField(Mat4, "BYTESIZE", 16 * Float32Array.BYTES_PER_ELEMENT);
class Vec3Buf {
  constructor(buf) {
    __publicField(this, "_buf");
    __publicField(this, "_xi", -1);
    __publicField(this, "_yi", -1);
    __publicField(this, "_zi", -1);
    __publicField(this, "_v", [0, 0, 0]);
    this._buf = buf;
  }
  get count() {
    return this._buf.length / 3;
  }
  get x() {
    return this._buf[this._xi];
  }
  set x(v) {
    this._buf[this._xi] = v;
  }
  get y() {
    return this._buf[this._yi];
  }
  set y(v) {
    this._buf[this._yi] = v;
  }
  get z() {
    return this._buf[this._zi];
  }
  set z(v) {
    this._buf[this._zi] = v;
  }
  at(i) {
    i *= 3;
    if (i > this._buf.length) {
      console.error("Vec3Buf.at : Index is more then the buffer has");
      return this;
    }
    this._xi = i;
    this._yi = i + 1;
    this._zi = i + 2;
    return this;
  }
  set(x, y, z) {
    if (y != void 0 && z != void 0) {
      this._buf[this._xi] = x;
      this._buf[this._yi] = y;
      this._buf[this._zi] = z;
    } else {
      this._buf[this._xi] = x;
      this._buf[this._yi] = x;
      this._buf[this._zi] = x;
    }
    return this;
  }
  get(out) {
    if (!out)
      return [this._buf[this._xi], this._buf[this._yi], this._buf[this._zi]];
    out != null ? out : out = this._v;
    out[0] = this._buf[this._xi];
    out[1] = this._buf[this._yi];
    out[2] = this._buf[this._zi];
    return out;
  }
  setBuffer(buf) {
    this._buf = buf;
    this._xi = -1;
    this._yi = -1;
    this._zi = -1;
    return this;
  }
  push(v, y, z) {
    if (this._buf instanceof Float32Array) {
      console.log("Buffer is a TypeArray, Can not push a vec3");
      return this;
    }
    if (v instanceof Array) {
      this._buf.push(v[0], v[1], v[2]);
    } else if (typeof v == "number" && y != void 0 && z != void 0) {
      this._buf.push(v, y, z);
    }
    return this;
  }
  toFloatArray() {
    return this._buf instanceof Float32Array ? this._buf : new Float32Array(this._buf);
  }
  clear() {
    if (this._buf instanceof Float32Array) {
      console.error("Can not clear a float32Array");
      return this;
    }
    this._buf.length = 0;
    return this;
  }
  len(i) {
    if (i != void 0)
      this.at(i);
    return Math.sqrt(this._buf[this._xi] ** 2 + this._buf[this._yi] ** 2 + this._buf[this._zi] ** 2);
  }
  lenSq(i) {
    if (i != void 0)
      this.at(i);
    return this._buf[this._xi] ** 2 + this._buf[this._yi] ** 2 + this._buf[this._zi] ** 2;
  }
  fromStruct(v) {
    this._buf[this._xi] = v.x;
    this._buf[this._yi] = v.y;
    this._buf[this._zi] = v.z;
    return this;
  }
  toStruct(v) {
    v.x = this._buf[this._xi];
    v.y = this._buf[this._yi];
    v.z = this._buf[this._zi];
    return this;
  }
  add(a) {
    this._buf[this._xi] += a[0];
    this._buf[this._yi] += a[1];
    this._buf[this._zi] += a[2];
    return this;
  }
  fromAdd(a, b) {
    this._buf[this._xi] = a[0] + b[0];
    this._buf[this._yi] = a[0] + b[1];
    this._buf[this._zi] = a[2] + b[2];
    return this;
  }
  sub(a) {
    this._buf[this._xi] -= a[0];
    this._buf[this._yi] -= a[1];
    this._buf[this._zi] -= a[2];
    return this;
  }
  fromSub(a, b) {
    this._buf[this._xi] = a[0] - b[0];
    this._buf[this._yi] = a[0] - b[1];
    this._buf[this._zi] = a[2] - b[2];
    return this;
  }
  norm() {
    let mag = Math.sqrt(this._buf[this._xi] ** 2 + this._buf[this._yi] ** 2 + this._buf[this._zi] ** 2);
    if (mag != 0) {
      mag = 1 / mag;
      this._buf[this._xi] *= mag;
      this._buf[this._yi] *= mag;
      this._buf[this._zi] *= mag;
    }
    return this;
  }
  fromNorm(v) {
    let mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    if (mag == 0)
      return this;
    mag = 1 / mag;
    this._buf[this._xi] = v[0] * mag;
    this._buf[this._yi] = v[1] * mag;
    this._buf[this._zi] = v[2] * mag;
    return this;
  }
  centroid(out) {
    let i;
    let x = 0;
    let y = 0;
    let z = 0;
    for (i = 0; i < this._buf.length; i += 3) {
      x += this._buf[i];
      y += this._buf[i + 1];
      z += this._buf[i + 2];
    }
    const cnt = 1 / (this._buf.length / 3);
    out != null ? out : out = [0, 0, 0];
    out[0] = x * cnt;
    out[1] = y * cnt;
    out[2] = z * cnt;
    return out;
  }
  bounds() {
    let i;
    let x;
    let y;
    let z;
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (i = 0; i < this._buf.length; i += 3) {
      x = this._buf[i];
      y = this._buf[i + 1];
      z = this._buf[i + 2];
      if (x < min[0])
        min[0] = x;
      if (y < min[1])
        min[1] = y;
      if (z < min[2])
        min[2] = z;
      if (x > max[0])
        max[0] = x;
      if (y > max[1])
        max[1] = y;
      if (z > max[2])
        max[2] = z;
    }
    return [min, max];
  }
}
const _Maths = class {
  static clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  static clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }
  static fract(f) {
    return f - Math.floor(f);
  }
  static nearZero(v) {
    return Math.abs(v) <= _Maths.EPSILON ? 0 : v;
  }
  static toRad(v) {
    return v * _Maths.DEG2RAD;
  }
  static toDeg(v) {
    return v * _Maths.RAD2DEG;
  }
  static dotToDeg(dot) {
    return _Maths.toDeg(Math.acos(_Maths.clamp(dot, -1, 1)));
  }
  static map(x, xMin, xMax, zMin, zMax) {
    return (x - xMin) / (xMax - xMin) * (zMax - zMin) + zMin;
  }
  static snap(x, step) {
    return Math.floor(x / step) * step;
  }
  static norm(min, max, v) {
    return (v - min) / (max - min);
  }
  static mod(a, b) {
    const v = a % b;
    return v < 0 ? b + v : v;
  }
  static asinc(x0) {
    let x = 6 * (1 - x0);
    const x1 = x;
    let a = x;
    x *= x1;
    a += x / 20;
    x *= x1;
    a += x * 2 / 525;
    x *= x1;
    a += x * 13 / 37800;
    x *= x1;
    a += x * 4957 / 14553e4;
    x *= x1;
    a += x * 58007 / 162162e5;
    x *= x1;
    a += x * 1748431 / 4469590125e3;
    x *= x1;
    a += x * 4058681 / 92100645e6;
    x *= x1;
    a += x * 5313239803 / 104624165646e7;
    x *= x1;
    a += x * 2601229460539 / 4365681093774e9;
    return Math.sqrt(a);
  }
  static wrap(value, min, max) {
    const range = max - min;
    return range != 0 ? value - range * Math.floor((value - min) / range) : min;
  }
  static damp(x, y, lambda, dt) {
    const ti = Math.exp(-lambda * dt);
    return x * ti + y * (1 - ti);
  }
  static negateIf(val, b) {
    return b ? -val : val;
  }
  static lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
  static eerp(a, b, t) {
    return a ** (1 - t) * b ** t;
  }
  static clerp(start, end, v) {
    const min = 0, max = 360, half = Math.abs((max - min) / 2), es = end - start;
    if (es < -half)
      return start + (max - start + end) * v;
    else if (es > half)
      return start + -(max - end + start) * v;
    return start + es * v;
  }
  static lawcosSSS(aLen, bLen, cLen) {
    let v = (aLen * aLen + bLen * bLen - cLen * cLen) / (2 * aLen * bLen);
    if (v < -1)
      v = -1;
    else if (v > 1)
      v = 1;
    return Math.acos(v);
  }
  static rnd(min, max) {
    return Math.random() * (max - min) + min;
  }
  static rndLcg(seed) {
    function lcg(a) {
      return a * 48271 % 2147483647;
    }
    seed = seed ? lcg(seed) : lcg(Math.random());
    return function() {
      return (seed = lcg(seed)) / 2147483648;
    };
  }
  static repeat(t, len) {
    return _Maths.clamp(t - Math.floor(t / len) * len, 0, len);
  }
  static pingPong(t, len) {
    t = _Maths.repeat(t, len * 2);
    return len - Math.abs(t - len);
  }
  static dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }
};
let Maths = _Maths;
__publicField(Maths, "TAU", 6.283185307179586);
__publicField(Maths, "PI_H", 1.5707963267948966);
__publicField(Maths, "TAU_INV", 1 / 6.283185307179586);
__publicField(Maths, "PI_Q", 0.7853981633974483);
__publicField(Maths, "PI_Q3", 1.5707963267948966 + 0.7853981633974483);
__publicField(Maths, "PI_270", Math.PI + 1.5707963267948966);
__publicField(Maths, "DEG2RAD", 0.01745329251);
__publicField(Maths, "RAD2DEG", 57.2957795131);
__publicField(Maths, "EPSILON", 1e-6);
__publicField(Maths, "PHI", 1.618033988749895);
class Gradient {
  static step(edge, x) {
    return x < edge ? 0 : 1;
  }
  static smoothTStep(t) {
    return t * t * (3 - 2 * t);
  }
  static smoothStep(min, max, v) {
    v = Math.max(0, Math.min(1, (v - min) / (max - min)));
    return v * v * (3 - 2 * v);
  }
  static smootherStep(min, max, v) {
    if (v <= min)
      return 0;
    if (v >= max)
      return 1;
    v = (v - min) / (max - min);
    return v * v * v * (v * (v * 6 - 15) + 10);
  }
  static overShoot(t, n = 2, k = 2) {
    t = t * t * (3 - 2 * t);
    const a = n * t * t;
    const b = 1 - k * (t - 1) ** 2;
    return a * (1 - t) + b * t;
  }
  static smoothMin(a, b, k) {
    if (k != 0) {
      const h = Math.max(k - Math.abs(a - b), 0) / k;
      return Math.min(a, b) - h * h * h * k * (1 / 6);
    } else
      return Math.min(a, b);
  }
  static fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  static remapN01(t) {
    return t * 2 - 1;
  }
  static remap010(t) {
    return 1 - Math.abs(2 * t - 1);
  }
  static bounce(t) {
    return (Math.sin(t * Math.PI * (0.2 + 2.5 * t * t * t)) * Math.pow(1 - t, 2.2) + t) * (1 + 1.2 * (1 - t));
  }
  static noise(x) {
    const i = Math.floor(x);
    const f = Maths.fract(x);
    const t = f * f * (3 - 2 * f);
    return Maths.lerp(Maths.fract(Math.sin(i) * 1e4), Maths.fract(Math.sin(i + 1) * 1e4), t);
  }
  static parabola(x, k) {
    return Math.pow(4 * x * (1 - x), k);
  }
  static sigmoid(t, k = 0) {
    return (t - k * t) / (k - 2 * k * Math.abs(t) + 1);
  }
  static bellCurve(t) {
    return (Math.sin(2 * Math.PI * (t - 0.25)) + 1) * 0.5;
  }
  static betaDistCurve(t, a) {
    return 4 ** a * (t * (1 - t)) ** a;
  }
}
class Cycle {
  constructor(sec = 1) {
    __publicField(this, "_value", 0);
    __publicField(this, "_cycleInc", 0);
    __publicField(this, "_speedScale", 1);
    __publicField(this, "onUpdate");
    this.setSeconds(sec);
  }
  setSeconds(s) {
    this._cycleInc = Maths.TAU / (s * 1e3);
    return this;
  }
  backwards() {
    if (this._speedScale > 0)
      this._speedScale *= -1;
    return this;
  }
  forwards() {
    if (this._speedScale < 0)
      this._speedScale *= -1;
    return this;
  }
  update(dt) {
    this._value = (this._value + dt * 1e3 * this._speedScale * this._cycleInc) % Maths.TAU;
    if (this.onUpdate)
      this.onUpdate(this);
    return this;
  }
  get(offset = 0) {
    return Maths.mod(this._value + offset, Maths.TAU);
  }
  asCycle01(offset = 0) {
    return this.get(offset) * Maths.TAU_INV;
  }
  asCycleN11(offset = 0) {
    return this.get(offset) * Maths.TAU_INV * 2 - 1;
  }
  asCycle010(offset = 0) {
    const n = this.get(offset) * Maths.TAU_INV * 2;
    return n > 1 ? 1 - (n - 1) : n;
  }
  asSin(offset = 0) {
    return Math.sin(this.get(offset));
  }
  asSin01(offset = 0) {
    return Math.sin(this.get(offset)) * 0.5 + 0.5;
  }
  asSinAbs(offset = 0) {
    return Math.abs(Math.sin(this.get(offset)));
  }
  asSigmoid01(k = 0, offset = 0) {
    const t = this.asCycleN11(offset), v = (t - k * t) / (k - 2 * k * Math.abs(t) + 1);
    return v * 0.5 + 0.5;
  }
  asSigmoid010(k = 0, offset = 0) {
    const t = this.asSigmoid01(k, offset) * 2;
    return t > 1 ? 1 - (t - 1) : t;
  }
}
const NORMALIZE_RGB = 1 / 255;
const COLORS = {
  "black": 0,
  "white": 16777215,
  "red": 16711680,
  "green": 65280,
  "blue": 255,
  "fuchsia": 16711935,
  "cyan": 65535,
  "yellow": 16776960,
  "orange": 16744448,
  "gray": 8421504,
  "darkgray": 3158064
};
class Colour extends Float32Array {
  constructor(c) {
    super(4);
    if (c !== void 0) {
      if (typeof c == "number" && !isNaN(c)) {
        this.fromNumber(c);
      } else if (typeof c == "string") {
        if (c.charAt(0) == "#")
          this.fromHex(c);
        else
          this.fromName(c);
      }
    }
  }
  get r() {
    return this[0];
  }
  set r(v) {
    this[0] = v;
  }
  get g() {
    return this[1];
  }
  set g(v) {
    this[1] = v;
  }
  get b() {
    return this[2];
  }
  set b(v) {
    this[2] = v;
  }
  get a() {
    return this[3];
  }
  set a(v) {
    this[3] = v;
  }
  fromName(s) {
    if (COLORS[s] !== void 0)
      this.fromNumber(COLORS[s]);
    else
      this.fromNumber(16711680);
    return this;
  }
  fromNumber(c) {
    this[0] = (c >> 16 & 255) * NORMALIZE_RGB;
    this[1] = (c >> 8 & 255) * NORMALIZE_RGB;
    this[2] = (c & 255) * NORMALIZE_RGB;
    return this;
  }
  fromHex(c) {
    if (!c || c.charAt(0) != "#") {
      console.error("Missing Pound Symbol: ", c);
      return this;
    }
    this[0] = parseInt(c[1] + c[2], 16) * NORMALIZE_RGB;
    this[1] = parseInt(c[3] + c[4], 16) * NORMALIZE_RGB;
    this[2] = parseInt(c[5] + c[6], 16) * NORMALIZE_RGB;
    if (c.length == 9)
      this[3] = parseInt(c[7] + c[8], 16) * NORMALIZE_RGB;
    return this;
  }
  fromLerp(a, b, t) {
    const ti = 1 - t;
    this[0] = a[0] * ti + b[0] * t;
    this[1] = a[1] * ti + b[1] * t;
    this[2] = a[2] * ti + b[2] * t;
    this[3] = a[3] * ti + b[3] * t;
    return this;
  }
  toRGBNumber() {
    return this[0] * 255 << 16 | this[1] * 255 << 8 | this[2] * 255;
  }
}
class Lerp {
  static linear(a, b, t) {
    return a * (1 - t) + b * t;
  }
  static cosine(a, b, t) {
    const t2 = (1 - Math.cos(t * Math.PI)) / 2;
    return a * (1 - t2) + b * t2;
  }
  static cubic(a, b, c, d, t) {
    const t2 = t * t;
    const a0 = d - c - a + b;
    const a1 = a - b - a0;
    const a2 = c - a;
    return a0 * t * t2 + a1 * t2 + a2 * t + b;
  }
  static cubicSmooth(a, b, c, d, t) {
    const t2 = t * t;
    const a0 = -0.5 * a + 1.5 * b - 1.5 * c + 0.5 * d;
    const a1 = a - 2.5 * b + 2 * c - 0.5 * d;
    const a2 = -0.5 * a + 0.5 * c;
    return a0 * t * t2 + a1 * t2 + a2 * t + b;
  }
  static hermite(a, b, c, d, t, tension, bias) {
    const t2 = t * t;
    const t3 = t2 * t;
    const btPN = (1 + bias) * (1 - tension) / 2;
    const btNP = (1 - bias) * (1 - tension) / 2;
    const m0 = (b - a) * btPN + (c - b) * btNP;
    const m1 = (c - b) * btPN + (d - c) * btNP;
    const a0 = 2 * t3 - 3 * t2 + 1;
    const a1 = t3 - 2 * t2 + t;
    const a2 = t3 - t2;
    const a3 = -2 * t3 + 3 * t2;
    return a0 * b + a1 * m0 + a2 * m1 + a3 * c;
  }
}
export { Colour, Cycle, DualQuat, Gradient, Lerp, Mat3, Mat4, Maths, Quat, Transform, Transform2D, Vec2, Vec3, Vec3Buf, Vec4, mat4, quat, vec3 };
