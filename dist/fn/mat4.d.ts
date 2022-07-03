import { TMat3, TMat4, TVec3, TVec4, TVec8 } from "../global";
declare class mat4 {
    static identity(out?: TMat4): TMat4;
    static clearTranslation(m: TMat4, out?: TMat4): TMat4;
    static copy(mat: TMat4, out: TMat4): TMat4;
    static determinant(m: TMat4): number;
    /** Frobenius norm of a Matrix */
    static frob(m: TMat4): number;
    static perspective(fovy: number, aspect: number, near: number, far: number, out?: TMat4): TMat4;
    static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: TMat4): TMat4;
    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number, out?: TMat4): TMat4;
    static fromQuatTranScale(q: TVec4, v: TVec3, s: TVec3, out?: TMat4): TMat4;
    static fromQuatTran(q: TVec4, v: TVec3, out?: TMat4): TMat4;
    static fromQuat(q: TVec4, out?: TMat4): TMat4;
    /** Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin */
    static fromQuatTranScaleOrigin(q: TVec4, v: TVec3, s: TVec3, o: TVec3, out?: TMat4): TMat4;
    static fromDualQuat(a: TVec8, out?: TMat4): TMat4;
    /** out creates a View Matrix, not a World Matrix. Use fromTarget for a World Matrix */
    static fromLook(eye: TVec3, center: TVec3, up: TVec3, out?: TMat4): TMat4;
    /** out creates a World Matrix, not a View Matrix. Use fromLook for a View Matrix */
    static fromTarget(eye: TVec3, target: TVec3, up: TVec3, out?: TMat4): TMat4;
    static fromAxisAngle(axis: TVec3, rad: number, out?: TMat4): TMat4;
    static fromRotX(rad: number, out?: TMat4): TMat4;
    static fromRotY(rad: number, out?: TMat4): TMat4;
    static fromRotZ(rad: number, out?: TMat4): TMat4;
    /** Used to get data from a flat buffer of matrices */
    static fromBuf(ary: Array<number> | Float32Array, idx: number, out?: TMat4): TMat4;
    /** Put data into a flat buffer of matrices */
    static toBuf(ary: Array<number> | Float32Array, idx: number, m: TMat4): void;
    static add(a: TMat4, b: TMat4, out?: TMat4): TMat4;
    static sub(a: TMat4, b: TMat4, out?: TMat4): TMat4;
    static mul(a: TMat4, b: TMat4, out?: TMat4): TMat4;
    static invert(mat: TMat4, out?: TMat4): TMat4;
    static translate(a: TMat4, v: TVec3, out?: TMat4): TMat4;
    static scale(a: TMat4, v: TVec3, out?: TMat4): TMat4;
    /** Make the rows into the columns */
    static transpose(m: TMat4, out?: TMat4): TMat4;
    static adjugate(a: TMat4, out?: TMat4): TMat4;
    static rotX(m: TMat4, rad: number, out?: TMat4): TMat4;
    static rotY(m: TMat4, rad: number, out?: TMat4): TMat4;
    static rotZ(m: TMat4, rad: number, out?: TMat4): TMat4;
    static rotAxisAngle(m: TMat4, axis: TVec3, rad: number, out?: TMat4): TMat4;
    static transformVec3(m: TMat4, v: TVec3, out?: TVec3): TVec3;
    static transformVec4(m: TMat4, v: TVec4, out?: TVec4): TVec4;
    static toNormalMat3(m: TMat4, out?: TMat3): TMat3;
    static getTranslation(m: TMat4, out?: TVec3): TVec3;
    static getScale(m: TMat4, out?: TVec3): TVec3;
    static getQuaternion(m: TMat4, out?: TVec4): TVec3;
    static decompose(m: TMat4, out_r: TVec4, out_t: TVec3, out_s: TVec3): void;
}
export default mat4;
