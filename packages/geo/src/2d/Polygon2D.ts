import { Vec2 } from '@oito/oop';
import Line2D   from './Line2D';

export default class Polygon2D{
    // #region MAIN
    points: Array< Vec2 > = [];
    constructor( pnts?: Array< Vec2 > ){
        if( pnts ) this.points = pnts;
    }
    // #endregion

    // #region MANAGE POINTS
    addPoint( p: ConstVec2 ): this{ this.points.push( new Vec2( p ) ); return this; }
    addArray( ary: Array< ConstVec2 > ): this{
        for( const i of ary ) this.points.push( new Vec2( i ) );
        return this;
    }
    // #endregion

    // #region GETTERS
    get pointCount(){ return this.points.length; }

    getEdge( i: number ): [ Vec2, Vec2 ]{
        const cnt = this.points.length;
        const j = ( cnt + i ) % cnt;
        const k = ( cnt + i + 1 ) % cnt;
        return [ this.points[ j ], this.points[ k ] ];
    }

    getLongestEdge(): [ Vec2, Vec2, number, number ]{
        const pnts  = this.points;
        const cnt   = pnts.length;
        let max     = -Infinity;
        let ai      = -1;
        let bi      = -1;
        let d       = 0;
        let ii;

        for( let i=0; i < cnt; i++ ){
            ii = ( i + 1 ) % cnt;
            d  = Vec2.distSqr( pnts[i], pnts[ii] );
            if( d > max ){
                ai  = i;
                bi  = ii;
                max = d;
            }
        }

        return [ pnts[ai], pnts[bi], ai, bi ];
    }

    centroid( out:TVec2 = [0,0] ): TVec2{
        for( const p of this.points ){
            out[0] += p[0];
            out[1] += p[1];
        }

        const inv = 1 / this.points.length;
        out[ 0 ] *= inv;
        out[ 1 ] *= inv;

        return out;
    }

    isClockwise(): boolean{
        const pnts = this.points;
        const end  = pnts.length-1;
        let sum    = 0;
        let ii:number;

        for (let i = 0; i < end; i++){
            ii  = i+1;
            // sum += ( pnts[ii][0] - pnts[i][0] ) * ( pnts[ii][1] + pnts[i][1] );
            // https://www.baeldung.com/cs/list-polygon-points-clockwise#2-area-of-polygon
            sum += pnts[i][0] * pnts[ii][1] - pnts[i][1] * pnts[ii][0];
        }

        // return ( sum < 0 );
        return ( sum >= 0 );
    }

    toVec3Buffer( isType: boolean = true, isYUp: boolean = true, n: number = 0 ): Float32Array | Array<number>{
        const cnt   = this.points.length;
        const buf : Float32Array | Array<number> = ( isType )
            ? new Float32Array( cnt * 3 )
            : new Array( cnt * 3 );
        let   i     = 0;

        if( isYUp ){
            for( const p of this.points ){
                buf[i++] = p[ 0 ];
                buf[i++] = n;
                buf[i++] = p[ 1 ];
            }
        }else{
            for( const p of this.points ){
                buf[i++] = p[ 0 ];
                buf[i++] = p[ 1 ];
                buf[i++] = n;
            }
        }

        return buf;
    }

    toFlatBuffer( isType: boolean = true ): Float32Array | Array<number>{
        const cnt   = this.points.length;
        const buf : Float32Array | Array<number> = ( isType )
            ? new Float32Array( cnt * 2 )
            : new Array( cnt * 2 );
        
        let i = 0;
        for( const p of this.points ){
            buf[i++] = p[ 0 ];
            buf[i++] = p[ 1 ];
        }

        return buf;
    }
    // #endregion

