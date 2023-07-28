export default class Vec3 extends Array< number >{
    // #region STATIC PROPERTIES
    static UP       = [  0,  1,  0 ];
    static DOWN     = [  0, -1,  0 ];
    static LEFT     = [ -1,  0,  0 ];
    static RIGHT    = [  1,  0,  0 ];
    static FORWARD  = [  0,  0,  1 ];
    static BACK     = [  0,  0, -1 ];
    // #endregion

    // #region MAIN 
    constructor()
    constructor( v: TVec3 | ConstVec3 )
    constructor( v: number )
    constructor( x: number, y: number, z: number )
    constructor( v ?: TVec3 | ConstVec3 | number, y ?: number, z ?: number ){
        super( 3 );
        
        if( v instanceof Vec3 || v instanceof Float32Array || ( v instanceof Array && v.length == 3 )){
            this[ 0 ] = v[ 0 ]; 
            this[ 1 ] = v[ 1 ]; 
            this[ 2 ] = v[ 2 ];
        }else if( typeof v === 'number' && typeof y === 'number' && typeof z === 'number' ){
            this[ 0 ] = v
            this[ 1 ] = y; 
            this[ 2 ] = z;
        }else if( typeof v === 'number' ){
            this[ 0 ] = v;
            this[ 1 ] = v;
            this[ 2 ] = v;
        }else{
            this[ 0 ] = 0;
            this[ 1 ] = 0;
            this[ 2 ] = 0;
        }
    }
    // #endregion

    // #region GETTERS
    get len(): number{ return Math.sqrt( this[ 0 ]**2 + this[ 1 ]**2 + this[ 2 ]**2 ); }
    get lenSqr(): number{ return  this[ 0 ]**2 + this[ 1 ]**2 + this[ 2 ]**2; }
    get isZero(): boolean{ return ( this[0] === 0 && this[1] === 0 && this[2] === 0 ); }

    clone(): Vec3{ return new Vec3( this ); }

    minAxis() : number{
        if( this[ 0 ] < this[ 1 ] && this[ 0 ] < this[ 2 ] ) return 0;
        if( this[ 1 ] < this[ 2 ] ) return 1;
        return 2;
    }

    maxAxis() : number{
        if( this[ 0 ] > this[ 1 ] && this[ 0 ] > this[ 2 ] ) return 0;
        if( this[ 1 ] > this[ 2 ] ) return 1;
        return 2;
    }
    // #endregion

    // #region SETTERS
    xyz( x:number, y:number, z:number ): this{
        this[ 0 ] = x;
        this[ 1 ] = y;
        this[ 2 ] = z;
        return this;
    }

    copy( a: ConstVec3 ): this{
        this[ 0 ] = a[ 0 ];
        this[ 1 ] = a[ 1 ];
        this[ 2 ] = a[ 2 ];
        return this;
    }

    copyTo( a: TVec3 ): this{
        a[ 0 ] = this[ 0 ];
        a[ 1 ] = this[ 1 ];
        a[ 2 ] = this[ 2 ];
        return this;
    }
    
    setInfinite( sign:number=1 ): this{
        this[ 0 ] = Infinity * sign;
        this[ 1 ] = Infinity * sign;
        this[ 2 ] = Infinity * sign;
        return this
    }

    /** Generate a random vector. Can choose per axis range */
    rnd( x0=0, x1=1, y0=0, y1=1, z0=0, z1=1 ): this{
        let t;
        t = Math.random(); this[ 0 ] = x0 * (1-t) + x1 * t;
        t = Math.random(); this[ 1 ] = y0 * (1-t) + y1 * t;
        t = Math.random(); this[ 2 ] = z0 * (1-t) + z1 * t;
        return this;
    }
    // #endregion

    // #region FROM OPERATORS

    fromAdd( a: ConstVec3, b: ConstVec3 ): this{
        this[ 0 ] = a[ 0 ] + b[ 0 ];
        this[ 1 ] = a[ 1 ] + b[ 1 ];
        this[ 2 ] = a[ 2 ] + b[ 2 ];
        return this;
    }

    fromSub( a: ConstVec3, b: ConstVec3 ): this{
        this[ 0 ] = a[ 0 ] - b[ 0 ];
        this[ 1 ] = a[ 1 ] - b[ 1 ];
        this[ 2 ] = a[ 2 ] - b[ 2 ];
        return this;
    }

    fromMul( a: ConstVec3, b: ConstVec3 ): this{
        this[ 0 ] = a[ 0 ] * b[ 0 ];
        this[ 1 ] = a[ 1 ] * b[ 1 ];
        this[ 2 ] = a[ 2 ] * b[ 2 ];
        return this;
    }

    fromScale( a: ConstVec3, s:number ): this{
        this[ 0 ] = a[ 0 ] * s;
        this[ 1 ] = a[ 1 ] * s;
        this[ 2 ] = a[ 2 ] * s;
        return this;
    }

    fromScaleThenAdd( scale: number, a: ConstVec3, b: ConstVec3 ): this{
        this[0] = a[0] * scale + b[0];
        this[1] = a[1] * scale + b[1];
        this[2] = a[2] * scale + b[2];
        return this;
    }

    fromCross( a: ConstVec3, b: ConstVec3 ): this{
        const ax = a[0], ay = a[1], az = a[2],
              bx = b[0], by = b[1], bz = b[2];

        this[ 0 ] = ay * bz - az * by;
        this[ 1 ] = az * bx - ax * bz;
        this[ 2 ] = ax * by - ay * bx;
        return this;
    }

    fromNegate( a: ConstVec3 ): this{
        this[ 0 ] = -a[ 0 ]; 
        this[ 1 ] = -a[ 1 ];
        this[ 2 ] = -a[ 2 ];
        return this;
    }

    fromInvert( a: ConstVec3 ): this{
        this[ 0 ] = 1 / a[0];
        this[ 1 ] = 1 / a[1];
        this[ 2 ] = 1 / a[2];
        return this;
    }

    fromPerpendicular( a: ConstVec3 ): this{
        this[0] = -a[1];
        this[1] =  a[0];
        this[2] =  a[2];
        return this;
    }

    fromQuat( q: ConstVec4, v: ConstVec3 ) : Vec3{
        const qx = q[0], qy = q[1], qz = q[2], qw = q[3],
              vx = v[0], vy = v[1], vz = v[2],
              x1 = qy * vz - qz * vy,
              y1 = qz * vx - qx * vz,
              z1 = qx * vy - qy * vx,
              x2 = qw * x1 + qy * z1 - qz * y1,
              y2 = qw * y1 + qz * x1 - qx * z1,
              z2 = qw * z1 + qx * y1 - qy * x1;
        this[ 0 ] = vx + 2 * x2;
        this[ 1 ] = vy + 2 * y2;
        this[ 2 ] = vz + 2 * z2;
        return this;
    }

    fromPolar( lon: number, lat: number ): this{
        const phi   = ( 90 - lat ) * 0.01745329251, //deg 2 rad
              theta = lon * 0.01745329251,  //( lon + 180 ) * 0.01745329251,
              sp    = Math.sin(phi);

        this[ 0 ] = -sp * Math.sin( theta );
        this[ 1 ] = Math.cos( phi );
        this[ 2 ] = sp * Math.cos( theta );
        return this;
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

    /** Copy data from a struct vector type. ThreeJS compatilbility */
    fromStruct( v: TVec3Struct ) : Vec3{
        this[ 0 ] = v.x; 
        this[ 1 ] = v.y; 
        this[ 2 ] = v.z;
        return this;
    }

    /** Copy data to a struct vector type. ThreeJS compatilbility */
    toStruct( v: TVec3Struct ) : Vec3 {
        v.x = this[ 0 ];
        v.y = this[ 1 ];
        v.z = this[ 2 ];
        return this;
    }

    fromVec2( v: ConstVec2, isYUp=false ) : this{
        this[ 0 ] = v[ 0 ];
        if( isYUp ){
            this[ 1 ] = 0;
            this[ 2 ] = v[ 1 ];
        }else{
            this[ 1 ] = v[ 1 ];
            this[ 2 ] = 0;
        }
        return this;
    }

    fromNorm( v: ConstVec3 ): this {
        let mag = Math.sqrt( v[ 0 ]**2 + v[ 1 ]**2 + v[ 2 ]**2 );
        if( mag == 0 ) return this;

        mag = 1 / mag;
        this[ 0 ] = v[ 0 ] * mag;
        this[ 1 ] = v[ 1 ] * mag;
        this[ 2 ] = v[ 2 ] * mag;
        return this;
    }

    fromTriNorm( a:TVec3, b:TVec3, c:TVec3 ): this{
        const ab = new Vec3().fromSub( b, a );
        const ac = new Vec3().fromSub( c, a );
        return this.fromCross( ab, ac ).norm();
    }

    fromAxisAngle( axis: TVec3, rad: number, v=Vec3.FORWARD ) : Vec3{
        // Rodrigues Rotation formula:
        // v_rot = v * cos(theta) + cross( axis, v ) * sin(theta) + axis * dot( axis, v) * (1-cos(theta))
        const cp    = new Vec3().fromCross( axis, v ),
              dot   = Vec3.dot( axis, v ),
              s     = Math.sin( rad ),
              c     = Math.cos( rad ),
              ci    = 1 - c;

        this[ 0 ] = v[ 0 ] * c + cp[ 0 ] * s + axis[ 0 ] * dot * ci;
        this[ 1 ] = v[ 1 ] * c + cp[ 1 ] * s + axis[ 1 ] * dot * ci;
        this[ 2 ] = v[ 2 ] * c + cp[ 2 ] * s + axis[ 2 ] * dot * ci;
        return this;
    }

   /*
    OrthogonalBasis( v )
    a = Orthogonal( v );
    b = Cross( a, v );
    */
    fromOrthogonal( v: TVec3 ) : this{
        if( v[0] >= 0.57735026919 ){
            this[ 0 ] =  v[ 1 ];
            this[ 1 ] = -v[ 0 ];
            this[ 2 ] =  0;
        }else{
            this[ 0 ] =  0;
            this[ 1 ] =  v[ 2 ];
            this[ 2 ] = -v[ 1 ];
        }
        return this;
    }

    // https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector3.cs
    fromReflect( dir: TVec3, norm: TVec3 ) : this{
        const factor = -2 * Vec3.dot( norm, dir );
        this[ 0 ] = factor * norm[ 0 ] + dir[ 0 ];
        this[ 1 ] = factor * norm[ 1 ] + dir[ 1 ];
        this[ 2 ] = factor * norm[ 2 ] + dir[ 2 ];
        return this;
    }

    /** Project Postion onto a Plane */
    fromPlaneProj( v:TVec3, planeNorm: TVec3, planePos: TVec3 ): this{
        const planeConst    = -Vec3.dot( planePos, planeNorm );
        const scl           = Vec3.dot( planeNorm, v ) + planeConst;
        this.fromScale( planeNorm, -scl ).add( v );
        return this;
    }

    // #endregion

    // #region LOADING / CONVERSION
    /** Used to get data from a flat buffer */
    fromBuf( ary: Array<number> | Float32Array, idx: number ): this{
        this[ 0 ] = ary[ idx ];
        this[ 1 ] = ary[ idx + 1 ];
        this[ 2 ] = ary[ idx + 2 ];
        return this;
    }

    /** Put data into a flat buffer */
    toBuf( ary : Array<number> | Float32Array, idx: number ): this{ 
        ary[ idx ]     = this[ 0 ];
        ary[ idx + 1 ] = this[ 1 ];
        ary[ idx + 2 ] = this[ 2 ];
        return this;
    }

    pushTo( ary: Array<number> ): this {
        ary.push( this[ 0 ], this[ 1 ], this[ 2 ] );
        return this;
    }
    // #endregion

    // #region INTERPOLATION SETTERS
    fromLerp( a: ConstVec3, b: ConstVec3, t: number ): this{
        const ti  = 1 - t;
        this[ 0 ] = a[ 0 ] * ti + b[ 0 ] * t;
        this[ 1 ] = a[ 1 ] * ti + b[ 1 ] * t;
        this[ 2 ] = a[ 2 ] * ti + b[ 2 ] * t;
        return this;
    }

    fromNLerp( a: TVec3, b: TVec3, t: number ) : Vec3 {
        const ti = 1 - t; // Linear Interpolation : (1 - t) * v0 + t * v1;
        this[ 0 ] = a[ 0 ] * ti + b[ 0 ] * t;
        this[ 1 ] = a[ 1 ] * ti + b[ 1 ] * t;
        this[ 2 ] = a[ 2 ] * ti + b[ 2 ] * t;
        this.norm();
        return this;
    }

    fromSlerp( a: TVec3, b: TVec3, t: number ) : Vec3 {
        const angle  = Math.acos( Math.min( Math.max( Vec3.dot( a, b ), -1 ), 1 ) );
        const sin    = Math.sin( angle);
        const ta     = Math.sin(( 1 - t ) * angle ) / sin;
        const tb     = Math.sin( t * angle ) / sin;
        
        this[ 0 ] = ta * a[ 0 ] + tb * b[ 0 ];
        this[ 1 ] = ta * a[ 1 ] + tb * b[ 1 ];
        this[ 2 ] = ta * a[ 2 ] + tb * b[ 2 ];
        return this;
    }
    
    fromHermite( a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number ) : Vec3 {
        const tt = t * t;
        const f1 = tt * (2 * t - 3) + 1;
        const f2 = tt * (t - 2) + t;
        const f3 = tt * (t - 1);
        const f4 = tt * (3 - 2 * t);

        this[ 0 ] = a[ 0 ] * f1 + b[ 0 ] * f2 + c[ 0 ] * f3 + d[ 0 ] * f4;
        this[ 1 ] = a[ 1 ] * f1 + b[ 1 ] * f2 + c[ 1 ] * f3 + d[ 1 ] * f4;
        this[ 2 ] = a[ 2 ] * f1 + b[ 2 ] * f2 + c[ 2 ] * f3 + d[ 2 ] * f4;  
        return this;
    }

    fromBezier( a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number ) : Vec3 {
        const it  = 1 - t;
        const it2 = it * it;
        const tt  = t * t;
        const f1  = it2 * it;
        const f2  = 3 * t * it2;
        const f3  = 3 * tt * it;
        const f4  = tt * t;

        this[ 0 ] = a[ 0 ] * f1 + b[ 0 ] * f2 + c[ 0 ] * f3 + d[ 0 ] * f4;
        this[ 1 ] = a[ 1 ] * f1 + b[ 1 ] * f2 + c[ 1 ] * f3 + d[ 1 ] * f4;
        this[ 2 ] = a[ 2 ] * f1 + b[ 2 ] * f2 + c[ 2 ] * f3 + d[ 2 ] * f4;
        return this;
    }

    fromCubic( a: TVec3, b: TVec3, c: TVec3, d: TVec3, t: number ) : Vec3{
        const t2 = t * t,
              t3 = t * t2,
              a0 = d[ 0 ] - c[ 0 ] - a[ 0 ] + b[ 0 ],
              a1 = d[ 1 ] - c[ 1 ] - a[ 1 ] + b[ 1 ],
              a2 = d[ 2 ] - c[ 2 ] - a[ 2 ] + b[ 2 ];
        this[ 0 ] = a0*t3 + ( a[ 0 ] - b[ 0 ] - a0 )*t2 + ( c[ 0 ] - a[ 0 ] )*t + b[ 0 ];
        this[ 1 ] = a1*t3 + ( a[ 1 ] - b[ 1 ] - a1 )*t2 + ( c[ 1 ] - a[ 1 ] )*t + b[ 1 ];
        this[ 2 ] = a2*t3 + ( a[ 2 ] - b[ 2 ] - a2 )*t2 + ( c[ 2 ] - a[ 2 ] )*t + b[ 2 ];
        return this;
    }
    // #endregion

    // #region OPERATORS
    add( a: ConstVec3 ): this{
        this[ 0 ] += a[ 0 ];
        this[ 1 ] += a[ 1 ];
        this[ 2 ] += a[ 2 ];
        return this;
    }

    sub( v: ConstVec3 ): this{
        this[ 0 ] -= v[ 0 ];
        this[ 1 ] -= v[ 1 ];
        this[ 2 ] -= v[ 2 ];
        return this;
    }

    mul( v: ConstVec3 ): this{
        this[ 0 ] *= v[ 0 ];
        this[ 1 ] *= v[ 1 ];
        this[ 2 ] *= v[ 2 ];
        return this;
    }

    div( v: ConstVec3 ): this{
        this[ 0 ] /= v[ 0 ];
        this[ 1 ] /= v[ 1 ];
        this[ 2 ] /= v[ 2 ];
        return this;
    }

    scale( v: number ): this{
        this[ 0 ] *= v;
        this[ 1 ] *= v;
        this[ 2 ] *= v;
        return this;
    }

    divScale( v: number ): this{
        this[ 0 ] /= v;
        this[ 1 ] /= v;
        this[ 2 ] /= v;
        return this;
    }

    addScaled( a: ConstVec3, s: number ): this{
        this[ 0 ] += a[ 0 ] * s;
        this[ 1 ] += a[ 1 ] * s;
        this[ 2 ] += a[ 2 ] * s;
        return this;
    }

    invert(): this{
        this[0] = 1 / this[0];
        this[1] = 1 / this[1];
        this[2] = 1 / this[2];
        return this;
    }

    norm(): this{
        let mag = Math.sqrt( this[0]**2 + this[1]**2 + this[2]**2 );
        if( mag != 0 ){
            mag      = 1 / mag;
            this[ 0 ] *= mag;
            this[ 1 ] *= mag;
            this[ 2 ] *= mag;
        }
        return this;
    }

    cross( b: ConstVec3 ): this{
        const ax = this[0], ay = this[1], az = this[2],
              bx = b[0],    by = b[1],    bz = b[2];

        this[ 0 ] = ay * bz - az * by;
        this[ 1 ] = az * bx - ax * bz;
        this[ 2 ] = ax * by - ay * bx;
        return this;
    }

    abs(): this{ 
        this[ 0 ] = Math.abs( this[ 0 ] );
        this[ 1 ] = Math.abs( this[ 1 ] );
        this[ 2 ] = Math.abs( this[ 2 ] );
        return this;
    }

    floor(): this{
        this[ 0 ] = Math.floor( this[ 0 ] );
        this[ 1 ] = Math.floor( this[ 1 ] );
        this[ 2 ] = Math.floor( this[ 2 ] );
        return this;
    }

    ceil(): this{
        this[ 0 ] = Math.ceil( this[ 0 ] );
        this[ 1 ] = Math.ceil( this[ 1 ] );
        this[ 2 ] = Math.ceil( this[ 2 ] );
        return this;
    }

    min( a: ConstVec3 ) : this{
        this[ 0 ] = Math.min( this[ 0 ], a[ 0 ] );
        this[ 1 ] = Math.min( this[ 1 ], a[ 1 ] );
        this[ 2 ] = Math.min( this[ 2 ], a[ 2 ] );
        return this;
    }

    max( a: ConstVec3 ) : this{
        this[ 0 ] = Math.max( this[ 0 ], a[ 0 ] );
        this[ 1 ] = Math.max( this[ 1 ], a[ 1 ] );
        this[ 2 ] = Math.max( this[ 2 ], a[ 2 ] );
        return this;
    }

    /** When values are very small, like less then 0.000001, just make it zero */
    nearZero(): this{
        if( Math.abs( this[ 0 ] ) <= 1e-6 ) this[ 0 ] = 0;
        if( Math.abs( this[ 1 ] ) <= 1e-6 ) this[ 1 ] = 0;
        if( Math.abs( this[ 2 ] ) <= 1e-6 ) this[ 2 ] = 0;
        return this;
    }

    negate(): this{
        this[ 0 ] = -this[ 0 ];
        this[ 1 ] = -this[ 1 ];
        this[ 2 ] = -this[ 2 ];
        return this;
    }

    snap( v: ConstVec3 ) : Vec3 {
        this[ 0 ] = ( v[ 0 ] != 0 )? Math.floor( this[ 0 ] / v[ 0 ] ) * v[ 0 ] : 0;
        this[ 1 ] = ( v[ 1 ] != 0 )? Math.floor( this[ 1 ] / v[ 1 ] ) * v[ 1 ] : 0;
        this[ 2 ] = ( v[ 2 ] != 0 )? Math.floor( this[ 2 ] / v[ 2 ] ) * v[ 2 ] : 0;
        return this;
    }

    clamp( min: ConstVec3, max: ConstVec3 ): this{
        this[ 0 ] = Math.min( Math.max( this[ 0 ], min[ 0 ] ), max[ 0 ] );
        this[ 1 ] = Math.min( Math.max( this[ 1 ], min[ 1 ] ), max[ 1 ] );
        this[ 2 ] = Math.min( Math.max( this[ 2 ], min[ 2 ] ), max[ 2 ] );
        return this;
    }

    // http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
    damp( v:TVec3, lambda: number, dt: number ): this{
        const t  = Math.exp( - lambda * dt );
        const ti = 1 - t;

        this[0] = this[0] * t + v[0] * ti;
        this[1] = this[1] * t + v[1] * ti;
        this[2] = this[2] * t + v[2] * ti;
        return this;
    }

    dot( b: ConstVec3 ): number{ return this[ 0 ] * b[ 0 ] + this[ 1 ] * b[ 1 ] + this[ 2 ] * b[ 2 ]; } 
    // #endregion

    // #region TRANFORMS
    axisAngle( axis: ConstVec3, rad: number ): this{
        // Rodrigues Rotation formula:
        // v_rot = v * cos(theta) + cross( axis, v ) * sin(theta) + axis * dot( axis, v) * (1-cos(theta))
        const cp  = new Vec3().fromCross( axis, this ),
              dot = Vec3.dot( axis, this ),
              s   = Math.sin(rad),
              c   = Math.cos(rad),
              ci  = 1 - c;

        this[ 0 ] = this[ 0 ] * c + cp[ 0 ] * s + axis[ 0 ] * dot * ci;
        this[ 1 ] = this[ 1 ] * c + cp[ 1 ] * s + axis[ 1 ] * dot * ci;
        this[ 2 ] = this[ 2 ] * c + cp[ 2 ] * s + axis[ 2 ] * dot * ci;
        return this;
    }

    rotate( rad: number, axis="x" ): this{
        // https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
        const sin = Math.sin( rad ),
              cos = Math.cos( rad ),
              x   = this[ 0 ],
              y   = this[ 1 ],
              z   = this[ 2 ];

        switch( axis ){
            case "y": //..........................
                this[ 0 ] = z * sin + x * cos; //x
                this[ 2 ] = z * cos - x * sin; //z
            break;
            case "x": //..........................
                this[ 1 ] = y * cos - z * sin; //y
                this[ 2 ] = y * sin + z * cos; //z
            break;
            case "z": //..........................
                this[ 0 ] = x * cos - y * sin; //x
                this[ 1 ] = x * sin + y * cos; //y
            break;
        }

        return this;
    }

    transformQuat( q: ConstVec4 ): this{ 
        const qx = q[ 0 ],    qy = q[ 1 ],    qz = q[ 2 ], qw = q[ 3 ],
              vx = this[ 0 ], vy = this[ 1 ], vz = this[ 2 ],
              x1 = qy * vz - qz * vy,
              y1 = qz * vx - qx * vz,
              z1 = qx * vy - qy * vx,
              x2 = qw * x1 + qy * z1 - qz * y1,
              y2 = qw * y1 + qz * x1 - qx * z1,
              z2 = qw * z1 + qx * y1 - qy * x1;
        this[ 0 ] = vx + 2 * x2;
        this[ 1 ] = vy + 2 * y2;
        this[ 2 ] = vz + 2 * z2;
        return this;
    }

    transformMat3( m : Array<number> | Float32Array ): this{
        const   x = this[ 0 ], 
                y = this[ 1 ],
                z = this[ 2 ];
        this[ 0 ] = x * m[ 0 ] + y * m[ 3 ] + z * m[ 6 ];
        this[ 1 ] = x * m[ 1 ] + y * m[ 4 ] + z * m[ 7 ];
        this[ 2 ] = x * m[ 2 ] + y * m[ 5 ] + z * m[ 8 ];
        return this;
    }

    transformMat4( m : Array<number> | Float32Array ): this{
        const   x = this[ 0 ], 
                y = this[ 1 ], 
                z = this[ 2 ],
                w = ( m[3 ] * x + m[ 7 ] * y + m[ 11 ] * z + m[ 15 ] ) || 1.0;

        this[ 0 ] = ( m[ 0 ] * x + m[ 4 ] * y + m[ 8 ]  * z + m[ 12 ] ) / w;
        this[ 1 ] = ( m[ 1 ] * x + m[ 5 ] * y + m[ 9 ]  * z + m[ 13 ] ) / w;
        this[ 2 ] = ( m[ 2 ] * x + m[ 6 ] * y + m[ 10 ] * z + m[ 14 ] ) / w;
        return this;
    }
    // #endregion

    // #region STATIC    
    static len( a: ConstVec3 ): number{ return Math.sqrt( a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]** 2 ); }
    static lenSqr( a: ConstVec3 ): number{ return a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]** 2; }

    static dist( a: ConstVec3, b: ConstVec3 ): number{ return Math.sqrt( (a[ 0 ]-b[ 0 ]) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2 + (a[ 2 ]-b[ 2 ]) ** 2 ); }
    static distSqr( a: ConstVec3, b: ConstVec3 ): number{ return (a[ 0 ]-b[ 0 ]) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2 + (a[ 2 ]-b[ 2 ]) ** 2; }

    static dot( a: ConstVec3, b: ConstVec3 ): number { return a[ 0 ] * b[ 0 ] + a[ 1 ] * b[ 1 ] + a[ 2 ] * b[ 2 ]; }
    static cross( a: ConstVec3, b: ConstVec3, out: TVec3 = new Vec3() ): TVec3{
        const ax = a[0], ay = a[1], az = a[2],
              bx = b[0], by = b[1], bz = b[2];

        out[ 0 ] = ay * bz - az * by;
        out[ 1 ] = az * bx - ax * bz;
        out[ 2 ] = ax * by - ay * bx;
        return out;
    }

    static norm( a: TVec3 ): TVec3{
        let mag = Math.sqrt( a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]**2 );
        if( mag != 0 ){
            mag    = 1 / mag;
            a[ 0 ] = a[ 0 ] * mag;
            a[ 1 ] = a[ 1 ] * mag;
            a[ 2 ] = a[ 2 ] * mag;
        }
        return a;
    }

    static angle( a: ConstVec3, b: ConstVec3 ): number{
        //acos(dot(a,b)/(len(a)*len(b))) 
        //let theta = this.dot( a, b ) / ( Math.sqrt( a.lenSqr * b.lenSqr ) );
        //return Math.acos( Math.max( -1, Math.min( 1, theta ) ) ); // clamp ( t, -1, 1 )

        // atan2(len(cross(a,b)),dot(a,b))  
        const d = this.dot( a, b ),
              c = new Vec3().fromCross( a, b );
        return Math.atan2( Vec3.len(c), d ); 

        // This also works, but requires more LEN / SQRT Calls
        // 2 * atan2( ( u * v.len - v * u.len ).len, ( u * v.len + v * u.len ).len );

        //https://math.stackexchange.com/questions/1143354/numerically-stable-method-for-angle-between-3d-vectors/1782769
        // θ=2 atan2(|| ||v||u−||u||v ||, || ||v||u+||u||v ||)

        //let cosine = this.dot( a, b );
        //if(cosine > 1.0) return 0;
        //else if(cosine < -1.0) return Math.PI;
        //else return Math.acos( cosine / ( Math.sqrt( a.lenSqr * b.lenSqr() ) ) );
    }

    /*
    static angleTo( from: ConstVec3, to: ConstVec3 ): number{
        // const denom = Math.sqrt( Vec3.lenSqr(from) * Vec3.lenSqr(to) );
        // if( denom < 0.00001 ) return 0;
        
        // const dot  = Math.min( 1, Math.max( -1, Vec3.dot( from, to ) / denom ));
        // const rad  = Math.acos( dot );
        // const sign = Math.sign( // Cross Product
        //     ( from[1] * to[2] - from[2] * to[1] ) + 
        //     ( from[2] * to[0] - from[0] * to[2] ) +
        //     ( from[0] * to[1] - from[1] * to[0] )
        // );

        const d    = this.dot( from, to );
        const c    = new Vec3().fromCross( from, to );
        const rad  = Math.atan2( Vec3.len( c ), d );
        const sign = Math.sign( c[0] + c[1] + c[2] ) || 1;
        return rad * sign;
    }
    */

    static scaleThenAdd( scale: number, a: ConstVec3, b: ConstVec3, out:TVec3 = new Vec3() ) {
        out[0] = a[0] * scale + b[0];
        out[1] = a[1] * scale + b[1];
        out[2] = a[2] * scale + b[2];
        return out;
    }

    static fromQuat( q: ConstVec4, v: ConstVec3=[0,0,1] ): Vec3{ return new Vec3( v ).transformQuat( q ); }

    static iterBuf( buf: Array<number> | Float32Array ) : { [Symbol.iterator]() : { next:()=>{ value:Vec3, done:boolean } } } {
        let   i       = 0;
        const result  = { value:new Vec3(), done:false },
              len     = buf.length,
              next    = ()=>{
                if( i >= len ) result.done = true;
                else{
                    result.value.fromBuf( buf, i );
                    i += 3;
                }
                return result;
              };
        return { [Symbol.iterator](){ return { next }; } };
    }

    /*
    static smoothDamp( cur: ConstVec3, tar: ConstVec3, vel: TVec3, dt: number, smoothTime: number = 0.25, maxSpeed: number = Infinity ): TVec3{
        // Based on Game Programming Gems 4 Chapter 1.10
        smoothTime   = Math.max( 0.0001, smoothTime );
        const omega  = 2 / smoothTime;
        const x      = omega * dt;
        const exp    = 1 / ( 1 + x + 0.48 * x * x + 0.235 * x * x * x );
    
        const change = vec3.sub( [0,0,0], cur, tar );
    
        // Clamp maximum speed
        const maxChange   = maxSpeed * smoothTime;
        const maxChangeSq = maxChange * maxChange;
        const magnitudeSq = change[0]**2 + change[1]**2 + change[2]**2;
    
        if( magnitudeSq > maxChangeSq ){
            const magnitude = Math.sqrt( magnitudeSq );
            vec3.scale( change, change, 1 / (magnitude * maxChange ) );
        }
    
        const diff = vec3.sub( [0,0,0], cur, change );
    
        // const tempX = ( velocity.x + omega * changeX ) * deltaTime;
        const temp  = vec3.scaleAndAdd( [0,0,0], vel, change, omega );
        vec3.scale( temp, temp, dt );
    
        // velocityR.x = ( velocity.x - omega * tempX ) * exp;
        vec3.scaleAndAdd( vel, vel, temp, -omega );
        vec3.scale( vel, vel, exp );
    
        // out.x = targetX + ( changeX + tempX ) * exp;
        const out = vec3.add( [0,0,0], change, temp );
        vec3.scale( out, out, exp );
        vec3.add( out, diff, out );
    
        // Prevent overshooting
        const origMinusCurrent = vec3.sub( [0,0,0], tar, cur );
        const outMinusOrig     = vec3.sub( [0,0,0], out, tar );
        if( origMinusCurrent[0] * outMinusOrig[0] + origMinusCurrent[1] * outMinusOrig[1] +  origMinusCurrent[2] * outMinusOrig[2] > -0.00001 ){
            vec3.copy( out, tar );
            vec3.copy( vel, [0,0,0] );
        }
    
        return out;
    }
    */

    // #endregion
}