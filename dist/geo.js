import {Vec2,Vec3}from'./oop.js';class Line2D {
  static intersectingSegments(a0, a1, b0, b1, out = [0, 0]) {
    const denom = (b1[1] - b0[1]) * (a1[0] - a0[0]) - (b1[0] - b0[0]) * (a1[1] - a0[1]);
    if (denom === 0)
      return null;
    const ua = ((b1[0] - b0[0]) * (a0[1] - b0[1]) - (b1[1] - b0[1]) * (a0[0] - b0[0])) / denom;
    const ub = ((a1[0] - a0[0]) * (a0[1] - b0[1]) - (a1[1] - a0[1]) * (a0[0] - b0[0])) / denom;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      out[0] = a0[0] + ua * (a1[0] - a0[0]);
      out[1] = a0[1] + ua * (a1[1] - a0[1]);
      return out;
    }
    return null;
  }
  static intersectingRays(ap, ad, bp, bd, out = [0, 0]) {
    const dx = bp[0] - ap[0];
    const dy = bp[1] - ap[1];
    const det = bd[0] * ad[1] - bd[1] * ad[0];
    if (det !== 0) {
      const u = (dy * bd[0] - dx * bd[1]) / det;
      const v = (dy * ad[0] - dx * ad[1]) / det;
      if (u >= 0 && v >= 0) {
        out[0] = ap[0] + ad[0] * u;
        out[1] = ap[1] + ad[1] * u;
        return out;
      }
    }
    return null;
  }
  static intersectingRaySegment(ro, rd, s0, s1, out = [0, 0]) {
    const denom = rd[0] * (s1[1] - s0[1]) - rd[1] * (s1[0] - s0[0]);
    if (Math.abs(denom) < 1e-4)
      return null;
    const t1 = ((s0[0] - ro[0]) * (s1[1] - s0[1]) - (s0[1] - ro[1]) * (s1[0] - s0[0])) / denom;
    const t2 = ((s0[0] - ro[0]) * rd[1] - (s0[1] - ro[1]) * rd[0]) / denom;
    if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
      out[0] = ro[0] + rd[0] * t1;
      out[1] = ro[1] + rd[1] * t1;
      return out;
    }
    return null;
  }
  static isPointOnSegment(a0, a1, p, epsilon = 1e-3) {
    const toStart = Vec2.dist(a0, p);
    const toEnd = Vec2.dist(a1, p);
    const segLen = Vec2.dist(a1, a0);
    return Math.abs(toStart + toEnd - segLen) < epsilon && toStart < segLen + epsilon && toEnd < segLen + epsilon;
  }
  static isLeft(a, b, p) {
    return (p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0]) >= 0;
  }
}class Polygon2D {
  points = [];
  constructor(pnts) {
    if (pnts)
      this.points = pnts;
  }
  addPoint(p) {
    this.points.push(new Vec2(p));
    return this;
  }
  addArray(ary) {
    for (const i of ary)
      this.points.push(new Vec2(i));
    return this;
  }
  get pointCount() {
    return this.points.length;
  }
  getEdge(i) {
    const cnt = this.points.length;
    const j = (cnt + i) % cnt;
    const k = (cnt + i + 1) % cnt;
    return [this.points[j], this.points[k]];
  }
  getLongestEdge() {
    const pnts = this.points;
    const cnt = pnts.length;
    let max = -Infinity;
    let ai = -1;
    let bi = -1;
    let d = 0;
    let ii;
    for (let i = 0; i < cnt; i++) {
      ii = (i + 1) % cnt;
      d = Vec2.distSqr(pnts[i], pnts[ii]);
      if (d > max) {
        ai = i;
        bi = ii;
        max = d;
      }
    }
    return [pnts[ai], pnts[bi], ai, bi];
  }
  centroid(out = [0, 0]) {
    for (const p of this.points) {
      out[0] += p[0];
      out[1] += p[1];
    }
    const inv = 1 / this.points.length;
    out[0] *= inv;
    out[1] *= inv;
    return out;
  }
  isClockwise() {
    const pnts = this.points;
    const end = pnts.length - 1;
    let sum = 0;
    let ii;
    for (let i = 0; i < end; i++) {
      ii = i + 1;
      sum += pnts[i][0] * pnts[ii][1] - pnts[i][1] * pnts[ii][0];
    }
    return sum >= 0;
  }
  toVec3Buffer(isType = true, isYUp = true, n = 0) {
    const cnt = this.points.length;
    const buf = isType ? new Float32Array(cnt * 3) : new Array(cnt * 3);
    let i = 0;
    if (isYUp) {
      for (const p of this.points) {
        buf[i++] = p[0];
        buf[i++] = n;
        buf[i++] = p[1];
      }
    } else {
      for (const p of this.points) {
        buf[i++] = p[0];
        buf[i++] = p[1];
        buf[i++] = n;
      }
    }
    return buf;
  }
  toFlatBuffer(isType = true) {
    const cnt = this.points.length;
    const buf = isType ? new Float32Array(cnt * 2) : new Array(cnt * 2);
    let i = 0;
    for (const p of this.points) {
      buf[i++] = p[0];
      buf[i++] = p[1];
    }
    return buf;
  }
  segmentCut(p0, p1) {
    const hits = [];
    const pnts = this.points;
    let p;
    let ii;
    for (let i = 0; i < pnts.length; i++) {
      ii = (i + 1) % pnts.length;
      p = Line2D.intersectingSegments(p0, p1, pnts[i], pnts[ii]);
      if (p)
        hits.push({ pos: new Vec2(p), i, ii });
    }
    if (hits.length !== 2)
      return null;
    const [a, b] = hits;
    const poly0 = new Polygon2D([
      a.pos,
      ...pnts.slice(a.ii, b.i + 1),
      b.pos
    ]);
    const poly1 = new Polygon2D(
      b.ii < a.i ? [b.pos, ...pnts.slice(b.ii, a.i + 1), a.pos] : [b.pos, ...pnts.slice(b.ii), ...pnts.slice(0, a.i + 1), a.pos]
    );
    return [poly0, poly1];
  }
  polyline(radius = 0.1, isClosed = true) {
    const pnts = this.points;
    const cnt = this.pointCount;
    const end = isClosed ? cnt : cnt - 1;
    const edgeDir = [];
    let v;
    let i, j;
    for (i = 0; i < end; i++) {
      j = (i + 1) % cnt;
      v = Vec2.sub(pnts[j], pnts[i]).norm();
      edgeDir.push(v);
    }
    const miterDir = new Vec2();
    const normDir = new Vec2();
    const outer = [];
    const inner = [];
    const prevDir = new Vec2(isClosed ? edgeDir[edgeDir.length - 1] : [0, 0, 0]);
    let curDir;
    let scl;
    for (i = 0; i < end; i++) {
      curDir = edgeDir[i];
      normDir.copy(curDir).rotN90();
      miterDir.fromAdd(prevDir, curDir).norm().rotN90();
      scl = radius / Vec2.dot(miterDir, normDir);
      outer.push(v = Vec2.scaleThenAdd(scl, miterDir, pnts[i]));
      inner.push(v = Vec2.scaleThenAdd(scl, miterDir.negate(), pnts[i]));
      prevDir.copy(curDir);
    }
    if (!isClosed) {
      i = cnt - 1;
      normDir.copy(edgeDir[i - 1]).rotN90();
      outer.push(v = Vec2.scaleThenAdd(radius, normDir, pnts[i]));
      inner.push(v = Vec2.scaleThenAdd(radius, normDir.negate(), pnts[i]));
    }
    return [outer, inner];
  }
  iterVec3(isYUp = true) {
    let i = 0;
    const idx = isYUp ? 2 : 1;
    const result = { value: [0, 0, 0], done: false }, len = this.points.length, next = () => {
      if (i >= len)
        result.done = true;
      else {
        result.value[0] = this.points[i][0];
        result.value[idx] = this.points[i][1];
        i++;
      }
      return result;
    };
    return { [Symbol.iterator]() {
      return { next };
    } };
  }
  iterEdges() {
    const v = { a: this.points[0], b: this.points[0], ai: 0, bi: 1 };
    const result = { value: v, done: false };
    const len = this.points.length;
    const next = () => {
      if (v.ai >= len)
        result.done = true;
      else {
        v.a = this.points[v.ai];
        v.b = this.points[v.bi];
        v.ai++;
        v.bi = (v.bi + 1) % len;
      }
      return result;
    };
    return { [Symbol.iterator]() {
      return { next };
    } };
  }
}class Quad {
  static create(_props) {
    const props = Object.assign({
      width: 1,
      height: 1,
      center: true,
      vertical: false
    }, _props);
    let wp;
    let hp;
    let wn;
    let hn;
    if (props.center) {
      wp = props.width * 0.5;
      hp = props.height * 0.5;
      wn = -props.width * 0.5;
      hn = -props.height * 0.5;
    } else {
      wp = props.width;
      hp = props.height;
      wn = 0;
      hn = 0;
    }
    const norm = [];
    const verts = [];
    const rtn = {
      indices: [0, 1, 2, 2, 3, 0],
      texcoord: [0, 0, 0, 1, 1, 1, 1, 0],
      normals: norm,
      vertices: verts
    };
    if (props.vertical) {
      norm.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
      verts.push(
        wn,
        hp,
        0,
        wn,
        hn,
        0,
        wp,
        hn,
        0,
        wp,
        hp,
        0
      );
    } else {
      norm.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
      verts.push(
        wn,
        0,
        hn,
        wn,
        0,
        hp,
        wp,
        0,
        hp,
        wp,
        0,
        hn
      );
    }
    return rtn;
  }
}class UtilVertices {
  static createGrid(out, width = 1, height = 1, xCells = 2, yCells = 2, useCenter = false, isVertical = false) {
    const xInc = width / xCells;
    let yInc = height / yCells;
    let ox = 0, oz = 0, x, z, xi, yi;
    if (useCenter) {
      if (!isVertical) {
        ox = -width * 0.5;
        oz = -height * 0.5;
      } else {
        ox = -width * 0.5;
        oz = height * 0.5;
        yInc = -yInc;
      }
    }
    for (yi = 0; yi <= yCells; yi++) {
      z = yi * yInc;
      for (xi = 0; xi <= xCells; xi++) {
        x = xi * xInc;
        if (!isVertical)
          out.push(x + ox, 0, z + oz);
        else
          out.push(x + ox, z + oz, 0);
      }
    }
    return out;
  }
}class UtilIndices {
  static grid(out, cSize, rSize, initIdx = 0, loop = 0, revQuad = false) {
    const cols = cSize + 1;
    const cEnd = loop === 1 ? cols : cols - 1;
    let ra, rb;
    let i, j, k;
    let a, b, c, d;
    for (i = 0; i < rSize; i++) {
      ra = initIdx + cols * i;
      rb = initIdx + cols * (i + 1);
      for (j = 0; j < cEnd; j++) {
        k = (j + 1) % cols;
        a = ra + j;
        b = rb + j;
        c = rb + k;
        d = ra + k;
        if (!revQuad)
          out.push(a, b, c, c, d, a);
        else
          out.push(a, d, c, c, b, a);
      }
    }
    return out;
  }
  static gridAlt(out, cSize, rSize, initIdx = 0, loop = 0, revQuad = false) {
    const cols = cSize + 1;
    const cEnd = loop === 1 ? cols : cols - 1;
    let ra, rb;
    let i, j, k;
    let a, b, c, d;
    let bit;
    for (i = 0; i < rSize; i++) {
      ra = initIdx + cols * i;
      rb = initIdx + cols * (i + 1);
      bit = i & 1;
      for (j = 0; j < cEnd; j++) {
        k = (j + 1) % cols;
        a = ra + j;
        b = rb + j;
        c = rb + k;
        d = ra + k;
        if (revQuad) {
          if ((j & 1) == bit)
            out.push(d, a, b, b, c, d);
          else
            out.push(a, b, c, c, d, a);
        } else {
          if ((j & 1) == bit)
            out.push(d, c, b, b, a, d);
          else
            out.push(a, d, c, c, b, a);
        }
      }
    }
    return out;
  }
  static flipWinding(out) {
    let x;
    for (let i = 0; i < out.length; i += 3) {
      x = out[i];
      out[i] = out[i + 2];
      out[i + 2] = x;
    }
    return out;
  }
}class Grid {
  static create(_props) {
    const props = Object.assign({
      width: 1,
      height: 1,
      cols: 2,
      rows: 2,
      alt: false,
      center: false,
      vertical: false,
      warpRadius: 0
    }, _props);
    const verts = UtilVertices.createGrid([], props.width, props.height, props.cols, props.rows, props.center, props.vertical);
    if (props.warpRadius !== 0)
      warp(verts, props.warpRadius);
    return {
      vertices: verts,
      indices: props.alt ? UtilIndices.gridAlt([], props.cols, props.rows) : UtilIndices.grid([], props.cols, props.rows),
      texcoord: texcoord([], props.cols, props.rows)
    };
  }
}
function texcoord(out, xLen, yLen) {
  let x, y, yt;
  for (y = 0; y <= yLen; y++) {
    yt = 1 - y / yLen;
    for (x = 0; x <= xLen; x++)
      out.push(x / xLen, yt);
  }
  return out;
}
function warp(verts, radius) {
  const fn = (i) => {
    const v = verts[i];
    let t = v / radius;
    const ts = Math.sign(t);
    t = 1 - Math.abs(t);
    return (1 - t ** 2) * ts * radius;
  };
  const cnt = verts.length / 3;
  for (let i = 0; i < cnt; i++) {
    verts[i * 3] = fn(i * 3);
    verts[i * 3 + 2] = fn(i * 3 + 2);
  }
}class Cube {
  static create(_props) {
    const props = Object.assign({
      width: 1,
      height: 1,
      depth: 1,
      placement: "origin"
    }, _props);
    let x1;
    let y1;
    let z1;
    let x0;
    let y0;
    let z0;
    switch (props.placement) {
      case "floor":
        x1 = props.width * 0.5;
        y1 = props.height;
        z1 = props.depth * 0.5;
        x0 = -x1;
        y0 = 0;
        z0 = -z1;
        break;
      case "voxel":
        x1 = props.width;
        y1 = props.height;
        z1 = props.depth;
        x0 = 0;
        y0 = 0;
        z0 = 0;
        break;
      default:
        x1 = props.width * 0.5;
        y1 = props.height * 0.5;
        z1 = props.depth * 0.5;
        x0 = -x1;
        y0 = -y1;
        z0 = -z1;
        break;
    }
    const vert = [
      x0,
      y1,
      z1,
      x0,
      y0,
      z1,
      x1,
      y0,
      z1,
      x1,
      y1,
      z1,
      x1,
      y1,
      z0,
      x1,
      y0,
      z0,
      x0,
      y0,
      z0,
      x0,
      y1,
      z0,
      x1,
      y1,
      z1,
      x1,
      y0,
      z1,
      x1,
      y0,
      z0,
      x1,
      y1,
      z0,
      x0,
      y0,
      z1,
      x0,
      y0,
      z0,
      x1,
      y0,
      z0,
      x1,
      y0,
      z1,
      x0,
      y1,
      z0,
      x0,
      y0,
      z0,
      x0,
      y0,
      z1,
      x0,
      y1,
      z1,
      x0,
      y1,
      z0,
      x0,
      y1,
      z1,
      x1,
      y1,
      z1,
      x1,
      y1,
      z0
    ];
    let i;
    const idx = [
      0,
      1,
      2,
      2,
      3,
      0,
      4,
      5,
      6,
      6,
      7,
      4,
      8,
      9,
      10,
      10,
      11,
      8,
      12,
      13,
      14,
      14,
      15,
      12,
      16,
      17,
      18,
      18,
      19,
      16,
      20,
      21,
      22,
      22,
      23,
      20
    ];
    const uv = [];
    for (i = 0; i < 6; i++)
      uv.push(0, 0, 0, 1, 1, 1, 1, 0);
    return {
      vertices: vert,
      indices: idx,
      texcoord: uv,
      normals: [
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0
      ]
    };
  }
}class Maths {
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
}class Torus {
  static create(_props) {
    const props = Object.assign({
      outerRadius: 0.5,
      outerSteps: 8,
      innerRadius: 0.15,
      innerSteps: 6
    }, _props);
    const ind = [];
    const norm = [];
    const uv = [];
    const rtn = {
      vertices: [],
      indices: ind,
      normals: norm,
      texcoord: uv
    };
    const pv = new Vec3();
    const cv = [0, 0, 0];
    let u_cos, u_sin, v_cos, v_sin;
    let i, j;
    let u = 0, v = 0, jt = 0, ti = 0;
    for (j = 0; j <= props.innerSteps; j++) {
      jt = j / props.innerSteps;
      v = jt * Maths.TAU;
      v_cos = Math.cos(v);
      v_sin = Math.sin(v);
      for (i = 0; i <= props.outerSteps; i++) {
        ti = i / props.outerSteps;
        u = ti * Maths.TAU;
        u_cos = Math.cos(u);
        u_sin = Math.sin(u);
        cv[0] = props.outerRadius * u_cos;
        cv[2] = props.outerRadius * u_sin;
        pv[0] = (props.outerRadius + props.innerRadius * v_cos) * u_cos;
        pv[1] = props.innerRadius * v_sin;
        pv[2] = (props.outerRadius + props.innerRadius * v_cos) * u_sin;
        pv.pushTo(rtn.vertices).sub(cv).norm().pushTo(norm);
        uv.push(ti, jt);
      }
    }
    let a, b, c, d;
    for (j = 1; j <= props.innerSteps; j++) {
      for (i = 1; i <= props.outerSteps; i++) {
        a = (props.outerSteps + 1) * j + i - 1;
        b = (props.outerSteps + 1) * (j - 1) + i - 1;
        c = (props.outerSteps + 1) * (j - 1) + i;
        d = (props.outerSteps + 1) * j + i;
        ind.push(a, d, c, c, b, a);
      }
    }
    return rtn;
  }
}export{Cube,Grid,Line2D,Polygon2D,Quad,Torus};