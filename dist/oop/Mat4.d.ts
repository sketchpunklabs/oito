import { TMat3, TMat4, TVec3, TVec4, TVec8 } from "../global";
declare class Mat4 extends Float32Array {
    static BYTESIZE: number;
    constructor();
    identity(): this;
    clearTranslation(): this;
    copy(mat: TMat4, offset?: number): this;
    copyTo(out: TMat4): this;
    determinant(): number;
    /** Frobenius norm of a Matrix */
    frob(): number;
    getTranslation(out?: TVec3): TVec3;
    getScale(out?: TVec3): TVec3;
    getRotation(out?: TVec4): TVec3;
    fromPerspective(fovy: number, aspect: number, near: number, far: number): this;
    fromOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
    fromMul(a: TMat4, b: TMat4): this;
    fromInvert(mat: TMat4): this;
    fromAdjugate(a: TMat4): this;
    fromFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
    fromQuatTranScale(q: TVec4, v: TVec3, s: TVec3): this;
    fromQuatTran(q: TVec4, v: TVec3): this;
    fromQuat(q: TVec4): this;
    /** Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin */
    fromQuatTranScaleOrigin(q: TVec4, v: TVec3, s: TVec3, o: TVec3): this;
    fromDualQuat(a: TVec8): this;
    /** This creates a View Matrix, not a World Matrix. Use fromTarget for a World Matrix */
    fromLook(eye: TVec3, center: TVec3, up: TVec3): this;
    /** This creates a World Matrix, not a View Matrix. Use fromLook for a View Matrix */
    fromTarget(eye: TVec3, target: TVec3, up: TVec3): this;
    fromAxisAngle(axis: TVec3, rad: number): this;
    fromRotX(rad: number): this;
    fromRotY(rad: number): this;
    fromRotZ(rad: number): this;
    toNormalMat3(out?: TMat3): TMat3;
    /** Used to get data from a flat buffer of matrices */
    fromBuf(ary: Array<number> | Float32Array, idx: number): this;
    /** Put data into a flat buffer of matrices */
    toBuf(ary: Array<number> | Float32Array, idx: number): this;
    add(b: TMat4): this;
    sub(b: TMat4): this;
    mul(b: TMat4): this;
    pmul(b: TMat4): this;
    invert(): this;
    translate(v: TVec3): this;
    translate(v: number, y: number, z: number): this;
    scale(x: number): this;
    scale(x: number, y: number, z: number): this;
    /** Make the rows into the columns */
    transpose(): this;
    decompose(out_r: TVec4, out_t: TVec3, out_s: TVec3): this;
    rotX(rad: number): this;
    rotY(rad: number): this;
    rotZ(rad: number): this;
    rotAxisAngle(axis: TVec3, rad: number): this;
    transformVec3(v: TVec3, out?: TVec3): TVec3;
    transformVec4(v: TVec4, out?: TVec4): TVec4;
    static mul(a: TMat4, b: TMat4): Mat4;
    static invert(a: TMat4): Mat4;
}
export default Mat4;
