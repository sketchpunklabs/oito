import { Vec3 } from '@oito/oop';

export default class Sphere{
    // #region MAIN
    center = new Vec3();
    radius = 1;
    constructor( pos?: ConstVec3, radius?: number ){
        if( pos )    this.center.copy( pos );
        if( radius ) this.radius = radius;
    }
    // #endregion
}