export default class Wave{

    // Square Wave :: y = (x++ % 6) < 3 ? 3 : 0;
    // Sign Wave :: y = 3 * sin((float)x / 10);
    // Concave Wave :: y = pow(abs((x++ % 6) - 3), 2.0);
    // Diff Concave Wave :: y = pow(abs((x++ % 6) - 3), 0.5);

    static trianglePeriod( x: number, period: number = 1 ): number{
        // Triangle Wave :: y = abs((x++ % 6) - 3);
        return 1 - ( Math.abs( (x % (period*2)) - period ) / period);
    }

}

/*
    //https://github.com/nodebox/g.js/blob/master/src/libraries/math.js
    static sawtoothWave(time, min=0, max=1, period=1){
        var amplitude	= (max - min) * 0.5,
            frequency	= Maths.PI_2 / period,
            phase		= 0;

        if(time % period !== 0)	phase = (time * frequency) % Maths.PI_2;
        if(phase < 0)			phase += Maths.PI_2;

        //return 2 * (phase / Maths.PI_2) * amplitude + min;
        return 2 * (phase * 0.15915494309) * amplitude + min; //Change Div to Mul
    }

    static triangleWave(v, min=0, max=1, period = 1){
        var amplitude	= (max - min) * 0.5,
            frequency	= Maths.PI_2 / period,
            phase		= 0,
            time		= v + period * 0.25; // div 4 changed to * 0.25
            
        if(time % period !== 0)	phase	= (time * frequency) % Maths.PI_2;
        if(phase < 0) 			phase	+= Maths.PI_2;

        return 2 * amplitude * (1 + -Math.abs((phase / Maths.PI_2) * 2 - 1)) + min;
    }

    static squareWave (v, min=0, max=1, period=1){ return ( (v % period) <  (period * 0.5) )? max : min; }

    static triangle_wave( t ){
        t -= Math.floor( t * 0.5 ) * 2;
        t = Math.min( Math.max( t, 0 ), 2 );
        return 1 - Math.abs( t - 1 );
    }

    [MethodImpl( INLINE )] public static float TriangleWave( float t, float period = 1f ) {
        float x = t / period;
        return 1f - Abs( 2 * ( x - Floor( x ) ) - 1 );
    }

    //static cheap_parabola( t ) { return 1.0 - Math.abs( t * 2.0 - 1.0 ); }
    */