import { Vec2 } from '@oito/oop';

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
    // segmentCut( p0: ConstVec2, p1: ConstVec2 ): void{
    // }
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