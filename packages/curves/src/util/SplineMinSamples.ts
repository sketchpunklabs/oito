// #region IMPORTS
import { Spline } from '../Spline';
import { Vec3 }   from '@oito/oop';
// #endregion

export default class SplineMinSamples{
    // #region MAIN
    lenAry  !: Array<number>;	// Total length at each sample 
    incAry  !: Array<number>;	// Length Traveled at each samples
    timeAry !: Array<number>;   // Curve T Value at each samples
    points  !: Array<TVec3>;    // Each point sample
    arcLen		     = 0;       // Total Length of the Spline
    #dotThreshold    = Math.cos( 160 * Math.PI / 180 );
    #minDist         = 0.2;

    constructor( s ?:Spline){
        if( s ) this.fromSpline( s );
    }
    // #endregion

    // #region SETTERS

    set angleLimit( v: number ){ this.#dotThreshold = Math.cos( v * Math.PI / 180 ); }
    set radianLimit( v: number ){ this.#dotThreshold = Math.cos( v ); }

    // #endregion

    // #region BUILD
    fromSpline( s: Spline ): this {
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const pnts      = this.processSpline( s );
        const pLen      = pnts.length
        this.lenAry     = new Array( pLen );
        this.incAry     = new Array( pLen );
        this.timeAry    = new Array( pLen );
        this.points     = new Array( pLen );
        
        this.arcLen     = 0;
        this.lenAry[0]  = 0;
        this.incAry[0]  = 0;
        this.timeAry[0] = 0;
        this.points[0]  = pnts[0].p;

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let dist;
        for( let i=1; i < pnts.length; i++ ){
            dist            = Vec3.dist( pnts[i].p, pnts[i-1].p );
            this.arcLen    += dist;

            this.lenAry[i]  = this.arcLen;
            this.incAry[0]  = dist;
            this.timeAry[i] = pnts[i].t;
            this.points[i]  = pnts[i].p;
        }

        return this;
    }

    processSpline( s: Spline ): Array<{ t: number, p: TVec3 }>{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Compute initial points and fill stack
        const a = [0,0,0];
        const b = [0,0,0];
        const c = [0,0,0];
        s.at( 0, a );
        s.at( 1, b );
        s.at( 0.5, c );

        const stack = [
            // { min: 0, minp:a, max: 1, maxp:b },
            { min: 0,   minp: a, max: 0.5, maxp: c },
            { min: 0.5, minp: c, max: 1,   maxp: b },
        ];

        // Initial set of points
        const pnts = [
            { t: 0,      p: a },
            { t: 0.5,    p: c },
            { t: 1,      p: b },
        ];

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Sub divide segments till they are all below
        // the angle threshold to add more points around
        // curves and less on straighter lines
        const lft = new Vec3();
        const rit = new Vec3();
        let mp: Vec3;
        let mt = 0;
        
        let ii=0;
        while( stack.length > 0 ){
            ii++;
            if( ii > 100 ){ console.log( 'BREAK !!!!!'); break; }
            // ---------------------------
            // Get mid point of our segment
            const itm = stack.pop();
            if( Vec3.dist( itm!.minp, itm!.maxp ) < this.#minDist ) continue;

            mt = itm!.min * 0.5 + itm!.max * 0.5;   // Mid T
            mp = new Vec3();                        // Mid Position
            s.at( mt, mp )
            
            // ---------------------------
            // Compute left & right unit vectors from the mid point
            lft.fromSub( itm!.minp, mp ).norm()
            rit.fromSub( itm!.maxp, mp ).norm();
            const dot = Vec3.dot( lft, rit );
            if( dot <= this.#dotThreshold ){ continue; }

            // ---------------------------
            // Save mid point data
            pnts.push( { t:mt, p:mp } )

            // Add Left & right segments to the stack
            stack.push(
                { min: itm!.min, minp: itm!.minp,    max: mt,         maxp: mp },
                { min: mt,       minp: mp,           max: itm!.max ,  maxp: itm!.maxp },
            );   
        }

        pnts.sort( (a,b)=> (a.t === b.t) ? 0 : (a.t < b.t) ? -1 : 1 );
        return pnts
    }
    // #endregion

}