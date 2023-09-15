// import { Maths } from '@oito/core';

export default class UtilVertices{

    // static createCircle( out: Array<number>, pntCnt=6, radius=1 ): void{
    //     let t, angle;
    //     for( let i=0; i < pntCnt; i++ ){
    //         t		= i / pntCnt;
    //         angle 	= Maths.TAU * t;
    //         out.push( Math.cos( angle ) * radius, Math.sin( angle ) * radius, 0 );
    //     }
    // }

    // static createArc( out: Array<number>, angle_a: number, angle_b: number, div: number, radius=1, offset=[0,0,0] ): void{
    //     const inc = 1 / ( div - 1 );
    //     let x: number, y: number, t: number, angle: number;

    //     for( let i=0; i < div; i++ ){
    //         t		= i * inc;
    //         angle 	= angle_a * ( 1 - t ) + angle_b * t;
    //         x		= Math.cos( angle ) * radius;
    //         y		= Math.sin( angle ) * radius;
    //         out.push( x + offset[0], y + offset[1], offset[2] );
    //     }
    // }

    static createGrid( out: Array<number>, width=1, height=1, xCells=2, yCells=2, useCenter=false, isVertical=false ): Array<number>{
        const   xInc   = width / xCells;
        let     yInc   = height / yCells;
        let     ox      = 0,    // Offset
                oz      = 0,
                x, z, xi, yi;
    
        if( useCenter ){
            if( !isVertical ){
                ox    = -width * 0.5;
                oz    = -height * 0.5;
            }else{
                ox    = -width * 0.5;
                oz    = height * 0.5;
                yInc  = -yInc;
            }
        }
    
        for( yi=0; yi <= yCells; yi++ ){
            z = yi * yInc;
            for( xi=0; xi <= xCells; xi++ ){
                x = xi * xInc;
                
                if( !isVertical ) out.push( x+ox, 0.0, z+oz );
                else              out.push( x+ox, z+oz, 0.0 );  
            }
        }

        return out;
    }

    // Counterclock wise indice starting at TOP-LEFT corner
    static gridEdgeLoopIndices( xCells: number, yCells: number ): Array<number>{
        const xLen = xCells + 1;
        const out  = [];
        const t    = xLen * yCells;
        let i;
        
        for( i=0; i <= yCells; i++ )    out.push( xLen * i );           // LEFT SIDE
        for( i=1; i <= xCells; i++ )    out.push( i + t );              // BOTTOM SIDE
        for( i=xCells-1; i >= 0; i-- )  out.push( xLen * i + xCells );  // RIGHT SIDE
        for( i=xCells-1; i >= 1; i-- )  out.push( i );                  // TOP SIDE
    
        return out;
    }

    // Get the indices of each side edge of a grid
    // Counterclock wise indice starting at TOP-LEFT corner
    static gridEdgeIndices( xCells: number, yCells: number ): Array< Array<number> >{
        const a    = [];
        const b    = [];
        const c    = [];
        const d    = [];
        const xLen = xCells + 1;
        const t    = xLen * yCells;
        let i;
        
        for( i=0; i <= yCells; i++ )  a.push( xLen * i );           // LEFT SIDE
        for( i=0; i <= xCells; i++ )  b.push( i + t );              // BOTTOM SIDE
        for( i=xCells; i >= 0; i-- )  c.push( xLen * i + xCells );  // RIGHT SIDE
        for( i=xCells; i >= 0; i-- )  d.push( i );                  // TOP SIDE
    
        return [ a, b, c, d ];
    }

    static gridTexcoord( out: Array<number>, xLen: number , yLen: number ): void{
        let x, y, yt;
        for( y=0; y <= yLen; y++ ){
            yt = 1 - ( y / yLen );
            for( x=0; x <= xLen; x++ ) out.push( x / xLen, yt );
        }
    }
}


// function plane_ellipse( vecCenter, xAxis, yAxis, angle, xRadius, yRadius, out=[0,0,0] ){
//     const sin = Math.sin( angle );
//     const cos = Math.cos( angle );
//     out[0] = vecCenter[0] + xRadius * cos * xAxis[0] + yRadius * sin * yAxis[0];
//     out[1] = vecCenter[1] + xRadius * cos * xAxis[1] + yRadius * sin * yAxis[1];
//     out[2] = vecCenter[2] + xRadius * cos * xAxis[2] + yRadius * sin * yAxis[2];
//     return out;
// }