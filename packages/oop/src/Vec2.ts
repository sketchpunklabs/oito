export default class Vec2 extends Array< number >{

    // #region CONSTRUCTORS 
    constructor()
    constructor( v: ConstVec2 )
    constructor( v: number )
    constructor( x: number, y: number )
    constructor( v ?: ConstVec2 | number, y ?: number){
        super( 2 );
        
        if( v instanceof Vec2 || v instanceof Float32Array || ( v instanceof Array && v.length == 2 )){
            this[ 0 ] = v[ 0 ]; 
            this[ 1 ] = v[ 1 ]; 
        }else if( typeof v === "number" && typeof y === "number" ){
            this[ 0 ] = v;
            this[ 1 ] = y; 
        }else if( typeof v === "number" ){
            this[ 0 ] = v;
            this[ 1 ] = v;
        }else{
            this[ 0 ] = 0;
            this[ 1 ] = 0;
        }
    }
    // #endregion

    // #region SETTERS / GETTERS

    /** Set the vector components */
    xy( x: number ) : this     // Great for using Vec3 for scaling
    xy( x: number, y: number ) : this
    xy( x: number, y?: number ) : this {
        if( y != undefined ){
            this[ 0 ] = x;
            this[ 1 ] = y;
        } else this[ 0 ] = this[ 1 ] = x;

        return this;
    }

    get x() : number { return this[ 0 ]; }
    set x( v: number ){ this[ 0 ] = v; }

    get y() : number { return this[ 1 ]; }
    set y( v: number ){ this[ 1 ] = v; }

    /** Create a new vec3 object with a copy of this vector's data */
    clone(): Vec2 { return new Vec2( this ); }

    copy( v: TVec2 ): this { this[0] = v[0]; this[1] = v[1]; return this; }

    /** Reset all components to zero */
    reset(): this { this[ 0 ] = 0;  this[ 1 ] = 0; return this; }

    /** Convert value to a string value */
    toString( rnd = 0 ): string{
        if( rnd == 0 ) return "[" + this.join(",") + "]";
        else{
            let s = "[";
            for( let i=0; i < 2; i++ ){
                switch( this[i] ){
                    case 0	: s += "0,"; break;
                    case 1	: s += "1,"; break;
                    default	: s += this[ i ].toFixed( rnd ) + ","; break;
                }
            }

            return s.slice(0,-1) + "]";
        }
    }
    
    /** Test if all components equal zero */
    isZero(): boolean { return ( this[ 0 ] == 0 && this[ 1 ] == 0 ); }

    /** When values are very small, like less then 0.000001, just make it zero.*/
    nearZero( x=1e-6, y=1e-6 ): this{
        if( Math.abs( this[0] ) <= x ) this[0] = 0;
        if( Math.abs( this[1] ) <= y ) this[1] = 0;
        return this;
    }

    /** Generate a random vector. Can choose per axis range */
    rnd( x0=0, x1=1, y0=0, y1=1 ): this {
        let t;
        t = Math.random(); this[ 0 ] = x0 * (1-t) + x1 * t;
        t = Math.random(); this[ 1 ] = y0 * (1-t) + y1 * t;
        return this;
    }

    angle( v ?: ConstVec2 ): number{
        return ( v )
            // ? Math.acos( Vec2.dot( this, v ) / ( this.len() * Vec2.len( v ) ) )
            ? Math.atan2( v[1] * this[0] - v[0] * this[1],  v[0] * this[0] + v[1] * this[1] )
            : Math.atan2( this[1], this[0] );
    }

    setLen( len: number ): this{ return this.norm().scale( len ); }
    len(): number { return Math.sqrt( this[0]*this[0] + this[1]*this[1] ); }
    lenSqr(): number{ return this[0]*this[0] + this[1]*this[1]; }

    toVec3( isYUp: boolean = true, n: number = 0 ): TVec3{
        const v = [ this[0], 0, 0 ];
        if( isYUp ){    v[1] = n;          v[2] = this[1]; }
        else{           v[1] = this[1];    v[2] = n; }

        return v;
    }

    // #endregion

    // #region FROM SETTERS / OPERATORS
    fromAngleLen( ang: number, len: number ): this{
        this[0] = len * Math.cos( ang );
        this[1] = len * Math.sin( ang );
        return this;
    }

    fromAdd( a: ConstVec2, b: ConstVec2 ): this{ this[0] = a[0] + b[0]; this[1] = a[1] + b[1]; return this; }
    fromSub( a: ConstVec2, b: ConstVec2 ): this{ this[0] = a[0] - b[0]; this[1] = a[1] - b[1]; return this; }
    fromMul( a: ConstVec2, b: ConstVec2 ): this{ this[0] = a[0] * b[0]; this[1] = a[1] * b[1]; return this; }
    fromScale( a: ConstVec2, s: number ): this{ this[0] = a[0] * s; this[1] = a[1] * s; return this; }
    fromLerp( a: ConstVec2, b: ConstVec2, t: number = 0.5 ): this{
        const tt = 1 - t;
        this[0] = a[0] * tt + b[0] * t;
        this[1] = a[1] * tt + b[1] * t;
        return this;
    }

    fromMax( a: ConstVec2, b: ConstVec2 ): this{
        this[ 0 ] = Math.max( a[ 0 ], b[ 0 ] );
        this[ 1 ] = Math.max( a[ 1 ], b[ 1 ] );
        return this
    }

    fromMin( a: ConstVec2, b: ConstVec2 ): this{
        this[ 0 ] = Math.min( a[ 0 ], b[ 0 ] );
        this[ 1 ] = Math.min( a[ 1 ], b[ 1 ] );
        return this
    }

    fromFloor( v: ConstVec2 ): this{
        this[0] = Math.floor( v[0] );
        this[1] = Math.floor( v[1] );
        return this;
    }

    fromFract( v: ConstVec2 ): this{
        this[0] = v[0] - Math.floor( v[0] );
        this[1] = v[1] - Math.floor( v[1] );
        return this;
    }

    fromNegate( a: ConstVec2 ) : this {
        this[ 0 ] = -a[ 0 ]; 
        this[ 1 ] = -a[ 1 ];
        return this;
    }

    fromInvert( a: ConstVec2 ) : this {
        this[0] = ( a[0] != 0 )? 1 / a[0] : 0;
        this[1] = ( a[1] != 0 )? 1 / a[1] : 0;
        return this;
    }

    fromLineProjecton( from: ConstVec2, to: ConstVec2 ): this{
        // Modified from https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector3.cs#L265
        // dot( a, b ) / dot( b, b ) * b
        const denom = Vec2.dot( to, to );
        if( denom < 0.000001 ) return this;
    
        const scl= Vec2.dot( from, to ) / denom;
        this.fromScale( to, scl ); //xy( to[0] * scl, to[1] * scl );
        return this;
    }

    //++++++++++++++++++++++++++++++++++
    // FLAT BUFFERS

    /** Used to get data from a flat buffer of vectors, useful when building geometery */
    fromBuf( ary : Array<number> | Float32Array, idx: number ) : this {
        this[ 0 ] = ary[ idx ];
        this[ 1 ] = ary[ idx + 1 ];
        return this;
    }

    /** Put data into a flat buffer of vectors, useful when building geometery */
    toBuf( ary : Array<number> | Float32Array, idx: number ) : this { 
        ary[ idx ]     = this[ 0 ]; 
        ary[ idx + 1 ] = this[ 1 ]; 
        return this;
    }

    /** Pust vector components onto an array, useful when building geometery */
    pushTo( ary: Array<number> ) : this {
        ary.push( this[ 0 ], this[ 1 ] );
        return this;
    }

    // #endregion

    // #region MATH OPERATIONS
    add( v: ConstVec2 ): this{ this[0] += v[0]; this[1] += v[1]; return this; }
    sub( v: ConstVec2 ): this{ this[0] -= v[0]; this[1] -= v[1]; return this; }
    mul( v: ConstVec2 ): this{ this[0] *= v[0]; this[1] *= v[1]; return this; }

    div( v: ConstVec2 ): this{
        this[0] = (v[0] != 0)? this[0] / v[0] : 0;
        this[1] = (v[1] != 0)? this[1] / v[1] : 0;
        return this;
    }

    scale( v: number ): this{ this[0] *= v; this[1] *= v; return this; }
    divScale( v: number ): this{ this[0] /= v; this[1] /= v; return this; }

    scaleThenAdd( scale: number, a: ConstVec2, b: ConstVec2 ): this{
        this[0] = a[0] * scale + b[0];
        this[1] = a[1] * scale + b[1];
        this[2] = a[2] * scale + b[2];
        return this;
    }

    floor(): this{
        this[0] = Math.floor( this[0] );
        this[1] = Math.floor( this[1] );
        return this;
    }

    negate(): this{
        this[ 0 ] = -this[ 0 ];
        this[ 1 ] = -this[ 1 ];
        return this;
    }

    min( a: ConstVec2 ): this{
        this[ 0 ] = Math.min( this[ 0 ], a[ 0 ] );
        this[ 1 ] = Math.min( this[ 1 ], a[ 1 ] );
        return this;
    }

    max( a: ConstVec2 ): this{
        this[ 0 ] = Math.max( this[ 0 ], a[ 0 ] );
        this[ 1 ] = Math.max( this[ 1 ], a[ 1 ] );
        return this;
    }
    
    norm(): this{
        const mag = Math.sqrt( this[0]**2 + this[1]**2 );
        if( mag == 0 ) return this;

        this[0] = this[0] / mag;
        this[1] = this[1] / mag;
        return this;
    }

    lerp( v: ConstVec2, t: number ): this{
        const ti = 1 - t;
        this[0]  = this[0] * ti + v[0] * t;
        this[1]  = this[1] * ti + v[1] * t;
        return this;
    }

    rotate( rad: number ): this{
        const cos   = Math.cos( rad ),
              sin   = Math.sin( rad ),
              x     = this[ 0 ],
              y     = this[ 1 ];

        this[0] = x * cos - y * sin;
        this[1] = x * sin + y * cos;
        return this;
    }

    rotateDeg( deg: number ): this{
        const rad   = deg * Math.PI / 180,
              cos   = Math.cos( rad ),
              sin   = Math.sin( rad ),
              x     = this[ 0 ],
              y     = this[ 1 ];

        this[0] = x * cos - y * sin;
        this[1] = x * sin + y * cos;
        return this;
    }

    invert(): this{
        this[0] = 1 / this[0];
        this[1] = 1 / this[1];
        return this;
    }

    rotP90(): this{	     // Perpendicular ClockWise
        const x   = this[ 0 ];
        this[ 0 ] = this[ 1 ];
        this[ 1 ] = -x;
        return this;
    }

    rotN90(): this{	// Perpendicular Counter-ClockWise
        const x   = this[ 0 ];
        this[ 0 ] = -this[ 1 ];
        this[ 1 ] = x;
        return this;
    }

    // #endregion

    // #region STATIC OPERATIONS
    static add( a: ConstVec2, b: ConstVec2 ): Vec2{ return new Vec2().fromAdd( a, b ); }
    static sub( a: ConstVec2, b: ConstVec2 ): Vec2{ return new Vec2().fromSub( a, b ); }
    static scale( v: ConstVec2, s: number): Vec2 { return new Vec2().fromScale( v, s ); }
    static floor( v: ConstVec2 ): Vec2{ return new Vec2().fromFloor( v ); }
    static fract( v: ConstVec2 ): Vec2{ return new Vec2().fromFract( v ); }
    static lerp( v0: ConstVec2, v1: ConstVec2, t: number ): Vec2{ return new Vec2().fromLerp( v0, v1, t ); }

    static len( v0: ConstVec2 ): number{ return Math.sqrt( v0[0]**2 + v0[1]**2 ); }
    static lenSqr( v0: ConstVec2 ): number{ return v0[0]**2 + v0[1]**2; }

    static dist( a: ConstVec3, b: ConstVec3 ): number{ return Math.sqrt( (a[ 0 ]-b[ 0 ] ) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2 ); }
    static distSqr( a: ConstVec3, b: ConstVec3 ): number{ return (a[ 0 ]-b[ 0 ]) ** 2 + (a[ 1 ]-b[ 1 ]) ** 2; }

    static dot( a: ConstVec2, b: ConstVec2 ): number{ return a[0] * b[0] + a[1] * b[1]; }
    static det( a: ConstVec2, b: ConstVec2 ): number{ return a[0] * b[1] - a[1] * b[0]; } // "cross product" / determinant also = len(a)*len(b) * sin( angle );

    static project( from: ConstVec2, to: ConstVec2 ) : Vec2{
        // Modified from https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector3.cs#L265
        // dot( a, b ) / dot( b, b ) * b
        const out   = new Vec2();
        const denom = Vec2.dot( to, to );
        if( denom < 0.000001 ) return out;
    
        const scl	= Vec2.dot( from, to ) / denom;
        return out.fromScale( to, scl ); //xy( to[0] * scl, to[1] * scl );
    }

    static scaleThenAdd( scale: number, a: ConstVec2, b: ConstVec2 ): Vec2{ return new Vec2().scaleThenAdd( scale, a, b ); }

    // From FROM and TO should have the same Origin.
    // FROM is a straight line from origin to plane. May need to do some extra projection to get this value.
    // To is treated like a Ray from the origin.
    static projectPlane( from: ConstVec2, to: ConstVec2, planeNorm: ConstVec2 ): Vec2{
        const out   = new Vec2();
        const denom = Vec2.dot( to, planeNorm );
        if( denom < 0.000001 && denom > -0.000001 ) return out;

        const t = Vec2.dot( from, planeNorm ) / denom;
        return out.fromScale( to, t );
    }

    static rotateDeg( v: TVec2, deg: number ): Vec2{
        const out   = new Vec2();
        const rad   = deg * Math.PI / 180,
              cos   = Math.cos( rad ),
              sin   = Math.sin( rad ),
              x     = v[ 0 ],
              y     = v[ 1 ];

        out[0] = x * cos - y * sin;
        out[1] = x * sin + y * cos;
        return out;
    }

    static rotP90( v: ConstVec2 ): Vec2{
        const out = new Vec2();
        out[ 0 ]  = v[ 1 ];
        out[ 1 ]  = -v[ 0 ];
        return out;
    }

    static rotN90( v: ConstVec2 ): Vec2{
        const out = new Vec2();
        out[ 0 ]  = -v[ 1 ];
        out[ 1 ]  = v[ 0 ];
        return out;
    }

    /** Angle from one vector to another */
    static angleTo( a: ConstVec2, b: ConstVec2 ): number{
        // return Math.acos( a[0] * b[0] + a[1] * b[1] ); Calcs the angle but not right sign from A to B sometimes.
        return Math.atan2( b[1] * a[0] - b[0] * a[1],  b[0] * a[0] + b[1] * a[1] );
    }

    /** Create an Iterator Object that allows an easy way to loop a Float32Buffer
     * @example
     * let buf = new Float32Array( 2 * 10 );
     * for( let v of Vec3.bufIter( buf ) ) console.log( v );
    */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static bufIter( buf : Array<number> | Float32Array ) : { [Symbol.iterator]() : { next:()=>{ value:Vec2, done:boolean } } } {
        let   i       = 0;
        const result  = { value:new Vec2(), done:false },
              len     = buf.length,
              next    = ()=>{
                if( i >= len ) result.done = true;
                else{
                    result.value.fromBuf( buf, i );
                    i += 2;
                }
                return result;
              };
        return { [Symbol.iterator](){ return { next }; } };
    }

    // #endregion

}