import { Vec3 }         from '@oito/oop';
import Ray              from '../Ray';
import intersectPlane   from './intersectPlane';

/** T Value is scaled for Vector Length, Not Direction */
export default function intersectCircle( ray: Ray, radius: number, planePos: ConstVec3, planeNorm: ConstVec3  ) : number | null{
    const t = intersectPlane( ray, planePos, planeNorm );
    if( t == null ) return null;

    const pnt   = ray.posAt( t );
    const lenSq = Vec3.distSqr( pnt, planePos );
    return ( lenSq <= radius*radius )? t : null;
}