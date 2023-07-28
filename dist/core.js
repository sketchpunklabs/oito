class Maths {
  static TAU = 6.283185307179586;
  static PI_H = 1.5707963267948966;
  static TAU_INV = 1 / 6.283185307179586;
  static PI_Q = 0.7853981633974483;
  static PI_Q3 = 1.5707963267948966 + 0.7853981633974483;
  static PI_270 = Math.PI + 1.5707963267948966;
  static DEG2RAD = 0.01745329251;
  static RAD2DEG = 57.2957795131;
  static EPSILON = 1e-6;
  static PHI = 1.618033988749895;
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
    return Math.abs(v) <= Maths.EPSILON ? 0 : v;
  }
  static toRad(v) {
    return v * Maths.DEG2RAD;
  }
  static toDeg(v) {
    return v * Maths.RAD2DEG;
  }
  static dotToDeg(dot) {
    return Maths.toDeg(Math.acos(Maths.clamp(dot, -1, 1)));
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
  static baseLog(base, val) {
    return Math.log(val) / Math.log(base);
  }
  static mod(a, b) {
    const v = a % b;
    return v < 0 ? b + v : v;
  }
  static euclideanMod(a, b) {
    return (a % b + b) % b;
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
  static damp60(x, y, t, dt) {
    const tt = Math.exp(Math.log(1 - t) * (dt / 16.6666));
    return x * tt + y * (1 - tt);
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
    return Maths.clamp(t - Math.floor(t / len) * len, 0, len);
  }
  static pingPong(t, len) {
    t = Maths.repeat(t, len * 2);
    return len - Math.abs(t - len);
  }
  static dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }
  static uuid() {
    return window.crypto.randomUUID();
  }
}class Lerp {
  static linear(a, b, t) {
    return a * (1 - t) + b * t;
  }
  static cosine(a, b, t) {
    const t2 = (1 - Math.cos(t * Math.PI)) / 2;
    return a * (1 - t2) + b * t2;
  }
  static cubicSpline(a, b, c, d, t) {
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
}const NORMALIZE_RGB = 1 / 255;
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
  toHex() {
    return "#" + ("000000" + this.toNumber().toString(16)).substr(-6);
  }
  toNumber() {
    return ~~(this[0] * 255) << 16 | ~~(this[1] * 255) << 8 | ~~(this[2] * 255);
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
  fromHSV(h, s = 1, v = 1) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        this[0] = v, this[1] = t, this[2] = p;
        break;
      case 1:
        this[0] = q, this[1] = v, this[2] = p;
        break;
      case 2:
        this[0] = p, this[1] = v, this[2] = t;
        break;
      case 3:
        this[0] = p, this[1] = q, this[2] = v;
        break;
      case 4:
        this[0] = t, this[1] = p, this[2] = v;
        break;
      case 5:
        this[0] = v, this[1] = p, this[2] = q;
        break;
    }
    return this;
  }
  fromHSL(h, s = 1, l = 0.5) {
    const ang = h * 360;
    const a = s * Math.min(l, 1 - l);
    const k = (n) => (n + ang / 30) % 12;
    this[0] = l - a * Math.max(-1, Math.min(k(0) - 3, Math.min(9 - k(0), 1)));
    this[1] = l - a * Math.max(-1, Math.min(k(8) - 3, Math.min(9 - k(8), 1)));
    this[2] = l - a * Math.max(-1, Math.min(k(4) - 3, Math.min(9 - k(4), 1)));
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
  fromPalettes(t, p) {
    this[0] = p.a[0] + p.b[0] * Math.cos(6.28318 * (p.c[0] * t + p.d[0]));
    this[1] = p.a[1] + p.b[1] * Math.cos(6.28318 * (p.c[1] * t + p.d[1]));
    this[2] = p.a[2] + p.b[2] * Math.cos(6.28318 * (p.c[2] * t + p.d[2]));
    return this;
  }
}class Gradient {
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
    return Maths.lerp(
      Maths.fract(Math.sin(i) * 1e4),
      Maths.fract(Math.sin(i + 1) * 1e4),
      t
    );
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
}class Easing {
  static quad_In(k) {
    return k * k;
  }
  static quad_Out(k) {
    return k * (2 - k);
  }
  static quad_InOut(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
  }
  static cubic_In(k) {
    return k * k * k;
  }
  static cubic_Out(k) {
    return --k * k * k + 1;
  }
  static cubic_InOut(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
  }
  static quart_In(k) {
    return k * k * k * k;
  }
  static quart_Out(k) {
    return 1 - --k * k * k * k;
  }
  static quart_InOut(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k * k * k;
    return -0.5 * ((k -= 2) * k * k * k - 2);
  }
  static quint_In(k) {
    return k * k * k * k * k;
  }
  static quint_Out(k) {
    return --k * k * k * k * k + 1;
  }
  static quint_InOut(k) {
    if ((k *= 2) < 1)
      return 0.5 * k * k * k * k * k;
    return 0.5 * ((k -= 2) * k * k * k * k + 2);
  }
  static sine_In(k) {
    return 1 - Math.cos(k * Math.PI / 2);
  }
  static sine_Out(k) {
    return Math.sin(k * Math.PI / 2);
  }
  static sine_InOut(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }
  static exp_In(k) {
    return k === 0 ? 0 : Math.pow(1024, k - 1);
  }
  static exp_Out(k) {
    return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
  }
  static exp_InOut(k) {
    if (k === 0 || k === 1)
      return k;
    if ((k *= 2) < 1)
      return 0.5 * Math.pow(1024, k - 1);
    return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
  }
  static circ_In(k) {
    return 1 - Math.sqrt(1 - k * k);
  }
  static circ_Out(k) {
    return Math.sqrt(1 - --k * k);
  }
  static circ_InOut(k) {
    if ((k *= 2) < 1)
      return -0.5 * (Math.sqrt(1 - k * k) - 1);
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
  }
  static elastic_In(k) {
    if (k === 0 || k === 1)
      return k;
    return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
  }
  static elastic_Out(k) {
    if (k === 0 || k === 1)
      return k;
    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
  }
  static elastic_InOut(k) {
    if (k === 0 || k === 1)
      return k;
    k *= 2;
    if (k < 1)
      return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
  }
  static back_In(k) {
    return k * k * ((1.70158 + 1) * k - 1.70158);
  }
  static back_Out(k) {
    return --k * k * ((1.70158 + 1) * k + 1.70158) + 1;
  }
  static back_InOut(k) {
    const s = 1.70158 * 1.525;
    if ((k *= 2) < 1)
      return 0.5 * (k * k * ((s + 1) * k - s));
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  }
  static bounce_In(k) {
    return 1 - Easing.bounce_Out(1 - k);
  }
  static bounce_Out(k) {
    if (k < 1 / 2.75)
      return 7.5625 * k * k;
    else if (k < 2 / 2.75)
      return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    else if (k < 2.5 / 2.75)
      return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    else
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
  }
  static bounce_InOut(k) {
    if (k < 0.5)
      return Easing.bounce_In(k * 2) * 0.5;
    return Easing.bounce_Out(k * 2 - 1) * 0.5 + 0.5;
  }
  static bouncy(t, jump = 6, offset = 1) {
    const rad = 6.283185307179586 * t;
    return (offset + Math.sin(rad)) / 2 * Math.sin(jump * rad);
  }
  static bounce(t) {
    return (Math.sin(t * Math.PI * (0.2 + 2.5 * t * t * t)) * Math.pow(1 - t, 2.2) + t) * (1 + 1.2 * (1 - t));
  }
}function nanoID(t = 21) {
  const r = crypto.getRandomValues(new Uint8Array(t));
  let n;
  let e = "";
  for (; t--; ) {
    n = 63 & r[t];
    e += n < 36 ? n.toString(36) : n < 62 ? (n - 26).toString(36).toUpperCase() : n < 63 ? "_" : "-";
  }
  return e;
}export{Colour,Easing,Gradient,Lerp,Maths,nanoID};