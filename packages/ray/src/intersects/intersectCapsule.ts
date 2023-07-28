import { Vec3 }         from '@oito/oop';
import Ray              from '../Ray';
import { intersectSphere, RaySphereResult } from "./intersectSphere";

export class RayCapsuleResult{
    pos = [0,0,0];
    t   = 0;
}

export function intersectCapsule( ray: Ray, radius: number, vecStart: TVec3, vecEnd: TVec3, result ?: RayCapsuleResult ): boolean{
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const A         = vecStart;
    const B         = vecEnd;
    const radiusSq  = radius * radius;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Start calculating lengths and cross products
    const AB    = new Vec3( B ).sub( A );                       // Vector Length of Capsule Segment
    const AO    = new Vec3( ray.posStart ).sub( A );            // Vector length between start of ray and capsule line
    const AOxAB = new Vec3().fromCross( AO, AB );               // Perpendicular Vector between Cap Line & delta of Ray Origin & Capsule Line Start
    const VxAB  = new Vec3().fromCross( ray.direction, AB );	// Perpendicular Vector between Ray Dir & capsule line
    const ab2   = Vec3.lenSqr( AB );                            // Length Squared of Capsule Line
    const a     = Vec3.lenSqr( VxAB );                          // Length Squared of Perp Vec Length of Perp Vec of Ray&Cap
    const b		= 2 * Vec3.dot( VxAB, AOxAB );
    const c     = Vec3.lenSqr( AOxAB ) - ( radiusSq * ab2 );
    const d     = b * b - 4 * a * c;

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Checking D seems to be related to distance from capsule. If not within radius, D will be under 0
    if( d < 0 ) return false;

    // T is less then 0 then ray goes through both end caps.
    const t = ( -b - Math.sqrt( d ) ) / ( 2 * a );
    if( t < 0 ){
        const pos = ( Vec3.distSqr( A, ray.posStart ) < Vec3.distSqr( B, ray.posStart ) )? A : B;
        if( result ){
            const sphereResult  = new RaySphereResult();
            const isHit         = intersectSphere( ray, pos, radius, sphereResult );

            if( isHit ){
                result.t        = sphereResult.tMin;
                result.pos[ 0 ] = sphereResult.posEntry[ 0 ];
                result.pos[ 1 ] = sphereResult.posEntry[ 1 ];
                result.pos[ 2 ] = sphereResult.posEntry[ 2 ];
            }
            
            return isHit;
        }else return intersectSphere( ray, pos, radius, result );   
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Limit intersection between the bounds of the cylinder's end caps.
    const iPos          = ray.directionAt( t );
    const iPosLen       = new Vec3( iPos ).sub( A );        // Vector Length Between Intersection and Cap line Start
    const tLimit        = Vec3.dot( iPosLen, AB ) / ab2;    // Projection of iPos onto Cap Line
    const sphereResult  = ( result )? new RaySphereResult() : undefined;   
    let isHit           = false

     // Hit Cylinder part
    if( tLimit >= 0 && tLimit <= 1 ){
        if( result ){
            result.t = t;
            result.pos[ 0 ] = iPos[ 0 ];
            result.pos[ 1 ] = iPos[ 1 ];
            result.pos[ 2 ] = iPos[ 2 ];
        }
        return true;
    
    // Check Sphere Caps
    }else if( tLimit < 0 )  isHit = intersectSphere( ray, A, radius, sphereResult ); 
    else  if( tLimit > 1 )  isHit = intersectSphere( ray, B, radius, sphereResult ); 

    // Save Results if requested
    if( isHit && result && sphereResult ){
        result.t        = t;
        result.pos[ 0 ] = sphereResult.posEntry[ 0 ];
        result.pos[ 1 ] = sphereResult.posEntry[ 1 ];
        result.pos[ 2 ] = sphereResult.posEntry[ 2 ];
    }

    return isHit;
}