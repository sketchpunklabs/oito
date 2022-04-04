// http://paulbourke.net/miscellaneous/interpolation/

// Lagrange Interpolation
// -- https://www.youtube.com/watch?v=4S6G-zenbFM
// -- https://www.geeksforgeeks.org/lagranges-interpolation/

export default class Lerp{

    static linear( a:number, b:number, t:number ) : number{
        return a * (1-t) + b * t;
    }

    static cosine( a:number, b:number, t:number ): number{
        const t2 = ( 1 - Math.cos( t * Math.PI) ) / 2;
        return a * ( 1- t2 ) + b * t2;
    }

    static cubic( a:number, b:number, c:number, d:number, t:number ): number {     
        const t2 = t*t;
        const a0 = d - c - a + b;
        const a1 = a - b - a0;
        const a2 = c - a;
        return a0 * t * t2 + 
               a1 * t2     + 
               a2 * t      + 
               b;
    }

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

        return( a0*b + a1*m0 + a2*m1 + a3*c );
    }
}