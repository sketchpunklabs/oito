// http://paulbourke.net/miscellaneous/interpolation/

// Lagrange Interpolation
// -- https://www.youtube.com/watch?v=4S6G-zenbFM
// -- https://www.geeksforgeeks.org/lagranges-interpolation/

export default class Lerp{

    static linear( a:number, b:number, t:number ) : number{
        return a * (1-t) + b * t;
    }

    // http://paulbourke.net/miscellaneous/interpolation/
    static cosine( a:number, b:number, t:number ): number{
        const t2 = ( 1 - Math.cos( t * Math.PI) ) / 2;
        return a * ( 1- t2 ) + b * t2;
    }

    // // http://archive.gamedev.net/archive/reference/articles/article1497.html
    // static cubic( t, a, b ){
    //     let t2 = t * t,
    //         t3 = t2 * t;
    //     return a * ( 2*t3 - 3*t2 + 1 ) + b * ( 3 * t2 - 2 * t3 );
    // }


    // http://paulbourke.net/miscellaneous/interpolation/
    static cubicSpline( a:number, b:number, c:number, d:number, t:number ): number {     
        const t2 = t*t;
        const a0 = d - c - a + b;
        const a1 = a - b - a0;
        const a2 = c - a;
        return a0 * t * t2 + 
               a1 * t2     + 
               a2 * t      + 
               b;
    }

    // catmull - http://paulbourke.net/miscellaneous/interpolation/
    static cubicSmooth( a:number, b:number, c:number, d:number, t:number ): number {     
        const t2 = t*t;
        const a0 = -0.5 * a + 1.5 * b - 1.5 * c + 0.5 * d;
        const a1 = a - 2.5 * b + 2 * c - 0.5 * d;
        const a2 = -0.5 * a + 0.5 * c;
        return a0 * t * t2 + 
               a1 * t2     + 
               a2 * t      + 
               b;
    }


        //     // http://archive.gamedev.net/archive/reference/articles/article1497.html
        // // ta > td is the time value of the specific key frames the values belong to.
        // static catmull_irregular_frames( t, a, b, c, d, ta, tb, tc, td ){
        //     //let bb = ((b-a) / (tb-ta)) * 0.5 + ((c-b) / (tb-ta)) * 0.5;	// Original but the second denom seems wrong.
        //     //let cc = ((c-a) / (tc-tb)) * 0.5 + ((d-c) / (tc-tb)) * 0.5;
        //     let t2 = t * t;
        //     let t3 = t * t2;
        //     let bb = ((b-a) / (tb-ta)) * 0.5 + ((c-b) / (tc-tb)) * 0.5;	// Tangent at b
        //     let cc = ((c-a) / (tc-tb)) * 0.5 + ((d-c) / (td-tc)) * 0.5;	// Tangent at c
        //     let ti = 1.0; //tc - tb;	// This hurts the animation with the BB, CC change
        //     return	b * (2 * t3 - 3 * t2 + 1) +
        //             c * (3 * t2 - 2* t3) +
        //             bb * ti * (t3 - 2 * t2 + t) +
        //             cc * ti * (t3 - t2);
        // }

    /*
    Tension : 1 is high, 0 normal, -1 is low
    Bias    : 0 is even,
              positive is towards first segment,
              negative towards the other
    */
    static hermite( a:number, b:number, c:number, d:number, t:number, tension:number, bias:number): number{ 
        const t2   = t * t;
        const t3   = t2 * t;
        const btPN = ( 1 + bias ) * ( 1 - tension ) / 2;
        const btNP = ( 1 - bias ) * ( 1 - tension ) / 2;
        const m0   =  (b-a) * btPN + (c-b) * btNP;
        const m1   =  (c-b) * btPN + (d-c) * btNP;
        const a0   =  2*t3 - 3*t2 + 1;
        const a1   =    t3 - 2*t2 + t;
        const a2   =    t3 -   t2;
        const a3   = -2*t3 + 3*t2;

        return a0*b + a1*m0 + a2*m1 + a3*c;
    }
}