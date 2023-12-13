import Vec3 from './Vec3';
import Quat from './Quat';

// https://gabormakesgames.com/blog_transforms_transforms.html
// https://gabormakesgames.com/blog_transforms_transform_world.html

export default class Transform{
    // #region MAIN
    rot	= new Quat();
    pos	= new Vec3( 0 );
    scl = new Vec3( 1 );

    constructor()
    constructor( tran: Transform )
    constructor( rot: ConstVec4, pos: ConstVec3, scl: ConstVec3 )
    constructor( rot ?: ConstVec4 | Transform, pos ?: ConstVec3, scl ?: ConstVec3 ){
        if( rot instanceof Transform )  this.copy( rot );
        else if( rot && pos && scl )    this.set( rot, pos, scl );
    }
    // #endregion

    // #region SETTERS / GETTERS
    reset(): this{
        this.rot[0] = 0;
        this.rot[1] = 0;
        this.rot[2] = 0;
        this.rot[3] = 1;
        this.pos[0] = 0;
        this.pos[1] = 0;
        this.pos[2] = 0;
        this.scl[0] = 1;
        this.scl[1] = 1;
        this.scl[2] = 1;
        return this;
    }

    copy( t: Readonly<Transform> ): this{
        this.rot[0] = t.rot[0];
        this.rot[1] = t.rot[1];
        this.rot[2] = t.rot[2];
        this.rot[3] = t.rot[3];
        this.pos[0] = t.pos[0];
        this.pos[1] = t.pos[1];
        this.pos[2] = t.pos[2];
        this.scl[0] = t.scl[0];
        this.scl[1] = t.scl[1];
        this.scl[2] = t.scl[2];
        return this;
    }

    set( r ?: ConstVec4, p ?: ConstVec3, s ?: ConstVec3 ): this{
        if( r ){
            this.rot[0] = r[0];
            this.rot[1] = r[1];
            this.rot[2] = r[2];
            this.rot[3] = r[3];
        }
        if( p ){
            this.pos[0] = p[0];
            this.pos[1] = p[1];
            this.pos[2] = p[2];
        }
        if( s ){
            this.scl[0] = s[0];
            this.scl[1] = s[1];
            this.scl[2] = s[2];
        }
        return this;
    }

    clone() : Transform{ return new Transform( this ); }
    // #endregion

    // #region OPERATORS

    // Computing Transforms, Parent -> Child
    mul( tran: Transform ) : this
    mul( cr: ConstVec4, cp: TVec3, cs ?: TVec3 ) : this
    mul( cr: ConstVec4 | Transform, cp ?: TVec3, cs ?: TVec3 ) : this{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // If just passing in Tranform Object
        if( cr instanceof Transform ){
            cp = cr.pos;
            cs = cr.scl;
            cr = cr.rot;
        }

        if( cr && cp ){
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // POSITION - parent.position + ( parent.rotation * ( parent.scale * child.position ) )
            // this.pos.add( new Vec3( this.scl ).mul( cp ).transformQuat( this.rot ) );
            const p = [
                cp[0] * this.scl[0],        // Scale
                cp[1] * this.scl[1],
                cp[2] * this.scl[2],
            ];
            transformQuat( p, this.rot );   // Rotation
            this.pos[0] += p[0];            // Translation
            this.pos[1] += p[1];
            this.pos[2] += p[2];
        
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // SCALE - parent.scale * child.scale
            // if( cs ) this.scl.mul( cs );
            if( cs ){
                this.scl[0] *= cs[0];
                this.scl[1] *= cs[1];
                this.scl[2] *= cs[2];
            }

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // ROTATION - parent.rotation * child.rotation
            // this.rot.mul( cr );
            quatMul( this.rot, cr, this.rot );
        }

        return this;
    }

