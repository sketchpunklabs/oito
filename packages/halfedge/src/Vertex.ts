export default class Vertex{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userData    : any       = null;
    idx         : number    = -1;
    halfEdge    : number    = -1;
    pos         : TVec3;
    
    constructor( x: number, y: number, z: number, idx ?: number ){
        this.idx        = ( idx !== undefined )? idx : -1;
        this.pos        = [ x, y, z ];
    }
}