import Vec3 from './Vec3';

export default class Quat extends Array< number >{
    // #region STATIC CONSTANTS
    static LOOKXP = [0,-0.7071067811865475,0,0.7071067811865475];
    static LOOKXN = [0,0.7071067811865475,0,0.7071067811865475];
    static LOOKYP = [0.7071067811865475,0,0,0.7071067811865475];
    static LOOKYN = [-0.7071067811865475,0,0,0.7071067811865475];
    static LOOKZP = [0,-1,0,0];
    static LOOKZN = [0,0,0,1];
    // #endregion

    // #region MAIN
    constructor( v ?: ConstVec4 ){
        super( 4 );

        if( v instanceof Quat || v instanceof Float32Array || ( v instanceof Array && v.length == 4 ) ){
            this[ 0 ] = v[ 0 ];
            this[ 1 ] = v[ 1 ];
            this[ 2 ] = v[ 2 ];
            this[ 3 ] = v[ 3 ];
        }else{
            this[ 0 ] = 0;
            this[ 1 ] = 0;
            this[ 2 ] = 0;
            this[ 3 ] = 1;
        }
    }
    // #endregion

    // #region SETTERS / GETTERS

    get x() : number { return this[ 0 ]; }
    set x( v: number ){ this[ 0 ] = v; }

    get y() : number { return this[ 1 ]; }
    set y( v: number ){ this[ 1 ] = v; }

    get z() : number { return this[ 2 ]; }
    set z( v: number ){ this[ 2 ] = v; }

    get w() : number { return this[ 3 ]; }
    set w( v: number ){ this[ 3 ] = v; }

    xyzw( x: number, y: number, z: number, w: number ) : Quat {
        this[ 0 ] = x;
        this[ 1 ] = y;
        this[ 2 ] = z;
        this[ 3 ] = w;
        return this;
    }

    identity(): this{
        this[ 0 ] = 0;
        this[ 1 ] = 0;
        this[ 2 ] = 0;
        this[ 3 ] = 1;
        return this
    }

    copy( a: ConstVec4 ): this{
        this[ 0 ] = a[ 0 ];
        this[ 1 ] = a[ 1 ];
        this[ 2 ] = a[ 2 ];
        this[ 3 ] = a[ 3 ];
        return this
    }

    copyTo( a: TVec4 ): this{
        a[ 0 ] = this[ 0 ];
        a[ 1 ] = this[ 1 ];
        a[ 2 ] = this[ 2 ];
        a[ 3 ] = this[ 3 ];
        return this;
    }

    clone(): Quat{ return new Quat( this ); }

    /** Convert value to a string value */
    toString( rnd = 0 ) : string{
        if( rnd == 0 ) return "[" + this.join(",") + "]";
        else{
            let s = "[";
            for( let i=0; i < 4; i++ ){
                switch( this[i] ){
                    case 0	: s += "0,"; break;
                    case 1	: s += "1,"; break;
                    default	: s += this[ i ].toFixed( rnd ) + ","; break;
                }
            }
            return s.slice(0,-1) + "]";
        }
    }

    isZero(): boolean { return ( this[0] == 0 && this[1] == 0 && this[2] == 0 && this[3] == 0 ); }
    lenSqr(): number{ return this[0]**2 + this[1]**2 + this[2]**2 + this[3]**2; }
    len(): number { return Math.sqrt( this[0]**2 + this[1]**2 + this[2]**2 + this[3]**2 ); }

    getAxisAngle(): Array<number>{
        if( this[3] > 1 ) this.norm(); // TODO Fix it so its not distructive

        const angle = 2 * Math.acos(this[3]),
              s     = Math.sqrt(1 - this[3] * this[3]);

        if( s < 0.001 )  return [ 1, 0, 0, 0 ];

        return [ this[ 0 ] / s, this[ 1 ] / s, this[ 2 ] / s, angle ];
    }

    getAngle(): number{ 
        if( this[ 3 ] > 1 ) this.norm(); // TODO Fix it so its not distructive
        return 2 * Math.acos( this[3] );
    }

	getAxis( out ?: TVec3 ): TVec3{
        if( this[3] > 1 ) this.norm(); // TODO Fix it so its not distructive
        
        const s = Math.sqrt( 1 - this[ 3 ]**2 );

        out = out || [ 0, 0, 0 ];
        if( s < 0.001 ){
            out[ 0 ] = 1;
            out[ 1 ] = 0;
            out[ 2 ] = 0;
        }else{
            out[ 0 ] = this[ 0 ] / s;
            out[ 1 ] = this[ 1 ] / s;
            out[ 2 ] = this[ 2 ] / s;
        }

        return out;
    }

    fromPolar( lon: number, lat: number, up ?: TVec3 ) : Quat{
        lat = Math.max( Math.min( lat, 89.999999 ), -89.999999 ); // Clamp lat, going to 90+ makes things spring around.

        const phi   = ( 90 - lat ) * 0.01745329251, // PI / 180
              theta = lon * 0.01745329251,
              phi_s	= Math.sin( phi ),
              v    = [
                -( phi_s * Math.sin( theta ) ),
                Math.cos( phi ),
                phi_s * Math.cos( theta )
            ];

        this.fromLook( v, up || Vec3.UP );
        return this;
    }

    toPolar() : Array<number>{
        const fwd     = new Vec3().fromQuat( this, Vec3.FORWARD );  // Forward Direction
        const flat    = new Vec3( fwd[0], 0, fwd[2] ).norm();       // Flatten Direction
        let lon       = Vec3.angle( Vec3.FORWARD, flat );           // Lon Angle in Rads
        let lat       = Vec3.angle( flat, fwd );                    // Lat Angle in Rads
        
        const d_side = Vec3.dot( fwd, Vec3.RIGHT );                 // Right Hemi Test
        const d_up   = Vec3.dot( fwd, Vec3.UP );                    // Top Hemi Test

        // Negitive Check
        if( d_side < 0 )	lon = -lon;
        if( d_up < 0 )		lat = -lat;

        // If Point UP / Down, Can get Lon easily
        // TODO, to fix this issue may need to sample 
        // RIGHT Direction to compute LON.
        if( d_up > 0.999 || d_up <= -0.999 ) lon = 0;
        
        const to_deg = 180 / Math.PI;
        return [ lon * to_deg, lat * to_deg ];
    }

