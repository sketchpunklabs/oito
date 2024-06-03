// #region TYPES
type TMap  = { [key:string] : number | boolean };
type Props = {
    oradius : number,
    iradius : number,
};
// #endregion

export default class UVDisk{
    static create( _props: TMap ): TGeo{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Setup
        const props: Props = Object.assign({
            oradius : 1,
            iradius : 0.85,
        }, _props );

        const ind  : Array<number> = [];
        const vert : Array<number> = [];
        const uv   : Array<number> = [];
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Build Vertices & UV
        const edges  = 12;
        const offset = Math.PI * -0.5;
        let rad, x, y;

        for( let i=0; i < edges; i++ ){
            rad = Math.PI * 2 * ( i / edges ) + offset;
            x   = Math.cos( rad );
            y   = Math.sin( rad );

            vert.push( x * props.oradius, 0, y * props.oradius );
            uv.push(
                ( Math.abs( x ) < 0.00001 )? 0 :  x / props.iradius, 
                ( Math.abs( y ) < 0.00001 )? 0 : -y / props.iradius,
            );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Compute Triangle Indices
        // Ring 1
        for( let i=0; i < edges; i+=2 ){
            ind.push( (i+3) % edges, (i+2) % edges, i+1 );
        }

        // Ring 2
        for( let i=0; i < edges; i+=4 ){
            ind.push( (i+5) % edges, (i+3) % edges, i+1 );
        }

        // Ring 3
        for( let i=0; i < edges; i+=8 ){
            ind.push( (i+9) % edges, (i+5) % edges, i+1 );
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        return { 
            indices  : ind,
            vertices : vert,
            texcoord : uv,
        };
    }
}