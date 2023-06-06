import type Topology from './Topology';

export default class Edge{
    idx      : number = -1;
    halfEdge : number = -1;
    aIdx     : number = -1;
    bIdx     : number = -1;

    constructor( a:number, b:number, idx ?: number, he ?: number ){
        this.idx      = ( idx !== undefined )? idx : -1;
        this.halfEdge = ( he  !== undefined )? he  : -1;
        this.aIdx     = a;
        this.bIdx     = b;
    }

    getTriangles( top: Topology ): Array< number > | null{
        // No half edge
        if( this.halfEdge === -1 ) return null;
        
        // No triangle
        const a = top.halfEdges[ this.halfEdge ];
        if( a.tri === -1 )  return null;
        
        // If twin exists, check if there is a second triangle
        if( a.twin !== -1 ){
            const b = top.halfEdges[ a.twin ];
            if( b.tri !== -1 ) return [ a.tri, b.tri ];
        }

        // Only one triangle
        return [ a.tri ];
    }
}