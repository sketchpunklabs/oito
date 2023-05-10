class Maths {
  // #region CONSTANTS
  static TAU = 6.283185307179586;
  static PI_H = 1.5707963267948966;
  static TAU_INV = 1 / 6.283185307179586;
  static PI_Q = 0.7853981633974483;
  static PI_Q3 = 1.5707963267948966 + 0.7853981633974483;
  static PI_270 = Math.PI + 1.5707963267948966;
  static DEG2RAD = 0.01745329251;
  // PI / 180
  static RAD2DEG = 57.2957795131;
  // 180 / PI
  static EPSILON = 1e-6;
  static PHI = 1.618033988749895;
  // Goldren Ratio, (1 + sqrt(5)) / 2
  //#endregion
  // #region OPERATIONS
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
  /** Modulas that handles Negatives
   * @example
   * Maths.mod( -1, 5 ) = 4 */
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
  /* Adapted from GODOT-engine math_funcs.h. */
  static wrap(value, min, max) {
    const range = max - min;
    return range != 0 ? value - range * Math.floor((value - min) / range) : min;
  }
  // http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
  static damp(x, y, lambda, dt) {
    const ti = Math.exp(-lambda * dt);
    return x * ti + y * (1 - ti);
  }
  // Damp Lerp with a 60FPS Exponential Decay
  static damp60(x, y, t, dt) {
    const tt = Math.exp(Math.log(1 - t) * (dt / 16.6666));
    return x * tt + y * (1 - tt);
  }
  //static select( t:number, f:number, b:boolean ): number{ return b ? t : f; }
  static negateIf(val, b) {
    return b ? -val : val;
  }
  //#endregion
  // #region INTERPOLATION
  static lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }
  //return a + t * (b-a); 
  // @FreyaHolmer : exponential interpolation, if you want to find the frequency, 
  // zoom level or scale, halfway between 2 and 8, then the right answer is 4, not 5
  static eerp(a, b, t) {
    return a ** (1 - t) * b ** t;
  }
  /** CLerp - Circular Lerp - is like lerp but handles the wraparound from 0 to 360.
  This is useful when interpolating eulerAngles and the object crosses the 0/360 boundary. */
  static clerp(start, end, v) {
    const min = 0, max = 360, half = Math.abs((max - min) / 2), es = end - start;
    if (es < -half)
      return start + (max - start + end) * v;
    else if (es > half)
      return start + -(max - end + start) * v;
    return start + es * v;
  }
  /*
  https://github.com/godotengine/godot/blob/master/core/math/math_funcs.h
  static _ALWAYS_INLINE_ float lerp_angle(float p_from, float p_to, float p_weight) {
      float difference = fmod(p_to - p_from, (float)Math_TAU);
      float distance = fmod(2.0f * difference, (float)Math_TAU) - difference;
      return p_from + distance * p_weight;
  }
  */
  //#endregion
  // #region TRIG
  static lawcosSSS(aLen, bLen, cLen) {
    let v = (aLen * aLen + bLen * bLen - cLen * cLen) / (2 * aLen * bLen);
    if (v < -1)
      v = -1;
    else if (v > 1)
      v = 1;
    return Math.acos(v);
  }
  //#endregion
  // #region RANDOM
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
  //#endregion
  // #region LOOPS
  /** Loops between 0 and Len, once over len, starts over again at 0, like a sawtooth wave  */
  static repeat(t, len) {
    return Maths.clamp(t - Math.floor(t / len) * len, 0, len);
  }
  /** Loops back and forth between 0 and len, it functions like a triangle wave. */
  static pingPong(t, len) {
    t = Maths.repeat(t, len * 2);
    return len - Math.abs(t - len);
  }
  //static pingPong( a: number, b: number ){ return ( b != 0 ) ? Math.abs( Maths.fract( (a - b) / ( b * 2) ) * b * 2 - b) : 0.0; }
  // #endregion
  // #region MISC
  /** Remove Negitive Bit, then output binary string of the number */
  static dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }
  static uuid() {
    return window.crypto.randomUUID();
  }
  //#endregion
  // #region WAVES
  /*
      //https://github.com/nodebox/g.js/blob/master/src/libraries/math.js
      static sawtoothWave(time, min=0, max=1, period=1){
          var amplitude	= (max - min) * 0.5,
              frequency	= Maths.PI_2 / period,
              phase		= 0;
  
          if(time % period !== 0)	phase = (time * frequency) % Maths.PI_2;
          if(phase < 0)			phase += Maths.PI_2;
  
          //return 2 * (phase / Maths.PI_2) * amplitude + min;
          return 2 * (phase * 0.15915494309) * amplitude + min; //Change Div to Mul
      }
  
      static triangleWave(v, min=0, max=1, period = 1){
          var amplitude	= (max - min) * 0.5,
              frequency	= Maths.PI_2 / period,
              phase		= 0,
              time		= v + period * 0.25; // div 4 changed to * 0.25
              
          if(time % period !== 0)	phase	= (time * frequency) % Maths.PI_2;
          if(phase < 0) 			phase	+= Maths.PI_2;
  
          return 2 * amplitude * (1 + -Math.abs((phase / Maths.PI_2) * 2 - 1)) + min;
      }
  
      static squareWave (v, min=0, max=1, period=1){ return ( (v % period) <  (period * 0.5) )? max : min; }
  
      static triangle_wave( t ){
          t -= Math.floor( t * 0.5 ) * 2;
          t = Math.min( Math.max( t, 0 ), 2 );
          return 1 - Math.abs( t - 1 );
      }
  
      //static cheap_parabola( t ) { return 1.0 - Math.abs( t * 2.0 - 1.0 ); }
  
      // Triangle Wave :: y = abs((x++ % 6) - 3);
      // Square Wave :: y = (x++ % 6) < 3 ? 3 : 0;
      // Sign Wave :: y = 3 * sin((float)x / 10);
      // Concave Wave :: y = pow(abs((x++ % 6) - 3), 2.0);
      // Diff Concave Wave :: y = pow(abs((x++ % 6) - 3), 0.5);
      */
  // #endregion
  // #region MISC
  // https://gist.github.com/jhermsmeier/72626d5fd79c5875248fd2c1e8162489
  /*
  
      function lonLatZoomXY( zoom, lon, lat ){
      const width     = Math.pow( 2, zoom );
      const height    = Math.pow( 2, zoom );
      const latRad    = ( lat * Math.PI ) / 180;
      const x         = ~~(( width * ( lon + 180 ) ) / 360 );
      const y         = ~~((( 1 - Math.asinh( Math.tan( latRad ) ) / Math.PI ) / 2.0 ) * height );
      return { x, y };
  }
  
      static polar_to_cartesian( lon, lat, radius, out ){
          out = out || new Vec3();
  
          let phi 	= ( 90 - lat ) * Maths.DEG2RAD,
              theta 	= ( lon + 180 ) * Maths.DEG2RAD;
  
          out[0] = -(radius * Math.sin( phi ) * Math.sin(theta));
          out[1] = radius * Math.cos( phi );
          out[2] = -(radius * Math.sin( phi ) * Math.cos(theta));
  
          return out;
      }
  
      static cartesian_to_polar( v, out ){
          out = out || [0,0];
  
          let len = Math.sqrt( v[0]**2 + v[2]**2 );
          out[ 0 ] = Math.atan2( v[0], v[2] ) * Maths.RAD2DEG;
          out[ 1 ] = Math.atan2( v[1], len ) * Maths.RAD2DEG;
          return out;
      }
  
      // X and Y axis need to be normalized vectors, 90 degrees of eachother.
      static plane_circle(vecCenter, xAxis, yAxis, angle, radius, out){
          let sin = Math.sin(angle),
              cos = Math.cos(angle);
          out[0] = vecCenter[0] + radius * cos * xAxis[0] + radius * sin * yAxis[0];
          out[1] = vecCenter[1] + radius * cos * xAxis[1] + radius * sin * yAxis[1];
          out[2] = vecCenter[2] + radius * cos * xAxis[2] + radius * sin * yAxis[2];
          return out;
      }
  
      //X and Y axis need to be normalized vectors, 90 degrees of eachother.
      static plane_ellipse(vecCenter, xAxis, yAxis, angle, xRadius, yRadius, out){
          let sin = Math.sin(angle),
              cos = Math.cos(angle);
          out[0] = vecCenter[0] + xRadius * cos * xAxis[0] + yRadius * sin * yAxis[0];
          out[1] = vecCenter[1] + xRadius * cos * xAxis[1] + yRadius * sin * yAxis[1];
          out[2] = vecCenter[2] + xRadius * cos * xAxis[2] + yRadius * sin * yAxis[2];
          return out;
      }
      */
  //#endregion
}

