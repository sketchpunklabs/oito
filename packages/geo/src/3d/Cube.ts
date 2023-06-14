
// #region TYPES
type TMap  = { [key:string] : number | boolean };
type Props = {
    width       : number,
    height      : number,
    depth       : number,
    placement   : string,
};
// #endregion


export default class Cube{
    static create( _props: TMap): TGeo{
        const props: Props = Object.assign({
            width       : 1,
            height      : 1,
            depth       : 1,
            placement   : 'origin',
        }, _props );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let x1: number;
        let y1: number;
        let z1: number;
        let x0: number;
        let y0: number;
        let z0: number;

        switch( props.placement ){
            case 'floor':
                x1 = props.width  * 0.5;
                y1 = props.height;
                z1 = props.depth  * 0.5;
                x0 = -x1;
                y0 = 0;
                z0 = -z1;
            break;

            case 'voxel':
                x1 = props.width;
                y1 = props.height;
                z1 = props.depth;
                x0 = 0;
                y0 = 0;
                z0 = 0;
            break;
            
            default:
                x1 = props.width  * 0.5;
                y1 = props.height * 0.5; 
                z1 = props.depth  * 0.5;
                x0 = -x1;
                y0 = -y1;  
                z0 = -z1;
            break;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    
        // Starting bottom left corner, then working counter clockwise to create the front face.
        // Backface is the first face but in reverse (3,2,1,0)
        // keep each quad face built the same way to make index and uv easier to assign
        const vert = [
            x0, y1, z1, 	//0 Front
            x0, y0, z1, 	//1
            x1, y0, z1, 	//2
            x1, y1, z1, 	//3 

            x1, y1, z0, 	//4 Back
            x1, y0, z0, 	//5
            x0, y0, z0, 	//6
            x0, y1, z0, 	//7 

            x1, y1, z1, 	//3 Right
            x1, y0, z1, 	//2 
            x1, y0, z0, 	//5
            x1, y1, z0, 	//4

            x0, y0, z1, 	//1 Bottom
            x0, y0, z0, 	//6
            x1, y0, z0, 	//5
            x1, y0, z1, 	//2

            x0, y1, z0, 	//7 Left
            x0, y0, z0, 	//6
            x0, y0, z1, 	//1
            x0, y1, z1, 	//0

            x0, y1, z0, 	//7 Top
            x0, y1, z1, 	//0
            x1, y1, z1, 	//3
            x1, y1, z0, 	//4
        ];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Build the index of each quad [0,1,2, 2,3,0]
        let i;
        // const idx = [];
        // for( i=0; i < vert.length / 3; i+=2) idx.push( i, i+1, ( Math.floor( i / 4 ) * 4 ) + ( ( i + 2 ) % 4 ) );

        // Hardcode indices
        const idx = [ 
            0, 1, 2, 2, 3, 0, 
            4, 5, 6, 6, 7, 4, 
            8, 9, 10, 10, 11, 8, 
            12, 13, 14, 14, 15, 12, 
            16, 17, 18, 18, 19, 16, 
            20, 21, 22, 22, 23, 20,
        ];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //Build UV data for each vertex
        const uv = [];
        for( i=0; i < 6; i++) uv.push( 0,0,  0,1,  1,1,  1,0 );
        //for( i=0; i < 6; i++) uv.push( 0,1, 0,0, 1,0, 1,1 );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return { 
            vertices    : vert,
            indices     : idx,
            texcoord    : uv, 
            normals     : [ // Left/Right have their xNormal flipped to render correctly in 3JS, Why does normals need to be mirrored on X?
                0, 0, 1,     0, 0, 1,    0, 0, 1,    0, 0, 1,   // Front
                0, 0,-1,     0, 0,-1,    0, 0,-1,    0, 0,-1,   // Back
                1, 0, 0,     1, 0, 0,    1, 0, 0,    1, 0, 0,   // Left
                0,-1, 0,     0,-1, 0,    0,-1, 0,    0,-1, 0,   // Bottom
               -1, 0, 0,    -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   // Right
                0, 1, 0,     0, 1, 0,    0, 1, 0,    0, 1, 0    // Top
            ],
        };
    }
}