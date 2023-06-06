import type Topology from './Topology';
import type Vertex   from './Vertex';

export default class Face{
    idx       : number         = -1;
    halfEdges : Array<number>  = [];

    constructor( idx ?: number ){
        if( idx !== undefined) this.idx = idx;
    }

    getVertices( top: Topology, out: Array<Vertex> | null ){
        out = out || new Array( this.halfEdges.length );
        for( let i=0; i < this.halfEdges.length; i++ ){
            out[ i ] = top.vertices[ top.halfEdges[ this.halfEdges[ i ] ].vertex ];
        }
        return out;
    }
}
