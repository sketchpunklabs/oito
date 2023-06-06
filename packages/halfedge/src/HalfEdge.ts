import type Topology from './Topology';

export default class HalfEdge{
    idx        : number = -1;
    twin       : number = -1; // It's reverse side

    vertex     : number = -1; // Vertex that starts the half edge
    edge       : number = -1; // Edge it belongs too
    tri        : number = -1; // Triangle it belongs to
    face       : number = -1; // Face it belongs too

    triPrev    : number = -1;
    triNext    : number = -1;
    facePrev   : number = -1;
    faceNext   : number = -1; 

    constructor( idx ?: number, twin ?: number ){
        this.idx  = ( idx  !== undefined )? idx  : -1;
        this.twin = ( twin !== undefined )? twin : -1;   // It's reverse side 
    }

    getOppositeVertex( top: Topology, vIdx: number ){
        const edg = top.edges[ this.edge ];
        return ( edg.aIdx !== vIdx )? edg.aIdx : edg.bIdx;
    }
}
