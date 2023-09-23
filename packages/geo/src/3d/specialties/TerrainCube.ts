// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import UtilVertices from '../../util/UtilVertices';
import UtilIndices  from '../../util/UtilIndices';

// #region TYPES
type Props = {
    size   ?: number,
    height ?: number,
    cells  ?: number,
    alt    ?: boolean,
};
// #endregion


export default class TerrainCube{
    static create( _props: Props = {} ){
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const props = Object.assign({
            size    : 1,
            height  : 1,
            cells   : 2,
            alt     : true,
        }, _props );

        const rtn: TGeo = { vertices:[], indices:[], normals:[], texcoord:[] };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create top grid face
        UtilVertices.createGrid( rtn.vertices, props.size, props.size, props.cells, props.cells, false, false );
        
        if( props.alt ) UtilIndices.gridAlt( rtn.indices, props.cells, props.cells, 0, 0, true );
        else            UtilIndices.grid( rtn.indices, props.cells, props.cells, 0, 0, false );

        UtilVertices.gridTexcoord( rtn.texcoord, props.cells, props.cells );

        // & move it into height position
        for( let i=1; i < rtn.vertices.length; i+=3 ) rtn.vertices[ i ] = props.height;

        // Create normals
        for( let i=0; i < rtn.vertices.length / 3; i++ ) rtn.normals.push( 0,1,0 );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const edges = UtilVertices.gridEdgeIndices( props.cells, props.cells );

        this.addSide( rtn, edges[0], [-1,0, 0] );
        this.addSide( rtn, edges[1], [ 0,0, 1] );
        this.addSide( rtn, edges[2], [ 1,0, 0] );
        this.addSide( rtn, edges[3], [ 0,0,-1] );
        this.addCap( rtn, edges );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        return rtn;
    }

    static addSide( geo: TGeo, iAry: Array<number>, norm: ConstVec3 ){
        const iOffset = geo.vertices.length / 3;
        let ii;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create Vertices & Normals
        let u=0;
        let uu=0;
        for( const i of iAry ){
            ii = i * 3;
            uu = u++ / ( iAry.length-1 );

            geo.texcoord.push( uu, 1, uu, 0 );
            geo.normals.push( ...norm, ...norm );
            geo.vertices.push(
                geo.vertices[ ii + 0 ], // TOP POINT
                geo.vertices[ ii + 1 ],
                geo.vertices[ ii + 2 ],

                geo.vertices[ ii + 0 ], // BOT POINT
                0,
                geo.vertices[ ii + 2 ],
            );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create Indices
        for( let i=0; i < iAry.length-1; i++ ){
            ii = iOffset + i * 2;
            geo.indices.push(
                ii,   ii+1, ii+2,
                ii+2, ii+1, ii+3,
            );
        }
    }

    static addCap( geo: TGeo, edges: Array< Array<number> > ): void{
        const iOffset = geo.vertices.length / 3;
        const mid     = [0,0];
        let ii;
        let i;
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // LEFT SIDE
        for( i=0; i < edges[0].length; i++ ){
            ii        = 3 * edges[0][i];
            mid[ 0 ] += geo.vertices[ ii + 0 ];
            mid[ 1 ] += geo.vertices[ ii + 2 ];

            geo.vertices.push( geo.vertices[ ii + 0 ], 0, geo.vertices[ ii + 2 ] );
            geo.texcoord.push( 0, i / ( edges[0].length - 1) );
            geo.normals.push( 0, -1, 0 );
        }

        // Bottom
        for( i=1; i < edges[1].length; i++ ){
            ii        = 3 * edges[1][i];
            mid[ 0 ] += geo.vertices[ ii + 0 ];
            mid[ 1 ] += geo.vertices[ ii + 2 ];
            geo.vertices.push( geo.vertices[ ii + 0 ], 0, geo.vertices[ ii + 2 ] );
            geo.texcoord.push( i / ( edges[1].length - 1), 1 );
            geo.normals.push( 0, -1, 0 );
        }

        // RIGHT
        for( let i=1; i < edges[2].length; i++ ){
            ii        = 3 * edges[2][i];
            mid[ 0 ] += geo.vertices[ ii + 0 ];
            mid[ 1 ] += geo.vertices[ ii + 2 ];
            geo.vertices.push( geo.vertices[ ii + 0 ], 0, geo.vertices[ ii + 2 ] );
            geo.texcoord.push( 1, 1 - i / ( edges[2].length - 1) );
            geo.normals.push( 0, -1, 0 );
        }

        // TOP
        for( let i=1; i < edges[3].length-1; i++ ){
            ii        = 3 * edges[3][i];
            mid[ 0 ] += geo.vertices[ ii + 0 ];
            mid[ 1 ] += geo.vertices[ ii + 2 ];
            geo.vertices.push( geo.vertices[ ii + 0 ], 0, geo.vertices[ ii + 2 ] );
            geo.texcoord.push(  1 - i / ( edges[3].length - 1), 0 );
            geo.normals.push( 0, -1, 0 );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Center Point
        const iMid = geo.vertices.length / 3;
        const vCnt = iMid - iOffset;
        mid[ 0 ] /= vCnt;
        mid[ 1 ] /= vCnt;

        geo.vertices.push( mid[0], 0, mid[1] );
        geo.normals.push( 0,-1,0 );
        geo.texcoord.push( 0.5, 0.5 );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Indices
        for( let i=0; i < vCnt; i++ ){
            ii = ( i+1 ) % vCnt;
            geo.indices.push( iOffset + ii, iOffset + i, iMid );
        }
    }

}