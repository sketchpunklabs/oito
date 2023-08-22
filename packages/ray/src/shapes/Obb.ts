import { Vec3 } from '@oito/oop';

export default class Obb{
    // #region MAIN
    center  = new Vec3();
    extents = new Vec3(1,1,1);
    xAxis   = new Vec3(1,0,0);
    yAxis   = new Vec3(0,1,0);
    zAxis   = new Vec3(0,0,1);
    // constructor(){}
    // #endregion

    // #region GETTERS // SETTERS
    fromQuat( q: ConstVec4 ): this{
        this.xAxis.fromQuat( q, [1,0,0] );
        this.yAxis.fromQuat( q, [0,1,0] );
        this.zAxis.fromQuat( q, [0,0,1] );
        return this;
    }

    fromAABB( min: ConstVec3, max: ConstVec3 ): this{
        this.xAxis.xyz( 1, 0, 0 );
        this.yAxis.xyz( 0, 1, 0 );
        this.zAxis.xyz( 0, 0, 1 );
        
        this.center.fromLerp( min, max, 0.5 );

        this.extents.xyz(
            ( max[0] - min[0] ) * 0.5,
            ( max[1] - min[1] ) * 0.5,
            ( max[2] - min[2] ) * 0.5,
        );

        return this;
    }

    getCorners(): Array< TVec3 >{
        // Alias
        const c  = this.center;
        const h  = this.extents;
        const xx = this.xAxis;
        const yy = this.yAxis;
        const zz = this.zAxis;

        // Axes * Half Lengths
        const x  = [ xx[0] * h[0], xx[1] * h[0], xx[2] * h[0] ];
        const y  = [ yy[0] * h[1], yy[1] * h[1], yy[2] * h[1] ];
        const z  = [ zz[0] * h[2], zz[1] * h[2], zz[2] * h[2] ];
        
        // Points, BACK - TOP LEFT then CCW Around, same for Front
        const ba = [ (c[0] - x[0] + y[0] - z[0]), (c[1] - x[1] + y[1] - z[1]), (c[2] - x[2] + y[2] - z[2]) ];
        const bb = [ (c[0] - x[0] - y[0] - z[0]), (c[1] - x[1] - y[1] - z[1]), (c[2] - x[2] - y[2] - z[2]) ];
        const bc = [ (c[0] + x[0] - y[0] - z[0]), (c[1] + x[1] - y[1] - z[1]), (c[2] + x[2] - y[2] - z[2]) ];
        const bd = [ (c[0] + x[0] + y[0] - z[0]), (c[1] + x[1] + y[1] - z[1]), (c[2] + x[2] + y[2] - z[2]) ];
        const fa = [ (c[0] - x[0] + y[0] + z[0]), (c[1] - x[1] + y[1] + z[1]), (c[2] - x[2] + y[2] + z[2]) ];
        const fb = [ (c[0] - x[0] - y[0] + z[0]), (c[1] - x[1] - y[1] + z[1]), (c[2] - x[2] - y[2] + z[2]) ];
        const fc = [ (c[0] + x[0] - y[0] + z[0]), (c[1] + x[1] - y[1] + z[1]), (c[2] + x[2] - y[2] + z[2]) ];
        const fd = [ (c[0] + x[0] + y[0] + z[0]), (c[1] + x[1] + y[1] + z[1]), (c[2] + x[2] + y[2] + z[2]) ];

        return [ ba, bb, bc, bd, fa, fb, fc, fd ];
    }

    // getQuat()=> Quat.fromAxes( this.xAxis, this.yAxis, this.zAxis )

    // // Get the smallest possible sphere to contain
    // // https://github.com/juj/MathGeoLib/blob/master/src/Geometry/OBB.cpp#L245
    // getMinimalEnclosingSphere(){
    //     const xp    = vec3.scale( [0,0,0], this.xAxis, this.half[0] );
    //     const yp    = vec3.scale( [0,0,0], this.yAxis, this.half[1] );
    //     const zp    = vec3.scale( [0,0,0], this.zAxis, this.half[2] );
    //     const v     = vec3_sum( [0,0,0], xp, yp, zp );
    //     return new Sphere( this.pos, vec3.len( v ) );
    // }

    // // Maxium possible sphere that fits inside the box
    // // https://github.com/juj/MathGeoLib/blob/master/src/Geometry/OBB.cpp#L253
    // getMaximalContainedSphere(){
    //     return new Sphere( this.pos, Math.min( this.half[0], this.half[1], this.half[2] ) );
    // }

    // #endregion
}