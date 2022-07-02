import type { TVec3, TVec2, TVec4, TVec3Struct } from '../global';

class vec3{
    // #region PROPERTIES
    static AXIS     = [ [1,0,0], [0,1,0], [0,0,1] ];
    static UP       = [  0,  1,  0 ];
    static DOWN     = [  0, -1,  0 ];
    static LEFT     = [ -1,  0,  0 ];
    static RIGHT    = [  1,  0,  0 ];
    static FORWARD  = [  0,  0,  1 ];
    static BACK     = [  0,  0, -1 ];
    static ZERO     = [  0,  0,  0 ];
    // #endegion

    // #region GETTERS
    static lenSq( a: TVec3 ) : number
    static lenSq( a: TVec3, b: TVec3 ) : number
    static lenSq( a: TVec3, b ?: TVec3 ) : number{ 
        if( b === undefined ) return  a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]** 2;
        return (a[ 0 ]-b[ 0 ]) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2 + (a[ 2 ]-b[ 2 ]) ** 2;
    }

    static len( a: TVec3 ) : number
    static len( a: TVec3, b: TVec3 ) : number
    static len( a: TVec3, b ?: TVec3 ) : number{ 
        if( b === undefined ) return Math.sqrt( a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]** 2 );
        return Math.sqrt( (a[ 0 ]-b[ 0 ]) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2 + (a[ 2 ]-b[ 2 ]) ** 2 );
    }

    static dot( a: TVec3, b: TVec3 ) : number { return a[ 0 ] * b[ 0 ] + a[ 1 ] * b[ 1 ] + a[ 2 ] * b[ 2 ]; }    

    static angle( a: TVec3, b: TVec3 ) : number{
        //acos(dot(a,b)/(len(a)*len(b))) 
        //let theta = this.dot( a, b ) / ( Math.sqrt( a.lenSqr * b.lenSqr ) );
        //return Math.acos( Math.max( -1, Math.min( 1, theta ) ) ); // clamp ( t, -1, 1 )

        // atan2(len(cross(a,b)),dot(a,b))  
        const d = this.dot( a, b ),
              c = this.cross( a, b, [0,0,0] );
        return Math.atan2( this.len( c ), d ); 

        // This also works, but requires more LEN / SQRT Calls
        // 2 * atan2( ( u * v.len - v * u.len ).len, ( u * v.len + v * u.len ).len );

        //https://math.stackexchange.com/questions/1143354/numerically-stable-method-for-angle-between-3d-vectors/1782769
        // θ=2 atan2(|| ||v||u−||u||v ||, || ||v||u+||u||v ||)

        //let cosine = this.dot( a, b );
        //if(cosine > 1.0) return 0;
        //else if(cosine < -1.0) return Math.PI;
        //else return Math.acos( cosine / ( Math.sqrt( a.lenSqr * b.lenSqr() ) ) );
    }

    static equal( a: TVec3, b: TVec3 ) : boolean{ return ( a[ 0 ] == b[ 0 ] && a[ 1 ] == b[ 1 ] && a[ 2 ] == b[ 2 ] ); }

    /** Copy data from a struct vector type. ThreeJS compatilbility */
    static fromStruct( v: TVec3Struct, out: TVec3 ) : TVec3{
        out[ 0 ] = v.x; 
        out[ 1 ] = v.y; 
        out[ 2 ] = v.z;
        return out;
    }

    /** Test if all components equal zero */
    static isZero( a:TVec3 ) : boolean { return ( a[ 0 ] == 0 && a[ 1 ] == 0 && a[ 2 ] == 0 ); }

    /** Convert value to a string value */
    static toString( a:TVec3, rnd = 0 ) : string{
        if( rnd == 0 ) return "[" + a.join(",") + "]";
        else{
            let s = "[";
            for( let i=0; i < 3; i++ ){
                switch( a[i] ){
                    case 0	: s += "0,"; break;
                    case 1	: s += "1,"; break;
                    default	: s += a[ i ].toFixed( rnd ) + ","; break;
                }
            }

            return s.slice(0,-1) + "]";
        }
    }

    static toKey( a:TVec3, place=0 ): string{
        return ( place == 0 )? 
            a[ 0 ] + '_' + a[ 1 ] + '_' + a[ 2 ] :
            a[ 0 ].toFixed( place ) + '_' + a[ 1 ].toFixed( place ) + '_' + a[ 2 ].toFixed( place );
    }

    /** Return the Index of which axis has the smallest number */
    static minAxis( a:TVec3 ) : number{
        if( a[ 0 ] < a[ 1 ] && a[ 0 ] < a[ 2 ] ) return 0;
        if( a[ 1 ] < a[ 2 ] ) return 1;
        return 2;
    }

    /** Return the Index of which axis has the smallest number */
    static maxAxis( a:TVec3 ) : number{
        if( a[ 0 ] > a[ 1 ] && a[ 0 ] > a[ 2 ] ) return 0;
        if( a[ 1 ] > a[ 2 ] ) return 1;
        return 2;
    }

    /** Create an array filled with Vec3 Objects */
    static createVecArray( len: number ) : Array<TVec3>{
        const ary = new Array( len );
        for( let i=0; i < len; i++) ary[ i ] = [0,0,0];
        return ary;
    }
    
    static flattenVecArray( ary: Array<TVec3> ): Array<number>{
        const len = ary.length;
        const rtn = new Array( len * 3 );
        let i  = 0;
        let v : TVec3;
        
        for( v of ary ){
            rtn[ i++ ] = v[ 0 ];
            rtn[ i++ ] = v[ 1 ];
            rtn[ i++ ] = v[ 2 ];
        }

        return rtn;
    }
    // #endregion


    // #region SETTERS
    /** Reset all components to zero */
    static reset( out:TVec3 ) : TVec3 { 
        out[ 0 ] = 0; 
        out[ 1 ] = 0; 
        out[ 2 ] = 0; 
        return out;
    }

    static copy( a:TVec3, out:TVec3 ): TVec3{
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        return out;
    }

    static fromVec2( v: TVec2, useZ=false, out: TVec3 ) : TVec3{
        out[ 0 ] = v[ 0 ];
        if( useZ ){
            out[ 1 ] = 0;
            out[ 2 ] = v[ 1 ];
        }else{
            out[ 1 ] = v[ 1 ];
            out[ 2 ] = 0;
        }
        return out;
    }

    /** Copy data to a struct vector type. ThreeJS compatilbility */
    static toStruct( a: TVec3, out: TVec3Struct ) : TVec3Struct {
        out.x = a[ 0 ];
        out.y = a[ 1 ];
        out.z = a[ 2 ];
        return out;
    }

    /** Generate a random vector. Can choose per axis range */
    static rnd( x0=0, x1=1, y0=0, y1=1, z0=0, z1=1, out : TVec3 ) : TVec3 {
        let t;
        t = Math.random(); out[ 0 ] = x0 * (1-t) + x1 * t;
        t = Math.random(); out[ 1 ] = y0 * (1-t) + y1 * t;
        t = Math.random(); out[ 2 ] = z0 * (1-t) + z1 * t;
        return out;
    }
    // #endregion


    // #region BUFFERS

    /** Used to get data from a flat buffer of vectors, useful when building geometery */
    static fromBuf( ary : Array<number> | Float32Array, idx: number, out: TVec3 ) : TVec3 {
        out[ 0 ] = ary[ idx ];
        out[ 1 ] = ary[ idx + 1 ];
        out[ 2 ] = ary[ idx + 2 ];
        return out;
    }

    /** Put data into a flat buffer of vectors, useful when building geometery */
    static toBuf( a: TVec3, ary : Array<number> | Float32Array, idx: number ): void { 
        ary[ idx ]     = a[ 0 ]; 
        ary[ idx + 1 ] = a[ 1 ]; 
        ary[ idx + 2 ] = a[ 2 ]; 
    }

    /** Pust vector components onto an array, useful when building geometery */
    static pushTo( a: TVec3, ary: Array<number> ) : number {
        const idx = ary.length;
        ary.push( a[ 0 ], a[ 1 ], a[ 2 ] );
        return idx;
    }

    /** Create an Iterator Object that allows an easy way to loop a Float32Buffer
     * @example
     * let buf = new Float32Array( 3 * 10 );
     * for( let v of vec3.bufIter( buf ) ) console.log( v );
    */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static bufIter( buf : Array<number> | Float32Array ) : { [Symbol.iterator]() : { next:()=>{ value:TVec3, done:boolean } } } {
        let   i       = 0;
        const result  = { value:[0,0,0], done:false },
              len     = buf.length,
              next    = ()=>{
                if( i >= len ) result.done = true;
                else{
                    vec3.fromBuf( buf, i, result.value );
                    i += 3;
                }
                return result;
              };
        return { [Symbol.iterator](){ return { next }; } };
    }

    /** Loop through a buffer array and use a function to update each vector
         * @example
         * let verts = [ 0,0,0, 0,0,0 ];
         * let dir   = [ 0,1,0 ];
         * vec3.bufMap( vertices, (v,i)=>v.add( dir ) ); */
    static bufMap( buf: Array<number> | Float32Array, fn: ( v:TVec3, i:number )=>void, startIdx=0, endIdx=0 ) : void{
        const end = ( endIdx == 0 )? buf.length : endIdx;
        const v   = [0,0,0];
        let i     = startIdx;

        for( i; i < end; i +=3 ){
            // Fill Data
            v[ 0 ]      = buf[ i ];
            v[ 1 ]      = buf[ i+1 ];
            v[ 2 ]      = buf[ i+2 ];
            
            // Transform Data
            fn( v, i );
            
            // Save Data Back
            buf[ i ]    = v[ 0 ];
            buf[ i+1 ]  = v[ 1 ];
            buf[ i+2 ]  = v[ 2 ];
        }
    }
    // #endregion


    // #region INTERPOLATION
    static lerp( a: TVec3, b: TVec3, t: number, out ?: TVec3 ) : TVec3 {
        const ti = 1 - t; // Linear Interpolation : (1 - t) * v0 + t * v1;
        out      = out || [0,0,0];
        out[ 0 ] = a[ 0 ] * ti + b[ 0 ] * t;
        out[ 1 ] = a[ 1 ] * ti + b[ 1 ] * t;
        out[ 2 ] = a[ 2 ] * ti + b[ 2 ] * t;
        return out;
    }

    static nlerp( a: TVec3, b: TVec3, t: number, out: TVec3 ) : TVec3 {
        const ti = 1 - t; // Linear Interpolation : (1 - t) * v0 + t * v1;
        out[ 0 ] = a[ 0 ] * ti + b[ 0 ] * t;
        out[ 1 ] = a[ 1 ] * ti + b[ 1 ] * t;
        out[ 2 ] = a[ 2 ] * ti + b[ 2 ] * t;
        this.norm( out );
        return out;
    }

    static slerp( a: TVec3, b: TVec3, t: number, out: TVec3 ) : TVec3 {
        const angle  = Math.acos( Math.min( Math.max( this.dot( a, b ), -1 ), 1 ) );
        const sin    = Math.sin( angle);
        const ta     = Math.sin(( 1 - t ) * angle ) / sin;
        const tb     = Math.sin( t * angle ) / sin;
        
        out[ 0 ] = ta * a[ 0 ] + tb * b[ 0 ];
        out[ 1 ] = ta * a[ 1 ] + tb * b[ 1 ];
        out[ 2 ] = ta * a[ 2 ] + tb * b[ 2 ];
        return out;
    }
    
    static hermite( a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number, out: TVec3 ) : TVec3 {
        const tt = t * t;
        const f1 = tt * (2 * t - 3) + 1;
        const f2 = tt * (t - 2) + t;
        const f3 = tt * (t - 1);
        const f4 = tt * (3 - 2 * t);

        out[ 0 ] = a[ 0 ] * f1 + b[ 0 ] * f2 + c[ 0 ] * f3 + d[ 0 ] * f4;
        out[ 1 ] = a[ 1 ] * f1 + b[ 1 ] * f2 + c[ 1 ] * f3 + d[ 1 ] * f4;
        out[ 2 ] = a[ 2 ] * f1 + b[ 2 ] * f2 + c[ 2 ] * f3 + d[ 2 ] * f4;  
        return out;
    }

    static bezier( a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number, out: TVec3 ) : TVec3 {
        const it  = 1 - t;
        const it2 = it * it;
        const tt  = t * t;
        const f1  = it2 * it;
        const f2  = 3 * t * it2;
        const f3  = 3 * tt * it;
        const f4  = tt * t;

        out[ 0 ] = a[ 0 ] * f1 + b[ 0 ] * f2 + c[ 0 ] * f3 + d[ 0 ] * f4;
        out[ 1 ] = a[ 1 ] * f1 + b[ 1 ] * f2 + c[ 1 ] * f3 + d[ 1 ] * f4;
        out[ 2 ] = a[ 2 ] * f1 + b[ 2 ] * f2 + c[ 2 ] * f3 + d[ 2 ] * f4;
        return out;
    }

    static cubic( a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number, out: TVec3 ) : TVec3{
        const t2 = t * t,
              t3 = t * t2,
              a0 = d[ 0 ] - c[ 0 ] - a[ 0 ] + b[ 0 ],
              a1 = d[ 1 ] - c[ 1 ] - a[ 1 ] + b[ 1 ],
              a2 = d[ 2 ] - c[ 2 ] - a[ 2 ] + b[ 2 ];
        out[ 0 ] = a0*t3 + ( a[ 0 ] - b[ 0 ] - a0 )*t2 + ( c[ 0 ] - a[ 0 ] )*t + b[ 0 ];
        out[ 1 ] = a1*t3 + ( a[ 1 ] - b[ 1 ] - a1 )*t2 + ( c[ 1 ] - a[ 1 ] )*t + b[ 1 ];
        out[ 2 ] = a2*t3 + ( a[ 2 ] - b[ 2 ] - a2 )*t2 + ( c[ 2 ] - a[ 2 ] )*t + b[ 2 ];
        return out;
    }
    //#endregion ////////////////////////////////////////////////////////


    // #region TRANSFORM
    static rotate( a: TVec3, rad: number, axis='x', out ?: TVec3 ) : TVec3 {
        // https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
        const sin = Math.sin( rad ),
              cos = Math.cos( rad ),
              x   = a[ 0 ],
              y   = a[ 1 ],
              z   = a[ 2 ];

        out = out || a;
        switch( axis ){
            case "y": //..........................
                out[ 0 ] = z * sin + x * cos; //x
                out[ 2 ] = z * cos - x * sin; //z
            break;
            case "x": //..........................
                out[ 1 ] = y * cos - z * sin; //y
                out[ 2 ] = y * sin + z * cos; //z
            break;
            case "z": //..........................
                out[ 0 ] = x * cos - y * sin; //x
                out[ 1 ] = x * sin + y * cos; //y
            break;
        }

        return out;
    }

    /** Axis Rotation of a Vector */
    static axisAngle( v: TVec3, axis: TVec3, rad: number, out ?: TVec3 ) : TVec3{
        // Rodrigues Rotation formula:
        // v_rot = v * cos(theta) + cross( axis, v ) * sin(theta) + axis * dot( axis, v) * (1-cos(theta))
        const cp    = this.cross( axis, v, [0,0,0] ),
              dot   = this.dot( axis, v ),
              s     = Math.sin( rad ),
              c     = Math.cos( rad ),
              ci    = 1 - c;
        out      = out || v;
        out[ 0 ] = v[ 0 ] * c + cp[ 0 ] * s + axis[ 0 ] * dot * ci;
        out[ 1 ] = v[ 1 ] * c + cp[ 1 ] * s + axis[ 1 ] * dot * ci;
        out[ 2 ] = v[ 2 ] * c + cp[ 2 ] * s + axis[ 2 ] * dot * ci;
        return out;
    }

    static transformQuat( v: TVec3, q: TVec4, out ?: TVec3 ) : TVec3{
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

    static transformMat3( a: TVec3, m : Array<number> | Float32Array, out ?: TVec3 ) : TVec3 {
        const   x = a[ 0 ], 
                y = a[ 1 ],
                z = a[ 2 ];
        out      = out || a;
        out[ 0 ] = x * m[ 0 ] + y * m[ 3 ] + z * m[ 6 ];
        out[ 1 ] = x * m[ 1 ] + y * m[ 4 ] + z * m[ 7 ];
        out[ 2 ] = x * m[ 2 ] + y * m[ 5 ] + z * m[ 8 ];
        return out;
    }

    static transformMat4( a: TVec3, m : Array<number> | Float32Array, out ?: TVec3 ) : TVec3 {
        const   x = a[ 0 ], 
                y = a[ 1 ], 
                z = a[ 2 ],
                w = ( m[3 ] * x + m[ 7 ] * y + m[ 11 ] * z + m[ 15 ] ) || 1.0;

        out      = out || a;
        out[ 0 ] = ( m[ 0 ] * x + m[ 4 ] * y + m[ 8 ]  * z + m[ 12 ] ) / w;
        out[ 1 ] = ( m[ 1 ] * x + m[ 5 ] * y + m[ 9 ]  * z + m[ 13 ] ) / w;
        out[ 2 ] = ( m[ 2 ] * x + m[ 6 ] * y + m[ 10 ] * z + m[ 14 ] ) / w;
        return out;
    }
    // #endregion ////////////////////////////////////////////////////////


    // #region OPERATIONS
    static add( a: TVec3, b: TVec3, out ?: TVec3 ) : TVec3 {
        out      = out || a;
        out[ 0 ] = a[ 0 ] + b[ 0 ];
        out[ 1 ] = a[ 1 ] + b[ 1 ];
        out[ 2 ] = a[ 2 ] + b[ 2 ];
        return out;
    }

    static sub( a: TVec3, b: TVec3, out ?: TVec3 ) : TVec3 {
        out      = out || a;
        out[ 0 ] = a[ 0 ] - b[ 0 ];
        out[ 1 ] = a[ 1 ] - b[ 1 ];
        out[ 2 ] = a[ 2 ] - b[ 2 ];
        return out;
    }

    static mul( a: TVec3, b: TVec3, out ?: TVec3 ) : TVec3 { 
        out      = out || a;
        out[ 0 ] = a[ 0 ] * b[ 0 ];
        out[ 1 ] = a[ 1 ] * b[ 1 ];
        out[ 2 ] = a[ 2 ] * b[ 2 ];
        return out;
    }

    static div( a: TVec3, b: TVec3, out ?: TVec3 ) : TVec3{
        out      = out || a;
        out[ 0 ] = ( b[ 0 ] != 0 )? a[ 0 ] / b[ 0 ] : 0;
        out[ 1 ] = ( b[ 1 ] != 0 )? a[ 1 ] / b[ 1 ] : 0;
        out[ 2 ] = ( b[ 2 ] != 0 )? a[ 2 ] / b[ 2 ] : 0;
        return out;
    }

    static scale( a: TVec3, s: number, out ?: TVec3 ) : TVec3{
        out      = out || a;
        out[ 0 ] = a[ 0 ] * s;
        out[ 1 ] = a[ 1 ] * s;
        out[ 2 ] = a[ 2 ] * s;
        return out;
    }

    static scaleThenAdd( v: TVec3, s: number, add: TVec3, out ?: TVec3 ) : TVec3 {
        out      = out || v;
        out[ 0 ] = v[ 0 ] * s + add[ 0 ];
        out[ 1 ] = v[ 1 ] * s + add[ 1 ];
        out[ 2 ] = v[ 2 ] * s + add[ 2 ];
        return out;
    }

    static divScale( a: TVec3, s: number, out ?: TVec3 ) : TVec3{
        out = out || a;
        if( s != 0 ){
            out[ 0 ] = a[ 0 ] / s;
            out[ 1 ] = a[ 1 ] / s;
            out[ 2 ] = a[ 2 ] / s;
        }
        return out;
    }

    static norm( a: TVec3, out ?: TVec3 ) : TVec3 {
        out = out || a;

        let mag = Math.sqrt( a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]**2 );
        if( mag != 0 ){
            mag      = 1 / mag;
            out[ 0 ] = a[ 0 ] * mag;
            out[ 1 ] = a[ 1 ] * mag;
            out[ 2 ] = a[ 2 ] * mag;
        }
        return out;
    }

    static invert( a: TVec3, out ?: TVec3 ) : TVec3 {
        out    = out || a;
        out[0] = 1 / a[0];
        out[1] = 1 / a[1];
        out[2] = 1 / a[2];
        return out;
    }

    static negate( a: TVec3, out ?: TVec3 ) : TVec3 {
        out      = out || a;
        out[ 0 ] = -a[ 0 ]; 
        out[ 1 ] = -a[ 1 ];
        out[ 2 ] = -a[ 2 ];
        return out;
    }

    static cross( a: TVec3, b: TVec3, out: TVec3 = [0,0,0] ) : TVec3{
        const ax = a[0], ay = a[1], az = a[2],
              bx = b[0], by = b[1], bz = b[2];

        out[ 0 ] = ay * bz - az * by;
        out[ 1 ] = az * bx - ax * bz;
        out[ 2 ] = ax * by - ay * bx;
        return out;
    }

    // https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector3.cs
    static reflect( dir: TVec3, norm: TVec3, out: TVec3 ) : TVec3{
        const factor = -2 * this.dot( norm, dir );
        out[ 0 ] = factor * norm[ 0 ] + dir[ 0 ];
        out[ 1 ] = factor * norm[ 1 ] + dir[ 1 ];
        out[ 2 ] = factor * norm[ 2 ] + dir[ 2 ];
        return out;
    }

    static abs( a:TVec3, out ?: TVec3 ) : TVec3{ 
        out      = out || a;
        out[ 0 ] = Math.abs( a[ 0 ] );
        out[ 1 ] = Math.abs( a[ 1 ] );
        out[ 2 ] = Math.abs( a[ 2 ] );
        return out;
    }

    static floor( a:TVec3, out ?: TVec3 ) : TVec3{
        out      = out || a;
        out[ 0 ] = Math.floor( a[ 0 ] );
        out[ 1 ] = Math.floor( a[ 1 ] );
        out[ 2 ] = Math.floor( a[ 2 ] );
        return out;
    }

    static ceil( a:TVec3, out ?: TVec3 ) : TVec3{
        out      = out || a;
        out[ 0 ] = Math.ceil( a[ 0 ] );
        out[ 1 ] = Math.ceil( a[ 1 ] );
        out[ 2 ] = Math.ceil( a[ 2 ] );
        return out;
    }

    static min( a:TVec3, b:TVec3, out ?: TVec3 ) : TVec3{
        out      = out || a;
        out[ 0 ] = Math.min( b[ 0 ], a[ 0 ] );
        out[ 1 ] = Math.min( b[ 1 ], a[ 1 ] );
        out[ 2 ] = Math.min( b[ 2 ], a[ 2 ] );
        return out;
    }

    static max( a:TVec3, b:TVec3, out ?: TVec3 ) : TVec3{
        out      = out || a;
        out[ 0 ] = Math.max( b[ 0 ], a[ 0 ] );
        out[ 1 ] = Math.max( b[ 1 ], a[ 1 ] );
        out[ 2 ] = Math.max( b[ 2 ], a[ 2 ] );
        return out;
    }

    static clamp( a:TVec3, min: TVec3, max: TVec3, out ?: TVec3  ) : TVec3{
        out      = out || a;
        out[ 0 ] = Math.min( Math.max( a[ 0 ], min[ 0 ] ), max[ 0 ] );
        out[ 1 ] = Math.min( Math.max( a[ 1 ], min[ 1 ] ), max[ 1 ] );
        out[ 2 ] = Math.min( Math.max( a[ 2 ], min[ 2 ] ), max[ 2 ] );
        return out;
    }

    /** When values are very small, like less then 0.000001, just make it zero */
    static nearZero( a:TVec3, out ?: TVec3 ) : TVec3{
        out      = out || a;
        out[ 0 ] = ( Math.abs( a[ 0 ] ) <= 1e-6 )? 0 : a[ 0 ];
        out[ 1 ] = ( Math.abs( a[ 1 ] ) <= 1e-6 )? 0 : a[ 1 ];
        out[ 2 ] = ( Math.abs( a[ 2 ] ) <= 1e-6 )? 0 : a[ 2 ];
        return out;
    }

    static snap( a: TVec3, s: TVec3, out ?: TVec3 ) : TVec3 {
        out      = out || a;
        out[ 0 ] = ( s[ 0 ] != 0 )? Math.floor( a[ 0 ] / s[ 0 ] ) * s[ 0 ] : 0;
        out[ 1 ] = ( s[ 1 ] != 0 )? Math.floor( a[ 1 ] / s[ 1 ] ) * s[ 1 ] : 0;
        out[ 2 ] = ( s[ 2 ] != 0 )? Math.floor( a[ 2 ] / s[ 2 ] ) * s[ 2 ] : 0;
        return out;
    }

    // EXPONENTIAL DECAY http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
    static damp( a:TVec3, b:TVec3, lambda: number, dt: number, out: TVec3 ): TVec3{
        // Mathf.Lerp(a, b, 1 - Mathf.Exp(-lambda * dt))
        const t  = 1 - Math.exp( - lambda * dt );
        const ti = 1 - t;

        out[0] = a[0] * t + b[0] * ti;
        out[1] = a[1] * t + b[1] * ti;
        out[2] = a[2] * t + b[2] * ti;
        return out;
    }
    // #endregion ////////////////////////////////////////////////////////


    // #region MISC
    /** Normal Direction of a Triangle */
    static project( from: TVec3, to: TVec3, out: TVec3 ) : TVec3{
        // Modified from https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector3.cs#L265
        // dot( a, b ) / dot( b, b ) * b
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const denom = this.dot( to, to );
        if( denom < 0.000001 ){
            out[ 0 ] = 0;
            out[ 1 ] = 0;
            out[ 2 ] = 0;
            return out;
        }
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const scl = this.dot( from, to ) / denom;
        out[ 0 ] = to[ 0 ] * scl;
        out[ 1 ] = to[ 1 ] * scl;
        out[ 2 ] = to[ 2 ] * scl;
        return out;
    }

    static projectScale( from: TVec3, to: TVec3 ) : number{
        // Modified from https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector3.cs#L265
        // dot( a, b ) / dot( b, b ) * b
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const denom = this.dot( to, to );
        return ( denom < 0.000001 )? 0 : this.dot( from, to ) / denom;
    }

    /** Project Postion onto a Plane */
    static planeProj( v:TVec3, planeNorm: TVec3, planePos: TVec3, out: TVec3 ): TVec3{
        const planeConst    = -this.dot( planePos, planeNorm );
        const scl           = this.dot( planeNorm, v ) + planeConst;
        this.scale( planeNorm, -scl, out );
        this.add( out, v );
        return out;
    }
    
    static triNorm( a:TVec3, b:TVec3, c:TVec3, out:TVec3 ): TVec3{
        const ab = this.sub( b, a, [0,0,0] );
        const ac = this.sub( c, a, [0,0,0] );
        this.cross( ab, ac, out );
        this.norm( out );
        return out;
    }

    static polar( lon: number, lat: number, out: TVec3 ) : TVec3{
        const phi   = ( 90 - lat ) * 0.01745329251, //deg 2 rad
              theta = lon * 0.01745329251,  //( lon + 180 ) * 0.01745329251,
              sp    = Math.sin(phi);

        out[ 0 ] = -sp * Math.sin( theta );
        out[ 1 ] = Math.cos( phi );
        out[ 2 ] = sp * Math.cos( theta );
        return out;
    }

    //TODO : toPolar() : [ number, number ];
    // theta   = Math.atan2( Math.sqrt( v[0]**2 + v[1]**2 ), v.z ) + Math.PI / 2;
    // phi     = Math.atan2( v[1], v[0] );

    // Angle around the Y axis, counter-clockwise when looking from above.
	// azimuth : Math.atan2( vector.z, - vector.x );

	// Angle above the XZ plane.
    //inclination Math.atan2( - vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) );

    //static cartesian_to_polar( v, out ){
	//		out = out || [0,0];

	//		let len = Math.sqrt( v[0]**2 + v[2]**2 );
	//		out[ 0 ] = Math.atan2( v[0], v[2] ) * Maths.RAD2DEG;
	//		out[ 1 ] = Math.atan2( v[1], len ) * Maths.RAD2DEG;
	//		return out;
	//	}

    /*
    OrthogonalBasis( v )
    a = Orthogonal( v );
    b = Cross( a, v );
    */
    static orthogonal( a: TVec3, out ?: TVec3 ) : TVec3{
        /*
        TODO: Found GLSL Code that might be better.
        vec3 orthogonal(vec3 v) {
            return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                                        : vec3(0.0, -v.z, v.y));
        }
        vec3 tangent    = orthogonal(normal);
        vec3 bitangent  = normalize(cross(normal, tangent));
        */
        const x = a[0], y = a[1], z = a[2];
        out = out || a;
        if( x >= 0.57735026919 ){
            out[ 0 ] =  y;
            out[ 1 ] = -x;
            out[ 2 ] =  0;
        }else{
            out[ 0 ] =  0;
            out[ 1 ] =  z;
            out[ 2 ] = -y;
        }

        return out;
    }


    static clone( a:TVec3 ): TVec3{ return [ a[0], a[1], a[2] ]; }
    // #endregion


    /** Handle Simple 90 Degree Rotations without the use of Quat, Trig, Matrices */
    // #region SINGLE AXIS ROTATION
    static xp( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = x; o[1] = -z; o[2] = y; return o; }    // x-zy rot x+90
    static xn( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = x; o[1] = z; o[2] = -y; return o; }    // xz-y rot x-90
    static x2( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = x; o[1] = -y; o[2] = -z; return o; }   // x-y-z rot x+180
    
    static yp( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -z; o[1] = y; o[2] = x; return o; }    // -zyx rot y+90
    static yn( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = z; o[1] = y; o[2] = -x; return o; }    // zy-x rot y-90
    static y2( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -x; o[1] = y; o[2] = -z; return o; }   // -xy-z rot y-180

    static zp( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = y; o[1] = -x; o[2] = z; return o; }    // y-xz rot z+90
    static zn( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -y; o[1] = x; o[2] = z; return o; }    // -yxz rot z-90
    static z2( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -x; o[1] = -y; o[2] = z; return o; }   // -x-yz rot z+180
    // #endregion

    // #region COMBINATIONS
    static xp_yn( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -y; o[1] = -z; o[2] = x; return o; }      // -y-zx rot x+90, y-90
    static xp_yp( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = y; o[1] = -z; o[2] = -x; return o; }      // y-z-x rot x+90, y+90
    static xp_yp_yp( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -x; o[1] = -z; o[2] = -y; return o; }  // -x-z-y rot x+90, y+90, y+90
    static xp_xp( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = x; o[1] = -y; o[2] = -z; return o; }      // x-y-z rot x+90, x+90
    static yn2( v: TVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -x; o[1] = y; o[2] = -z; return o; }        // -xy-z rot y-180
    // #endregion

}

export default vec3;