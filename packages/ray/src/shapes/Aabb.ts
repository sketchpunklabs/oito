import { Vec3 } from '@oito/oop';

export default class Aabb{
    // #region MAIN
    center  = new Vec3();
    min     = new Vec3( -1,-1,-1 );
    max     = new Vec3( 1, 1, 1 );
    // constructor(){}
    // #endregion

    // #region GETTERS // SETTERS
    
    setBounds( min: ConstVec3, max: ConstVec3 ): this{
        this.min.copy( min );
        this.max.copy( max );
        this.center.fromLerp( min, max, 0.5 );
        return this;
    }

    getSize( out=[0,0,0] ){
        out[ 0 ] = this.max[ 0 ] - this.min[ 0 ];
        out[ 1 ] = this.max[ 1 ] - this.min[ 1 ];
        out[ 2 ] = this.max[ 2 ] - this.min[ 2 ];
        return out;
    }

    getHalfSize( out=[0,0,0] ){
        out[ 0 ] = ( this.max[ 0 ] - this.min[ 0 ] ) * 0.5;
        out[ 1 ] = ( this.max[ 1 ] - this.min[ 1 ] ) * 0.5;
        out[ 2 ] = ( this.max[ 2 ] - this.min[ 2 ] ) * 0.5;
        return out;
    }

    getCorners(): Array< TVec3 >{
        const x1 = this.min[0], y1 = this.min[1], z1 = this.min[2];
        const x2 = this.max[0], y2 = this.max[1], z2 = this.max[2];

        // Bottom Face, start at Back-Left, CCW Around
        const b0 = [x1,y1,z1]; 
        const b1 = [x1,y1,z2];
        const b2 = [x2,y1,z2];
        const b3 = [x2,y1,z1];

        // Top Face
        const t0 = [x1,y2,z1];
        const t1 = [x1,y2,z2];
        const t2 = [x2,y2,z2];
        const t3 = [x2,y2,z1];
        
        return [ b0, b1, b2, b3, t0, t1, t2, t3 ];
    }

    // // https://github.com/juj/MathGeoLib/blob/master/src/Geometry/AABB.cpp#L155
    // getMinimalEnclosingSphere(){
    //     const radius = vec3.len( this.getSize() ) * 0.5;
    //     return new Sphere( this.getCenter(), radius );
    // }

    // // https://github.com/juj/MathGeoLib/blob/master/src/Geometry/AABB.cpp#L160
    // getMaximalContainedSphere(){
    //     const half = this.getHalfSize();
    //     return new Sphere( this.getCenter(), Math.in( half[0],half[1],half[2] ) );
    // }

    // #endregion
}