import type { TVec2, TVec3, TVec4, TVec4Struct } from '../global';
export default class quat {
    /** Reset back to identity*/
    static reset(a: TVec4): TVec4;
    /** Copy in quaternion data */
    static copy(a: TVec4, out: TVec4): TVec4;
    /** Copy data from a struct vector type. ThreeJS compatilbility */
    static fromStruct(v: TVec4Struct, out?: TVec4): TVec4;
    /** Copy data to a struct vector type. ThreeJS compatilbility */
    static toStruct(a: TVec4, v: TVec4Struct): TVec4Struct;
    static fromPolar(lon: number, lat: number, up: TVec3, out?: TVec4): TVec4;
    static toPolar(a: TVec4, out?: TVec2): TVec2;
    /** Rotation based on 3 Orthoginal Directions */
    static fromAxis(xAxis: TVec3, yAxis: TVec3, zAxis: TVec3, out?: TVec4): TVec4;
    /** Using unit vectors, Shortest rotation from Direction A to Direction B  */
    static unitVecs(a: TVec3, b: TVec3, out?: TVec3): TVec4;
    static fromMat3(m: Array<number>, out?: TVec4): TVec4;
    static fromMat4(m: Array<number>, out?: TVec4): TVec4;
    /** Length / Magnitude squared of the vector. Good for quick simple testing */
    static lenSq(a: TVec4): number;
    static len(a: TVec4): number;
    /** Convert value to a string value */
    static toString(a: TVec4, rnd?: number): string;
    static isZero(a: TVec4): boolean;
    static random(out?: TVec4): TVec4;
    /** Used to get data from a flat buffer of vectors */
    fromBuf(ary: Array<number> | Float32Array, idx: number, out?: TVec4): TVec4;
    /** Put data into a flat buffer of quaternions */
    toBuf(a: TVec4, ary: Array<number> | Float32Array, idx: number): void;
    /** Push quaternion components onto an array */
    pushTo(a: TVec4, ary: Array<number>): void;
    /** Axis must be normlized, Angle is in Rads */
    static axisAngle(axis: TVec3, angle: number, out?: TVec4): TVec4;
    static getAxisAngle(a: TVec4, out?: TVec4): TVec4;
    static getAngle(a: TVec4): number;
    static getAxis(a: TVec4, out?: TVec3): TVec3;
    static mul(a: TVec4, b: TVec4, out?: TVec4): TVec4;
    static norm(q: TVec4, out?: TVec4): TVec4;
    static invert(q: TVec4, out?: TVec4): TVec4;
    static look(vDir: TVec3, vUp: TVec3, out?: TVec4): TVec4;
    static negate(q: TVec4, out?: TVec4): TVec4;
    /** Checks if on opposite hemisphere, if so, negate this quat */
    static dotNegate(q: TVec4, by: TVec4, out?: TVec4): TVec4;
    static conjugate(q: TVec4, out?: TVec4): TVec4;
    static mirrorX(q: TVec4, out?: TVec4): TVec4;
    static scaleAngle(q: TVec4, scl: number, out?: TVec4): TVec4;
    static transformVec3(q: TVec4, v: TVec3, out?: TVec3): TVec3;
    static rotX(q: TVec4, rad: number, out?: TVec4): TVec4;
    static rotY(q: TVec4, rad: number, out?: TVec4): TVec4;
    static rotZ(q: TVec4, rad: number, out?: TVec4): TVec4;
    static rotDeg(q: TVec4, deg: number, axis?: string, out?: TVec4): TVec4;
    /** Multiple an Axis Angle */
    static mulAxisAngle(q: TVec4, axis: TVec3, angle: number, out?: TVec4): TVec4;
    /** PreMultiple an Axis Angle to this quaternions */
    static pmulAxisAngle(q: TVec4, axis: TVec3, angle: number, out?: TVec4): TVec4;
    /** Inverts the quaternion passed in, then pre multiplies to this quaternion. */
    static pmulInvert(q: TVec4, inv: TVec4, out?: TVec4): TVec4;
    /** Apply Unit Vector Rotation to Quaternion */
    static mulUnitVecs(q: TVec4, a: TVec3, b: TVec3, out?: TVec4): TVec4;
    static getEuler(q: TVec4, out?: TVec3, inDeg?: boolean): TVec3;
    /** order="YXZ", Values in Degrees, will be converted to Radians by function*/
    static fromEuler(v: TVec3, out?: TVec4): TVec4;
    /**order="YXZ", Values in Degrees, will be converted to Radians by function */
    static fromEulerXY(x: number, y: number, out?: TVec4): TVec4;
    static fromEulerOrder(x: number, y: number, z: number, out?: TVec4, order?: string): TVec4;
    static fromAngularVec(v: TVec3, out?: TVec4): TVec4;
    static toAngularVec(q: TVec4, out?: TVec3): TVec3;
    static lerp(a: TVec4, b: TVec4, t: number, out?: TVec4): TVec4;
    static nlerp(a: TVec4, b: TVec4, t: number, out?: TVec4): TVec4;
    static nblend(a: TVec4, b: TVec4, t: number, out?: TVec4): TVec4;
    static slerp(a: TVec4, b: TVec4, t: number, out?: TVec4): TVec4;
    static cubic(a: TVec4, b: TVec4, c: TVec4, d: TVec4, t: number, out?: TVec4): TVec4;
    static dot(a: TVec4, b: TVec4): number;
}
