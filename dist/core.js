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
  static remapAngle180(deg) {
    const ang = deg % 360;
    return ang > 180 ? ang - 360 : ang < -180 ? ang + 360 : ang;
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
  static expDecay(x, rate = 0.5) {
    return Math.exp(-rate * x);
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
}class Wave {
  static trianglePeriod(x, period = 1) {
    return 1 - Math.abs(x % (period * 2) - period) / period;
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
}class RandomLCG {
  _seed;
  _num;
  constructor(s = 1) {
    this.seed = s;
  }
  _lcg(n) {
    return n * 48271 % 2147483647;
  }
  set seed(s) {
    this._seed = Math.max(s, 1);
    this._num = this._lcg(this._seed);
  }
  reset() {
    this._num = this._lcg(this._seed);
    return this;
  }
  next() {
    return (this._num = this._lcg(this._num)) / 2147483648;
  }
  probability(n) {
    return !!n && this.next() <= n;
  }
}class Fn {
  static debounce(fn, delay = 20) {
    let id = -1;
    const caller = (...args) => {
      if (id !== -1)
        clearTimeout(id);
      id = setTimeout(() => fn(...args), delay);
    };
    return caller;
  }
  static memorize(fn) {
    const cache = {};
    const caller = (...args) => {
      const key = args.toString();
      if (key in cache)
        return cache[key];
      const result = fn(...args);
      cache[key] = result;
      return result;
    };
    return caller;
  }
  static throttle(fn, delay = 20) {
    let lastTime = 0;
    const caller = (...args) => {
      const now = ( new Date()).getTime();
      if (now - lastTime < delay)
        return;
      lastTime = now;
      fn(...args);
    };
    return caller;
  }
  static pipe(...fnArray) {
    const caller = (...args) => {
      let result = fnArray[0](...args);
      for (let i = 1; i < fnArray.length; i++) {
        result = fnArray[i](result);
      }
      return result;
    };
    return caller;
  }
  static promise(fn) {
    const caller = (...args) => {
      return new Promise((resolve, reject) => {
        try {
          resolve(fn(...args));
        } catch (e) {
          reject(e);
        }
      });
    };
    return caller;
  }
  static promiseNow(fn, ...args) {
    return new Promise((resolve, reject) => {
      try {
        resolve(fn(...args));
      } catch (e) {
        reject(e);
      }
    });
  }
}class FunHash {
  static string(s) {
    let h = 3735928559;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
    }
    return (h ^ h >>> 16) >>> 0;
  }
  static numberArray(ary, scale = 1) {
    let h = 3735928559;
    for (let i = 0; i < ary.length; i++) {
      h = Math.imul(h ^ ary[i] * scale, 2654435761);
    }
    return (h ^ h >>> 16) >>> 0;
  }
}const CRC_TBL = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".split(" ").map((s) => parseInt(s, 16));
function crc32(str) {
  let crc = -1;
  for (let i = 0; i < str.length; i++) {
    crc = crc >>> 8 ^ CRC_TBL[(crc ^ str.charCodeAt(i)) & 255];
  }
  return (crc ^ -1) >>> 0;
}export{Colour,Easing,Fn,FunHash,Gradient,Lerp,Maths,RandomLCG,Wave,crc32,nanoID};