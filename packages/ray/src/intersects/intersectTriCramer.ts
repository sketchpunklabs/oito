import { Vec3 } from '@oito/oop';
import Ray      from '../Ray';

const EPS = 0.000001;

// All det's function
function det3x3_old( a: ConstVec3, b: ConstVec3, c: ConstVec3 ): number {
    const a00 = a[0], a01 = a[1], a02 = a[2];
    const a10 = b[0], a11 = b[1], a12 = b[2];
    const a20 = c[0], a21 = c[1], a22 = c[2];

    return (
        a00 * (  a22 * a11 - a12 * a21 ) +
        a01 * ( -a22 * a10 + a12 * a20 ) +
        a02 * (  a21 * a10 - a11 * a20 )
    );
}

function det3x3_new( a: ConstVec3, b: ConstVec3, c: ConstVec3 ): number {
    return Vec3.dot( a, new Vec3().fromCross( b, c ) );
}

function det3x3( a: ConstVec3, b: ConstVec3, c: ConstVec3 ): number {
    // cross( b, c ) 
    const x = b[1] * c[2] - b[2] * c[1];
    const y = b[2] * c[0] - b[0] * c[2];
    const z = b[0] * c[1] - b[1] * c[0];
    
    // dot( a, [xyz] )
    return a[0] * x + a[1] * y + a[2] * z;
}


// Solve with Cramer rule
// https://x.com/lisyarus/status/1786327676120117683
export default function intersectTriCramer( ray: Ray, v0: ConstVec3, v1: ConstVec3, v2: ConstVec3, out ?: TVec3, cullFace: boolean = true ): boolean{
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Compute 3x3 matrix
    const m0  = ray.direction;
    const m1  = new Vec3( v0 ).sub( v1 );
    const m2  = new Vec3( v0 ).sub( v2 );
    const rhs = new Vec3( v0 ).sub( ray.posStart );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Failed on backfaced triangles
    if( cullFace ){
        const cross = new Vec3().fromCross( ray.direction, m2 );
        const dot   = Vec3.dot( m1, cross );
        if( dot < EPS ) return false;
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Solve 3x3 Equation
    const det = det3x3( m0,  m1,  m2 );
    if( Math.abs( det ) < EPS ) return false;

    const d0  = det3x3( rhs, m1,  m2 );
    const d1  = det3x3( m0,  rhs, m2 );
    const d2  = det3x3( m0,  m1,  rhs );

    const t   = d0 / det;
    const u   = d1 / det;
    const v   = d2 / det;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Results
    const hit = ( t >= 0 && u >= 0 && v >= 0 && ( u + v ) <= 1 );
    if( hit && out ) ray.directionAt( t, out );

    return hit;
}

