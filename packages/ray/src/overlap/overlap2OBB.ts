import type Obb from '../shapes/Obb';
import { Vec3 } from '@oito/oop';

// Refactored verison of : https://mugen87.github.io/yuka/docs/math_OBB.js.html
export default function overlap2OBB( a: Obb, b: Obb, epsilon = Number.EPSILON ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // prepare data structures (the code uses the same nomenclature like the reference)
    
    // compute rotation matrix expressing b in a’s coordinate frame
    const R = [
        [ Vec3.dot( a.xAxis, b.xAxis ), Vec3.dot( a.xAxis, b.yAxis ), Vec3.dot( a.xAxis, b.zAxis ) ],
        [ Vec3.dot( a.yAxis, b.xAxis ), Vec3.dot( a.yAxis, b.yAxis ), Vec3.dot( a.yAxis, b.zAxis ) ],
        [ Vec3.dot( a.zAxis, b.xAxis ), Vec3.dot( a.zAxis, b.yAxis ), Vec3.dot( a.zAxis, b.zAxis ) ],
    ];

    // -----------------------------------------
    // compute translation vector
    // bring translation into a’s coordinate frame
    const v = [
        b.center[0] - a.center[0], 
        b.center[1] - a.center[1], 
        b.center[2] - a.center[2],
    ];

    const t  = [
        Vec3.dot( v, a.xAxis ),
        Vec3.dot( v, a.yAxis ),
        Vec3.dot( v, a.zAxis ),
    ];

    // -----------------------------------------
    // compute common subexpressions. Add in an epsilon term to
    // counteract arithmetic errors when two edges are parallel and
    // their cross product is (near) null
    const AbsR: Array< Array<number> > = new Array( 3 );
    for( let i = 0; i < 3; i ++ ){
        AbsR[ i ] = [
            Math.abs( R[ i ][ 0 ] ) + epsilon,
            Math.abs( R[ i ][ 1 ] ) + epsilon,
            Math.abs( R[ i ][ 2 ] ) + epsilon,
        ];
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let ra, rb;

    // test axes L = A0, L = A1, L = A2
    for( let i = 0; i < 3; i ++ ){
        ra = a.extents[ i ];
        rb = b.extents[ 0 ] * AbsR[ i ][ 0 ] + b.extents[ 1 ] * AbsR[ i ][ 1 ] + b.extents[ 2 ] * AbsR[ i ][ 2 ];
        if ( Math.abs( t[ i ] ) > ra + rb ) return false;
    }

    // test axes L = B0, L = B1, L = B2
    for( let i = 0; i < 3; i ++ ){
        ra = a.extents[ 0 ] * AbsR[ 0 ][ i ] + a.extents[ 1 ] * AbsR[ 1 ][ i ] + a.extents[ 2 ] * AbsR[ 2 ][ i ];
        rb = b.extents[ i ];
        if ( Math.abs( t[ 0 ] * R[ 0 ][ i ] + t[ 1 ] * R[ 1 ][ i ] + t[ 2 ] * R[ 2 ][ i ] ) > ra + rb ) return false;
    }

    // test axis L = A0 x B0
    ra = a.extents[ 1 ] * AbsR[ 2 ][ 0 ] + a.extents[ 2 ] * AbsR[ 1 ][ 0 ];
    rb = b.extents[ 1 ] * AbsR[ 0 ][ 2 ] + b.extents[ 2 ] * AbsR[ 0 ][ 1 ];
    if( Math.abs( t[ 2 ] * R[ 1 ][ 0 ] - t[ 1 ] * R[ 2 ][ 0 ] ) > ra + rb ) return false;

    // test axis L = A0 x B1
    ra = a.extents[ 1 ] * AbsR[ 2 ][ 1 ] + a.extents[ 2 ] * AbsR[ 1 ][ 1 ];
    rb = b.extents[ 0 ] * AbsR[ 0 ][ 2 ] + b.extents[ 2 ] * AbsR[ 0 ][ 0 ];
    if( Math.abs( t[ 2 ] * R[ 1 ][ 1 ] - t[ 1 ] * R[ 2 ][ 1 ] ) > ra + rb ) return false;

    // test axis L = A0 x B2
    ra = a.extents[ 1 ] * AbsR[ 2 ][ 2 ] + a.extents[ 2 ] * AbsR[ 1 ][ 2 ];
    rb = b.extents[ 0 ] * AbsR[ 0 ][ 1 ] + b.extents[ 1 ] * AbsR[ 0 ][ 0 ];
    if( Math.abs( t[ 2 ] * R[ 1 ][ 2 ] - t[ 1 ] * R[ 2 ][ 2 ] ) > ra + rb ) return false;

    // test axis L = A1 x B0
    ra = a.extents[ 0 ] * AbsR[ 2 ][ 0 ] + a.extents[ 2 ] * AbsR[ 0 ][ 0 ];
    rb = b.extents[ 1 ] * AbsR[ 1 ][ 2 ] + b.extents[ 2 ] * AbsR[ 1 ][ 1 ];
    if( Math.abs( t[ 0 ] * R[ 2 ][ 0 ] - t[ 2 ] * R[ 0 ][ 0 ] ) > ra + rb ) return false;

    // test axis L = A1 x B1
    ra = a.extents[ 0 ] * AbsR[ 2 ][ 1 ] + a.extents[ 2 ] * AbsR[ 0 ][ 1 ];
    rb = b.extents[ 0 ] * AbsR[ 1 ][ 2 ] + b.extents[ 2 ] * AbsR[ 1 ][ 0 ];
    if( Math.abs( t[ 0 ] * R[ 2 ][ 1 ] - t[ 2 ] * R[ 0 ][ 1 ] ) > ra + rb ) return false;

    // test axis L = A1 x B2
    ra = a.extents[ 0 ] * AbsR[ 2 ][ 2 ] + a.extents[ 2 ] * AbsR[ 0 ][ 2 ];
    rb = b.extents[ 0 ] * AbsR[ 1 ][ 1 ] + b.extents[ 1 ] * AbsR[ 1 ][ 0 ];
    if( Math.abs( t[ 0 ] * R[ 2 ][ 2 ] - t[ 2 ] * R[ 0 ][ 2 ] ) > ra + rb ) return false;

    // test axis L = A2 x B0
    ra = a.extents[ 0 ] * AbsR[ 1 ][ 0 ] + a.extents[ 1 ] * AbsR[ 0 ][ 0 ];
    rb = b.extents[ 1 ] * AbsR[ 2 ][ 2 ] + b.extents[ 2 ] * AbsR[ 2 ][ 1 ];
    if( Math.abs( t[ 1 ] * R[ 0 ][ 0 ] - t[ 0 ] * R[ 1 ][ 0 ] ) > ra + rb ) return false;

    // test axis L = A2 x B1
    ra = a.extents[ 0 ] * AbsR[ 1 ][ 1 ] + a.extents[ 1 ] * AbsR[ 0 ][ 1 ];
    rb = b.extents[ 0 ] * AbsR[ 2 ][ 2 ] + b.extents[ 2 ] * AbsR[ 2 ][ 0 ];
    if( Math.abs( t[ 1 ] * R[ 0 ][ 1 ] - t[ 0 ] * R[ 1 ][ 1 ] ) > ra + rb ) return false;

    // test axis L = A2 x B2
    ra = a.extents[ 0 ] * AbsR[ 1 ][ 2 ] + a.extents[ 1 ] * AbsR[ 0 ][ 2 ];
    rb = b.extents[ 0 ] * AbsR[ 2 ][ 1 ] + b.extents[ 1 ] * AbsR[ 2 ][ 0 ];
    if( Math.abs( t[ 1 ] * R[ 0 ][ 2 ] - t[ 0 ] * R[ 1 ][ 2 ] ) > ra + rb ) return false;

    // since no separating axis is found, the OBBs must be intersecting
    return true;
}