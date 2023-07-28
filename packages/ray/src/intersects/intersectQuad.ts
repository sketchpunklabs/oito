import { Vec3 }         from '@oito/oop';
import Ray              from '../Ray';
import intersectPlane   from './intersectPlane';

// TODO : Need to handle precalc the 4 points of a quad AND handle scale, rotation and translation
export default function intersectQuad( ray: Ray, centerPos: ConstVec3, w: number, h:number ): number | null{
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Figure out the 4 points in the quad based on center position and known width/height;
    // Note: If the quad has been rotated or scaled, need to apply those to the 4 points as well.
    const v0 = new Vec3().fromAdd( centerPos, [-w,  h, 0] );
    const v1 = new Vec3().fromAdd( centerPos, [-w, -h, 0] );
    const v2 = new Vec3().fromAdd( centerPos, [ w, -h, 0] );
    // const v3 = new Vec3().fromAdd( centerPos, [ w,  h, 0] );


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Figure out the normal direction of the quad
    // To find normal direction, take 3 sequential corners, get two vector 
    // lengths then cross apply in counter-clockwise order
    const a     = new Vec3().fromSub( v0, v1 );
    const b     = new Vec3().fromSub( v2, v1 );
    const norm  = new Vec3().fromCross( b, a ).norm();

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Determine if the ray intersects the same plane of the quad.
    const t = intersectPlane( ray, centerPos, norm );
    if( t == null ) return null;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // First Diagonal Test - Projecting intersection point onto Left Side of Quad
    const ip    = ray.posAt( t );
    let   tt    = 0;

    a.fromSub( ip, v0 );                        // Top Corner to Plane Intersection Point
    b.fromSub( v1, v0 );                        // Left Edge
    tt = Vec3.dot( a, b ) / Vec3.lenSqr( b );   // PROJECTION : |a|.|b| / |b|.|b| 
    
    if( tt < 0 || tt > 1 ) return null;

    // Second Diagonal Test - Projecting intersection point onto bottom Side of Quad
    a.fromSub( ip, v1 );                        // Bottom Corner to Plane Intersection Point
    b.fromSub( v2, v2 );                        // Bottom Edge
    tt = Vec3.dot( a, b ) / Vec3.lenSqr( b );

    return ( tt < 0 || tt > 1 )? null : t;
}