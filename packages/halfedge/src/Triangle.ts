import Topology from './Topology';

export default class Triangle{
    idx       : number = -1;
    halfEdges : Array<number> = [];
    face      : number = -1;

    constructor( idx?: number ){
        this.idx = ( idx !== undefined )? idx : -1;
    }

    findHalfEdge( top: Topology, edgeId: number ){
        let he;
        for( const i of this.halfEdges ){
            he = top.halfEdges[ i ];
            if( he.edge == edgeId ) return he;
        }
        return null;
    }

    nextHalfEdge( hIdx: number ){
        const i = this.halfEdges.indexOf( hIdx );
        return this.halfEdges[ (i+1) % 3 ];
    }
}
