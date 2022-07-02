var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
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
export { Colour, Cycle, Gradient, Lerp, Maths };
