// #region IMPORT
import UtilVertices from '../util/UtilVertices';
import UtilIndices  from '../util/UtilIndices';
// #endregion

// #region TYPES
type TMap  = { [key:string] : number | boolean };
type Props = {
    width       : number,
    height      : number,
    cols        : number,
    rows        : number,
    center      : boolean,
    vertical    : boolean,
    alt         : boolean,
    warpRadius  : number,
};
// #endregion

export default class Grid{

    static create( _props: TMap ): TGeo{
        const props: Props = Object.assign({
            width       : 1,
            height      : 1,
            cols        : 2,
            rows        : 2,

            alt         : false,
            center      : false,
            vertical    : false,
            warpRadius  : 0,
        }, _props );

        const verts = UtilVertices.createGrid( [], props.width, props.height, props.cols, props.rows, props.center, props.vertical );

        if( props.warpRadius !== 0 ) warp( verts, props.warpRadius );

        return {
            vertices : verts,
            indices  : ( props.alt )
                ? UtilIndices.gridAlt( [], props.cols, props.rows )
                : UtilIndices.grid( [], props.cols, props.rows ),

            texcoord : texcoord( [], props.cols, props.rows ),
        }
    }

}

// #region HELPERS

function texcoord( out: Array<number>, xLen: number, yLen: number ){
    let x, y, yt;
    for( y=0; y <= yLen; y++ ){
        yt = 1 - ( y / yLen );
        for( x=0; x <= xLen; x++ ) out.push( x / xLen, yt );
    }

    return out;
}

function warp( verts: Array<number>, radius: number ){
    const fn = ( i: number ): number=>{
        const v  = verts[ i ];               // Get Axis Value
        let   t  = v / radius;               // Reverse Map Axis Value
        const ts = Math.sign( t );           // SAVE Sign, important
        t        = 1.0 - Math.abs( t );      // Invert T
        return ( 1.0 - t**2 ) * ts * radius; // easeInQuad 
    }

    const cnt = verts.length / 3;
    for( let i=0; i < cnt; i++ ){
        verts[ i*3 ]     = fn( i*3 );     // x
        verts[ i*3 + 2 ] = fn( i*3 + 2 ); // z
    }
}

// #endregion