class Lerp {
  static linear(a, b, t) {
    return a * (1 - t) + b * t;
  }
  // http://paulbourke.net/miscellaneous/interpolation/
  static cosine(a, b, t) {
    const t2 = (1 - Math.cos(t * Math.PI)) / 2;
    return a * (1 - t2) + b * t2;
  }
  // // http://archive.gamedev.net/archive/reference/articles/article1497.html
  // static cubic( t, a, b ){
  //     let t2 = t * t,
  //         t3 = t2 * t;
  //     return a * ( 2*t3 - 3*t2 + 1 ) + b * ( 3 * t2 - 2 * t3 );
  // }
  // http://paulbourke.net/miscellaneous/interpolation/
  static cubicSpline(a, b, c, d, t) {
    const t2 = t * t;
    const a0 = d - c - a + b;
    const a1 = a - b - a0;
    const a2 = c - a;
    return a0 * t * t2 + a1 * t2 + a2 * t + b;
  }
  // catmull - http://paulbourke.net/miscellaneous/interpolation/
  static cubicSmooth(a, b, c, d, t) {
    const t2 = t * t;
    const a0 = -0.5 * a + 1.5 * b - 1.5 * c + 0.5 * d;
    const a1 = a - 2.5 * b + 2 * c - 0.5 * d;
    const a2 = -0.5 * a + 0.5 * c;
    return a0 * t * t2 + a1 * t2 + a2 * t + b;
  }
  //     // http://archive.gamedev.net/archive/reference/articles/article1497.html
  // // ta > td is the time value of the specific key frames the values belong to.
  // static catmull_irregular_frames( t, a, b, c, d, ta, tb, tc, td ){
  //     //let bb = ((b-a) / (tb-ta)) * 0.5 + ((c-b) / (tb-ta)) * 0.5;	// Original but the second denom seems wrong.
  //     //let cc = ((c-a) / (tc-tb)) * 0.5 + ((d-c) / (tc-tb)) * 0.5;
  //     let t2 = t * t;
  //     let t3 = t * t2;
  //     let bb = ((b-a) / (tb-ta)) * 0.5 + ((c-b) / (tc-tb)) * 0.5;	// Tangent at b
  //     let cc = ((c-a) / (tc-tb)) * 0.5 + ((d-c) / (td-tc)) * 0.5;	// Tangent at c
  //     let ti = 1.0; //tc - tb;	// This hurts the animation with the BB, CC change
  //     return	b * (2 * t3 - 3 * t2 + 1) +
  //             c * (3 * t2 - 2* t3) +
  //             bb * ti * (t3 - 2 * t2 + t) +
  //             cc * ti * (t3 - t2);
  // }
  /*
  Tension : 1 is high, 0 normal, -1 is low
  Bias    : 0 is even,
            positive is towards first segment,
            negative towards the other
  */
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
  // #endregion ////////////////////////////////////////////////////////
  // #region GETTERS / SETTERS
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
  //get rgbSlice(){ return new Float32Array( this.buffer, 0, 3*4 ); } // See if can create new F32 from buf but maybe just the 3 floats instead of 4.
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
  // #endregion ////////////////////////////////////////////////////////
}

