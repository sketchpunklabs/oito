export default class Vec3Wizzy{
    // #region SINGLE AXIS ROTATION
    static xp( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = x; o[1] = -z; o[2] = y; return o; }    // x-zy rot x+90
    static xn( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = x; o[1] = z; o[2] = -y; return o; }    // xz-y rot x-90
    
    static yp( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -z; o[1] = y; o[2] = x; return o; }    // -zyx rot y+90
    static yn( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = z; o[1] = y; o[2] = -x; return o; }    // zy-x rot y-90

    static zp( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = y; o[1] = -x; o[2] = z; return o; }    // y-xz rot z+90
    static zn( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -y; o[1] = x; o[2] = z; return o; }    // -yxz rot z-90
    // #endregion

    // #region COMBINATIONS
    static xp_yn( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -y; o[1] = -z; o[2] = x; return o; }     // -y-zx rot x+90, y-90
    static xp_yp( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = y; o[1] = -z; o[2] = -x; return o; }     // y-z-x rot x+90, y+90
    static xp_yp_yp( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -x; o[1] = -z; o[2] = -y; return o; } // -x-z-y rot x+90, y+90, y+90
    static xp_xp( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = x; o[1] = -y; o[2] = -z; return o; }     // x-y-z rot x+90, x+90
    
    static yn_yn( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -x; o[1] = y; o[2] = -z; return o; }     // -xy-z rot y-90, y-90

    static zp_zp( v: ConstVec3, o: TVec3 ): TVec3{ const x = v[0], y = v[1], z = v[2]; o[0] = -x; o[1] = -y; o[2] = z; return o; }     // -x,-y,z rot z+180
    // #endregion
}