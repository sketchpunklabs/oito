import type { TVec2, TVec3, TVec4, TVec4Struct } from '../global';
import vec3 from './vec3';

export default class quat{

    // #region SETTERS
    /** Reset back to identity*/
    static reset( a: TVec4 ) : TVec4 { 
        a[ 0 ] = 0; 
        a[ 1 ] = 0; 
        a[ 2 ] = 0; 
        a[ 3 ] = 1; 
        return a;
    }

    /** Copy in quaternion data */
    static copy( a: TVec4, out: TVec4 ) : TVec4 {
        out[ 0 ] = a[ 0 ]; 
        out[ 1 ] = a[ 1 ]; 
        out[ 2 ] = a[ 2 ];
        out[ 3 ] = a[ 3 ]; 
        return out;
    }

    /** Copy data from a struct vector type. ThreeJS compatilbility */
    static fromStruct( v: TVec4Struct, out: TVec4 = [0,0,0,0] ) : TVec4{
        out[ 0 ] = v.x; 
        out[ 1 ] = v.y; 
        out[ 2 ] = v.z;
        out[ 3 ] = v.w;
        return out;
    }

    /** Copy data to a struct vector type. ThreeJS compatilbility */
    static toStruct( a:TVec4, v: TVec4Struct ) : TVec4Struct {
        v.x = a[ 0 ];
        v.y = a[ 1 ];
        v.z = a[ 2 ];
        v.w = a[ 3 ];
        return v;
    }

    static fromPolar( lon: number, lat: number, up: TVec3, out: TVec4 = [0,0,0,1] ) : TVec4{
        lat = Math.max( Math.min( lat, 89.999999 ), -89.999999 ); // Clamp lat, going to 90+ makes things spring around.

        const phi   = ( 90 - lat ) * 0.01745329251, // PI / 180
              theta = lon * 0.01745329251,
              phi_s	= Math.sin( phi ),
              v    = [
                -( phi_s * Math.sin( theta ) ),
                Math.cos( phi ),
                phi_s * Math.cos( theta )
            ];

        this.look( v, up, out );
        return out;
    }

    static toPolar( a: TVec4, out: TVec2 = [0,0] ) : TVec2{
        //const fwd     = new Vec3().fromQuat( a, vec3.FORWARD ); // Forward Direction
        const fwd     = vec3.transformQuat( vec3.FORWARD, a );  // Forward Direction
        //const flat    = new Vec3( fwd.x, 0, fwd.z ).norm();     // Flatten Direction
        const flat    = vec3.norm( [ fwd[0], 0, fwd[2] ] );     // Flatten Direction
        
        let lon       = vec3.angle( vec3.FORWARD, flat );       // Lon Angle in Rads
        let lat       = vec3.angle( flat, fwd );                // Lat Angle in Rads
        
        const d_side = vec3.dot( fwd, vec3.RIGHT );             // Right Hemi Test
        const d_up   = vec3.dot( fwd, vec3.UP );                // Top Hemi Test

        // Negitive Check
        if( d_side < 0 )	lon = -lon;
        if( d_up < 0 )		lat = -lat;

        // If Point UP / Down, Can get Lon easily
        // TODO, to fix this issue may need to sample 
        // RIGHT Direction to compute LON.
        if( d_up > 0.999 || d_up <= -0.999 ) lon = 0;
        
        const to_deg = 180 / Math.PI;
        out[ 0 ] = lon * to_deg;
        out[ 1 ] = lat * to_deg;
        return out;
    }

    /** Rotation based on 3 Orthoginal Directions */
    static fromAxis( xAxis: TVec3, yAxis: TVec3, zAxis: TVec3, out ?: TVec4 ) : TVec4{
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

        out      = out || [0,0,0,0];
        out[ 0 ] = x;
        out[ 1 ] = y;
        out[ 2 ] = z;
        out[ 3 ] = w;
        return out;
    }

    /** Using unit vectors, Shortest rotation from Direction A to Direction B  */
    static unitVecs( a: TVec3, b: TVec3, out: TVec3 = [0,0,0,1] ) : TVec4 {
        // Using unit vectors, Shortest rotation from Direction A to Direction B
        // http://glmatrix.net/docs/quat.js.html#line548
        // http://physicsforgames.blogspot.com/2010/03/Quat-tricks.html

        const dot = vec3.dot( a, b );

        if( dot < -0.999999 ){ // 180 opposites
          const tmp = vec3.cross( vec3.LEFT, a );
          if( vec3.len( tmp ) < 0.000001 ) vec3.cross( vec3.UP, a, tmp );
          this.axisAngle( vec3.norm( tmp ), Math.PI, out );

        }else if( dot > 0.999999 ){ // Same Direction
            out[ 0 ] = 0;
            out[ 1 ] = 0;
            out[ 2 ] = 0;
            out[ 3 ] = 1;
        }else{
            const v = vec3.cross( a, b );
            out[ 0 ] = v[ 0 ];
            out[ 1 ] = v[ 1 ];
            out[ 2 ] = v[ 2 ];
            out[ 3 ] = 1 + dot;
            this.norm( out );
        }

        return out;
    }

