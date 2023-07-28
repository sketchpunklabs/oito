import { Vec3 } from '@oito/oop';
import Ray      from '../Ray';

export class RayObbResult{
    posEntry    = new Vec3();
    posExit     = new Vec3();
    tMin        = 0;            // 0 > 1
    tMax        = 0;            // 0 > 1
    // entryAxis   = 0;            // 0 : X, 1 : Y, 2 : Z
    normEntry   = new Vec3();   // -1 or 1 , Positive or Negative Axis
    // exitAxis    = 0;            // 0 : X, 1 : Y, 2 : Z
    normExit    = new Vec3();   // -1 or 1 , Positive or Negative Axis
}

export function intersectObb( ray: Ray, center:ConstVec3, xDir: ConstVec3, yDir: ConstVec3, zDir: ConstVec3, halfLen: ConstVec3, result ?: RayObbResult ): boolean{
    const rayDelta  = new Vec3( center ).sub( ray.posStart ); // Distance between Ray start and Box Position
    let tMin        = 0;
    let tMax        = 1000000;
    let minAxis     = 0;    // Which axis hit, X:0, Y:1, Z:2
    let maxAxis     = 0;
    let axis        : ConstVec3;
    let nomLen      : number;
    let denomLen    : number;
    let tmp         : number; 
    let min         : number;
    let max         : number;
    const list      = [ xDir, yDir, zDir ];

    for( let i=0; i < 3; i++){
        axis        = list[ i ];
        nomLen      = Vec3.dot( axis, rayDelta ); 	    // Get the length of Axis and distance to ray position
        denomLen    = Vec3.dot( ray.vecLength, axis );  // Get Length of ray and axis

        if( Math.abs( denomLen ) > 0.00001 ){ // Can't divide by Zero
            min = ( nomLen - halfLen[i] ) / denomLen;
            max = ( nomLen + halfLen[i] ) / denomLen;

            if( min > max ){  tmp = min; min = max; max = tmp; }    // Swap
            if( min > tMin ){ tMin = min; minAxis = i; }            // Biggest Min
            if( max < tMax ){ tMax = max; maxAxis = i; }            // Smallest Max

            if( tMax < tMin ) return false;
        }else if(
            -nomLen - halfLen[i] > 0 || 
            -nomLen + halfLen[i] < 0 ) return false;  // Are almost parallel check
    }

    if( result ){
        result.tMin = tMin;
        result.tMax = tMax;

        ray.posAt( tMin, result.posEntry );
        ray.posAt( tMax, result.posExit );

        const tmp = new Vec3();

        result.normEntry.copy( list[ minAxis ] );
        tmp.fromSub( ray.posStart, result.posEntry );
        if( Vec3.dot( tmp, result.normEntry ) < 0 ) result.normEntry.negate();

        result.normExit.copy( list[ maxAxis ] );
        tmp.fromSub( ray.posStart, result.posExit );
        if( Vec3.dot( tmp, result.normExit ) > 0 ) result.normExit.negate();
    }

    return true;
}