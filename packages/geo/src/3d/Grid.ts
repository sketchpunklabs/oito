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
        }, _props );

        return {
            vertices : UtilVertices.createGrid( [], props.width, props.height, props.cols, props.rows, props.center, props.vertical ),
            
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
// #endregion