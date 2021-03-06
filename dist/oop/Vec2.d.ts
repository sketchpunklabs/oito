import type { TVec2, TVec3 } from '../global';
declare class Vec2 extends Float32Array {
    static BYTESIZE: number;
    constructor();
    constructor(v: TVec2);
    constructor(v: number);
    constructor(x: number, y: number);
    /** Set the vector components */
    xy(x: number): Vec2;
    xy(x: number, y: number): this;
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    /** Create a new vec3 object with a copy of this vector's data */
    clone(): Vec2;
    copy(v: TVec2): this;
    /** Reset all components to zero */
    reset(): Vec2;
    /** Convert value to a string value */
    toString(rnd?: number): string;
    toArray(): Array<number>;
    /** Test if all components equal zero */
    isZero(): boolean;
    /** When values are very small, like less then 0.000001, just make it zero.*/
    nearZero(x?: number, y?: number): this;
    /** Generate a random vector. Can choose per axis range */
    rnd(x0?: number, x1?: number, y0?: number, y1?: number): this;
    angle(v?: Vec2): number;
    setLen(len: number): this;
    len(): number;
    lenSqr(): number;
    fromAngleLen(ang: number, len: number): this;
    fromAdd(a: TVec2, b: TVec2): this;
    fromSub(a: TVec2, b: TVec2): this;
    fromMul(a: TVec2, b: TVec2): this;
    fromScale(a: TVec2, s: number): this;
    fromLerp(a: TVec2, b: TVec2, t: number): this;
    fromVec3(v: TVec3, z_plane?: boolean): this;
    fromMax(a: TVec2, b: TVec2): this;
    fromMin(a: TVec2, b: TVec2): this;
    fromFloor(v: TVec2): this;
    fromFract(v: TVec2): this;
    fromNegate(a: TVec2): this;
    fromInvert(a: TVec2): this;
    /** Used to get data from a flat buffer of vectors, useful when building geometery */
    fromBuf(ary: Array<number> | Float32Array, idx: number): this;
    /** Put data into a flat buffer of vectors, useful when building geometery */
    toBuf(ary: Array<number> | Float32Array, idx: number): this;
    /** Pust vector components onto an array, useful when building geometery */
    pushTo(ary: Array<number>): this;
    add(v: TVec2): this;
    addRaw(x: number, y: number): this;
    sub(v: TVec2): this;
    subRaw(x: number, y: number): this;
    mul(v: TVec2): this;
    div(v: TVec2): this;
    scale(v: number): this;
    divScale(v: number): this;
    divInvScale(v: number, out: TVec2): TVec2;
    floor(out?: TVec2): TVec2;
    negate(): this;
    min(a: TVec2): this;
    max(a: TVec2): this;
    norm(): this;
    lerp(v: TVec2, t: number, out?: TVec2): TVec2;
    rotate(rad: number): this;
    rotateDeg(deg: number, out?: TVec2): TVec2;
    invert(out?: TVec2): TVec2;
    perpCW(): this;
    perpCCW(): this;
    static add(a: TVec2, b: TVec2): Vec2;
    static sub(a: TVec2, b: TVec2): Vec2;
    static scale(v: TVec2, s: number): Vec2;
    static floor(v: TVec2): Vec2;
    static fract(v: TVec2): Vec2;
    static lerp(v0: TVec2, v1: TVec2, t: number): Vec2;
    static len(v0: TVec2, v1: TVec2): number;
    static lenSqr(v0: TVec2, v1: TVec2): number;
    static dot(a: TVec2, b: TVec2): number;
    static det(a: TVec2, b: TVec2): number;
    static project(from: TVec2, to: TVec2): Vec2;
    static projectPlane(from: TVec2, to: TVec2, planeNorm: TVec2): Vec2;
    static rotateDeg(v: TVec2, deg: number): Vec2;
    static perpCW(v: TVec2): Vec2;
    static perpCCW(v: TVec2): Vec2;
    /** Create an Iterator Object that allows an easy way to loop a Float32Buffer
     * @example
     * let buf = new Float32Array( 2 * 10 );
     * for( let v of Vec3.bufIter( buf ) ) console.log( v );
    */
    static bufIter(buf: Array<number> | Float32Array): {
        [Symbol.iterator](): {
            next: () => {
                value: Vec2;
                done: boolean;
            };
        };
    };
}
export default Vec2;
