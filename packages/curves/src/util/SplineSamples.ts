// #region IMPORTS
import { Spline } from '../Spline';
import { Vec3 }   from '@oito/oop';
// #endregion

export default class SplineSamples{
    // #region MAIN
    arcLen		= 0;            // Total Length of the Spline
    curveCnt 	= 0;            // How many curves in spline
    sampPerCrv  = 0;            // How many samples per curve
    sampCnt     = 0;            // Total Sample Count
    lenAry  !: Array<number>;	// Total length at each sample 
    incAry  !: Array<number>;	// Length Traveled at each samples
    timeAry !: Array<number>;   // Curve T Value at each samples
    spline  !: Spline;

    constructor( s ?:Spline, samp_cnt=5 ){
        if( s ) this.fromSpline( s, samp_cnt );
    }
    // #endregion

    // #region BUILD
    fromSpline( s: Spline, sampCnt=5 ): this {
        this.spline     = s;
        this.curveCnt	= s.curveCount;
        this.sampPerCrv = sampCnt;
        this.sampCnt    = this.curveCnt * (sampCnt-1) + 1;
        this.lenAry     = new Array( this.sampCnt );
        this.incAry     = new Array( this.sampCnt );
        this.timeAry    = new Array( this.sampCnt );

        sampCnt--; // indexing 0 to N-1
    
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const v0    = new Vec3();
        const v1    = new Vec3();
        let a       = 1;
        let i, j, t, len;

        s.at( 0, v0 );
        this.lenAry[ 0 ]	= 0;
        this.incAry[ 0 ]	= 0;
        this.timeAry[ 0 ]	= 0;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for( i=0; i < this.curveCnt; i++ ){				    // One Iteration Per Curve
            for( j=1; j <= sampCnt; j++ ){					// One Iteractin per Sample on 1 Curve
                t = j / sampCnt;							// Time on the curve
                s.atCurve( i, t, v1 );                      // Get Position of the curve					

                // .................................
                len                 = Vec3.dist( v0, v1 );
                this.arcLen         += len;					// Total Length
                this.lenAry[ a ]    = this.arcLen;			// Current Total Length
                this.incAry[ a ]    = len;					// Length between Current+Previous Point
                this.timeAry[ a ]   = i + t;				// Time Curve Step

                // .................................
                v0.copy( v1 );                              // Save for next loop
                a++;                                        // Move Array Index up
            }
        }

        return this;
    }
    // #endregion

    // #region GETTERS
    // Compute the Spline's T Value based on a specific length of the curve
    atLen( len:number, a=0, b=this.sampCnt-2 ): number{
        for( let i=b; i >= a; i-- ){
            if( this.lenAry[ i ] < len ){
                let tt	= ( len - this.lenAry[ i ] ) / this.incAry[ i+1 ];          // Normalize the Search Length   ( x-a / b-a )
                let ttt	= this.timeAry[ i ] * (1-tt) + this.timeAry[ i+1 ] * tt;    // Interpolate the Curve Time between two points
                return ttt / this.curveCnt;                                         // Since time saved as as Curve# + CurveT, Normalize it based on total time which is curve count
            }
        }
        return 0;
    }

    // Get Spline T based on Time of Arc Length
    at( t: number ): number{
        if( t >= 1 ) return 1;
        if( t <= 0 ) return 0;
        return this.atLen( this.arcLen * t );
    }

    // Get Spline T based on Time between Two Main Points on the Spline
    atRange( a: number, b: number, t: number ): number{
        const ai 	= a * this.sampPerCrv;
        const bi	= b * this.sampPerCrv;
        const len	= this.lenAry[ ai ] * (1-t) + this.lenAry[ bi ] * t;
        return this.atLen( len, ai, bi );
    }
    // #endregion

    // #region ITERATORS
    iterPoints() : { [Symbol.iterator]() : { next:()=>{ value:Vec3, done:boolean } } } {
        const result  = { value:new Vec3(), done:false };
        const len     = this.timeAry.length;
        let i = 0;
        let t;
        let c; 

        const next    = ()=>{
                if( i >= len ) result.done = true;
                else{
                    const n = this.timeAry[i];
                    if( n >= this.curveCnt ){
                        c = this.curveCnt - 1;
                        t = 1;
                    }else{
                        c = Math.floor( n );
                        t = n - c;
                    }
   
                    this.spline.atCurve( c, t, result.value );
                    i++;
                }
                return result;
              };
        return { [Symbol.iterator](){ return { next }; } };
    }
    // #endregion
}