    // Computing Transforms in reverse, Child - > Parent
    pmul( tran: Transform ) : this
    pmul( pr: ConstVec4, pp: TVec3, ps: TVec3 ) : this
    pmul( pr: ConstVec4 | Transform, pp ?: TVec3, ps ?: TVec3 ): this{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // If just passing in Tranform Object
        if( pr instanceof Transform ){
            pp = pr.pos;
            ps = pr.scl;
            pr = pr.rot;
        }

        if( !pr || !pp || !ps ) return this;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // POSITION - parent.position + ( parent.rotation * ( parent.scale * child.position ) )
        // The only difference for this func, We use the IN.scl & IN.rot instead of THIS.scl * THIS.rot
        // Consider that this Object is the child and the input is the Parent.
        // this.pos.mul( ps ).transformQuat( pr ).add( pp );
        this.pos[0] *= ps[0];           // Scale
        this.pos[1] *= ps[1];
        this.pos[2] *= ps[2];
        transformQuat( this.pos, pr );  // Rotation
        this.pos[0] += pp[0];           // Translation
        this.pos[1] += pp[1];
        this.pos[2] += pp[2];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // SCALE - parent.scale * child.scale
        // if( ps ) this.scl.mul( ps );
        if( ps ){
            this.scl[0] *= ps[0];
            this.scl[1] *= ps[1];
            this.scl[2] *= ps[2];
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ROTATION - parent.rotation * child.rotation
        // this.rot.pmul( pr ); // Must Rotate from Parent->Child, need PMUL
        quatMul( pr, this.rot, this.rot ); // Must Rotate from Parent->Child, need PMUL
        return this
    }

    addPos( cp: TVec3, ignoreScl=false ): this{
        //POSITION - parent.position + ( parent.rotation * ( parent.scale * child.position ) )
        if( ignoreScl )	this.pos.add( new Vec3().fromQuat( this.rot, cp ) );
        else 			this.pos.add( new Vec3().fromMul( cp, this.scl ).transformQuat( this.rot ) );
        return this;
    }

    pivotRot( pivot: ConstVec3, q: ConstVec4 ): this{
        this.rot.pmul( q );             // Apply rotation 
                      
        const offset = new Vec3()
            .fromSub( this.pos, pivot ) // Get Pivot Offset
            .transformQuat( q );        // Rotate the Pivot Offset
        
        // Pre-Add Pivot back to offset
        this.pos[0] = pivot[0] + offset[0];
        this.pos[1] = pivot[1] + offset[1];
        this.pos[2] = pivot[2] + offset[2];
        
        return this
    }
    // #endregion

    // #region FROM OPERATORS
    fromMul( tp: Transform, tc: Transform ): this{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // POSITION - parent.position + (  ( parent.scale * child.position ) * parent.rotation )
        // const v = new Vec3()
        //     .fromMul( tp.scl, tc.pos ) // parent.scale * child.position
        //     .transformQuat( tp.rot );  // * parent.rotation
        // this.pos.fromAdd( tp.pos, v ); // parent.position +
        const v = [                         // parent.scale * child.position
            tp.scl[0] * tc.pos[0],
            tp.scl[1] * tc.pos[1],
            tp.scl[2] * tc.pos[2],
        ];
        transformQuat( v, tp.rot );         // * parent.rotation
        this.pos[0] = tp.pos[0] + v[0];     // parent.position +
        this.pos[1] = tp.pos[1] + v[1];
        this.pos[2] = tp.pos[2] + v[2];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // SCALE - parent.scale * child.scale
        // this.scl.fromMul( tp.scl, tc.scl );
        this.scl[0] = tp.scl[0] * tc.scl[0];
        this.scl[1] = tp.scl[1] * tc.scl[1];
        this.scl[2] = tp.scl[2] * tc.scl[2];

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // ROTATION - parent.rotation * child.rotation
        // this.rot.fromMul( tp.rot, tc.rot );
        quatMul( tp.rot, tc.rot, this.rot );

        return this;
    }

    fromInvert( t: Transform ) : this{
        // Invert Rotation
        quatInvert( t.rot, this.rot ); // this.rot.fromInvert( t.rot );

        // Invert Scale this.scl.fromInvert( t.scl );
        this.scl[ 0 ] = 1 / t.scl[0];
        this.scl[ 1 ] = 1 / t.scl[1];
        this.scl[ 2 ] = 1 / t.scl[2];

        // NOTE: This doesn't seem to work in practice when 
        // dealing with scaling and dealing with vec3 transform
        // between world > local. Just negate pos seems to work

        // Invert Position : rotInv * ( invScl * -Pos )
        // this.pos
        //         .fromNegate( t.pos );
        //         // .mul( this.scl )
        //         // .transformQuat( this.rot );

        // this.pos[0] = -t.pos[0] * this.scl[0];
        // this.pos[1] = -t.pos[1] * this.scl[1];
        // this.pos[2] = -t.pos[2] * this.scl[2];
        // transformQuat( this.pos, this.rot );

        this.pos[0] = -t.pos[0];
        this.pos[1] = -t.pos[1];
        this.pos[2] = -t.pos[2];

        return this;
    }
    // #endregion

    // #region TRANSFORMATION
    // Regular Applying transform, Does not work well for inversed transforms
    // when dealing with World to Local Transformation
    transformVec3( v: TVec3, out ?: TVec3 ): TVec3{
        // GLSL - vecQuatRotation(model.rotation, a_position.xyz * model.scale) + model.position;
        // return (out || v).fromMul( v, this.scl ).transformQuat( this.rot ).add( this.pos );

        // Vector * Scale
        const vx = v[0] * this.scl[0];
        const vy = v[1] * this.scl[1];
        const vz = v[2] * this.scl[2];

        // ( Rotation * Vector3 ) + Translation
        const qx = this.rot[0];
        const qy = this.rot[1];
        const qz = this.rot[2];
        const qw = this.rot[3];
        const x1 = qy * vz - qz * vy;
        const y1 = qz * vx - qx * vz;
        const z1 = qx * vy - qy * vx;
        const x2 = qw * x1 + qy * z1 - qz * y1;
        const y2 = qw * y1 + qz * x1 - qx * z1;
        const z2 = qw * z1 + qx * y1 - qy * x1;

        const rtn = out || v;
        rtn[ 0 ]  = ( vx + 2 * x2 ) + this.pos[0];
        rtn[ 1 ]  = ( vy + 2 * y2 ) + this.pos[1];
        rtn[ 2 ]  = ( vz + 2 * z2 ) + this.pos[2];

        return rtn;
    }

    // When using an inversed transform, use this to transform
    // WorldSpace vectors to local space
    transformVec3Rev( v: TVec3, out ?: TVec3 ): TVec3{
        // Translation
        const vx = v[0] + this.pos[0];
        const vy = v[1] + this.pos[1];
        const vz = v[2] + this.pos[2];

        // ( Rotation * Vector3 ) * scale
        const qx = this.rot[0];
        const qy = this.rot[1];
        const qz = this.rot[2];
        const qw = this.rot[3];
        const x1 = qy * vz - qz * vy;
        const y1 = qz * vx - qx * vz;
        const z1 = qx * vy - qy * vx;
        const x2 = qw * x1 + qy * z1 - qz * y1;
        const y2 = qw * y1 + qz * x1 - qx * z1;
        const z2 = qw * z1 + qx * y1 - qy * x1;

        const rtn = out || v;
        rtn[0]    = ( vx + 2 * x2 ) * this.scl[0];
        rtn[1]    = ( vy + 2 * y2 ) * this.scl[1];
        rtn[2]    = ( vz + 2 * z2 ) * this.scl[2];
        return rtn;
    }
    // #endregion
}


// #region INDEPENDANCE FROM VEC3/QUAT
function transformQuat( v:TVec3, q:ConstVec4 ):TVec3{ 
    const qx = q[ 0 ], qy = q[ 1 ], qz = q[ 2 ], qw = q[ 3 ],
          vx = v[ 0 ], vy = v[ 1 ], vz = v[ 2 ],
          x1 = qy * vz - qz * vy,
          y1 = qz * vx - qx * vz,
          z1 = qx * vy - qy * vx,
          x2 = qw * x1 + qy * z1 - qz * y1,
          y2 = qw * y1 + qz * x1 - qx * z1,
          z2 = qw * z1 + qx * y1 - qy * x1;
    v[ 0 ] = vx + 2 * x2;
    v[ 1 ] = vy + 2 * y2;
    v[ 2 ] = vz + 2 * z2;
    return v;
}

function quatInvert( q:ConstVec4, out:TVec4=[0,0,0,1] ): TVec4{
    const a0  = q[0],
          a1  = q[1],
          a2  = q[2],
          a3  = q[3],
          dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;
    
    if( dot == 0 ){ out[0] = out[1] = out[2] = out[3] = 0; return out; }

    const invDot = 1.0 / dot; // let invDot = dot ? 1.0/dot : 0;
    out[ 0 ]     = -a0 * invDot;
    out[ 1 ]     = -a1 * invDot;
    out[ 2 ]     = -a2 * invDot;
    out[ 3 ]     =  a3 * invDot;
    return out;
}

function quatMul( a:ConstVec4, b:ConstVec4, out:TVec4=[0,0,0,1] ):TVec4{
    const ax = a[0], ay = a[1], az = a[2], aw = a[3],
          bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out[ 0 ] = ax * bw + aw * bx + ay * bz - az * by;
    out[ 1 ] = ay * bw + aw * by + az * bx - ax * bz;
    out[ 2 ] = az * bw + aw * bz + ax * by - ay * bx;
    out[ 3 ] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
}
// #endregion