import type { TVec3, TVec4, TVec4Struct } from '../global';
import Vec3 from './Vec3';
export default class Quat extends Float32Array {
    static BYTESIZE: number;
    constructor(v?: TVec4);
    xyzw(x: number, y: number, z: number, w: number): Quat;
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    get z(): number;
    set z(v: number);
    get w(): number;
    set w(v: number);
    /** Create a new Quat object with a copy of this vector's data */
    clone(): Quat;
    /** Reset all components to zero */
    reset(): Quat;
    /** Convert value to a string value */
    toString(rnd?: number): string;
    isZero(): boolean;
    /** Length / Magnitude squared of the vector. Good for quick simple testing */
    lenSqr(): number;
    len(): number;
    /** Copy data from a struct vector type. ThreeJS compatilbility */
    fromStruct(v: TVec4Struct): Quat;
    /** Copy data to a struct vector type. ThreeJS compatilbility */
    toStruct(v: TVec4Struct): Quat;
    /** Copy in quaternion data */
    copy(v: TVec4): Quat;
    /** Copy data to another quaternion. Good in chaining operations when you want a copy of a quaternion before continuing operations */
    copyTo(v: TVec4): Quat;
    /** Used to get data from a flat buffer of vectors */
    fromBuf(ary: Array<number> | Float32Array, idx: number): Quat;
    /** Put data into a flat buffer of quaternions */
    toBuf(ary: Array<number> | Float32Array, idx: number): Quat;
    /** Push quaternion components onto an array */
    pushTo(ary: Array<number>): Quat;
    getAxisAngle(): Array<number>;
    getAngle(): number;
    getAxis(out?: TVec3): TVec3;
    fromPolar(lon: number, lat: number, up?: TVec3): Quat;
    toPolar(): Array<number>;
    fromAxis(xAxis: TVec3, yAxis: TVec3, zAxis: TVec3): Quat;
    fromLook(vDir: TVec3, vUp: TVec3): Quat;
    fromInvert(q: TVec4): Quat;
    fromNegate(q: TVec4): this;
    /** Axis must be normlized, Angle is in Rads  */
    fromAxisAngle(axis: TVec3, angle: number): Quat;
    /** Using unit vectors, Shortest rotation from Direction A to Direction B  */
    fromUnitVecs(a: TVec3, b: TVec3): Quat;
    fromMat3(m: Array<number>): Quat;
    fromMat4(mat: Array<number>): Quat;
    getEuler(out?: TVec3, inDeg?: boolean): TVec3;
    /** order="YXZ", Values in Degrees, will be converted to Radians by function*/
    fromEuler(x: TVec3): Quat;
    fromEuler(x: number, y: number, z: number): Quat;
    /**order="YXZ", Values in Degrees, will be converted to Radians by function */
    fromEulerXY(x: number, y: number): Quat;
    fromEulerOrder(x: number, y: number, z: number, order?: string): Quat;
    fromAngularVec(v: TVec3): Quat;
    toAngularVec(out?: Vec3): Vec3;
    fromMul(a: TVec4, b: TVec4): Quat;
    fromNBlend(a: TVec4, b: TVec4, t: number): this;
    fromLerp(a: TVec4, b: TVec4, t: number): this;
    fromNLerp(a: TVec4, b: TVec4, t: number): this;
    fromSlerp(a: TVec4, b: TVec4, t: number): this;
    norm(): this;
    invert(): Quat;
    negate(): Quat;
    /** Checks if on opposite hemisphere, if so, negate this quat */
    dotNegate(q: TVec4): Quat;
    conjugate(): Quat;
    mirrorX(): Quat;
    random(): Quat;
    scaleAngle(scl: number): Quat;
    transformVec3(v: TVec3): TVec3;
    rotX(rad: number): Quat;
    rotY(rad: number): Quat;
    rotZ(rad: number): Quat;
    rotDeg(deg: number, axis?: string): Quat;
    /** Multiple Quaternions onto this Quaternion */
    mul(q: TVec4): Quat;
    /** PreMultiple Quaternions onto this Quaternion */
    pmul(q: TVec4): Quat;
    /** Multiple an Axis Angle */
    mulAxisAngle(axis: TVec3, angle: number): Quat;
    /** PreMultiple an Axis Angle to this quaternions */
    pmulAxisAngle(axis: TVec3, angle: number): Quat;
    /** Inverts the quaternion passed in, then pre multiplies to this quaternion. */
    pmulInvert(q: TVec4): Quat;
    /** Apply Unit Vector Rotation to Quaternion */
    mulUnitVecs(a: TVec3, b: TVec3): Quat;
    static dot(a: TVec4, b: TVec4): number;
    static lenSqr(a: TVec4, b: TVec4): number;
}