    // #region OPERATIONS
    segmentCut( p0: ConstVec2, p1: ConstVec2 ): Array< Polygon2D > | null{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Find all the edges that intersect the segment
        const hits : Array<{ pos:Vec2, i:number, ii:number }> = [];
        const pnts = this.points;
        let p  : TVec2 | null;
        let ii : number;
        
        for( let i=0; i < pnts.length; i++ ){
            ii = ( i+1 ) % pnts.length;
            p  = Line2D.intersectingSegments( p0, p1, pnts[i], pnts[ii] );
    
            if( p ) hits.push({ pos: new Vec2( p ), i:i, ii:ii });
        }
    
        // If not 2 intersections then its not a good half slice
        if( hits.length !== 2 ) return null;
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create two polygons from the intersection slice
        const [ a, b ] = hits;
        const poly0    = new Polygon2D([
            a.pos,
            ...pnts.slice( a.ii, b.i+1 ),
            b.pos,
        ]);
    
        // Second polygon can overlap end to start, in that case
        // will need a second condition to handle getting ending half
        // and the starting half.
        const poly1 = new Polygon2D( ( b.ii < a.i )
            ? [ b.pos, ...pnts.slice( b.ii, a.i+1 ), a.pos ]
            : [ b.pos, ...pnts.slice( b.ii ), ...pnts.slice( 0, a.i+1 ), a.pos ]
        );
    
        return [ poly0, poly1 ];
    }

    /** Return Points for [ Outer, Inner ] */
    polyline( radius=0.1, isClosed=true ):[ Array<Vec2>,  Array<Vec2> ]{
        const pnts    = this.points;
        const cnt     = this.pointCount;
        const end     = ( isClosed )? cnt : cnt - 1;
        const edgeDir = [];
    
        let v;
        let i, j;
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Compute direction of each segment
        for( i=0; i < end; i++ ){
            j = ( i+1 ) % cnt;
            v  = Vec2.sub( pnts[j], pnts[i] ).norm();
            edgeDir.push( v );
        }
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Compute the inner & outer points by using the miter vector
        // along with a scale 
        
        const miterDir  = new Vec2();
        const normDir   = new Vec2();
        const outer     = [];
        const inner     = [];
        const prevDir   = new Vec2( ( isClosed )? edgeDir[ edgeDir.length-1 ] : [0,0,0] );
        let curDir;
        let scl;
    
        for( i=0; i < end; i++ ){
            curDir = edgeDir[ i ];
            normDir.copy( curDir ).rotN90();    // Normal vector
            miterDir                           
                .fromAdd( prevDir, curDir )     // Tangent Vector
                .norm() 
                .rotN90();                      // Rotate for bivector
    
            // Distance for the miter is size over dot of miter and normal
            scl = radius / Vec2.dot( miterDir, normDir );
            
            outer.push( (v = Vec2.scaleThenAdd( scl, miterDir, pnts[i] )) );            // Outer Point
            inner.push( (v = Vec2.scaleThenAdd( scl, miterDir.negate(), pnts[i] )) );   // Inner Point
    
            prevDir.copy( curDir );
        }
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Compute final miter poins when dealing with lines
        if( !isClosed ){
            i = cnt - 1;
            normDir.copy( edgeDir[ i-1 ] ).rotN90();                                    // Normal vector
            outer.push( (v = Vec2.scaleThenAdd( radius, normDir, pnts[i] )) );          // Outer Point
            inner.push( (v = Vec2.scaleThenAdd( radius, normDir.negate(), pnts[i] )) ); // Inner Point
        }
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        return [ outer, inner ];
    }
    // #endregion

    // #region ITERATORS
    iterVec3( isYUp:boolean = true ): { [Symbol.iterator]() : { next:()=>{ value:TVec3, done:boolean } } } {
        let   i       = 0;
        const idx     = isYUp ? 2 : 1;
        const result  = { value:[0,0,0], done:false },
              len     = this.points.length,
              next    = ()=>{
                if( i >= len ) result.done = true;
                else{
                    result.value[ 0 ]   = this.points[ i ][ 0 ];
                    result.value[ idx ] = this.points[ i ][ 1 ];
                    i++;
                }
                return result;
              };
        return { [Symbol.iterator](){ return { next }; } };
    }

    iterEdges(): { [Symbol.iterator]() : { next:()=>{ value:{ a:Vec2, b:Vec2, ai:number, bi:number}, done:boolean } } } {
        const v       = { a:this.points[ 0 ], b:this.points[ 0 ] ,ai:0, bi:1 };
        const result  = { value:v, done:false };
        const len     = this.points.length;
        const next    = ()=>{
                if( v.ai >= len ) result.done = true;
                else{
                    v.a = this.points[ v.ai ];
                    v.b = this.points[ v.bi ];
                    v.ai++;
                    v.bi = ( v.bi + 1 ) % len;
                }
                return result;
              };
        return { [Symbol.iterator](){ return { next }; } };
    }
    // #endregion

}


