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
}