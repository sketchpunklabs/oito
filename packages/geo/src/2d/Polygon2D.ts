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
            sum += ( pnts[ii][0] - pnts[i][0] ) * ( pnts[ii][1] + pnts[i][1] );


            // sum += (points[i + 2] - points[i]) * (points[i + 3] + points[i + 1]);
        }

        return ( sum < 0 );
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