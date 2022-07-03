import type { TVec3, TVec3Struct } from '../global';
declare type TNumAry = number[] | Float32Array;
export default class Vec3Buf {
    _buf: TNumAry;
    _xi: number;
    _yi: number;
    _zi: number;
    _v: number[];
    constructor(buf: TNumAry);
    get count(): number;
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    get z(): number;
    set z(v: number);
    at(i: number): this;
    set(x: number): this;
    set(x: number, y: number, z: number): this;
    get(out?: TVec3): TVec3;
    setBuffer(buf: TNumAry): this;
    push(v: number, y: number, z: number): this;
    toFloatArray(): Float32Array;
    clear(): this;
    len(i?: number): number;
    lenSq(i?: number): number;
    /** Copy data from a struct vector type. ThreeJS compatilbility */
    fromStruct(v: TVec3Struct): this;
    /** Copy data to a struct vector type. ThreeJS compatilbility */
    toStruct(v: TVec3Struct): this;
    add(a: TVec3): this;
    fromAdd(a: TVec3, b: TVec3): this;
    sub(a: TVec3): this;
    fromSub(a: TVec3, b: TVec3): this;
    norm(): this;
    fromNorm(v: TVec3): this;
    centroid(out?: TVec3): TVec3;
    bounds(): [number[], number[]];
}
export {};
