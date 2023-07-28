import { Vec3 }         from '@oito/oop';
import Ray              from '../Ray';

export default function intersectQuadPnts( ray: Ray, v0: ConstVec3, v1: ConstVec3, v2: ConstVec3, cullBackface=true ): number | null{
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Figure out the normal direction of the quad
    // To find normal direction, take 3 sequential corners, get two vector 
    // lengths then cross apply in counter-clockwise order
    const a     = new Vec3( v0 ).sub( v1 );
    const b     = new Vec3( v2 ).sub( v1 );
    const norm  = new Vec3().fromCross( b, a ).norm();

    if( cullBackface && Vec3.dot( ray.direction, norm ) > 0 ) return null;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Determine if the ray intersects the same plane as the quad.
    const denom = Vec3.dot( ray.vecLength, norm );    // Dot product of ray Length and plane normal
    if( Math.abs( denom ) <= 0.000001 ) return null;

    const t = Vec3.dot( new Vec3( v1 ).sub( ray.posStart ), norm ) / denom;
    if( t < 0 ) return null;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // First Diagonal Test - Projecting intersection point onto Left Side of Quad
    const ip    = ray.posAt( t );
    const dm    = new Vec3( ip ).sub( v1 );
    const u     = Vec3.dot( dm, a );
    const v     = Vec3.dot( dm, b );

    return (
        u >= 0.0 && u <= Vec3.dot( a, a ) &&
        v >= 0.0 && v <= Vec3.dot( b, b )
    )? t : null;
}