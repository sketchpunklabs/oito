import Vertex   from './Vertex';
import Edge     from './Edge';
import HalfEdge from './HalfEdge';
import Triangle from './Triangle';
import Face     from './Face';

export default class Topology{
    // #region MAIN
    mapVerts    : Map<string,number> = new Map();
    mapEdges    = new Map();
    vertices    : Array<Vertex>     = [];
    edges       : Array<Edge>       = [];
    halfEdges   : Array<HalfEdge>   = [];
    triangles   : Array<Triangle>   = [];
    faces       : Array<Face>       = [];

    clearMaps(){
        this.mapVerts.clear();
        this.mapEdges.clear();        
    }

    dispose(){
        this.mapVerts.clear();
        this.mapEdges.clear();
        this.vertices.length    = 0;
        this.edges.length       = 0;
        this.halfEdges.length   = 0;
        this.triangles.length   = 0;
        this.faces.length       = 0;
    }
    // #endregion

    // #region ADDING
    addVertex( pos: ConstVec3 ): number{
        const x = Math.floor( pos[ 0 ] * 100000 );
        const y = Math.floor( pos[ 1 ] * 100000 );
        const z = Math.floor( pos[ 2 ] * 100000 );
        const k = x + '_' + y + '_' + z;

        // Guard doesn't seem to understand .has, just recast to any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if( this.mapVerts.has( k ) ) return ( this.mapVerts.get( k ) as any );
        
        const v = new Vertex( pos[0], pos[1], pos[2], this.vertices.length );
        this.vertices.push( v );
        this.mapVerts.set( k, v.idx );

        return v.idx;
    }