    static fromMat3( m: Array<number>, out: TVec4 = [0,0,0,1] ) : TVec4{
        // https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/quat.js#L305
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quat Calculus and Fast Animation".
        let fRoot;
        const fTrace = m[0] + m[4] + m[8];

        if( fTrace > 0.0 ){
            // |w| > 1/2, may as well choose w > 1/2
            fRoot	= Math.sqrt( fTrace + 1.0 );  // 2w
            out[3]	= 0.5 * fRoot;
            
            fRoot	= 0.5 / fRoot;  // 1/(4w)
            out[0]	= (m[5]-m[7])*fRoot;
            out[1]	= (m[6]-m[2])*fRoot;
            out[2]	= (m[1]-m[3])*fRoot;
        }else{
            // |w| <= 1/2
            let i = 0;

            if ( m[4] > m[0] )		i = 1;
            if ( m[8] > m[i*3+i] )	i = 2;
            
            const j     = (i+1) % 3;
            const k     = (i+2) % 3;

            fRoot       = Math.sqrt( m[i*3+i] - m[j*3+j] - m[k*3+k] + 1.0);
            out[ i ]    = 0.5 * fRoot;

            fRoot       = 0.5 / fRoot;
            out[ 3 ]    = ( m[j*3+k] - m[k*3+j] ) * fRoot;
            out[ j ]    = ( m[j*3+i] + m[i*3+j] ) * fRoot;
            out[ k ]    = ( m[k*3+i] + m[i*3+k] ) * fRoot;
        }
        return out;
    }

    static fromMat4( m: Array<number>, out: TVec4 = [0,0,0,1]  ) : TVec4 {
        // https://github.com/toji/gl-matrix/blob/master/src/mat4.js
        // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuat/index.htm
        const trace = m[0] + m[5] + m[10];
        let S = 0;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out[3] = 0.25 * S;
            out[0] = (m[6] - m[9]) / S;
            out[1] = (m[8] - m[2]) / S;
            out[2] = (m[1] - m[4]) / S;
        } else if ((m[0] > m[5]) && (m[0] > m[10])) {
            S = Math.sqrt(1.0 + m[0] - m[5] - m[10]) * 2;
            out[3] = (m[6] - m[9]) / S;
            out[0] = 0.25 * S;
            out[1] = (m[1] + m[4]) / S;
            out[2] = (m[8] + m[2]) / S;
        } else if (m[5] > m[10]) {
            S = Math.sqrt(1.0 + m[5] - m[0] - m[10]) * 2;
            out[3] = (m[8] - m[2]) / S;
            out[0] = (m[1] + m[4]) / S;
            out[1] = 0.25 * S;
            out[2] = (m[6] + m[9]) / S;
        } else {
            S = Math.sqrt(1.0 + m[10] - m[0] - m[5]) * 2;
            out[3] = (m[1] - m[4]) / S;
            out[0] = (m[8] + m[2]) / S;
            out[1] = (m[6] + m[9]) / S;
            out[2] = 0.25 * S;
        }

