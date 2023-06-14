export default class UtilIndices{

    // cell col count, cell row count, loop=0:no, 1:col, 2:row
    static grid( out: Array<number>, cSize: number, rSize: number, initIdx=0, loop=0, revQuad=false ): Array<number>{
        const cols = cSize + 1;
        const cEnd = ( loop === 1 )? cols : cols - 1;
        let ra, rb;
        let i, j, k;
        let a, b, c, d;

        for( i=0; i < rSize; i++ ){
            ra = initIdx + cols * i;
            rb = initIdx + cols * ( i + 1 );

            for( j=0; j < cEnd; j++ ){
                k   = ( j + 1 ) % cols;
                a 	= ra + j;	
                b   = rb + j;
                c   = rb + k;
                d   = ra + k;

                if( !revQuad ) out.push( a,b,c, c,d,a ); // Counter Clockwise
                else 		   out.push( a,d,c, c,b,a ); // Clockwise
            }
        }

        return out;
    }

    // Altenative indices with alternating Black & Forward Slashes
    static gridAlt( out: Array<number>, cSize: number, rSize: number, initIdx=0, loop=0, revQuad=false ): Array<number>{
        const cols = cSize + 1;
        const cEnd = ( loop === 1 )? cols : cols - 1;
        let ra, rb;
        let i, j, k;
        let a, b, c, d;
        let bit;

        for( i=0; i < rSize; i++ ){
            ra  = initIdx + cols * i;
            rb  = initIdx + cols * ( i + 1 );
            bit = i & 1; // Alternate the starting Quad Layout for every row 

            for( j=0; j < cEnd; j++ ){
                k   = ( j + 1 ) % cols;
                a 	= ra + j;	
                b   = rb + j;
                c   = rb + k;
                d   = ra + k;

                // Alternate the Quad Layout for each cell
                if( revQuad ){
                    if( ( j & 1 ) == bit )	out.push( d, a, b, b, c, d ); // Front Slash
                    else					out.push( a, b, c, c, d, a ); // Back Slash
                }else{
                    if( ( j & 1 ) == bit )	out.push( d, c, b, b, a, d ); // Front Slash
                    else					out.push( a, d, c, c, b, a ); // Back Slash
                }
            }
        }

        return out;
    }

    static flipWinding( out: Array<number> ){
        let x;
        for( let i=0; i < out.length; i+=3 ){
            x           = out[ i ];
            out[ i ]    = out[ i+2 ];
            out[ i+2 ]  = x;
        }
        return out;
    }

}