class Gradient {
  // #region STEP
  static step(edge, x) {
    return x < edge ? 0 : 1;
  }
  /** t must be in the range of 0 to 1 : start & ends slowly*/
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
  /** This is a smooth over shoot easing : t must be in the range of 0 to 1 */
  static overShoot(t, n = 2, k = 2) {
    t = t * t * (3 - 2 * t);
    const a = n * t * t;
    const b = 1 - k * (t - 1) ** 2;
    return a * (1 - t) + b * t;
  }
  // #endregion
  // #region MISC
  /** See: https://www.iquilezles.org/www/articles/smin/smin.htm. */
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
  /** Remap 0 > 1 to -1 > 0 > 1 */
  static remapN01(t) {
    return t * 2 - 1;
  }
  /** Remap 0 > 1 to 0 > 1 > 0 */
  static remap010(t) {
    return 1 - Math.abs(2 * t - 1);
  }
  /** bounce ease out */
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
  // #endregion
  // #region CURVES
  static parabola(x, k) {
    return Math.pow(4 * x * (1 - x), k);
  }
  static sigmoid(t, k = 0) {
    return (t - k * t) / (k - 2 * k * Math.abs(t) + 1);
  }
  static bellCurve(t) {
    return (Math.sin(2 * Math.PI * (t - 0.25)) + 1) * 0.5;
  }
  /** a = 1.5, 2, 4, 9 */
  static betaDistCurve(t, a) {
    return 4 ** a * (t * (1 - t)) ** a;
  }
  // static CBezierEase(target, x0,y0, x1,y1, x2,y2, x3,y3 ){
  //     const TRIES		= 30;
  //     const MARGIN	= 0.001;
  //     //if(target <= 0.00001) // Target is Zero
  //     //else if(target > 0.99999 ) //target is One
  //     let a		= 0,
  //         b		= 1,
  //         loop	= 0,
  //         t,tt, i, ii, x;
  //     while( loop++ < TRIES ){
  //         t	= (b - a) * 0.5  + a;
  //         i	= 1 - t;
  //         tt	= t * t;
  //         ii	= i * i;
  //         x 	= i*ii*x0 + 3*t*ii*x1 + 3*tt*i*x2 + t*tt*x3;
  //         //console.log("x",loop, x, target, Math.abs(target - x));
  //         if( Math.abs(target - x) < MARGIN ) break; //console.log("found target at", t);
  //         if(target > x)		a = t;
  //         else if(target < x)	b = t;
  //     }
  //     return i*ii*y0 + 3*t*ii*y1 + 3*tt*i*y2 + t*tt*y3;
  // }
  // //https://blog.demofox.org/2014/08/28/one-dimensional-bezier-curves/
  // //1D Cubic (3rd) Bezier through A, B, C, D where a Start and d is end are assumed to be 0 and 1.
  // static normalizedBezier3(b, c, t){
  //     let s	= 1.0 - t,
  //         t2	= t * t,
  //         s2	= s * s,
  //         t3	= t2 * t;
  //     return (3.0 * b * s2 * t) + (3.0 * c * s * t2) + t3;
  // }
  // static normalizedBezier7(b, c, d, e, f, g, t){
  //     let s	= 1.0 - t,
  //         t2	= t * t,
  //         s2	= s * s,
  //         t3	= t2 * t,
  //         s3	= s2 * s,
  //         t4	= t2 * t2,
  //         s4	= s2 * s2,
  //         t5	= t3 * t2,
  //         s5	= s3 * s2,
  //         t6	= t3 * t3,
  //         s6	= s3 * t3,
  //         t7 	= t3 * t2 * t2;
  //     return 	(7.0 * b * s6 * t) + (21.0 * c * s5 * t2) + (35.0 * d * s4 * t3) +
  //             (35.0 * e * s3 * t4) + (21.0 * f * s2 * t5) + (7.0 * g * s * t6) + t7;
  // }
  // Parabola that passes between 0 and 1
  // p = 4 * x * ( 1 - x );
  // p1 = pow( p, 2.0 * p ); // Curves the start and end
  // p1 = pow( p, 4.0 * p ); // Curves more start and end
  // p1 = pow( p, 8.0 * p ); // Curves more start and end
  // p1 = pow( p, 12.0 * p ); // By this point creates a very sharp parabola
  // S Curve ( Kinda like an ease in-out )
  // x * x * ( 3 - 2 * x )
  // if replace x with a color vec3, its like adding contrast, brighters and darkers.
  // if too much clamp color before curve, might fix over exposure.
  // Ripples from hieght
  // gt = fract( time );
  // len = length( a.xy-b.xy )
  // h -= 0.1 *  // Amptitude
  //		sin( gt * 10 + len * 3.0 ) * // Create a Wave
  //		exp( -1 * l * l ) * // Exponetial of Distance
  //		exp( -1 * gt ) * // Exponetial of Time, more time the weaker the wave
  //		smoothstep( 0.0, 0.1, gt ); // Smooth out time near the beginning.
  // Camera Shake
  // pos += 0.05 * sin( time * 0.5 * vec3( 0, 2, 4 ) ); // Use Sin wave at different starting direction values.
  /*
      	//https://www.desmos.com/calculator/3zhzwbfrxd
  	// Configurable easing Function
  	function ExpBlend( t, p, s ){
  		let c = (2 / (1-s)) - 1;
  		if( t > p ){
  			t = 1 - t;
  			p = 1 - p;
  		}
  		return (t**c) / (p**(c-1));
  	}
  
      function prob_density( t, a, b ){
  		return ( t**(a-1) * (1-t)**(b-1) ) / ( Math.log(a) * Math.log(b) / ( Math.log( a + b )) ); //NOT log, needs to be Gamma https://github.com/substack/gamma.js/blob/master/index.js
  	}
      */
  // #endregion
}

