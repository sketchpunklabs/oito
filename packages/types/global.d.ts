export {};

declare global{
    type TVec2     = [number,number] | Float32Array | Array<number> | number[];
    type ConstVec2 = Readonly< TVec2 >;
    
    type TVec3     = [number,number,number] | Float32Array | Array<number> | number[];
    type ConstVec3 = Readonly< TVec3 >;

    type TQuat     = [number,number,number,number] | Float32Array | Array<number> | number[];
    type ConstQuat = Readonly< TQuat >;

    type TVec3Struct = { x: number, y:number, z:number };
}