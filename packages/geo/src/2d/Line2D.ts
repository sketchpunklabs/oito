export default class Line2D{

    // #region INTERSECTIONS
    static intersectingSegments( a0:ConstVec2, a1:ConstVec2, b0:ConstVec2, b1:ConstVec2, out:TVec2=[0,0] ): TVec2 | null{
        const denom = (b1[1] - b0[1]) * (a1[0] - a0[0]) - (b1[0] - b0[0]) * (a1[1] - a0[1]);
        
        // Lines are parallel-ish
        if( denom === 0 ) return null;
      
        const ua = ((b1[0] - b0[0]) * (a0[1] - b0[1]) - (b1[1] - b0[1]) * (a0[0] - b0[0])) / denom;
        const ub = ((a1[0] - a0[0]) * (a0[1] - b0[1]) - (a1[1] - a0[1]) * (a0[0] - b0[0])) / denom;
    
        if( ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1 ){
            out[0] = a0[0] + ua * (a1[0] - a0[0]);
            out[1] = a0[1] + ua * (a1[1] - a0[1]);
            return out;
        }
      
        return null; // Lines do not intersect
    }

    static intersectingRays( ap: ConstVec2, ad: ConstVec2, bp: ConstVec2, bd: ConstVec2, out:TVec2=[0,0] ): TVec2 | null{
        // https://stackoverflow.com/questions/2931573/determining-if-two-rays-intersect
        const dx    = bp[0] - ap[0];
        const dy    = bp[1] - ap[1];
        const det   = bd[0] * ad[1] - bd[1] * ad[0];

        if( det !== 0 ){ // near parallel line will yield noisy results
            const u = ( dy * bd[0] - dx * bd[1] ) / det;
            const v = ( dy * ad[0] - dx * ad[1] ) / det;
            
            if( u >= 0 && v >= 0 ){
                out[ 0 ] = ap[ 0 ] + ad[ 0 ] * u;
                out[ 1 ] = ap[ 1 ] + ad[ 1 ] * u;
                return out;
            }
        }

        return null;
    }

    static intersectingRaySegment( ro: ConstVec2, rd: ConstVec2, s0: ConstVec2, s1: ConstVec2, out:TVec2=[0,0] ): TVec2 | null {
        const denom = rd[0] * (s1[1] - s0[1]) - rd[1] * (s1[0] - s0[0]);
      
        // Check for parallel or near-parallel lines
        if( Math.abs( denom ) < 0.0001 ) return null;
      
        const t1 = ( ( s0[0] - ro[0] ) * ( s1[1] - s0[1] ) - ( s0[1] - ro[1] ) * ( s1[0] - s0[0] ) ) / denom;
        const t2 = ( ( s0[0] - ro[0] ) * rd[1] - ( s0[1] - ro[1] ) * rd[0]) / denom;
      
        // Check if the intersection point lies within the bounds of the segment
        if( t1 >= 0 && t2 >= 0 && t2 <= 1 ){
          out[0] = ro[0] + rd[0] * t1;
          out[1] = ro[1] + rd[1] * t1;
          return out;
        }
      
        return null;
    }

    /*
    function isPointOnSegment(
        point: Vector3,
        segmentStart: Vector3,
        segmentEnd: Vector3,
        ): boolean {
        const distanceStartToPoint = segmentStart.distanceTo(point)
        const distanceEndToPoint = segmentEnd.distanceTo(point)
        const segmentLength = segmentStart.distanceTo(segmentEnd)
        const epsilon = DELTA // A small value to account for floating-point errors
        return (
            Math.abs(distanceStartToPoint + distanceEndToPoint - segmentLength) <
            epsilon &&
            distanceStartToPoint < segmentLength + epsilon &&
            distanceEndToPoint < segmentLength + epsilon
        )
    }
    */
    // #endregion

    // #region MISC
    static isLeft( a: ConstVec2, b: ConstVec2, p: ConstVec2 ): boolean{
        return ( // Cross Product
            ( b[0] - a[0] ) * 
            ( p[1] - a[1] ) - 
            ( p[0] - a[0] ) * 
            ( b[1] - a[1] )
        ) > 0;
    }
    // #endregion
}