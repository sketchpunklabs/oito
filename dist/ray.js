import {Vec3,Quat,Mat4}from'./oop.js';class Frustum {
  nearPoints = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
  farPoints = [new Vec3(), new Vec3(), new Vec3(), new Vec3()];
  planes = [
    new Plane(),
    new Plane(),
    new Plane(),
    new Plane(),
    new Plane(),
    new Plane()
  ];
  pos = new Vec3();
  rot = new Quat();
  near = 0;
  far = 10;
  ratio = 1;
  fov = 45;
  near_w = 0;
  near_h = 0;
  far_w = 0;
  far_h = 0;
  setCamera(fovDeg, near, far, ratio) {
    this.fov = fovDeg * Math.PI / 180;
    this.near = near;
    this.far = far;
    this.ratio = ratio;
    const ang = 2 * Math.tan(this.fov / 2);
    this.near_h = ang * this.near * 0.5;
    this.near_w = this.near_h * this.ratio;
    this.far_h = ang * this.far * 0.5;
    this.far_w = this.far_h * this.ratio;
    return this;
  }
  setFromProjection(proj, near = 0, far = 0) {
    const topFov = (proj[9] + 1) / proj[5];
    const rightFov = (proj[8] + 1) / proj[0];
    this.near = near || proj[14] / (proj[10] - 1);
    this.far = far || proj[14] / (proj[10] + 1);
    this.near_w = this.near * rightFov;
    this.near_h = this.near * topFov;
    this.far_w = this.far * rightFov;
    this.far_h = this.far * topFov;
    return this;
  }
  setPos(p) {
    this.pos.copy(p);
    return this;
  }
  setRot(r) {
    this.rot.copy(r);
    return this;
  }
  getLineOfSight() {
    const dir = new Vec3().fromQuat(this.rot, [0, 0, -1]);
    return [
      this.pos.clone(),
      new Vec3().fromScale(dir, this.far).add(this.pos)
    ];
  }
  update() {
    const xAxis = new Vec3().fromQuat(this.rot, [1, 0, 0]);
    const yAxis = new Vec3().fromQuat(this.rot, [0, 1, 0]);
    const zAxis = new Vec3().fromQuat(this.rot, [0, 0, -1]);
    const yAxisH = new Vec3();
    const xAxisH = new Vec3();
    const v = new Vec3();
    xAxisH.fromScale(xAxis, this.near_w);
    yAxisH.fromScale(yAxis, this.near_h);
    v.fromScaleThenAdd(this.near, zAxis, this.pos);
    this.nearPoints[0].fromAdd(v, yAxisH).sub(xAxisH);
    this.nearPoints[1].fromSub(v, yAxisH).sub(xAxisH);
    this.nearPoints[2].fromSub(v, yAxisH).add(xAxisH);
    this.nearPoints[3].fromAdd(v, yAxisH).add(xAxisH);
    xAxisH.fromScale(xAxis, this.far_w);
    yAxisH.fromScale(yAxis, this.far_h);
    v.fromScaleThenAdd(this.far, zAxis, this.pos);
    this.farPoints[0].fromAdd(v, yAxisH).sub(xAxisH);
    this.farPoints[1].fromSub(v, yAxisH).sub(xAxisH);
    this.farPoints[2].fromSub(v, yAxisH).add(xAxisH);
    this.farPoints[3].fromAdd(v, yAxisH).add(xAxisH);
    const fp = this.farPoints;
    const np = this.nearPoints;
    this.planes[4].fromQuad(np[0], np[1], np[2], np[3]);
    this.planes[5].fromQuad(fp[3], fp[2], fp[1], fp[0]);
    for (let i = 0; i < 4; i++) {
      const ii = (i + 1) % 4;
      this.planes[i].fromQuad(fp[i], fp[ii], np[ii], np[i]);
    }
    return this;
  }
  intersectAABB(min, max) {
    const vmin = [0, 0, 0];
    const vmax = [0, 0, 0];
    let rtn = 1;
    for (const p of this.planes) {
      const n = p.norm;
      if (n[0] > 0) {
        vmin[0] = min[0];
        vmax[0] = max[0];
      } else {
        vmin[0] = max[0];
        vmax[0] = min[0];
      }
      if (n[1] > 0) {
        vmin[1] = min[1];
        vmax[1] = max[1];
      } else {
        vmin[1] = max[1];
        vmax[1] = min[1];
      }
      if (n[2] > 0) {
        vmin[2] = min[2];
        vmax[2] = max[2];
      } else {
        vmin[2] = max[2];
        vmax[2] = min[2];
      }
      if (Vec3.dot(n, vmin) + p.d > 0)
        return -1;
      if (Vec3.dot(n, vmax) + p.d >= 0)
        rtn = 0;
    }
    return rtn;
  }
  intersectBox(min, max) {
    const v = [0, 0, 0];
    for (const p of this.planes) {
      v[0] = p.norm[0] < 0 ? max[0] : min[0];
      v[1] = p.norm[1] < 0 ? max[1] : min[1];
      v[2] = p.norm[2] < 0 ? max[2] : min[2];
      if (Vec3.dot(p.norm, v) + p.d > 0)
        return false;
    }
    return true;
  }
  intersectSphere(pos, radius) {
    for (const p of this.planes) {
      if (Vec3.dot(p.norm, pos) + p.d > radius)
        return false;
    }
    return true;
  }
  containsPoint(pos) {
    for (const p of this.planes) {
      if (Vec3.dot(p.norm, pos) + p.d > 0)
        return false;
    }
    return true;
  }
}
class Plane {
  pos = new Vec3();
  norm = new Vec3();
  d = 0;
  constructor(pos = null, norm = null) {
    if (pos && norm)
      this.set(pos, norm);
  }
  set(pos, norm) {
    this.pos.copy(pos);
    this.norm.copy(norm);
    this.d = -Vec3.dot(norm, pos);
    return this;
  }
  fromTriangle(a, b, c) {
    const ab = new Vec3().fromSub(a, b);
    const cb = new Vec3().fromSub(c, b);
    const norm = new Vec3().fromCross(cb, ab).norm();
    this.set(a, norm);
    return this;
  }
  fromQuad(lt, lb, rb, rt) {
    this.pos.fromAdd(lt, lb).add(rb).add(rt).scale(0.25);
    const a = new Vec3().fromSub(rt, lt);
    const b = new Vec3().fromSub(lb, lt);
    this.norm.fromCross(b, a).norm();
    this.d = -Vec3.dot(this.norm, this.pos);
    return this;
  }
  negate() {
    this.norm[0] = -this.norm[0];
    this.norm[1] = -this.norm[1];
    this.norm[2] = -this.norm[2];
    this.d = -this.d;
    return this;
  }
  pointDistance(pnt) {
    return Vec3.dot(this.norm, pnt) + this.d;
  }
  sphereDistance(c, radius) {
    return Vec3.dot(this.norm, c) + this.d - radius;
  }
  projectPoint(p, out = new Vec3()) {
    const dist = this.pointDistance(p);
    return out.fromScaleThenAdd(-dist, this.norm, p);
  }
}class Ray {
  posStart = new Vec3();
  posEnd = new Vec3();
  direction = new Vec3();
  vecLength = new Vec3();
  fromEndPoints(a, b) {
    this.posStart.copy(a);
    this.posEnd.copy(b);
    this.vecLength.fromSub(b, a);
    this.direction.fromNorm(this.vecLength);
    return this;
  }
  fromScreenProjection(x, y, w, h, projMatrix, camMatrix) {
    const nx = x / w * 2 - 1;
    const ny = 1 - y / h * 2;
    const invMatrix = new Mat4().fromInvert(projMatrix).pmul(camMatrix);
    const clipNear = [nx, ny, -1, 1];
    const clipFar = [nx, ny, 1, 1];
    invMatrix.transformVec4(clipNear);
    invMatrix.transformVec4(clipFar);
    for (let i = 0; i < 3; i++) {
      clipNear[i] /= clipNear[3];
      clipFar[i] /= clipFar[3];
    }
    this.posStart.copy(clipNear);
    this.posEnd.copy(clipFar);
    this.vecLength.fromSub(this.posEnd, this.posStart);
    this.direction.fromNorm(this.vecLength);
    return this;
  }
  posAt(t, out = [0, 0, 0]) {
    out[0] = this.vecLength[0] * t + this.posStart[0];
    out[1] = this.vecLength[1] * t + this.posStart[1];
    out[2] = this.vecLength[2] * t + this.posStart[2];
    return out;
  }
  directionAt(len, out = [0, 0, 0]) {
    out[0] = this.direction[0] * len + this.posStart[0];
    out[1] = this.direction[1] * len + this.posStart[1];
    out[2] = this.direction[2] * len + this.posStart[2];
    return out;
  }
  clone() {
    const r = new Ray();
    r.posStart.copy(this.posStart);
    r.posEnd.copy(this.posEnd);
    r.direction.copy(this.direction);
    r.vecLength.copy(this.vecLength);
    return r;
  }
  transformMat4(m) {
    this.fromEndPoints(
      m.transformVec3(this.posStart, [0, 0, 0]),
      m.transformVec3(this.posEnd, [0, 0, 0])
    );
    return this;
  }
}function intersectPlane(ray, planePos, planeNorm) {
  const denom = Vec3.dot(ray.vecLength, planeNorm);
  if (denom <= 1e-6 && denom >= -1e-6)
    return null;
  const offset = [
    planePos[0] - ray.posStart[0],
    planePos[1] - ray.posStart[1],
    planePos[2] - ray.posStart[2]
  ];
  const t = Vec3.dot(offset, planeNorm) / denom;
  return t >= 0 ? t : null;
}function intersectQuad(ray, centerPos, w, h) {
  const v0 = new Vec3().fromAdd(centerPos, [-w, h, 0]);
  const v1 = new Vec3().fromAdd(centerPos, [-w, -h, 0]);
  const v2 = new Vec3().fromAdd(centerPos, [w, -h, 0]);
  const a = new Vec3().fromSub(v0, v1);
  const b = new Vec3().fromSub(v2, v1);
  const norm = new Vec3().fromCross(b, a).norm();
  const t = intersectPlane(ray, centerPos, norm);
  if (t == null)
    return null;
  const ip = ray.posAt(t);
  let tt = 0;
  a.fromSub(ip, v0);
  b.fromSub(v1, v0);
  tt = Vec3.dot(a, b) / Vec3.lenSqr(b);
  if (tt < 0 || tt > 1)
    return null;
  a.fromSub(ip, v1);
  b.fromSub(v2, v2);
  tt = Vec3.dot(a, b) / Vec3.lenSqr(b);
  return tt < 0 || tt > 1 ? null : t;
}function intersectCircle(ray, radius, planePos, planeNorm) {
  const t = intersectPlane(ray, planePos, planeNorm);
  if (t == null)
    return null;
  const pnt = ray.posAt(t);
  const lenSq = Vec3.distSqr(pnt, planePos);
  return lenSq <= radius * radius ? t : null;
}function intersectTri(ray, v0, v1, v2, out, cullFace = true) {
  const v0v1 = new Vec3(v1).sub(v0);
  const v0v2 = new Vec3(v2).sub(v0);
  const pvec = new Vec3().fromCross(ray.direction, v0v2);
  const det = Vec3.dot(v0v1, pvec);
  if (cullFace && det < 1e-6)
    return false;
  const idet = 1 / det;
  const tvec = new Vec3(ray.posStart).sub(v0);
  const u = Vec3.dot(tvec, pvec) * idet;
  if (u < 0 || u > 1)
    return false;
  const qvec = new Vec3().fromCross(tvec, v0v1);
  const v = Vec3.dot(ray.direction, qvec) * idet;
  if (v < 0 || u + v > 1)
    return false;
  if (out) {
    const len = Vec3.dot(v0v2, qvec) * idet;
    ray.directionAt(len, out);
  }
  return true;
}function intersectAABB(ray, min, max) {
  const tMin = new Vec3(min).sub(ray.posStart);
  const tMax = new Vec3(max).sub(ray.posStart);
  tMin.div(ray.direction);
  tMax.div(ray.direction);
  const t1 = new Vec3(tMin).min(tMax);
  const t2 = new Vec3(tMin).max(tMax);
  const tNear = Math.max(t1[0], t1[1], t1[2]);
  const tFar = Math.min(t2[0], t2[1], t2[2]);
  return tNear < tFar ? [tNear, tFar] : null;
}class RaySphereResult {
  tMin = 0;
  tMax = 0;
  posEntry = [0, 0, 0];
  posExit = [0, 0, 0];
}
function intersectSphere(ray, origin, radius, results) {
  const radiusSq = radius * radius;
  const rayToCenter = new Vec3(origin).sub(ray.posStart);
  const tProj = Vec3.dot(rayToCenter, ray.direction);
  const oppLenSq = Vec3.lenSqr(rayToCenter) - tProj * tProj;
  if (oppLenSq > radiusSq)
    return false;
  if (results) {
    if (oppLenSq == radiusSq) {
      results.tMin = tProj;
      results.tMax = tProj;
      ray.directionAt(tProj, results.posEntry);
      results.posExit[0] = results.posEntry[0];
      results.posExit[1] = results.posEntry[1];
      results.posExit[2] = results.posEntry[2];
      return true;
    }
    const oLen = Math.sqrt(radiusSq - oppLenSq);
    const t0 = tProj - oLen;
    const t1 = tProj + oLen;
    if (t1 < t0) {
      results.tMin = t1;
      results.tMax = t0;
    } else {
      results.tMin = t0;
      results.tMax = t1;
    }
    ray.directionAt(t0, results.posEntry);
    ray.directionAt(t1, results.posExit);
  }
  return true;
}class RayCapsuleResult {
  pos = [0, 0, 0];
  t = 0;
}
function intersectCapsule(ray, radius, vecStart, vecEnd, result) {
  const A = vecStart;
  const B = vecEnd;
  const radiusSq = radius * radius;
  const AB = new Vec3(B).sub(A);
  const AO = new Vec3(ray.posStart).sub(A);
  const AOxAB = new Vec3().fromCross(AO, AB);
  const VxAB = new Vec3().fromCross(ray.direction, AB);
  const ab2 = Vec3.lenSqr(AB);
  const a = Vec3.lenSqr(VxAB);
  const b = 2 * Vec3.dot(VxAB, AOxAB);
  const c = Vec3.lenSqr(AOxAB) - radiusSq * ab2;
  const d = b * b - 4 * a * c;
  if (d < 0)
    return false;
  const t = (-b - Math.sqrt(d)) / (2 * a);
  if (t < 0) {
    const pos = Vec3.distSqr(A, ray.posStart) < Vec3.distSqr(B, ray.posStart) ? A : B;
    if (result) {
      const sphereResult2 = new RaySphereResult();
      const isHit2 = intersectSphere(ray, pos, radius, sphereResult2);
      if (isHit2) {
        result.t = sphereResult2.tMin;
        result.pos[0] = sphereResult2.posEntry[0];
        result.pos[1] = sphereResult2.posEntry[1];
        result.pos[2] = sphereResult2.posEntry[2];
      }
      return isHit2;
    } else
      return intersectSphere(ray, pos, radius, result);
  }
  const iPos = ray.directionAt(t);
  const iPosLen = new Vec3(iPos).sub(A);
  const tLimit = Vec3.dot(iPosLen, AB) / ab2;
  const sphereResult = result ? new RaySphereResult() : void 0;
  let isHit = false;
  if (tLimit >= 0 && tLimit <= 1) {
    if (result) {
      result.t = t;
      result.pos[0] = iPos[0];
      result.pos[1] = iPos[1];
      result.pos[2] = iPos[2];
    }
    return true;
  } else if (tLimit < 0)
    isHit = intersectSphere(ray, A, radius, sphereResult);
  else if (tLimit > 1)
    isHit = intersectSphere(ray, B, radius, sphereResult);
  if (isHit && result && sphereResult) {
    result.t = t;
    result.pos[0] = sphereResult.posEntry[0];
    result.pos[1] = sphereResult.posEntry[1];
    result.pos[2] = sphereResult.posEntry[2];
  }
  return isHit;
}class RayObbResult {
  posEntry = new Vec3();
  posExit = new Vec3();
  tMin = 0;
  tMax = 0;
  normEntry = new Vec3();
  normExit = new Vec3();
}
function intersectObb(ray, center, xDir, yDir, zDir, halfLen, result) {
  const rayDelta = new Vec3(center).sub(ray.posStart);
  let tMin = 0;
  let tMax = 1e6;
  let minAxis = 0;
  let maxAxis = 0;
  let axis;
  let nomLen;
  let denomLen;
  let tmp;
  let min;
  let max;
  const list = [xDir, yDir, zDir];
  for (let i = 0; i < 3; i++) {
    axis = list[i];
    nomLen = Vec3.dot(axis, rayDelta);
    denomLen = Vec3.dot(ray.vecLength, axis);
    if (Math.abs(denomLen) > 1e-5) {
      min = (nomLen - halfLen[i]) / denomLen;
      max = (nomLen + halfLen[i]) / denomLen;
      if (min > max) {
        tmp = min;
        min = max;
        max = tmp;
      }
      if (min > tMin) {
        tMin = min;
        minAxis = i;
      }
      if (max < tMax) {
        tMax = max;
        maxAxis = i;
      }
      if (tMax < tMin)
        return false;
    } else if (-nomLen - halfLen[i] > 0 || -nomLen + halfLen[i] < 0)
      return false;
  }
  if (result) {
    result.tMin = tMin;
    result.tMax = tMax;
    ray.posAt(tMin, result.posEntry);
    ray.posAt(tMax, result.posExit);
    const tmp2 = new Vec3();
    result.normEntry.copy(list[minAxis]);
    tmp2.fromSub(ray.posStart, result.posEntry);
    if (Vec3.dot(tmp2, result.normEntry) < 0)
      result.normEntry.negate();
    result.normExit.copy(list[maxAxis]);
    tmp2.fromSub(ray.posStart, result.posExit);
    if (Vec3.dot(tmp2, result.normExit) > 0)
      result.normExit.negate();
  }
  return true;
}function nearPoint(ray, p, distLimit = 0.1) {
  const v = new Vec3(p).sub(ray.posStart).mul(ray.vecLength);
  const t = (v[0] + v[1] + v[2]) / Vec3.lenSqr(ray.vecLength);
  if (t < 0 || t > 1)
    return null;
  const lenSqr = Vec3.distSqr(ray.posAt(t, v), p);
  return lenSqr <= distLimit * distLimit ? t : null;
}class NearSegmentResult {
  segPosition = [0, 0, 0];
  rayPosition = [0, 0, 0];
  distanceSq = 0;
  distance = 0;
}
function nearSegment(ray, p0, p1, results) {
  const u = new Vec3(p1).sub(p0);
  const v = ray.vecLength;
  const w = new Vec3(p0).sub(ray.posStart);
  const a = Vec3.dot(u, u);
  const b = Vec3.dot(u, v);
  const c = Vec3.dot(v, v);
  const d = Vec3.dot(u, w);
  const e = Vec3.dot(v, w);
  const D = a * c - b * b;
  let tU = 0;
  let tV = 0;
  if (D < 1e-6) {
    tU = 0;
    tV = b > c ? d / b : e / c;
  } else {
    tU = (b * e - c * d) / D;
    tV = (a * e - b * d) / D;
  }
  if (tU < 0 || tU > 1 || tV < 0 || tV > 1)
    return null;
  if (results) {
    const ti = 1 - tU;
    results.segPosition[0] = p0[0] * ti + p1[0] * tU;
    results.segPosition[1] = p0[1] * ti + p1[1] * tU;
    results.segPosition[2] = p0[2] * ti + p1[2] * tU;
    ray.posAt(tV, results.rayPosition);
    results.distanceSq = Vec3.distSqr(results.segPosition, results.rayPosition);
    results.distance = Math.sqrt(results.distanceSq);
  }
  return [tU, tV];
}export{Frustum,NearSegmentResult,Ray,RayCapsuleResult,RayObbResult,RaySphereResult,intersectAABB,intersectCapsule,intersectCircle,intersectObb,intersectPlane,intersectQuad,intersectSphere,intersectTri,nearPoint,nearSegment};