/*


function iterEdges( pnts, isClosed=true ){
    const cnt     = pnts.length;
    const len     = ( isClosed )? cnt : cnt-1;    
    const v       = { a:pnts[ 0 ], b:pnts[ 0 ], ai:0, bi:1 };
    const result  = { value:v, done:false };

    const next    = ()=>{
        if( v.ai >= len ) result.done = true;
        else{
            v.a = pnts[ v.ai ];
            v.b = pnts[ v.bi ];
            v.ai++;
            v.bi = ( v.bi + 1 ) % cnt;
        }
        return result;
    };

    return { [Symbol.iterator](){ return { next }; } };
}

function sortPolygonPoints( pnts, asCCW=true ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Compute Centroid
    const cent = new Vec2();
    for( const p of pnts ) cent.add( p );
    cent.divScale( pnts.length );

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Compute point angles
    let ang; 

    const a   = new Vec2();
    const b   = new Vec2();
    const rtn = [ { ang:0, p:pnts[0] } ]; // First point will be angle 0

    a.fromSub( pnts[0], cent ); // Focal Vector for angle computation

    for( let i=1; i < pnts.length; i++ ){
        // Get angle from first point
        b.fromSub( pnts[i], cent );
        ang = Vec2.angleTo( a, b );

        // remap values -180:180 to 0:360
        if( ang < 0 ) ang = Math.PI * 2 + ang;
        
        rtn.push( { ang, p:pnts[i] } );
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return rtn.sort( asCCW
        ? ( a, b )=>( a.ang === b.ang )? 0 : ( a.ang < b.ang )? 1 : -1
        : ( a, b )=>( a.ang === b.ang )? 0 : ( a.ang < b.ang )? -1 : 1
    ).map( i=>i.p );
}

function simplifyPolySegments( pnts, h ){
    const cnt = pnts.length;
    const a   = new Vec2();
    const b   = new Vec2();
    const rtn = [];
    let i=0;
    let j=0;
    let k=0;

    while( j < pnts.length ){
        i = ( j - 1 + cnt ) % cnt;  // Previous Point
        k = ( j + 1 ) % cnt;        // Next Point

        a.fromSub( pnts[i], pnts[j] ).norm();
        b.fromSub( pnts[k], pnts[j] ).norm();

        Debug.pnt.add( pnts[j].toVec3( true, h ), 0xff0000, 2 );

        // console.log( i, j, k, Vec2.dot( a, b ) );

        if( Math.abs( Vec2.dot( a, b ) ) < 0.99 ){
            Debug.pnt.add( pnts[j].toVec3( true, h ), 0xffffff, 2.5 );
            rtn.push( pnts[j] );
        }
        j++;
    }

    return rtn;
}



https://github.com/FreyaHolmer/Mathfs/blob/master/Runtime/Geometric%20Shapes/Polygon.cs

public float SignedArea {
    get {
        int count = points.Count;
        float sum = 0f;
        for( int i = 0; i < count; i++ ) {
            Vector2 a = points[i];
            Vector2 b = points[( i + 1 ) % count];
            sum += ( b.x - a.x ) * ( b.y + a.y );
        }

        return sum * 0.5f;
    }
}

/// <summary>Returns the length of the perimeter of the polygon</summary>
public float Perimeter {
    get {
        int count = points.Count;
        float totalDist = 0f;
        for( int i = 0; i < count; i++ ) {
            Vector2 a = points[i];
            Vector2 b = points[( i + 1 ) % count];
            float dx = a.x - b.x;
            float dy = a.y - b.y;
            totalDist += MathF.Sqrt( dx * dx + dy * dy ); // unrolled for speed
        }

        return totalDist;
    }
}

/// <summary>Returns the axis-aligned bounding box of this polygon</summary>
public Rect Bounds {
    get {
        int count = points.Count;
        Vector2 p = points[0];
        float xMin = p.x, xMax = p.x, yMin = p.y, yMax = p.y;
        for( int i = 1; i < count; i++ ) {
            p = points[i];
            xMin = MathF.Min( xMin, p.x );
            xMax = MathF.Max( xMax, p.x );
            yMin = MathF.Min( yMin, p.y );
            yMax = MathF.Max( yMax, p.y );
        }

        return new Rect( xMin, yMin, xMax - xMin, yMax - yMin );
    }
}
*/