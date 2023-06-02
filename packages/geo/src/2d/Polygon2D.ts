import { Vec2 } from '@oito/oop';

function lineIntersection( a0: ConstVec2, a1: ConstVec2, b0: ConstVec2, b1: ConstVec2, out:TVec2 ): boolean{
    const denom = (b1[1] - b0[1]) * (a1[0] - a0[0]) - (b1[0] - b0[0]) * (a1[1] - a0[1]);
    
    // Lines are parallel-ish
    if( denom === 0 ) return false;
  
    const ua = ((b1[0] - b0[0]) * (a0[1] - b0[1]) - (b1[1] - b0[1]) * (a0[0] - b0[0])) / denom;
    const ub = ((a1[0] - a0[0]) * (a0[1] - b0[1]) - (a1[1] - a0[1]) * (a0[0] - b0[0])) / denom;

    if( ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1 ){
      out[0] = a0[0] + ua * (a1[0] - a0[0]);
      out[1] = a0[1] + ua * (a1[1] - a0[1]);
      return true;
    }
  
    return false; // Lines do not intersect
}

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

    iterVec3Edges( isYUp:boolean = true ): { [Symbol.iterator]() : { next:()=>{ value:{ a:TVec3, b:TVec3, ai:number, bi:number}, done:boolean } } } {
        const idx     = isYUp ? 2 : 1;
        const a       = [0,0,0];
        const b       = [0,0,0];
        const v       = { a, b ,ai:0, bi:1 };
        const result  = { value:v, done:false };
        const len     = this.points.length;
        const next    = ()=>{
                if( v.ai >= len ) result.done = true;
                else{
                    a[ 0 ]   = this.points[ v.ai ][ 0 ];
                    a[ idx ] = this.points[ v.ai ][ 1 ];

                    b[ 0 ]   = this.points[ v.bi ][ 0 ];
                    b[ idx ] = this.points[ v.bi ][ 1 ];
                    
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
// https://github.com/kenjinp/hello-worlds/blob/hello-cities/apps/docs/examples/city/lib/math/Polygon.ts#LL65C1-L124C2
function splitPolygon(
    polygon: Polygon,
    lineSegment: LineSegment,
    gap,
  ): Polygon[] {
    const intersectionPoints: {
      edgeIndex: number
      point: Vector3
    }[] = []
  
    // Find all intersection points between the polygon and the line segment
    for (let i = 0; i < polygon.vertices.length; i++) {
      const currentPoint = polygon.vertices[i]
      const nextPoint = polygon.next(currentPoint)
      const polygonEdge: LineSegment = {
        start: currentPoint,
        end: nextPoint,
      }
      const intersection = lineIntersection(polygonEdge, lineSegment)
      if (intersection !== null) {
        intersectionPoints.push({
          edgeIndex: i,
          point: intersection,
        })
      }
    }
  
    if (intersectionPoints.length !== 2) {
      // The polygon is either not intersecting the line segment, or is intersecting it at more than two points
      return [polygon]
    }
  
    const point1 = intersectionPoints[0]
    const point2 = intersectionPoints[1]
  
    let half1 = new Polygon(
      polygon.vertices.slice(point1.edgeIndex + 1, point2.edgeIndex + 1),
    )
    half1.vertices.unshift(point1.point)
    half1.vertices.push(point2.point)
  
    let half2 = new Polygon(
      polygon.vertices
        .slice(point2.edgeIndex)
        .concat(polygon.vertices.slice(0, point1.edgeIndex + 1)),
    )
    half2.vertices.unshift(point2.point)
    half2.vertices.push(point1.point)
    half2.vertices.splice(1, 1)
  
    if (gap > 0) {
      half1 = half1.peel(point2.point, gap / 2)
      half2 = half2.peel(point1.point, gap / 2)
    }
  
    let v = polygon.vectorByIndex(point1.edgeIndex)
    let dx1 = lineSegment.end.x - lineSegment.start.x
    let dy1 = lineSegment.end.y - lineSegment.start.y
    return cross(dx1, dy1, v.x, v.y) > 0 ? [half1, half2] : [half2, half1]
  }
  */