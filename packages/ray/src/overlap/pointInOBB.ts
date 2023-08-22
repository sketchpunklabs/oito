import { Vec3 } from '@oito/oop';

export default function pointInObb( pnt: ConstVec3, bCenter: ConstVec3, bHalf: ConstVec3, xNorm: ConstVec3, yNorm: ConstVec3, zNorm: ConstVec3 ): boolean{
    const d = [
        pnt[0] - bCenter[0],
        pnt[1] - bCenter[1],
        pnt[2] - bCenter[2],
    ];
    return  Math.abs( Vec3.dot( d, xNorm ) ) <= bHalf[ 0 ] &&
            Math.abs( Vec3.dot( d, yNorm ) ) <= bHalf[ 1 ] &&
            Math.abs( Vec3.dot( d, zNorm ) ) <= bHalf[ 2 ];
}