        return out;
    }
    // #endregion


    // #region GETTERS

    /** Length / Magnitude squared of the vector. Good for quick simple testing */
    static lenSq( a :TVec4 ) : number{ return a[0]**2 + a[1]**2 + a[2]**2 + a[3]**2; }

    static len( a :TVec4 ) : number { return Math.sqrt( a[0]**2 + a[1]**2 + a[2]**2 + a[3]**2 ); }

    /** Convert value to a string value */
    static toString( a :TVec4, rnd = 0 ) : string{
        if( rnd == 0 ) return "[" + a.join(",") + "]";
        else{
            let s = "[";
            for( let i=0; i < 4; i++ ){
                switch( a[i] ){
                    case 0	: s += "0,"; break;
                    case 1	: s += "1,"; break;
                    default	: s += a[ i ].toFixed( rnd ) + ","; break;
                }
            }
            return s.slice(0,-1) + "]";
        }
    }

    static isZero( a :TVec4 ) : boolean { return ( a[0] == 0 && a[1] == 0 && a[2] == 0 && a[3] == 0 ); }
    
    static random( out: TVec4 = [0,0,0,1] ) : TVec4{
        // http://planning.cs.uiuc.edu/node198.html  uniform random quaternion
        const u1 = Math.random(),
              u2 = Math.random(),
              u3 = Math.random(),
              r1 = Math.sqrt( 1-u1 ),
              r2 = Math.sqrt( u1 );

        out[ 0 ] = r1 * Math.sin( 6.283185307179586 * u2 );
        out[ 1 ] = r1 * Math.cos( 6.283185307179586 * u2 );
        out[ 2 ] = r2 * Math.sin( 6.283185307179586 * u3 );
        out[ 3 ] = r2 * Math.cos( 6.283185307179586 * u3 );
        return out;
    }
    // #endregion


    // #region FLAT BUFFERS

    /** Used to get data from a flat buffer of vectors */
    fromBuf( ary : Array<number> | Float32Array, idx: number, out: TVec4 = [0,0,0,0] ) : TVec4 {
        out[ 0 ] = ary[ idx ];
        out[ 1 ] = ary[ idx + 1 ];
        out[ 2 ] = ary[ idx + 2 ];
        out[ 3 ] = ary[ idx + 3 ];
        return out;
    }

    /** Put data into a flat buffer of quaternions */
    toBuf( a: TVec4, ary : Array<number> | Float32Array, idx: number ) : void { 
        ary[ idx ]     = a[ 0 ]; 
        ary[ idx + 1 ] = a[ 1 ]; 
        ary[ idx + 2 ] = a[ 2 ];
        ary[ idx + 3 ] = a[ 3 ];
    }

    /** Push quaternion components onto an array */
    pushTo( a: TVec4, ary: Array<number> ) : void {
        ary.push( a[ 0 ], a[ 1 ], a[ 2 ], a[ 3 ] );
    }

    // #endregion


    // #region AXIS ANGLE
    /** Axis must be normlized, Angle is in Rads */
    static axisAngle( axis: TVec3, angle: number, out: TVec4 = [0,0,0,1] ) : TVec4{ 
        const half = angle * .5,
              s    = Math.sin( half );
        out[ 0 ] = axis[ 0 ] * s;
        out[ 1 ] = axis[ 1 ] * s;
        out[ 2 ] = axis[ 2 ] * s;
        out[ 3 ] = Math.cos( half );
        return out;
    }

	static getAxisAngle( a: TVec4, out: TVec4 = [0,0,0,0] ) : TVec4{
        if( a[3] > 1 ) a = this.norm( a, [0,0,0,0] );
        
        const angle = 2 * Math.acos( a[3] ),
              s     = Math.sqrt(1 - a[3] * a[3]);

        if( s < 0.001 ){
            out[ 0 ] = 1;
            out[ 1 ] = 0;
            out[ 2 ] = 0;
            out[ 3 ] = 0;
        }else{
            out[ 0 ] = a[ 0 ] / s;
            out[ 1 ] = a[ 1 ] / s;
            out[ 2 ] = a[ 2 ] / s;
            out[ 3 ] = angle;
        }
        return out;
    }

    static getAngle( a: TVec4 ) : number{ 
        if( a[3] > 1 ) a = this.norm( a, [0,0,0,0] );
        return 2 * Math.acos( a[3] );
    }

	static getAxis( a: TVec4, out: TVec3 = [ 0, 0, 0 ] ) : TVec3{
        if( a[3] > 1 ) a = this.norm( a, [0,0,0,0] );
        
        const s = Math.sqrt( 1 - a[ 3 ]**2 );
        if( s < 0.001 ){
            out[ 0 ] = 1;
            out[ 1 ] = 0;
            out[ 2 ] = 0;
        }else{
            out[ 0 ] = a[ 0 ] / s;
            out[ 1 ] = a[ 1 ] / s;
            out[ 2 ] = a[ 2 ] / s;
        }
        return out;
    }
    // #endregion

    
    // #region OPERATIONS
    static mul( a: TVec4, b: TVec4, out ?: TVec4 ) : TVec4{
        const ax = a[0], ay = a[1], az = a[2], aw = a[3],
              bx = b[0], by = b[1], bz = b[2], bw = b[3];
        out      = out || a;
        out[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        out[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        out[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        out[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    static norm( q: TVec4, out ?:TVec4 ) : TVec4{
        let len =  q[0]**2 + q[1]**2 + q[2]**2 + q[3]**2;
        out = out || q;
        if( len > 0 ){
            len = 1 / Math.sqrt( len );
            out[ 0 ] = q[ 0 ] * len;
            out[ 1 ] = q[ 1 ] * len;
            out[ 2 ] = q[ 2 ] * len;
            out[ 3 ] = q[ 3 ] * len;
        }
        return out;
    }

    static invert( q: TVec4, out ?: TVec4 ) : TVec4{
        const a0  = q[0],
              a1  = q[1],
              a2  = q[2],
              a3  = q[3],
              dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;

        out = out || q;
        if( dot == 0 ){
            out[0] = out[1] = out[2] = out[3] = 0;
        }else{
            const invDot = 1.0 / dot; // let invDot = dot ? 1.0/dot : 0;
            out[ 0 ]	= -a0 * invDot;
            out[ 1 ]	= -a1 * invDot;
            out[ 2 ]	= -a2 * invDot;
            out[ 3 ]	=  a3 * invDot;
        }

        return out;
    }

    static look( vDir: TVec3, vUp: TVec3, out:TVec4 = [0,0,0,0] ) : TVec4 {
        // Ported to JS from C# example at https://pastebin.com/ubATCxJY
        // TODO, if Dir and Up are equal, a roll happends. Need to find a way to fix this.
        const zAxis	= vec3.clone( vDir ),         // Forward
              xAxis = vec3.cross( vUp, zAxis ),   // Right
              yAxis = vec3.cross( zAxis, xAxis ); // Up

        vec3.norm( xAxis );
        vec3.norm( yAxis );
        vec3.norm( zAxis );

        //fromAxis - Mat3 to Quat
        const m00 = xAxis[0], m01 = xAxis[1], m02 = xAxis[2],
              m10 = yAxis[0], m11 = yAxis[1], m12 = yAxis[2],
              m20 = zAxis[0], m21 = zAxis[1], m22 = zAxis[2],
              t   = m00 + m11 + m22;
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

        out[ 0 ] = x;
        out[ 1 ] = y;
        out[ 2 ] = z;
        out[ 3 ] = w;
        return out;
    }

    static negate( q: TVec4, out ?: TVec4 ) : TVec4{
        out      = out || q;
        out[ 0 ] = -q[ 0 ];
        out[ 1 ] = -q[ 1 ];
        out[ 2 ] = -q[ 2 ];
        out[ 3 ] = -q[ 3 ];
        return out;
    }

    /** Checks if on opposite hemisphere, if so, negate this quat */
    static dotNegate( q: TVec4, by:TVec4, out ?: TVec4 ): TVec4{ 
        out = out || q;
        if( this.dot( q, by ) < 0 ) this.negate( q, out );
        return out;
    }

    static conjugate( q:TVec4, out ?: TVec4 ) : TVec4{
        out    = out || q;
        out[0] = -q[0];
        out[1] = -q[1];
        out[2] = -q[2];
        out[3] =  q[3];
        return out;
    }

    static mirrorX( q:TVec4, out ?: TVec4 ) : TVec4{
        out      = out || q;
        out[ 0 ] =  q[ 0 ];
        out[ 1 ] = -q[ 1 ];
        out[ 2 ] = -q[ 2 ];
        return out;
    }

    static scaleAngle( q: TVec4, scl: number, out ?: TVec4 ) : TVec4{
        if( q[ 3 ] > 1 ) q = this.norm( q );

        const angle = 2 * Math.acos( q[3] ),
              len   = 1 / Math.sqrt( q[0]**2 + q[1]**2 + q[2]**2 ), // Get Length to normalize axis
              half  = (angle * scl) * 0.5,                                   // Calc Angle, Scale it then Half it.
              s     = Math.sin( half );                                      // Do Normalize and SinHalf at the same time

        out      = out || q;
        out[ 0 ] = ( q[ 0 ] * len ) * s;
        out[ 1 ] = ( q[ 1 ] * len ) * s;
        out[ 2 ] = ( q[ 2 ] * len ) * s;
        out[ 3 ] = Math.cos( half );
        return out;
    }

    static transformVec3( q:TVec4, v: TVec3, out ?: TVec3 ) : TVec3{
        const qx = q[0], qy = q[1], qz = q[2], qw = q[3],
              vx = v[0], vy = v[1], vz = v[2],
              x1 = qy * vz - qz * vy,
              y1 = qz * vx - qx * vz,
              z1 = qx * vy - qy * vx,
              x2 = qw * x1 + qy * z1 - qz * y1,
              y2 = qw * y1 + qz * x1 - qx * z1,
              z2 = qw * z1 + qx * y1 - qy * x1;

        out      = out || v;
        out[ 0 ] = vx + 2 * x2;
        out[ 1 ] = vy + 2 * y2;
        out[ 2 ] = vz + 2 * z2;
        return out;
    }

    static rotX( q: TVec4, rad: number, out ?: TVec4 ) : TVec4{
        // https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/quat.js
        rad *= 0.5; 

        const ax = q[0], ay = q[1], az = q[2], aw = q[3],
              bx = Math.sin(rad), bw = Math.cos(rad);

        out    = out || q;
        out[0] = ax * bw + aw * bx;
        out[1] = ay * bw + az * bx;
        out[2] = az * bw - ay * bx;
        out[3] = aw * bw - ax * bx;
        return out;
    }

    static rotY( q:TVec4, rad: number, out ?: TVec4 ) : TVec4{
        rad *= 0.5; 

        const ax = q[0], ay = q[1], az = q[2], aw = q[3],
              by = Math.sin(rad), bw = Math.cos(rad);
        
        out    = out || q;
        out[0] = ax * bw - az * by;
        out[1] = ay * bw + aw * by;
        out[2] = az * bw + ax * by;
        out[3] = aw * bw - ay * by;
        return out;
    }

    static rotZ( q:TVec4, rad: number, out ?: TVec4 ) : TVec4{
        rad *= 0.5; 

        const ax = q[0], ay = q[1], az = q[2], aw = q[3],
              bz = Math.sin(rad),
              bw = Math.cos(rad);

        out    = out || q;
        out[0] = ax * bw + ay * bz;
        out[1] = ay * bw - ax * bz;
        out[2] = az * bw + aw * bz;
        out[3] = aw * bw - az * bz;
        return out;
    }

    static rotDeg( q: TVec4, deg: number, axis='y', out ?: TVec4 ) : TVec4{
        const rad = deg * Math.PI / 180;
        out = out || q;
        switch( axis ){
            case 'x' : this.rotX( q, rad, out ); break;
            case 'y' : this.rotY( q, rad, out ); break;
            case 'z' : this.rotZ( q, rad, out ); break;
        }
        return out;
    }

    /** Multiple an Axis Angle */
    static mulAxisAngle( q: TVec4, axis: TVec3, angle: number, out ?: TVec4 ) : TVec4{
        const half = angle * .5,
              s    = Math.sin( half ),
              bx   = axis[0] * s,	// B Quat based on Axis Angle
              by   = axis[1] * s, 
              bz   = axis[2] * s,
              bw   = Math.cos( half ),
              ax   = q[0],		// A of mul
              ay   = q[1],
              az   = q[2],
              aw   = q[3];

        // Quat.mul( a, b );
        out      = out || q;
        out[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        out[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        out[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        out[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    /** PreMultiple an Axis Angle to this quaternions */
    static pmulAxisAngle( q: TVec4, axis: TVec3, angle: number, out ?: TVec4 ) : TVec4{
        const half = angle * .5,
              s    = Math.sin( half ),
              ax   = axis[0] * s,	// A Quat based on Axis Angle
              ay   = axis[1] * s, 
              az   = axis[2] * s,
              aw   = Math.cos( half ),

              bx   = q[0],		// B of mul
              by   = q[1],
              bz   = q[2],
              bw   = q[3];
        
        // Quat.mul( a, b );
        out      = out || q;
        out[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        out[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        out[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        out[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    /** Inverts the quaternion passed in, then pre multiplies to this quaternion. */
    static pmulInvert( q: TVec4, inv: TVec4, out ?: TVec4 ) : TVec4{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // .invert()
        let ax = inv[ 0 ],	
            ay = inv[ 1 ],
            az = inv[ 2 ],
            aw = inv[ 3 ];

        const dot = ax*ax + ay*ay + az*az + aw*aw;

        if( dot == 0 ){
            ax = ay = az = aw = 0;
        }else{
            const dot_inv = 1.0 / dot;
            ax = -ax * dot_inv;
            ay = -ay * dot_inv;
            az = -az * dot_inv;
            aw =  aw * dot_inv;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // .mul( a, b );
        const bx = q[ 0 ],	
              by = q[ 1 ],
              bz = q[ 2 ],
              bw = q[ 3 ];

        out      = out || q;
        out[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
        out[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
        out[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
        out[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    /** Apply Unit Vector Rotation to Quaternion */
    static mulUnitVecs( q: TVec4, a: TVec3, b: TVec3, out ?: TVec4 ) : TVec4{
        // fromUnitVecs
        const dot = vec3.dot( a, b );
        const ax  = q[0],		// A of mul
              ay  = q[1],
              az  = q[2],
              aw  = q[3];
        let bx, by, bz, bw;

        if( dot < -0.999999 ){
            const axis = vec3.cross( vec3.LEFT, a );
            if( vec3.len( axis ) < 0.000001 ) vec3.cross( vec3.UP, a, axis );
            vec3.norm( axis );

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
            const v     = vec3.cross(a, b);
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
        out     = out || q;
        out[0]	= ax * bw + aw * bx + ay * bz - az * by;
        out[1]	= ay * bw + aw * by + az * bx - ax * bz;
        out[2]	= az * bw + aw * bz + ax * by - ay * bx;
        out[3]	= aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }
    // #endregion


    // #region EULER

    static getEuler( q: TVec4, out: TVec3=[0,0,0], inDeg=false ) : TVec3{ //order="YZX"
        // http://bediyap.com/programming/convert-Quat-to-euler-rotations/
        // http://schteppe.github.io/cannon.js/docs/files/src_math_Quat.js.html

        let pitch=0, yaw=0, roll=0;
        const x     = q[0],
              y		= q[1],
              z     = q[2],
              w		= q[3],
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
        out[ 0 ]	= roll	* deg;
        out[ 1 ]	= pitch	* deg;
        out[ 2 ]	= yaw	* deg;
        return out;
    }

    /** order="YXZ", Values in Degrees, will be converted to Radians by function*/
    static fromEuler( v: TVec3, out:TVec4=[0,0,0,1] ) : TVec4{
        const xx = v[ 0 ] * 0.01745329251 * 0.5;
        const yy = v[ 1 ] * 0.01745329251 * 0.5;
        const zz = v[ 2 ] * 0.01745329251 * 0.5;
        const c1 = Math.cos( xx ),
              c2 = Math.cos( yy ),
              c3 = Math.cos( zz ),
              s1 = Math.sin( xx ),
              s2 = Math.sin( yy ),
              s3 = Math.sin( zz );

        out[ 0 ] = s1 * c2 * c3 + c1 * s2 * s3;
        out[ 1 ] = c1 * s2 * c3 - s1 * c2 * s3;
        out[ 2 ] = c1 * c2 * s3 - s1 * s2 * c3;
        out[ 3 ] = c1 * c2 * c3 + s1 * s2 * s3;
        return this.norm( out );
    }

    /**order="YXZ", Values in Degrees, will be converted to Radians by function */
    static fromEulerXY( x: number, y: number, out:TVec4=[0,0,0,1] ) : TVec4{ 
        const xx = x * 0.01745329251 * 0.5,
              yy = y * 0.01745329251 * 0.5,
              c1 = Math.cos( xx ),
              c2 = Math.cos( yy ),
              s1 = Math.sin( xx ),
              s2 = Math.sin( yy );

        out[ 0 ] = s1 * c2 ;
        out[ 1 ] = c1 * s2 ;
        out[ 2 ] = -s1 * s2;
        out[ 3 ] = c1 * c2;
        return this.norm( out );
    }

    static fromEulerOrder( x: number, y: number, z: number, out: TVec4=[0,0,0,1], order='YXZ' ) : TVec4{
        // https://github.com/mrdoob/three.js/blob/dev/src/math/Quat.js

        const c1 = Math.cos(x*0.5), //Math.cos(x/2)
              c2 = Math.cos(y*0.5), //Math.cos(y/2),
              c3 = Math.cos(z*0.5), //Math.cos(z/2),
              s1 = Math.sin(x*0.5), //Math.sin(x/2),
              s2 = Math.sin(y*0.5), //Math.sin(y/2)
              s3 = Math.sin(z*0.5); //Math.sin(z/2)

        switch(order){
            case 'XYZ':			
                out[0] = s1 * c2 * c3 + c1 * s2 * s3;
                out[1] = c1 * s2 * c3 - s1 * c2 * s3;
                out[2] = c1 * c2 * s3 + s1 * s2 * c3;
                out[3] = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'YXZ':
                out[0] = s1 * c2 * c3 + c1 * s2 * s3;
                out[1] = c1 * s2 * c3 - s1 * c2 * s3;
                out[2] = c1 * c2 * s3 - s1 * s2 * c3;
                out[3] = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            case 'ZXY':
                out[0] = s1 * c2 * c3 - c1 * s2 * s3;
                out[1] = c1 * s2 * c3 + s1 * c2 * s3;
                out[2] = c1 * c2 * s3 + s1 * s2 * c3;
                out[3] = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'ZYX':
                out[0] = s1 * c2 * c3 - c1 * s2 * s3;
                out[1] = c1 * s2 * c3 + s1 * c2 * s3;
                out[2] = c1 * c2 * s3 - s1 * s2 * c3;
                out[3] = c1 * c2 * c3 + s1 * s2 * s3;
                break;
            case 'YZX':
                out[0] = s1 * c2 * c3 + c1 * s2 * s3;
                out[1] = c1 * s2 * c3 + s1 * c2 * s3;
                out[2] = c1 * c2 * s3 - s1 * s2 * c3;
                out[3] = c1 * c2 * c3 - s1 * s2 * s3;
                break;
            case 'XZY':
                out[0] = s1 * c2 * c3 - c1 * s2 * s3;
                out[1] = c1 * s2 * c3 - s1 * c2 * s3;
                out[2] = c1 * c2 * s3 + s1 * s2 * c3;
                out[3] = c1 * c2 * c3 + s1 * s2 * s3;
                break;
        }

        return this.norm( out );
    }

    // #endregion


    // #region ANGULAR VECTOR
    static fromAngularVec( v: TVec3, out: TVec4=[0,0,0,1] ) : TVec4{
        let len = vec3.len( v );
        if( len < 0.000001 ){
            this.reset( out ); 
        }else{
            const h = 0.5 * len;
            const s = Math.sin( h );
            const c = Math.cos( h );
            len = 1 / len;

            out[ 0 ] = s * ( v[ 0 ] * len );
            out[ 1 ] = s * ( v[ 1 ] * len );
            out[ 2 ] = s * ( v[ 2 ] * len );
            out[ 3 ] = c;
        }
        return out;
    }
    
    static toAngularVec( q:TVec4, out: TVec3 = [0,0,0] ) : TVec3{
        const v = this.getAxisAngle( q );  // axis * angle;
        out[ 0 ] = v[ 0 ] * v[ 3 ];
        out[ 1 ] = v[ 1 ] * v[ 3 ];
        out[ 2 ] = v[ 2 ] * v[ 3 ];
        return out;
    }
    // #endregion


    // #region INTERPOLATION
    static lerp( a: TVec4, b: TVec4, t: number, out: TVec4 = [0,0,0,1] ) : TVec4{
        const ti = 1 - t;
        out[0]	 = a[0] * ti + b[0] * t;
        out[1]	 = a[1] * ti + b[1] * t;
        out[2]	 = a[2] * ti + b[2] * t;
        out[3]	 = a[3] * ti + b[3] * t;
        return out;
    }

    static nlerp( a: TVec4, b: TVec4, t: number, out: TVec4 = [0,0,0,1] ) : TVec4{
        const ti = 1 - t;
        out[0]	 = a[0] * ti + b[0] * t;
        out[1]	 = a[1] * ti + b[1] * t;
        out[2]	 = a[2] * ti + b[2] * t;
        out[3]	 = a[3] * ti + b[3] * t;
        return this.norm( out );
    }

    static nblend( a: TVec4, b: TVec4, t: number, out: TVec4 = [0,0,0,1] ) : TVec4{
        // https://physicsforgames.blogspot.com/2010/02/quaternions.html
        const a_x = a[ 0 ],	// Quaternion From
            a_y = a[ 1 ],
            a_z = a[ 2 ],
            a_w = a[ 3 ],
            b_x = b[ 0 ],	// Quaternion To
            b_y = b[ 1 ],
            b_z = b[ 2 ],
            b_w = b[ +3 ],
            dot = a_x*b_x + a_y*b_y + a_z*b_z + a_w*b_w,
            ti 	= 1 - t;
        let s 	= 1;

        // if Rotations with a dot less then 0 causes artifacts when lerping,
        // Can fix this by switching the sign of the To Quaternion.
        if( dot < 0 ) s = -1;

        out[ 0 ]	= ti * a_x + t * b_x * s;
        out[ 1 ]	= ti * a_y + t * b_y * s;
        out[ 2 ]	= ti * a_z + t * b_z * s;
        out[ 3 ]	= ti * a_w + t * b_w * s;

        return this.norm( out );
    }

    static slerp( a: TVec4, b: TVec4, t: number, out: TVec4 = [0,0,0,1] ) : TVec4{
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

    static cubic( a: TVec4, b: TVec4, c: TVec4, d: TVec4, t: number, out: TVec4=[0,0,0,1] ) : TVec4{
        // B & C are the main points, A & D are the tangents
        const t2 = t * t,
              t3 = t * t2,
              a0 = d[0] - c[0] - a[0] + b[0],
              a1 = d[1] - c[1] - a[1] + b[1],
              a2 = d[2] - c[2] - a[2] + b[2],
              a3 = d[3] - c[3] - a[3] + b[3];
        out[ 0 ] = a0*t3 + ( a[0] - b[0] - a0 )*t2 + ( c[0] - a[0] )*t + b[0];
        out[ 1 ] = a1*t3 + ( a[1] - b[1] - a1 )*t2 + ( c[1] - a[1] )*t + b[1];
        out[ 2 ] = a2*t3 + ( a[2] - b[2] - a2 )*t2 + ( c[2] - a[2] )*t + b[2];
        out[ 3 ] = a3*t3 + ( a[3] - b[3] - a3 )*t2 + ( c[3] - a[3] )*t + b[3];
        return this.norm( out );
    }
    // #endregion


    // #region STATIC
    static dot( a: TVec4, b: TVec4 ) : number{ return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]; }
    // #endregion

}


/*
angleTo( q ) {
    return 2 * Math.acos( Math.abs( MathUtils.clamp( this.dot( q ), - 1, 1 ) ) );
}

function decompSwingTwist( q, qSwing, qTwist ){
	//q_z = ( 0, 0, z, w ) / sqrt( z^2 + w^2 )
	let denom = Math.sqrt( q[2]*q[2] + q[3]*q[3] );
	qTwist[0] = 0;
	qTwist[1] = 0;
	qTwist[2] = q[2] / denom;
	qTwist[3] = q[3] / denom;
	//q_xy = q * conjugate( q_z );
	Quat.mul( q, Quat.conjugate( qTwist ), qSwing );
}
*/

/*
//http://allenchou.net/2018/05/game-math-swing-twist-interpolation-sterp/
function get_swing_twist( q, twist_axis=Vec3.UP, out_swing, out_twist ){
	let r = new Vec3( q[0], q[1], q[2] );
	// singularity: rotation by 180 degree
	if( r.lengthSqr() < 0.00001 ){
		let t_axis = Vec3.transformQuat( twist_axis, q );
		let s_axis = Vec3.cross( twist_axis, t_axis );
		if( s_axis.lengthSqr() > 0.00001 ){
      		let s_angle = Vector3.angle( twist_axis, t_axis );
      		out_swing.setAxisAngle( s_axis, s_angle );
    	}else{ // more singularity rotation axis parallel to twist axis
      		out_swing.reset() // no swing
    	}
    	// always twist 180 degree on singularity
    	out_twist.setAxisAngle( twist_axis, Math.PI );
    	console.log("singularity");
    	return;
	}
	// meat of swing-twist decomposition
	let p = vec3_project( r, twist_axis );
	out_twist.set( p[0], p[1], p[2], q[3] ).norm();
	out_swing.from_mul( Quat.invert( out_twist ), q ); //q * Quaternion.Inverse(twist);
	//out_swing.from_mul( q, Quat.invert( out_twist ) );
}


// https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/math/Quat.java
// http://physicsforgames.blogspot.com/2010/03/Quat-tricks.html
// http://physicsforgames.blogspot.com/2010/02/Quats.html

/*
https://physicsforgames.blogspot.com/2010/02/quaternions.html
Quat QuatIntegrate(const Quat& q, const Vector& omega, float deltaT){
     Quat deltaQ;
     Vector theta = VecScale(omega, deltaT * 0.5f);
     float thetaMagSq = VecMagnitudeSq(theta);
     float s;
     if(thetaMagSq * thetaMagSq / 24.0f < MACHINE_SMALL_FLOAT)
     {
          deltaQ.w = 1.0f - thetaMagSq / 2.0f;
          s = 1.0f - thetaMagSq / 6.0f;
     }
     else
     {
          float thetaMag = sqrt(thetaMagSq);
          deltaQ.w = cos(thetaMag);
          s = sin(thetaMag) / thetaMag;
     }
     deltaQ.x = theta.x * s;
     deltaQ.y = theta.y * s;
     deltaQ.z = theta.z * s;
     return QuatMultiply(deltaQ, q);
}

public final Angle getRotationX(){
    double radians = Math.atan2((2.0 * this.x * this.w) - (2.0 * this.y * this.z),
                                1.0 - 2.0 * (this.x * this.x) - 2.0 * (this.z * this.z));
    if (Double.isNaN(radians))
        return null;
    return Angle.fromRadians(radians);
}

public final Angle getRotationY(){
    double radians = Math.atan2((2.0 * this.y * this.w) - (2.0 * this.x * this.z),
                                1.0 - (2.0 * this.y * this.y) - (2.0 * this.z * this.z));
    if (Double.isNaN(radians))
        return null;
    return Angle.fromRadians(radians);
}

public final Angle getRotationZ(){
    double radians = Math.asin((2.0 * this.x * this.y) + (2.0 * this.z * this.w));
    if (Double.isNaN(radians))
        return null;
    return Angle.fromRadians(radians);
}

public final LatLon getLatLon(){
    double latRadians = Math.asin((2.0 * this.y * this.w) - (2.0 * this.x * this.z));
    double lonRadians = Math.atan2((2.0 * this.y * this.z) + (2.0 * this.x * this.w),
                                    (this.w * this.w) - (this.x * this.x) - (this.y * this.y) + (this.z * this.z));
    if (Double.isNaN(latRadians) || Double.isNaN(lonRadians))
        return null;
    return LatLon.fromRadians(latRadians, lonRadians);
}
*/

/*
//https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Quat.cs
// Rotates the point /point/ with /rotation/.
public static Vector3 operator*(Quat rotation, Vector3 point){
    float x = rotation.x * 2F;
    float y = rotation.y * 2F;
    float z = rotation.z * 2F;
    float xx = rotation.x * x;
    float yy = rotation.y * y;
    float zz = rotation.z * z;
    float xy = rotation.x * y;
    float xz = rotation.x * z;
    float yz = rotation.y * z;
    float wx = rotation.w * x;
    float wy = rotation.w * y;
    float wz = rotation.w * z;
    Vector3 res;
    res.x = (1F - (yy + zz)) * point.x + (xy - wz) * point.y + (xz + wy) * point.z;
    res.y = (xy + wz) * point.x + (1F - (xx + zz)) * point.y + (yz - wx) * point.z;
    res.z = (xz - wy) * point.x + (yz + wx) * point.y + (1F - (xx + yy)) * point.z;
    return res;
}
*/