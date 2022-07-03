import type { TVec3, TVec2, TVec4, TVec3Struct } from '../global';
declare class vec3 {
    static AXIS: number[][];
    static UP: number[];
    static DOWN: number[];
    static LEFT: number[];
    static RIGHT: number[];
    static FORWARD: number[];
    static BACK: number[];
    static ZERO: number[];
    static lenSq(a: TVec3): number;
    static lenSq(a: TVec3, b: TVec3): number;
    static len(a: TVec3): number;
    static len(a: TVec3, b: TVec3): number;
    static dot(a: TVec3, b: TVec3): number;
    static angle(a: TVec3, b: TVec3): number;
    static equal(a: TVec3, b: TVec3): boolean;
    /** Copy data from a struct vector type. ThreeJS compatilbility */
    static fromStruct(v: TVec3Struct, out: TVec3): TVec3;
    /** Test if all components equal zero */
    static isZero(a: TVec3): boolean;
    /** Convert value to a string value */
    static toString(a: TVec3, rnd?: number): string;
    static toKey(a: TVec3, place?: number): string;
    /** Return the Index of which axis has the smallest number */
    static minAxis(a: TVec3): number;
    /** Return the Index of which axis has the smallest number */
    static maxAxis(a: TVec3): number;
    /** Create an array filled with Vec3 Objects */
    static createVecArray(len: number): Array<TVec3>;
    static flattenVecArray(ary: Array<TVec3>): Array<number>;
    /** Reset all components to zero */
    static reset(out: TVec3): TVec3;
    static copy(a: TVec3, out: TVec3): TVec3;
    static fromVec2(v: TVec2, useZ: boolean, out: TVec3): TVec3;
    /** Copy data to a struct vector type. ThreeJS compatilbility */
    static toStruct(a: TVec3, out: TVec3Struct): TVec3Struct;
    /** Generate a random vector. Can choose per axis range */
    static rnd(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, out: TVec3): TVec3;
    /** Used to get data from a flat buffer of vectors, useful when building geometery */
    static fromBuf(ary: Array<number> | Float32Array, idx: number, out: TVec3): TVec3;
    /** Put data into a flat buffer of vectors, useful when building geometery */
    static toBuf(a: TVec3, ary: Array<number> | Float32Array, idx: number): void;
    /** Pust vector components onto an array, useful when building geometery */
    static pushTo(a: TVec3, ary: Array<number>): number;
    /** Create an Iterator Object that allows an easy way to loop a Float32Buffer
     * @example
     * let buf = new Float32Array( 3 * 10 );
     * for( let v of vec3.bufIter( buf ) ) console.log( v );
    */
    static bufIter(buf: Array<number> | Float32Array): {
        [Symbol.iterator](): {
            next: () => {
                value: TVec3;
                done: boolean;
            };
        };
    };
    /** Loop through a buffer array and use a function to update each vector
         * @example
         * let verts = [ 0,0,0, 0,0,0 ];
         * let dir   = [ 0,1,0 ];
         * vec3.bufMap( vertices, (v,i)=>v.add( dir ) ); */
    static bufMap(buf: Array<number> | Float32Array, fn: (v: TVec3, i: number) => void, startIdx?: number, endIdx?: number): void;
    static lerp(a: TVec3, b: TVec3, t: number, out?: TVec3): TVec3;
    static nlerp(a: TVec3, b: TVec3, t: number, out: TVec3): TVec3;
    static slerp(a: TVec3, b: TVec3, t: number, out: TVec3): TVec3;
    static hermite(a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number, out: TVec3): TVec3;
    static bezier(a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number, out: TVec3): TVec3;
    static cubic(a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number, out: TVec3): TVec3;
    static rotate(a: TVec3, rad: number, axis?: string, out?: TVec3): TVec3;
    /** Axis Rotation of a Vector */
    static axisAngle(v: TVec3, axis: TVec3, rad: number, out?: TVec3): TVec3;
    static transformQuat(v: TVec3, q: TVec4, out?: TVec3): TVec3;
    static transformMat3(a: TVec3, m: Array<number> | Float32Array, out?: TVec3): TVec3;
    static transformMat4(a: TVec3, m: Array<number> | Float32Array, out?: TVec3): TVec3;
    static add(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static sub(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static mul(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static div(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static scale(a: TVec3, s: number, out?: TVec3): TVec3;
    static scaleThenAdd(v: TVec3, s: number, add: TVec3, out?: TVec3): TVec3;
    static divScale(a: TVec3, s: number, out?: TVec3): TVec3;
    static norm(a: TVec3, out?: TVec3): TVec3;
    static invert(a: TVec3, out?: TVec3): TVec3;
    static negate(a: TVec3, out?: TVec3): TVec3;
    static cross(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static reflect(dir: TVec3, norm: TVec3, out: TVec3): TVec3;
    static abs(a: TVec3, out?: TVec3): TVec3;
    static floor(a: TVec3, out?: TVec3): TVec3;
    static ceil(a: TVec3, out?: TVec3): TVec3;
    static min(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static max(a: TVec3, b: TVec3, out?: TVec3): TVec3;
    static clamp(a: TVec3, min: TVec3, max: TVec3, out?: TVec3): TVec3;
    /** When values are very small, like less then 0.000001, just make it zero */
    static nearZero(a: TVec3, out?: TVec3): TVec3;
    static snap(a: TVec3, s: TVec3, out?: TVec3): TVec3;
    static damp(a: TVec3, b: TVec3, lambda: number, dt: number, out: TVec3): TVec3;
    /** Normal Direction of a Triangle */
    static project(from: TVec3, to: TVec3, out: TVec3): TVec3;
    static projectScale(from: TVec3, to: TVec3): number;
    /** Project Postion onto a Plane */
    static planeProj(v: TVec3, planeNorm: TVec3, planePos: TVec3, out: TVec3): TVec3;
    static triNorm(a: TVec3, b: TVec3, c: TVec3, out: TVec3): TVec3;
    static polar(lon: number, lat: number, out: TVec3): TVec3;
    static orthogonal(a: TVec3, out?: TVec3): TVec3;
    static clone(a: TVec3): TVec3;
    /** Handle Simple 90 Degree Rotations without the use of Quat, Trig, Matrices */
    static xp(v: TVec3, o: TVec3): TVec3;
    static xn(v: TVec3, o: TVec3): TVec3;
    static x2(v: TVec3, o: TVec3): TVec3;
    static yp(v: TVec3, o: TVec3): TVec3;
    static yn(v: TVec3, o: TVec3): TVec3;
    static y2(v: TVec3, o: TVec3): TVec3;
    static zp(v: TVec3, o: TVec3): TVec3;
    static zn(v: TVec3, o: TVec3): TVec3;
    static z2(v: TVec3, o: TVec3): TVec3;
    static xp_yn(v: TVec3, o: TVec3): TVec3;
    static xp_yp(v: TVec3, o: TVec3): TVec3;
    static xp_yp_yp(v: TVec3, o: TVec3): TVec3;
    static xp_xp(v: TVec3, o: TVec3): TVec3;
    static yn2(v: TVec3, o: TVec3): TVec3;
}
export default vec3;