    addEdge( ai: number, bi: number ){
        const [ min, max ] = ( bi < ai )? [ bi, ai ] : [ ai, bi ]; // Keep idx order
        const key          = min + '_' + max;
        const eIdx         = this.mapEdges.get( key );

        const va = this.vertices[ ai ];
        const vb = this.vertices[ bi ];

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // If edge exists, then create twin if none exists
        if( eIdx != undefined ){ 
            const edge = this.edges[ eIdx ];
            const he   = this.halfEdges[ edge.halfEdge ];

            if( he.twin !== -1 ){
                console.log( 'Meh', edge, he, this.halfEdges[ he.twin ] );
                console.error( 'Edge already has two half edges' );
                return null;
            }

            const twin  = new HalfEdge( this.halfEdges.length, he.idx );
            twin.vertex = ai;
            twin.edge   = eIdx;
            he.twin     = twin.idx;

            this.halfEdges.push( twin );

            if( va.halfEdge === -1 ) va.halfEdge = twin.idx;
            if( vb.halfEdge === -1 ) vb.halfEdge = twin.idx;
            
            return twin;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Edge doesn't exist, create it and its half edge
        const he   = new HalfEdge( this.halfEdges.length );
        const edge = new Edge( ai, bi, this.edges.length, he.idx );
        
        he.vertex = ai;
        he.edge   = edge.idx;

        if( va.halfEdge === -1 ) va.halfEdge = he.idx;
        if( vb.halfEdge === -1 ) vb.halfEdge = he.idx;

        this.edges.push( edge );
        this.halfEdges.push( he );

        this.mapEdges.set( key, edge.idx );
        return he;
    }

    addTriangle( ai: number, bi: number, ci: number ){
        // Create Edges & HalfEdges
        const he0 = this.addEdge( ai, bi );
        if( he0 === null ) return null;

        const he1 = this.addEdge( bi, ci );
        if( he1 === null ) return null;
        
        const he2 = this.addEdge( ci, ai );
        if( he2 === null ) return null;

        // Build Triangle
        const tri = new Triangle( this.triangles.length );
        tri.halfEdges.push( he0.idx, he1.idx, he2.idx );
        this.triangles.push( tri );
        
        // Set which triangle the half edge is used on
        he0.tri     = tri.idx;
        he0.triPrev = he2.idx;
        he0.triNext = he1.idx;

        he1.tri     = tri.idx;
        he1.triPrev = he0.idx;
        he1.triNext = he2.idx;

        he2.tri     = tri.idx;
        he2.triPrev = he1.idx;
        he2.triNext = he0.idx;

        return tri;
    }

    addTriangleVerts( a: ConstVec3, b: ConstVec3, c: ConstVec3 ){
        const ai = this.addVertex( a );
        const bi = this.addVertex( b );
        const ci = this.addVertex( c );
        return this.addTriangle( ai, bi, ci );
    }

    addTriFromHalfEdges( aryHe: Array<HalfEdge> ){
        const tri = new Triangle( this.triangles.length );
        this.triangles.push( tri );
        
        const cnt = aryHe.length;
        let he: HalfEdge;
        let prevIdx : number = aryHe[ cnt-1 ].idx; // Starting Prev is last

        for( let i=0; i < cnt; i++ ){
            he         = aryHe[ i ];
            he.tri     = tri.idx;
            he.triPrev = prevIdx;
            he.triNext = aryHe[ (i+1) % cnt ].idx;

            prevIdx    = he.idx;
            tri.halfEdges.push( he.idx );
        }

        return tri;
    }

    addFaceFromHalfEdges( aryHe: Array<HalfEdge> ){
        const face = new Face( this.faces.length );
        this.faces.push( face );

        const cnt = aryHe.length;
        let he: HalfEdge;
        let prevIdx = aryHe[ cnt-1 ].idx; // Starting Prev is last

        for( let i=0; i < cnt; i++ ){
            he          = aryHe[ i ];
            he.face     = face.idx;
            he.facePrev = prevIdx;
            he.faceNext = aryHe[ (i+1) % cnt ].idx;

            prevIdx     = he.idx;
            face.halfEdges.push( he.idx );
        }

        return face;
    }
    // #endregion

    // #region GETTERS
    getVertPos( i: number ){ return this.vertices[ i ].pos; }
    getHalfEdgeVertIdx( i: number ){ return this.halfEdges[ i ].vertex; }
    getHalfEdgeVertex( i: number ){ return this.vertices[ this.halfEdges[ i ].vertex ]; }
    getHalfEdgePos( i: number ){ return this.vertices[ this.halfEdges[ i ].vertex ].pos; }
    // #endregion

    // #region FLATTEN

    flattenVertices(): Array<number>{
        const rtn = new Array( this.vertices.length * 3 );
        let o, i=0;
        for( o of this.vertices ){
            rtn[ i++ ] = o.pos[ 0 ];
            rtn[ i++ ] = o.pos[ 1 ];
            rtn[ i++ ] = o.pos[ 2 ];
        }
        return rtn;
    }

    flattenIndices(): Array<number>{
        const rtn = new Array( this.triangles.length * 3 );
        let o, i=0;
        for( o of this.triangles ){
            rtn[ i++ ] = this.getHalfEdgeVertIdx( o.halfEdges[ 0 ] );
            rtn[ i++ ] = this.getHalfEdgeVertIdx( o.halfEdges[ 1 ] );
            rtn[ i++ ] = this.getHalfEdgeVertIdx( o.halfEdges[ 2 ] );
        }
        return rtn;
    }
    // #endregion

    // #region ITERATORS
    iterEdges(){
        let   i   : number = 0;
        const val : { a:TVec3, b:TVec3 } = { a:[], b:[] };

        const result = { value:val, done:false };
        const next   = ()=>{
            if( i >= this.edges.length ) result.done = true;
            else{
                const edge  = this.edges[ i ];
                val.a       = this.vertices[ edge.aIdx ].pos;
                val.b       = this.vertices[ edge.bIdx ].pos;
            }
            i++;
            return result;
        };

        return {
            [Symbol.iterator](){
                return { next };
            }
        };
    }
    // #endregion
}