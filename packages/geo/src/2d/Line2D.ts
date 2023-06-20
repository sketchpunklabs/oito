import { Vec2 } from '@oito/oop';

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

    static isPointOnSegment( a0:ConstVec2, a1:ConstVec2, p: ConstVec2, epsilon: number = 0.001  ): boolean{
        // Note: Tried using distance Squared & squaring epsilon, it doesn't work very well. Only works
        // when dealing with actual lengths
        const toStart = Vec2.dist( a0, p );
        const toEnd   = Vec2.dist( a1, p );
        const segLen  = Vec2.dist( a1, a0 );
    
        return (
            Math.abs( toStart + toEnd - segLen ) < epsilon 
            && toStart < segLen + epsilon 
            && toEnd   < segLen + epsilon
        );
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

    https://lucidar.me/en/mathematics/check-if-a-point-belongs-on-a-line-segment/
    * \brief rOc_segment::isPointOnSegment check if a point is inside the current segment
    * \param point coordinates of the point to test
    * \return  ROC_SEGMENT_INTERSEC_NONE if the point doesn't lay with the segment
    *          ROC_SEGMENT_INTERSEC_EXTREMITY_P1 if the point is merged with P1
    *          ROC_SEGMENT_INTERSEC_EXTREMITY_P2 if the point is merged with P2
    *          ROC_SEGMENT_INTERSEC_CROSS if the point belongs to the segment (extremity no included)
    
    char rOc_segment::isPointOnSegment(rOc_point point)
    {
        // A and B are the extremities of the current segment
        // C is the point to check

        // Create the vector AB
        rOc_vector AB=this->vector();
        // Create the vector AC
        rOc_vector AC=rOc_vector(this->point1(),point);

        // Compute the cross product of VA and PAP
        // Check if the three points are aligned (cross product is null)
        if (!( AB.cross(AC).isNull())) return ROC_SEGMENT_INTERSEC_NONE;

        // Compute the dot product of vectors
        double KAC = AB.dot(AC);
        if (KAC<0) return ROC_SEGMENT_INTERSEC_NONE; 
        if (KAC==0) return ROC_SEGMENT_INTERSEC_EXTREMITY_P1; 

        // Compute the square of the segment length 
        double KAB=AB.dot(AB); 
        if (KAC>KAB) return ROC_SEGMENT_INTERSEC_NONE;
        if (KAC==KAB) return ROC_SEGMENT_INTERSEC_EXTREMITY_P2;

        // The point is on the segment
        return ROC_SEGMENT_INTERSEC_CROSS;
    }

    */
    // #endregion

    // #region MISC
    static isLeft( a: ConstVec2, b: ConstVec2, p: ConstVec2 ): boolean{
        // AI Generated
        // return ( // Cross Product
        //     ( b[0] - a[0] ) * 
        //     ( p[1] - a[1] ) - 
        //     ( p[0] - a[0] ) * 
        //     ( b[1] - a[1] )
        // ) > 0;

        // // https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
        return (
            ( p[0] - a[0] ) * ( b[1] - a[1] ) -
            ( p[1] - a[1] ) * ( b[0] - a[0] ) ) >= 0;
    }
    // #endregion
}


/*

		/// <summary>The determinant is equivalent to the dot product, but with one vector rotated 90 degrees.
		/// Note that <c>det(a,b) != det(b,a)</c>. <c>It's equivalent to a.x * b.y - a.y * b.x</c>.
		/// It is also known as the 2D Cross Product, Wedge Product, Outer Product and Perpendicular Dot Product</summary>
		public static float Determinant( Vector2 a, Vector2 b ) => a.x * b.y - a.y * b.x; // 2D "cross product"

https://github.com/FreyaHolmer/Mathfs/blob/master/Runtime/Geometric%20Shapes/Line2D.cs
[MethodImpl( INLINE )] public float SignedDistance( Vector2 point ) => Determinant( dir.normalized, point - origin );

[MethodImpl( INLINE )] public static float ProjectPointToLineTValue( Vector3 lineOrigin, Vector3 lineDir, Vector3 point ) {
    return Vector3.Dot( lineDir, point - lineOrigin ) / Vector3.Dot( lineDir, lineDir );
}

		[MethodImpl( INLINE )] public static (float tA, float tB) ClosestPointBetweenLinesTValues( Vector3 aOrigin, Vector3 aDir, Vector3 bOrigin, Vector3 bDir ) {
			// source: https://math.stackexchange.com/questions/2213165/find-shortest-distance-between-lines-in-3d
			Vector3 a = aOrigin;
			Vector3 b = aDir;
			Vector3 c = bOrigin;
			Vector3 d = bDir;
			Vector3 e = a - c;
			float be = Vector3.Dot( b, e );
			float de = Vector3.Dot( d, e ); 
			float bd = Vector3.Dot( b, d );
			float b2 = Vector3.Dot( b, b );
			float d2 = Vector3.Dot( d, d );
			float A = -b2 * d2 + bd * bd;

			float s = ( -b2 * de + be * bd ) / A;
			float t = ( d2 * be - de * bd ) / A;

			return ( t, s );

			// Vector3 n = Vector3.Cross( aDir, bDir );
			// float nMag = n.magnitude;
			// float dist = Vector3.Dot( n, aOrigin - bOrigin ) / nMag;
		}

[MethodImpl( INLINE )] public static Vector3 ProjectPointToLine( Vector3 lineOrigin, Vector3 lineDir, Vector3 point ) {
			return lineOrigin + lineDir * ProjectPointToLineTValue( lineOrigin, lineDir, point );
		}

		/// <summary>Projects a point onto an infinite line</summary>
		/// <param name="line">Line to project onto</param>
		/// <param name="point">The point to project onto the line</param>
		[MethodImpl( INLINE )] public static Vector3 ProjectPointToLine( Line3D line, Vector3 point ) => ProjectPointToLine( line.origin, line.dir, point );

		/// <summary>Returns the signed distance to a 3D plane</summary>
		/// <param name="planeOrigin">Plane origin</param>
		/// <param name="planeNormal">Plane normal (has to be normalized for a true distance)</param>
		/// <param name="point">The point to use when checking distance to the plane</param>
		[MethodImpl( INLINE )] public static float PointToPlaneSignedDistance( Vector3 planeOrigin, Vector3 planeNormal, Vector3 point ) {
			return Vector3.Dot( point - planeOrigin, planeNormal );
		}

		/// <summary>Returns the distance to a 3D plane</summary>
		/// <param name="planeOrigin">Plane origin</param>
		/// <param name="planeNormal">Plane normal (has to be normalized for a true distance)</param>
		/// <param name="point">The point to use when checking distance to the plane</param>
		[MethodImpl( INLINE )] public static float PointToPlaneDistance( Vector3 planeOrigin, Vector3 planeNormal, Vector3 point ) => Abs( PointToPlaneSignedDistance( planeOrigin, planeNormal, point ) );


*/