class Easing {
  //-----------------------------------------------
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
  //-----------------------------------------------
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
  //-----------------------------------------------
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
  //-----------------------------------------------
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
  //-----------------------------------------------
  static sine_In(k) {
    return 1 - Math.cos(k * Math.PI / 2);
  }
  static sine_Out(k) {
    return Math.sin(k * Math.PI / 2);
  }
  static sine_InOut(k) {
    return 0.5 * (1 - Math.cos(Math.PI * k));
  }
  //-----------------------------------------------
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
  //-----------------------------------------------
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
  //-----------------------------------------------
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
  //-----------------------------------------------
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
  //-----------------------------------------------
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
  //-----------------------------------------------
  // EXTRAS
  static bouncy(t, jump = 6, offset = 1) {
    const rad = 6.283185307179586 * t;
    return (offset + Math.sin(rad)) / 2 * Math.sin(jump * rad);
  }
  /** bounce ease out */
  static bounce(t) {
    return (Math.sin(t * Math.PI * (0.2 + 2.5 * t * t * t)) * Math.pow(1 - t, 2.2) + t) * (1 + 1.2 * (1 - t));
  }
}

function nanoID(t = 21) {
  const r = crypto.getRandomValues(new Uint8Array(t));
  let n;
  let e = "";
  for (; t--; ) {
    n = 63 & r[t];
    e += n < 36 ? n.toString(36) : n < 62 ? (n - 26).toString(36).toUpperCase() : n < 63 ? "_" : "-";
  }
  return e;
}

export { Colour, Easing, Gradient, Lerp, Maths, nanoID };