    /** Used to get data from a flat buffer */
    fromBuf( ary: Array<number> | Float32Array, idx: number ): this{
        this[ 0 ] = ary[ idx ];
        this[ 1 ] = ary[ idx + 1 ];
        this[ 2 ] = ary[ idx + 2 ];
        this[ 3 ] = ary[ idx + 3 ];
        return this;
    }

    /** Put data into a flat buffer */
    toBuf( ary : Array<number> | Float32Array, idx: number ): this{ 
        ary[ idx ]     = this[ 0 ];
        ary[ idx + 1 ] = this[ 1 ];
        ary[ idx + 2 ] = this[ 2 ];
        ary[ idx + 3 ] = this[ 3 ];
        return this;
    }

    pushTo( ary: Array<number> ) : Quat {
        ary.push( this[ 0 ], this[ 1 ], this[ 2 ], this[ 3 ] );
        return this;
    }

    // #endregion

    // #region FROM OPERATORS
    fromMul( a: ConstVec4, b: ConstVec4 ) : Quat{
        const ax = a[0], ay = a[1], az = a[2], aw = a[3],
              bx = b[0], by = b[1], bz = b[2], bw = b[3];

        this[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        this[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        this[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        this[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }
    
    /** Axis must be normlized, Angle in Radians  */
    fromAxisAngle( axis: ConstVec3, rad: number ): this{ 
        const half = rad * 0.5;
        const s    = Math.sin( half );
        this[ 0 ]  = axis[ 0 ] * s;
        this[ 1 ]  = axis[ 1 ] * s;
        this[ 2 ]  = axis[ 2 ] * s;
        this[ 3 ]  = Math.cos( half );
        return this;
    }

    /** Using unit vectors, Shortest swing rotation from Direction A to Direction B  */
    fromSwing( a: ConstVec3, b: ConstVec3 ): this {
        // http://physicsforgames.blogspot.com/2010/03/Quat-tricks.html
        const dot = Vec3.dot( a, b );

        if( dot < -0.999999 ){ // 180 opposites
            const tmp = new Vec3().fromCross( Vec3.LEFT, a );

            if( tmp.len < 0.000001 ) tmp.fromCross( Vec3.UP, a );
            this.fromAxisAngle( tmp.norm(), Math.PI );

        }else if( dot > 0.999999 ){ // Same Direction
            this[ 0 ] = 0;
            this[ 1 ] = 0;
            this[ 2 ] = 0;
            this[ 3 ] = 1;

        }else{
            const v   = Vec3.cross( a, b, [0,0,0] );
            this[ 0 ] = v[ 0 ];
            this[ 1 ] = v[ 1 ];
            this[ 2 ] = v[ 2 ];
            this[ 3 ] = 1 + dot;
            this.norm();
        }

        return this;
    }

    fromInvert( q: ConstVec4 ): this{
        const a0  = q[0],
              a1  = q[1],
              a2  = q[2],
              a3  = q[3],
              dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;
        
        if( dot == 0 ){ this[0] = this[1] = this[2] = this[3] = 0; return this; }

        const invDot = 1.0 / dot; // let invDot = dot ? 1.0/dot : 0;
        this[ 0 ]    = -a0 * invDot;
        this[ 1 ]    = -a1 * invDot;
        this[ 2 ]    = -a2 * invDot;
        this[ 3 ]    =  a3 * invDot;
        return this;
    }

    fromNegate( q: ConstVec4 ): this{
        this[ 0 ] = -q[ 0 ];
        this[ 1 ] = -q[ 1 ];
        this[ 2 ] = -q[ 2 ];
        this[ 3 ] = -q[ 3 ];
        return this;
    }

    fromLook( dir: ConstVec3, up: ConstVec3 = [0,1,0] ): this{
        // Ported to JS from C# example at https://pastebin.com/ubATCxJY
        // TODO, if Dir and Up are equal, a roll happends. Need to find a way to fix this.
        const zAxis	= new Vec3( dir ).norm();                       // Forward
        const xAxis = new Vec3().fromCross( up, zAxis ).norm();     // Right
        const yAxis = new Vec3().fromCross( zAxis, xAxis ).norm();  // Up

        //fromAxis - Mat3 to Quat
        const m00 = xAxis[0], m01 = xAxis[1], m02 = xAxis[2],
              m10 = yAxis[0], m11 = yAxis[1], m12 = yAxis[2],
              m20 = zAxis[0], m21 = zAxis[1], m22 = zAxis[2],
              t   = m00 + m11 + m22;

        let x: number, 
            y: number, 
            z: number, 
            w: number, 
            s: number;

        if(t > 0.0){
            s = Math.sqrt(t + 1.0);
            w = s * 0.5 ; // |w| >= 0.5
            s = 0.5 / s;
            x = (m12 - m21) * s;
            y = (m20 - m02) * s;
            z = (m01 - m10) * s;
        }else if((m00 >= m11) && (m00 >= m22)){
            s = Math.sqrt(1.0 + m00 - m11 - m22);
            x = 0.5 * s;// |x| >= 0.5
            s = 0.5 / s;
            y = (m01 + m10) * s;
            z = (m02 + m20) * s;
            w = (m12 - m21) * s;
        }else if(m11 > m22){
            s = Math.sqrt(1.0 + m11 - m00 - m22);
            y = 0.5 * s; // |y| >= 0.5
            s = 0.5 / s;
            x = (m10 + m01) * s;
            z = (m21 + m12) * s;
            w = (m20 - m02) * s;
        }else{
            s = Math.sqrt(1.0 + m22 - m00 - m11);
            z = 0.5 * s; // |z| >= 0.5
            s = 0.5 / s;
            x = (m20 + m02) * s;
            y = (m21 + m12) * s;
            w = (m01 - m10) * s;
        }

        this[ 0 ] = x;
        this[ 1 ] = y;
        this[ 2 ] = z;
        this[ 3 ] = w;
        return this;
    }

    fromNBlend( a: ConstVec4, b: ConstVec4, t: number ): this{
        // https://physicsforgames.blogspot.com/2010/02/quaternions.html
        const a_x = a[ 0 ];	// Quaternion From
        const a_y = a[ 1 ];
        const a_z = a[ 2 ];
        const a_w = a[ 3 ];
        const b_x = b[ 0 ];	// Quaternion To
        const b_y = b[ 1 ];
        const b_z = b[ 2 ];
        const b_w = b[ 3 ];
        const dot = a_x*b_x + a_y*b_y + a_z*b_z + a_w*b_w;
        const ti  = 1 - t;

        // if Rotations with a dot less then 0 causes artifacts when lerping,
        // Can fix this by switching the sign of the To Quaternion.
        const s   = ( dot < 0 )? -1 : 1;
        this[ 0 ] = ti * a_x + t * b_x * s;
        this[ 1 ] = ti * a_y + t * b_y * s;
        this[ 2 ] = ti * a_z + t * b_z * s;
        this[ 3 ] = ti * a_w + t * b_w * s;
        return this.norm();
    }

    fromLerp( a: TVec4, b: TVec4, t: number ) : this{
        const ti = 1 - t;
        this[0]	 = a[0] * ti + b[0] * t;
        this[1]	 = a[1] * ti + b[1] * t;
        this[2]	 = a[2] * ti + b[2] * t;
        this[3]	 = a[3] * ti + b[3] * t;
        return this;
    }

    fromNLerp( a: TVec4, b: TVec4, t: number ) : this{
        const ti = 1 - t;
        this[0]	 = a[0] * ti + b[0] * t;
        this[1]	 = a[1] * ti + b[1] * t;
        this[2]	 = a[2] * ti + b[2] * t;
        this[3]	 = a[3] * ti + b[3] * t;
        return this.norm();
    }

    fromSlerp( a: TVec4, b: TVec4, t: number ) : this{
        // benchmarks: http://jsperf.com/Quat-slerp-implementations
        const ax = a[0], ay = a[1], az = a[2], aw = a[3];
        let   bx = b[0], by = b[1], bz = b[2], bw = b[3];
        let omega, cosom, sinom, scale0, scale1;

        // calc cosine
        cosom = ax * bx + ay * by + az * bz + aw * bw;

        // adjust signs (if necessary)
        if ( cosom < 0.0 ) {
            cosom = -cosom;
            bx = - bx;
            by = - by;
            bz = - bz;
            bw = - bw;
        }

        // calculate coefficients
        if ( (1.0 - cosom) > 0.000001 ) {
            // standard case (slerp)
            omega  = Math.acos(cosom);
            sinom  = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        }else{
            // "from" and "to" Quats are very close so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }

        // calculate final values
        this[ 0 ] = scale0 * ax + scale1 * bx;
        this[ 1 ] = scale0 * ay + scale1 * by;
        this[ 2 ] = scale0 * az + scale1 * bz;
        this[ 3 ] = scale0 * aw + scale1 * bw;

        return this;
    }

    fromAxes( xAxis: TVec3, yAxis: TVec3, zAxis: TVec3 ) : this{
        const m00 = xAxis[0], m01 = xAxis[1], m02 = xAxis[2],
              m10 = yAxis[0], m11 = yAxis[1], m12 = yAxis[2],
              m20 = zAxis[0], m21 = zAxis[1], m22 = zAxis[2],
              t = m00 + m11 + m22;
        let x, y, z, w, s;

        if(t > 0.0){
            s = Math.sqrt(t + 1.0);
            w = s * 0.5 ; // |w| >= 0.5
            s = 0.5 / s;
            x = (m12 - m21) * s;
            y = (m20 - m02) * s;
            z = (m01 - m10) * s;
        }else if((m00 >= m11) && (m00 >= m22)){
            s = Math.sqrt(1.0 + m00 - m11 - m22);
            x = 0.5 * s;// |x| >= 0.5
            s = 0.5 / s;
            y = (m01 + m10) * s;
            z = (m02 + m20) * s;
            w = (m12 - m21) * s;
        }else if(m11 > m22){
            s = Math.sqrt(1.0 + m11 - m00 - m22);
            y = 0.5 * s; // |y| >= 0.5
            s = 0.5 / s;
            x = (m10 + m01) * s;
            z = (m21 + m12) * s;
            w = (m20 - m02) * s;
        }else{
            s = Math.sqrt(1.0 + m22 - m00 - m11);
            z = 0.5 * s; // |z| >= 0.5
            s = 0.5 / s;
            x = (m20 + m02) * s;
            y = (m21 + m12) * s;
            w = (m01 - m10) * s;
        }

        this[ 0 ] = x;
        this[ 1 ] = y;
        this[ 2 ] = z;
        this[ 3 ] = w;
        return this;
    }

    fromMat3( m: Array<number> ): this{
        // https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/quat.js#L305
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quat Calculus and Fast Animation".
        let fRoot;
        const fTrace = m[0] + m[4] + m[8];

        if( fTrace > 0.0 ){
            // |w| > 1/2, may as well choose w > 1/2
            fRoot	= Math.sqrt( fTrace + 1.0 );  // 2w
            this[3]	= 0.5 * fRoot;
            
            fRoot	= 0.5 / fRoot;  // 1/(4w)
            this[0]	= (m[5]-m[7])*fRoot;
            this[1]	= (m[6]-m[2])*fRoot;
            this[2]	= (m[1]-m[3])*fRoot;
        }else{
            // |w| <= 1/2
            let i = 0;

            if ( m[4] > m[0] )		i = 1;
            if ( m[8] > m[i*3+i] )	i = 2;
            
            const j = (i+1) % 3;
            const k = (i+2) % 3;

            fRoot	= Math.sqrt( m[i*3+i] - m[j*3+j] - m[k*3+k] + 1.0);
            this[ i ]	= 0.5 * fRoot;

            fRoot	= 0.5 / fRoot;
            this[ 3 ]	= ( m[j*3+k] - m[k*3+j] ) * fRoot;
            this[ j ]	= ( m[j*3+i] + m[i*3+j] ) * fRoot;
            this[ k ]	= ( m[k*3+i] + m[i*3+k] ) * fRoot;
        }
        return this;
    }

    fromMat4( mat: Array<number> ): this{
        // https://github.com/toji/gl-matrix/blob/master/src/mat4.js
        // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuat/index.htm
        const trace = mat[0] + mat[5] + mat[10];
        let S = 0;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            this[3] = 0.25 * S;
            this[0] = (mat[6] - mat[9]) / S;
            this[1] = (mat[8] - mat[2]) / S;
            this[2] = (mat[1] - mat[4]) / S;
        } else if ((mat[0] > mat[5]) && (mat[0] > mat[10])) {
            S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
            this[3] = (mat[6] - mat[9]) / S;
            this[0] = 0.25 * S;
            this[1] = (mat[1] + mat[4]) / S;
            this[2] = (mat[8] + mat[2]) / S;
        } else if (mat[5] > mat[10]) {
            S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
            this[3] = (mat[8] - mat[2]) / S;
            this[0] = (mat[1] + mat[4]) / S;
            this[1] = 0.25 * S;
            this[2] = (mat[6] + mat[9]) / S;
        } else {
            S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
            this[3] = (mat[1] - mat[4]) / S;
            this[0] = (mat[8] + mat[2]) / S;
            this[1] = (mat[6] + mat[9]) / S;
            this[2] = 0.25 * S;
        }

        return this;
    }

    fromAngularVec( v: TVec3 ) : Quat{
        let len = Vec3.len( v );
        if( len < 0.000001 ){ this.identity(); return this; }

        const h = 0.5 * len;
        const s = Math.sin( h );
        const c = Math.cos( h );
        len = 1 / len;

        this[ 0 ] = s * ( v[ 0 ] * len );
        this[ 1 ] = s * ( v[ 1 ] * len );
        this[ 2 ] = s * ( v[ 2 ] * len );
        this[ 3 ] = c;
        return this;
    }
    
    toAngularVec( out ?: Vec3 ): Vec3{
        const v = this.getAxisAngle();
        out     = out || new Vec3();
        return out.fromScale( v, v[ 3 ] ); // axis * angle;
    }

    // /** Create a rotation from eye & target position */
    // lookAt(
    //   out: TVec4,
    //   eye: TVec3, // Position of camera or object
    //   target: TVec3 = [0, 0, 0], // Position to look at
    //   up: TVec3 = [0, 1, 0], // Up direction for orientation
    // ): TVec4 {
    //   // Forward is inverted, will face correct direction when converted
    //   // to a ViewMatrix as it'll invert the Forward direction anyway
    //   const z: TVec3 = vec3.sub([0, 0, 0], eye, target);
    //   const x: TVec3 = vec3.cross([0, 0, 0], up, z);
    //   const y: TVec3 = vec3.cross([0, 0, 0], z, x);
    
    //   vec3.normalize(x, x);
    //   vec3.normalize(y, y);
    //   vec3.normalize(z, z);
    
    //   // Format: column-major, when typed out it looks like row-major
    //   quat.fromMat3(out, [...x, ...y, ...z]);
    //   return quat.normalize(out, out);
    // }
    // #endregion

    // #region EULER
/*
    getEuler( out ?: TVec3, inDeg=false ) : TVec3{ //order="YZX"
        // http://bediyap.com/programming/convert-Quat-to-euler-rotations/
        // http://schteppe.github.io/cannon.js/docs/files/src_math_Quat.js.html

        let pitch=0, yaw=0, roll=0;
        const x     = this[0],
              y		= this[1],
              z     = this[2],
              w		= this[3],
              test  = x*y + z*w;
        
        //..............................
        // singularity at north pole
        if( test > 0.499 ){ //console.log("North");
            pitch	= 2 * Math.atan2(x,w);
            yaw		= Math.PI / 2;
            roll	= 0;
        }

        //..............................
        // singularity at south pole
        if( test < -0.499 ){ //console.log("South");
            pitch	= -2 * Math.atan2(x,w);
            yaw		= - Math.PI / 2;
            roll	= 0;
        }

        //..............................
        if( isNaN( pitch ) ){ // console.log("isNan");
            const sqz	= z*z;
            roll        = Math.atan2( 2*x*w - 2*y*z , 1 - 2*x*x - 2*sqz );  // bank
            pitch       = Math.atan2( 2*y*w - 2*x*z , 1 - 2*y*y - 2*sqz );  // Heading
            yaw         = Math.asin(  2*test );                             // attitude
        }

        //..............................
        const deg = ( inDeg )? 180 / Math.PI : 1;
        out         = out || [0,0,0];
        out[ 0 ]	= roll	* deg;
        out[ 1 ]	= pitch	* deg;
        out[ 2 ]	= yaw	* deg;
        return out;
    }

    fromEulerYXZ(
        out: Array<number>,
        xDeg: number,
        yDeg: number,
        zDeg: number,
    ): Array<number> {
        const xx = xDeg * 0.01745329251 * 0.5;
        const yy = yDeg * 0.01745329251 * 0.5;
        const zz = zDeg * 0.01745329251 * 0.5;
        const c1 = Math.cos(xx);
        const c2 = Math.cos(yy);
        const c3 = Math.cos(zz);
        const s1 = Math.sin(xx);
        const s2 = Math.sin(yy);
        const s3 = Math.sin(zz);

        out[0] = s1 * c2 * c3 + c1 * s2 * s3;
        out[1] = c1 * s2 * c3 - s1 * c2 * s3;
        out[2] = c1 * c2 * s3 - s1 * s2 * c3;
        out[3] = c1 * c2 * c3 + s1 * s2 * s3;
        return quat.normalize(out, out);
    },
   
    toEulerYXZ(
        q: Array<number>,
        inDeg: boolean = true,
      ): [number, number, number] {
        const out = [0, 0, 0];
        
        // https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js#L696
        const [x, y, z, w] = q;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
    
        const m11 = 1 - (yy + zz);
        // const m12 = xy - wz;
        const m13 = xz + wy;
    
        const m21 = xy + wz;
        const m22 = 1 - (xx + zz);
        const m23 = yz - wx;
    
        const m31 = xz - wy;
        // const m32 = yz + wx;
        const m33 = 1 - (xx + yy);
        
        // https://github.com/mrdoob/three.js/blob/master/src/math/Euler.js#L134
        // Matrix4 to Euler YXZ
        out[0] = Math.asin(-Math.min(1, Math.max(-1, m23)));
        if (Math.abs(m23) < 0.9999999) {
          out[1] = Math.atan2(m13, m33);
          out[2] = Math.atan2(m21, m22);
        } else {
          out[1] = Math.atan2(-m31, m11);
          out[2] = 0;
        }
    
        if (inDeg) {
          out[0] *= 180 / Math.PI;
          out[1] *= 180 / Math.PI;
          out[2] *= 180 / Math.PI;
        }
        return out;
      }

    toEulerYXZ(
        q: Array<number>,
        inDeg: boolean = true,
    ): [number, number, number] {
        const out = [0, 0, 0];

        const [x, y, z, w] = q;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const m23 = y * z2 - w * x2;

        out[0] = Math.asin(-Math.min(1, Math.max(-1, m23)));
        if (Math.abs(m23) < 0.9999999) {
        out[1] = Math.atan2(x * z2 + w * y2, 1 - (x * x2 + y * y2));
        out[2] = Math.atan2(x * y2 + w * z2, 1 - (x * x2 + z * z2));
        } else {
        out[1] = Math.atan2(-(x * z2 - w * y2), 1 - (y * y2 + z * z2));
        out[2] = 0;
        }

        if (inDeg) {
        out[0] *= 180 / Math.PI;
        out[1] *= 180 / Math.PI;
        out[2] *= 180 / Math.PI;
        }
        return out;
    }

      */

    /** order="YXZ", Values in Degrees, will be converted to Radians by function*/
    fromEuler( x: TVec3 ) : Quat
    fromEuler( x: number, y: number, z: number ) : Quat
    fromEuler( x: number | TVec3, y ?: number, z ?: number ) : Quat{
        let xx=0, yy=0, zz=0;

        if( x instanceof Vec3 || x instanceof Float32Array || ( x instanceof Array && x.length == 3 )){
            xx = x[ 0 ] * 0.01745329251 * 0.5;
            yy = x[ 1 ] * 0.01745329251 * 0.5;
            zz = x[ 2 ] * 0.01745329251 * 0.5;
        }else if( typeof x === "number" && typeof y === "number" && typeof z === "number" ){
            xx = x * 0.01745329251 * 0.5;
            yy = y * 0.01745329251 * 0.5;
            zz = z * 0.01745329251 * 0.5;
        }

        const c1 = Math.cos( xx ),
              c2 = Math.cos( yy ),
              c3 = Math.cos( zz ),
              s1 = Math.sin( xx ),
              s2 = Math.sin( yy ),
              s3 = Math.sin( zz );
        this[ 0 ] = s1 * c2 * c3 + c1 * s2 * s3;
        this[ 1 ] = c1 * s2 * c3 - s1 * c2 * s3;
        this[ 2 ] = c1 * c2 * s3 - s1 * s2 * c3;
        this[ 3 ] = c1 * c2 * c3 + s1 * s2 * s3;
        return this.norm();
    }

    /**order="YXZ", Values in Degrees, will be converted to Radians by function */
    fromEulerXY( x: number, y: number ) : Quat{ 
        const xx = x * 0.01745329251 * 0.5,
              yy = y * 0.01745329251 * 0.5,
              c1 = Math.cos( xx ),
              c2 = Math.cos( yy ),
              s1 = Math.sin( xx ),
              s2 = Math.sin( yy );

        this[ 0 ] = s1 * c2 ;
        this[ 1 ] = c1 * s2 ;
        this[ 2 ] = -s1 * s2;
        this[ 3 ] = c1 * c2;
        return this.norm();
    }

    fromEulerOrder( x: number, y: number, z: number, order="YXZ" ) : Quat{
        // https://github.com/mrdoob/three.js/blob/dev/src/math/Quat.js

        const c1 = Math.cos(x*0.5), //Math.cos(x/2)
              c2 = Math.cos(y*0.5), //Math.cos(y/2),
              c3 = Math.cos(z*0.5), //Math.cos(z/2),
              s1 = Math.sin(x*0.5), //Math.sin(x/2),
              s2 = Math.sin(y*0.5), //Math.sin(y/2)
              s3 = Math.sin(z*0.5); //Math.sin(z/2)

        switch(order){
            case 'XYZ':			
                this[0] = s1 * c2 * c3 + c1 * s2 * s3;
                this[1] = c1 * s2 * c3 - s1 * c2 * s3;
                this[2] = c1 * c2 * s3 + s1 * s2 * c3;
                this[3] = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'YXZ':
                this[0] = s1 * c2 * c3 + c1 * s2 * s3;
                this[1] = c1 * s2 * c3 - s1 * c2 * s3;
                this[2] = c1 * c2 * s3 - s1 * s2 * c3;
                this[3] = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            case 'ZXY':
                this[0] = s1 * c2 * c3 - c1 * s2 * s3;
                this[1] = c1 * s2 * c3 + s1 * c2 * s3;
                this[2] = c1 * c2 * s3 + s1 * s2 * c3;
                this[3] = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'ZYX':
                this[0] = s1 * c2 * c3 - c1 * s2 * s3;
                this[1] = c1 * s2 * c3 + s1 * c2 * s3;
                this[2] = c1 * c2 * s3 - s1 * s2 * c3;
                this[3] = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            case 'YZX':
                this[0] = s1 * c2 * c3 + c1 * s2 * s3;
                this[1] = c1 * s2 * c3 + s1 * c2 * s3;
                this[2] = c1 * c2 * s3 - s1 * s2 * c3;
                this[3] = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'XZY':
                this[0] = s1 * c2 * c3 - c1 * s2 * s3;
                this[1] = c1 * s2 * c3 - s1 * c2 * s3;
                this[2] = c1 * c2 * s3 + s1 * s2 * c3;
                this[3] = c1 * c2 * c3 + s1 * s2 * s3;
                break;
        }

        return this.norm();
    }

    // #endregion

    // #region OPERATORS
    /** Multiple Quaternion onto this Quaternion */
    mul( q: ConstVec4 ): Quat{ 
        const ax = this[0], ay = this[1], az = this[2], aw = this[3],
              bx = q[0],    by = q[1],    bz = q[2],    bw = q[3];
        this[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        this[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        this[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        this[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }

    /** PreMultiple Quaternions onto this Quaternion */
    pmul( q: ConstVec4 ): Quat{
        const ax = q[0],    ay  = q[1],     az = q[2],    aw = q[3],
              bx = this[0], by  = this[1],  bz = this[2], bw = this[3];
        this[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        this[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        this[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        this[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }

    norm(): this{
        let len =  this[0]**2 + this[1]**2 + this[2]**2 + this[3]**2;
        if( len > 0 ){
            len = 1 / Math.sqrt( len );
            this[ 0 ] *= len;
            this[ 1 ] *= len;
            this[ 2 ] *= len;
            this[ 3 ] *= len;
        }
        return this;
    }

    invert(): Quat{
        const a0  = this[ 0 ],
              a1  = this[ 1 ],
              a2  = this[ 2 ],
              a3  = this[ 3 ],
              dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;
        
        if(dot == 0){ this[0] = this[1] = this[2] = this[3] = 0; return this }

        const invDot = 1.0 / dot; // let invDot = dot ? 1.0/dot : 0;
        this[ 0 ]    = -a0 * invDot;
        this[ 1 ]    = -a1 * invDot;
        this[ 2 ]    = -a2 * invDot;
        this[ 3 ]    =  a3 * invDot;
        return this;
    }

    negate(): Quat{
        this[ 0 ] = -this[ 0 ];
        this[ 1 ] = -this[ 1 ];
        this[ 2 ] = -this[ 2 ];
        this[ 3 ] = -this[ 3 ];
        return this;
    }

    conjugate() : Quat{
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        return this;
    }

    scaleAngle( scl: number ) : Quat{
        if( this[ 3 ] > 1 ) this.norm();

        const angle = 2 * Math.acos( this[3] ),
              len   = 1 / Math.sqrt( this[0]**2 + this[1]**2 + this[2]**2 ), // Get Length to normalize axis
              half  = (angle * scl) * 0.5,                                   // Calc Angle, Scale it then Half it.
              s     = Math.sin( half );                                      // Do Normalize and SinHalf at the same time

        this[ 0 ] = ( this[ 0 ] * len ) * s;
        this[ 1 ] = ( this[ 1 ] * len ) * s;
        this[ 2 ] = ( this[ 2 ] * len ) * s;
        this[ 3 ] = Math.cos( half );
        return this;
    }

    transformVec3( v: TVec3 ) : TVec3{
        const qx = this[0], qy = this[1], qz = this[2], qw = this[3],
            vx = v[0], vy = v[1], vz = v[2],
            x1 = qy * vz - qz * vy,
            y1 = qz * vx - qx * vz,
            z1 = qx * vy - qy * vx,
            x2 = qw * x1 + qy * z1 - qz * y1,
            y2 = qw * y1 + qz * x1 - qx * z1,
            z2 = qw * z1 + qx * y1 - qy * x1;

        v[ 0 ] = vx + 2 * x2;
        v[ 1 ] = vy + 2 * y2;
        v[ 2 ] = vz + 2 * z2;
        return this;
    }
    // #endregion

    // #region ROTATIONS
    rotX( rad: number ) : Quat{
        //https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/quat.js
        rad *= 0.5; 

        const ax = this[0], ay = this[1], az = this[2], aw = this[3],
              bx = Math.sin(rad), bw = Math.cos(rad);

        this[0] = ax * bw + aw * bx;
        this[1] = ay * bw + az * bx;
        this[2] = az * bw - ay * bx;
        this[3] = aw * bw - ax * bx;
        return this;
    }

    rotY( rad: number ) : Quat{
        rad *= 0.5; 

        const ax = this[0], ay = this[1], az = this[2], aw = this[3],
              by = Math.sin(rad), bw = Math.cos(rad);

        this[0] = ax * bw - az * by;
        this[1] = ay * bw + aw * by;
        this[2] = az * bw + ax * by;
        this[3] = aw * bw - ay * by;
        return this;
    }

    rotZ( rad: number ) : Quat{
        rad *= 0.5; 

        const ax = this[0], ay = this[1], az = this[2], aw = this[3],
              bz = Math.sin(rad),
              bw = Math.cos(rad);

        this[0] = ax * bw + ay * bz;
        this[1] = ay * bw - ax * bz;
        this[2] = az * bw + aw * bz;
        this[3] = aw * bw - az * bz;
        return this;
    }

    rotDeg( deg: number, axis=0 ) : Quat{
        const rad = deg * Math.PI / 180;
        switch( axis ){
            case 0 : this.rotX( rad ); break;
            case 1 : this.rotY( rad ); break;
            case 2 : this.rotZ( rad ); break;
        }
        return this;
    }
    // #endregion

    // #region SPECIAL OPERATORS
    /** Inverts the quaternion passed in, then pre multiplies to this quaternion. */
    pmulInvert( q: ConstVec4 ): this{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // q.invert()
        let ax = q[ 0 ],	
            ay = q[ 1 ],
            az = q[ 2 ],
            aw = q[ 3 ];

        const dot = ax*ax + ay*ay + az*az + aw*aw;

        if( dot === 0 ){
            ax = ay = az = aw = 0;
        }else{
            const dot_inv = 1.0 / dot;
            ax = -ax * dot_inv;
            ay = -ay * dot_inv;
            az = -az * dot_inv;
            aw =  aw * dot_inv;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Quat.mul( a, b );
        const bx = this[ 0 ],	
              by = this[ 1 ],
              bz = this[ 2 ],
              bw = this[ 3 ];
        this[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        this[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        this[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        this[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }

    pmulAxisAngle( axis: ConstVec3, rad: number ): this{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Quat.AxisAngle()
        const half = rad * 0.5;
        const s    = Math.sin( half );
        const ax   = axis[ 0 ] * s;
        const ay   = axis[ 1 ] * s;
        const az   = axis[ 2 ] * s;
        const aw   = Math.cos( half );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Quat.mul( a, b );
        const bx = this[ 0 ],	
              by = this[ 1 ],
              bz = this[ 2 ],
              bw = this[ 3 ];
        this[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        this[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        this[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        this[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }

    mulAxisAngle( axis: TVec3, angle: number ) : Quat{
        const half = angle * .5,
              s    = Math.sin( half ),
              bx   = axis[0] * s,	// B Quat based on Axis Angle
              by   = axis[1] * s, 
              bz   = axis[2] * s,
              bw   = Math.cos( half ),
              ax   = this[0],		// A of mul
              ay   = this[1],
              az   = this[2],
              aw   = this[3];

        // Quat.mul( a, b );
        this[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        this[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        this[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        this[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }

    dotNegate( q: ConstVec4, chk: ConstVec4 ): this{
        if( Quat.dot( q, chk ) < 0 ) this.fromNegate( q );
        else                         this.copy( q );
        
        return this;
    }

    mirrorX() : Quat{
        this[ 1 ] = -this[ 1 ];
        this[ 2 ] = -this[ 2 ];
        return this;
    }

    random() : Quat{
        // http://planning.cs.uiuc.edu/node198.html  uniform random quaternion
        const u1 = Math.random(),
              u2 = Math.random(),
              u3 = Math.random(),
              r1 = Math.sqrt( 1-u1 ),
              r2 = Math.sqrt( u1 );

        this[ 0 ] = r1 * Math.sin( 6.283185307179586 * u2 );
        this[ 1 ] = r1 * Math.cos( 6.283185307179586 * u2 );
        this[ 2 ] = r2 * Math.sin( 6.283185307179586 * u3 );
        this[ 3 ] = r2 * Math.cos( 6.283185307179586 * u3 );
        return this;
    }

    /** Apply Unit Vector Rotation to Quaternion */
    mulUnitVecs( a: TVec3, b: TVec3 ) : Quat{
        // fromUnitVecs
        const dot = Vec3.dot( a, b );
        const ax  = this[0],		// A of mul
            ay  = this[1],
            az  = this[2],
            aw  = this[3];
        let bx, by, bz, bw;

        if( dot < -0.999999 ){
            const axis = Vec3.cross( Vec3.LEFT, a );
            if( Vec3.len( axis ) < 0.000001 ) Vec3.cross( Vec3.UP, a, axis );
            Vec3.norm( axis );

            // fromAxisAngle
            const half  = Math.PI * .5,
                s     = Math.sin( half );
            bx          = axis[0] * s;
            by          = axis[1] * s;
            bz          = axis[2] * s;
            bw          = Math.cos( half );
        }else if(dot > 0.999999){
            bx          = 0;
            by          = 0;
            bz          = 0;
            bw          = 1;
        }else{
            const v     = Vec3.cross(a, b);
            bx          = v[0];
            by          = v[1];
            bz          = v[2];
            bw          = 1 + dot;

            // Norm
            let len     = bx**2 + by**2 + bz**2 + bw**2;
            if( len > 0 ){
                len = 1 / Math.sqrt( len );
                bx *= len;
                by *= len;
                bz *= len;
                bw *= len;
            }
        }

        // Quat.mul( a, b );
        this[0]	= ax * bw + aw * bx + ay * bz - az * by;
        this[1]	= ay * bw + aw * by + az * bx - ax * bz;
        this[2]	= az * bw + aw * bz + ax * by - ay * bx;
        this[3]	= aw * bw - ax * bx - ay * by - az * bz;
        return this;
    }
    // #endregion

    // #region STATIC
    static dot( a: ConstVec4, b: ConstVec4 ) : number{ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]; }
    static lenSqr( a: ConstVec4, b: ConstVec4 ) : number{ return (a[0]-b[0]) ** 2 + (a[1]-b[1]) ** 2 + (a[2]-b[2]) ** 2 + (a[3]-b[3]) ** 2; }

    static nblend( a: ConstVec4, b: ConstVec4, t: number, out: Quat ): Quat{
        // https://physicsforgames.blogspot.com/2010/02/quaternions.html
        const a_x = a[ 0 ];	// Quaternion From
        const a_y = a[ 1 ];
        const a_z = a[ 2 ];
        const a_w = a[ 3 ];
        const b_x = b[ 0 ];	// Quaternion To
        const b_y = b[ 1 ];
        const b_z = b[ 2 ];
        const b_w = b[ 3 ];
        const dot = a_x*b_x + a_y*b_y + a_z*b_z + a_w*b_w;
        const ti  = 1 - t;

        // if Rotations with a dot less then 0 causes artifacts when lerping,
        // Can fix this by switching the sign of the To Quaternion.
        const s  = ( dot < 0 )? -1 : 1;
        out[ 0 ] = ti * a_x + t * b_x * s;
        out[ 1 ] = ti * a_y + t * b_y * s;
        out[ 2 ] = ti * a_z + t * b_z * s;
        out[ 3 ] = ti * a_w + t * b_w * s;
        return out.norm();
    }

    static slerp( a: ConstVec4, b: ConstVec4, t: number, out: Quat ): Quat{
        // benchmarks: http://jsperf.com/Quat-slerp-implementations
        const ax = a[0], ay = a[1], az = a[2], aw = a[3];
        let   bx = b[0], by = b[1], bz = b[2], bw = b[3];
        let omega, cosom, sinom, scale0, scale1;

        // calc cosine
        cosom = ax * bx + ay * by + az * bz + aw * bw;

        // adjust signs (if necessary)
        if ( cosom < 0.0 ) {
            cosom = -cosom;
            bx = - bx;
            by = - by;
            bz = - bz;
            bw = - bw;
        }

        // calculate coefficients
        if ( (1.0 - cosom) > 0.000001 ) {
            // standard case (slerp)
            omega  = Math.acos(cosom);
            sinom  = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        }else{
            // "from" and "to" Quats are very close so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }

        // calculate final values
        out[ 0 ] = scale0 * ax + scale1 * bx;
        out[ 1 ] = scale0 * ay + scale1 * by;
        out[ 2 ] = scale0 * az + scale1 * bz;
        out[ 3 ] = scale0 * aw + scale1 * bw;

        return out;
    }

    static shortest( from: ConstVec4, to: ConstVec4, out:TVec4 ): TVec4{
        // if( Quaternion.Dot(a, b) < 0 ){
        //     return a * Quaternion.Inverse( Multiply(b, -1) );
        // }   else return a * Quaternion.Inverse(b);

        const ax  = from[0], ay = from[1], az = from[2], aw = from[3];
        let   bx  = to[0],   by = to[1],   bz = to[2],   bw = to[3];

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const dot = ax * bx + ay * by + az * bz + aw * bw;
        if( dot < 0 ){
            // quat.negate
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // quat.invert
        const d = bx*bx + by*by + bz*bz + bw*bw;
        if( d === 0 ){
            bx = 0;
            by = 0;
            bz = 0;
            bw = 0;
        }else{
            const di = 1.0 / d;
            bx    = -bx * di;
            by    = -by * di;
            bz    = -bz * di;
            bw    =  bw * di;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // quat.mul
        out[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        out[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        out[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        out[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    static swing( a: ConstVec3, b: ConstVec3 ): Quat{
        return new Quat().fromSwing( a, b ); 
    }

    static axisAngle(  axis: ConstVec3, rad: number ): Quat{
        return new Quat().fromAxisAngle( axis, rad ); 
    }

    // // https://pastebin.com/66qSCKcZ
    // // https://forum.unity.com/threads/manually-calculate-angular-velocity-of-gameobject.289462/#post-4302796
    // static angularVelocity( foreLastFrameRotation: ConstVec4, lastFrameRotation: ConstVec4): TVec3{
    //     var q = lastFrameRotation * Quaternion.Inverse(foreLastFrameRotation);
        
    //     // no rotation?
    //     // You may want to increase this closer to 1 if you want to handle very small rotations.
    //     // Beware, if it is too close to one your answer will be Nan
    //     if ( Mathf.Abs(q.w) > 1023.5f / 1024.0f ) return [0,0,0]; Vector3.zero;
        
    //     float gain;
    //     // handle negatives, we could just flip it but this is faster
    //     if( q.w < 0.0f ){
    //         var angle = Mathf.Acos(-q.w);
    //         gain = -2.0f * angle / (Mathf.Sin(angle) * Time.deltaTime);
    //     }else{
    //         var angle = Mathf.Acos(q.w);
    //         gain = 2.0f * angle / (Mathf.Sin(angle) * Time.deltaTime);
    //     }

    //     Vector3 angularVelocity = new Vector3(q.x * gain, q.y * gain, q.z * gain);

    //     if(float.IsNaN(angularVelocity.z)) angularVelocity = Vector3.zero;

    //     return angularVelocity;
    // }
    // #endregion

}


// https://gist.github.com/maxattack/4c7b4de00f5c1b95a33b
/*
public static Quaternion IntegrateRotation(Quaternion Rotation, Vector3 AngularVelocity, float DeltaTime) {
    if (DeltaTime < Mathf.Epsilon) return Rotation;
    var Deriv = AngVelToDeriv(Rotation, AngularVelocity);
    var Pred = new Vector4(
            Rotation.x + Deriv.x * DeltaTime,
            Rotation.y + Deriv.y * DeltaTime,
            Rotation.z + Deriv.z * DeltaTime,
            Rotation.w + Deriv.w * DeltaTime
    ).normalized;
    return new Quaternion(Pred.x, Pred.y, Pred.z, Pred.w);
}

public static Quaternion AngVelToDeriv(Quaternion Current, Vector3 AngVel) {
    var Spin = new Quaternion(AngVel.x, AngVel.y, AngVel.z, 0f);
    var Result = Spin * Current;
    return new Quaternion(0.5f * Result.x, 0.5f * Result.y, 0.5f * Result.z, 0.5f * Result.w);
} 

public static Vector3 DerivToAngVel(Quaternion Current, Quaternion Deriv) {
    var Result = Deriv * Quaternion.Inverse(Current);
    return new Vector3(2f * Result.x, 2f * Result.y, 2f * Result.z);
}

public const float SQRT2 = 1.41421356237f;

// https://github.com/FreyaHolmer/Mathfs/blob/700e27cd9454143f3024fccacf1d47a02f1540d0/Runtime/Extensions.cs#L225-L279
/// <summary>Returns the quaternion rotated around the given axis by 90°</summary>
		/// <param name="q">The quaternion to rotate</param>
		/// <param name="axis">The axis to rotate around</param>
		/// <param name="space">The rotation space of the axis, if it should be intrinsic/self/local or extrinsic/"world"</param>
		public static Quaternion Rotate90Around( this Quaternion q, Axis axis, RotationSpace space = RotationSpace.Self ) {
			const float v = Mathfs.SQRT2; // 2*cos(90°/2) = 2*sin(90°/2)
			float x = q.x;
			float y = q.y;
			float z = q.z;
			float w = q.w;

			return space switch {
				RotationSpace.Self => axis switch {
					Axis.X => new Quaternion( v * ( x + w ), v * ( y + z ), v * ( z - y ), v * ( w - x ) ),
					Axis.Y => new Quaternion( v * ( x - z ), v * ( y + w ), v * ( z + x ), v * ( w - y ) ),
					Axis.Z => new Quaternion( v * ( x + y ), v * ( y - x ), v * ( z + w ), v * ( w - z ) ),
					_      => throw new ArgumentOutOfRangeException( nameof(axis) )
				},
				RotationSpace.Extrinsic => axis switch {
					Axis.X => new Quaternion( v * ( x + w ), v * ( y - z ), v * ( z + y ), v * ( w - x ) ),
					Axis.Y => new Quaternion( v * ( x + z ), v * ( y + w ), v * ( z - x ), v * ( w - y ) ),
					Axis.Z => new Quaternion( v * ( x - y ), v * ( y + x ), v * ( z + w ), v * ( w - z ) ),
					_      => throw new ArgumentOutOfRangeException( nameof(axis) )
				},
				_ => throw new ArgumentOutOfRangeException( nameof(space) )
			};
		}

		/// <summary>Returns the quaternion rotated around the given axis by -90°</summary>
		/// <param name="q">The quaternion to rotate</param>
		/// <param name="axis">The axis to rotate around</param>
		/// <param name="space">The rotation space of the axis, if it should be intrinsic/self/local or extrinsic/"world"</param>
		public static Quaternion RotateNeg90Around( this Quaternion q, Axis axis, RotationSpace space = RotationSpace.Self ) {
			const float v = Mathfs.SQRT2; // 2*cos(90°/2) = 2*sin(90°/2)
			float x = q.x;
			float y = q.y;
			float z = q.z;
			float w = q.w;

			return space switch {
				RotationSpace.Self => axis switch {
					Axis.X => new Quaternion( v * ( x - w ), v * ( y - z ), v * ( z + y ), v * ( w + x ) ),
					Axis.Y => new Quaternion( v * ( x + z ), v * ( y - w ), v * ( z - x ), v * ( w + y ) ),
					Axis.Z => new Quaternion( v * ( x - y ), v * ( y + x ), v * ( z - w ), v * ( w + z ) ),
					_      => throw new ArgumentOutOfRangeException( nameof(axis) )
				},
				RotationSpace.Extrinsic => axis switch {
					Axis.X => new Quaternion( v * ( x - w ), v * ( y + z ), v * ( z - y ), v * ( w + x ) ),
					Axis.Y => new Quaternion( v * ( x - z ), v * ( y - w ), v * ( z + x ), v * ( w + y ) ),
					Axis.Z => new Quaternion( v * ( x + y ), v * ( y - x ), v * ( z - w ), v * ( w + z ) ),
					_      => throw new ArgumentOutOfRangeException( nameof(axis) )
				},
				_ => throw new ArgumentOutOfRangeException( nameof(space) )
			};
		}

*/

/*
IMPORTANT: It has a way to handle when UP and Look are the same.

https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js#L297
lookAt( eye, target, up ) {

    const te = this.elements;

    _z.subVectors( eye, target );

    if ( _z.lengthSq() === 0 ) {

        // eye and target are in the same position

        _z.z = 1;

    }

    _z.normalize();
    _x.crossVectors( up, _z );

    if ( _x.lengthSq() === 0 ) {

        // up and z are parallel

        if ( Math.abs( up.z ) === 1 ) {

            _z.x += 0.0001;

        } else {

            _z.z += 0.0001;

        }

        _z.normalize();
        _x.crossVectors( up, _z );

    }

    _x.normalize();
    _y.crossVectors( _z, _x );

    te[ 0 ] = _x.x; te[ 4 ] = _y.x; te[ 8 ] = _z.x;
    te[ 1 ] = _x.y; te[ 5 ] = _y.y; te[ 9 ] = _z.y;
    te[ 2 ] = _x.z; te[ 6 ] = _y.z; te[ 10 ] = _z.z;

    return this;

}
*/