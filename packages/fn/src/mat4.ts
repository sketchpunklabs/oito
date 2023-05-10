import { TMat3, TMat4, TVec3, TVec4, TVec8 } from "../global";

class mat4{
    // #region MISC

    static identity( out ?:TMat4 ): TMat4 {
        out     = out || new Array( 16 );
        out[0]  = 1;
        out[1]  = 0;
        out[2]  = 0;
        out[3]  = 0;
        out[4]  = 0;
        out[5]  = 1;
        out[6]  = 0;
        out[7]  = 0;
        out[8]  = 0;
        out[9]  = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }

    static clearTranslation( m: TMat4, out ?: TMat4 ) : TMat4{
        out     = out || m;
        out[12] = 0; 
        out[13] = 0;
        out[14] = 0; 
        out[15] = 1;
        return out; 
    }

    static copy( mat: TMat4, out: TMat4 ) : TMat4{
        for( let i=0; i < 16; i++ ) out[ i ] = mat[ i ];
        return out;
    }

    static determinant( m: TMat4 ) : number {
        const 
            a00 = m[0],
            a01 = m[1],
            a02 = m[2],
            a03 = m[3],
            a10 = m[4],
            a11 = m[5],
            a12 = m[6],
            a13 = m[7],
            a20 = m[8],
            a21 = m[9],
            a22 = m[10],
            a23 = m[11],
            a30 = m[12],
            a31 = m[13],
            a32 = m[14],
            a33 = m[15],
            b0  = a00 * a11 - a01 * a10,
            b1  = a00 * a12 - a02 * a10,
            b2  = a01 * a12 - a02 * a11,
            b3  = a20 * a31 - a21 * a30,
            b4  = a20 * a32 - a22 * a30,
            b5  = a21 * a32 - a22 * a31,
            b6  = a00 * b5 - a01 * b4 + a02 * b3,
            b7  = a10 * b5 - a11 * b4 + a12 * b3,
            b8  = a20 * b2 - a21 * b1 + a22 * b0,
            b9  = a30 * b2 - a31 * b1 + a32 * b0;
        return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9; // Calculate the determinant
    }

    /** Frobenius norm of a Matrix */
    static frob( m: TMat4 ) : number{
        return Math.hypot(
            m[0],
            m[1],
            m[2],
            m[3],
            m[4],
            m[5],
            m[6],
            m[7],
            m[8],
            m[9],
            m[10],
            m[11],
            m[12],
            m[13],
            m[14],
            m[15]
        );
    }
    // #endregion


    // #region PROJECTION
    
    static perspective( fovy: number, aspect: number, near: number, far: number, out ?: TMat4 ) : TMat4{
        const f  = 1.0 / Math.tan( fovy * 0.5 ),
              nf = 1 / ( near - far );

        out     = out || new Array( 16 );
        out[0]  = f / aspect;
        out[1]  = 0;
        out[2]  = 0;
        out[3]  = 0;
        out[4]  = 0;
        out[5]  = f;
        out[6]  = 0;
        out[7]  = 0;
        out[8]  = 0;
        out[9]  = 0;
        out[10] = ( far + near ) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = ( 2 * far * near ) * nf;
        out[15] = 0;
        return out;
    }

    /*
    Generates a perspective projection matrix with the given bounds.
    * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
    export function perspectiveNO(out, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
        const nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
    } else {
        out[10] = -1;
        out[14] = -2 * near;
    }
    return out;
    }

    Generates a perspective projection matrix suitable for WebGPU with the given bounds.
    The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
    export function perspectiveZO(out, fovy, aspect, near, far) {
        const f = 1.0 / Math.tan(fovy / 2);
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;
        if (far != null && far !== Infinity) {
          const nf = 1 / (near - far);
          out[10] = far * nf;
          out[14] = far * near * nf;
        } else {
          out[10] = -1;
          out[14] = -near;
        }
        return out;
      }

     * Generates a perspective projection matrix with the given field of view.
    * out is primarily useful for generating projection matrices to be used
    * with the still experiemental WebVR API.
    export function perspectiveFromFieldOfView(out, fov, near, far) {
        let upTan = Math.tan((fov.upDegrees * Math.PI) / 180.0);
        let downTan = Math.tan((fov.downDegrees * Math.PI) / 180.0);
        let leftTan = Math.tan((fov.leftDegrees * Math.PI) / 180.0);
        let rightTan = Math.tan((fov.rightDegrees * Math.PI) / 180.0);
        let xScale = 2.0 / (leftTan + rightTan);
        let yScale = 2.0 / (upTan + downTan);
    
        out[0] = xScale;
        out[1] = 0.0;
        out[2] = 0.0;
        out[3] = 0.0;
        out[4] = 0.0;
        out[5] = yScale;
        out[6] = 0.0;
        out[7] = 0.0;
        out[8] = -((leftTan - rightTan) * xScale * 0.5);
        out[9] = (upTan - downTan) * yScale * 0.5;
        out[10] = far / (near - far);
        out[11] = -1.0;
        out[12] = 0.0;
        out[13] = 0.0;
        out[14] = (far * near) / (near - far);
        out[15] = 0.0;
        return out;
    }

    */

    static orthographic( left: number, right: number, bottom: number, top: number, near: number, far: number, out ?: TMat4 ) : TMat4 {
        const lr = 1 / ( left - right ),
                bt = 1 / ( bottom - top ),
                nf = 1 / ( near - far );
        
        out     = out || new Array( 16 );
        out[0]  = -2 * lr;
        out[1]  = 0;
        out[2]  = 0;
        out[3]  = 0;
        out[4]  = 0;
        out[5]  = -2 * bt;
        out[6]  = 0;
        out[7]  = 0;
        out[8]  = 0;
        out[9]  = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = ( left + right ) * lr;
        out[13] = ( top + bottom ) * bt;
        out[14] = ( far + near )   * nf;
        out[15] = 1;
        return out;
    }

    /*
    * Generates a orthogonal projection matrix with the given bounds.
    * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
    * which matches WebGL/OpenGL's clip volume.
   export function orthoNO(out, left, right, bottom, top, near, far) {
     const lr = 1 / (left - right);
     const bt = 1 / (bottom - top);
     const nf = 1 / (near - far);
     out[0] = -2 * lr;
     out[1] = 0;
     out[2] = 0;
     out[3] = 0;
     out[4] = 0;
     out[5] = -2 * bt;
     out[6] = 0;
     out[7] = 0;
     out[8] = 0;
     out[9] = 0;
     out[10] = 2 * nf;
     out[11] = 0;
     out[12] = (left + right) * lr;
     out[13] = (top + bottom) * bt;
     out[14] = (far + near) * nf;
     out[15] = 1;
     return out;
   }

    * Generates a orthogonal projection matrix with the given bounds.
    * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
    * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
    export function orthoZO(out, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
    }

    */

    static frustum( left: number, right: number, bottom: number, top: number, near: number, far: number, out ?: TMat4 ) : TMat4{
        const rl = 1 / (right - left);
        const tb = 1 / (top - bottom);
        const nf = 1 / (near - far);
        out     = out || new Array( 16 );
        out[0]  = near * 2 * rl;
        out[1]  = 0;
        out[2]  = 0;
        out[3]  = 0;
        out[4]  = 0;
        out[5]  = near * 2 * tb;
        out[6]  = 0;
        out[7]  = 0;
        out[8]  = (right + left) * rl;
        out[9]  = (top + bottom) * tb;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = far * near * 2 * nf;
        out[15] = 0;
        return out;
    }

    // #endregion 


    // #region FROM TRANSFORM
    static fromQuatTranScale( q: TVec4, v: TVec3, s: TVec3, out ?: TMat4 ) : TMat4{
        // Quaternion math
        const x = q[0], y = q[1], z = q[2], w = q[3],
                x2 = x + x,
                y2 = y + y,
                z2 = z + z,
                xx = x * x2,
                xy = x * y2,
                xz = x * z2,
                yy = y * y2,
                yz = y * z2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2,
                sx = s[0],
                sy = s[1],
                sz = s[2];
        
        out     = out || new Array( 16 );
        out[0]  = ( 1 - ( yy + zz ) ) * sx;
        out[1]  = ( xy + wz ) * sx;
        out[2]  = ( xz - wy ) * sx;
        out[3]  = 0;
        out[4]  = ( xy - wz ) * sy;
        out[5]  = ( 1 - ( xx + zz ) ) * sy;
        out[6]  = ( yz + wx ) * sy;
        out[7]  = 0;
        out[8]  = ( xz + wy ) * sz;
        out[9]  = ( yz - wx ) * sz;
        out[10] = ( 1 - ( xx + yy ) ) * sz;
        out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
        return out;
    }

    static fromQuatTran(  q: TVec4, v: TVec3, out ?: TMat4 ) : TMat4{
        // Quaternion math
        const x = q[0], y = q[1], z = q[2], w = q[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;
        
        out     = out || new Array( 16 );
        out[0]  = 1 - ( yy + zz );
        out[1]  = xy + wz;
        out[2]  = xz - wy;
        out[3]  = 0;
        out[4]  = xy - wz;
        out[5]  = 1 - ( xx + zz );
        out[6]  = yz + wx;
        out[7]  = 0;
        out[8]  = xz + wy;
        out[9]  = yz - wx;
        out[10] = 1 - ( xx + yy );
        out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
        return out;
    }

    static fromQuat( q: TVec4, out ?: TMat4 ) : TMat4{
        // Quaternion math
        const x = q[0], y = q[1], z = q[2], w = q[3],
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        out     = out || new Array( 16 );
        out[0]  = 1 - ( yy + zz );
        out[1]  = xy + wz;
        out[2]  = xz - wy;
        out[3]  = 0;
        out[4]  = xy - wz;
        out[5]  = 1 - ( xx + zz );
        out[6]  = yz + wx;
        out[7]  = 0;
        out[8]  = xz + wy;
        out[9]  = yz - wx;
        out[10] = 1 - ( xx + yy );
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }

    /** Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin */
    static fromQuatTranScaleOrigin( q: TVec4, v: TVec3, s: TVec3, o: TVec3, out ?: TMat4 ) : TMat4{
        // Quaternion math
        const x = q[0],
              y = q[1],
              z = q[2],
              w = q[3];
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

        const sx = s[0];
        const sy = s[1];
        const sz = s[2];

        const ox = o[0];
        const oy = o[1];
        const oz = o[2];

        const out0  = (1 - (yy + zz)) * sx;
        const out1  = (xy + wz) * sx;
        const out2  = (xz - wy) * sx;
        const out4  = (xy - wz) * sy;
        const out5  = (1 - (xx + zz)) * sy;
        const out6  = (yz + wx) * sy;
        const out8  = (xz + wy) * sz;
        const out9  = (yz - wx) * sz;
        const out10 = (1 - (xx + yy)) * sz;

        out     = out || new Array( 16 );
        out[0]  = out0;
        out[1]  = out1;
        out[2]  = out2;
        out[3]  = 0;
        out[4]  = out4;
        out[5]  = out5;
        out[6]  = out6;
        out[7]  = 0;
        out[8]  = out8;
        out[9]  = out9;
        out[10] = out10;
        out[11] = 0;
        out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
        out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
        out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
        out[15] = 1;

        return out;
    }

    static fromDualQuat( a: TVec8, out ?: TMat4 ) : TMat4{
        const   bx = -a[0],
                by = -a[1],
                bz = -a[2],
                bw = a[3],
                ax = a[4],
                ay = a[5],
                az = a[6],
                aw = a[7];

        const translation = [0,0,0];
        let   magnitude   = bx * bx + by * by + bz * bz + bw * bw;

        // Only scale if it makes sense
        if( magnitude > 0 ){
            magnitude      = 1 / magnitude;
            translation[0] = ((ax * bw + aw * bx + ay * bz - az * by) * 2) * magnitude;
            translation[1] = ((ay * bw + aw * by + az * bx - ax * bz) * 2) * magnitude;
            translation[2] = ((az * bw + aw * bz + ax * by - ay * bx) * 2) * magnitude;
        }else{
            translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
            translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
            translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
        }

        out = out || new Array( 16 );
        return this.fromQuatTran( a, translation, out );
    }

    // #endregion
    

    // #region FROM ROTATION
    /** out creates a View Matrix, not a World Matrix. Use fromTarget for a World Matrix */
    static fromLook( eye: TVec3, center: TVec3, up: TVec3, out ?: TMat4 ) : TMat4{
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        const eyex    = eye[0];
        const eyey    = eye[1];
        const eyez    = eye[2];
        const upx     = up[0];
        const upy     = up[1];
        const upz     = up[2];
        const centerx = center[0];
        const centery = center[1];
        const centerz = center[2];
        
        out = out || new Array( 16 );
        if (Math.abs( eyex - centerx ) < 0.000001 &&
            Math.abs( eyey - centery ) < 0.000001 &&
            Math.abs( eyez - centerz ) < 0.000001) {

            return this.identity( out );   // Identity
        }

        z0  = eyex - centerx;
        z1  = eyey - centery;
        z2  = eyez - centerz;

        len = 1 / Math.sqrt( z0 * z0 + z1 * z1 + z2 * z2 );
        z0  *= len;
        z1  *= len;
        z2  *= len;

        x0  = upy * z2 - upz * z1;
        x1  = upz * z0 - upx * z2;
        x2  = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

        if( !len ){
            x0  = 0;
            x1  = 0;
            x2  = 0;
        }else{
            len = 1 / len;
            x0  *= len;
            x1  *= len;
            x2  *= len;
        }

        y0  = z1 * x2 - z2 * x1;
        y1  = z2 * x0 - z0 * x2;
        y2  = z0 * x1 - z1 * x0;
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

        if( !len ){
            y0  = 0;
            y1  = 0;
            y2  = 0;
        }else{
            len = 1 / len;
            y0  *= len;
            y1  *= len;
            y2  *= len;
        }

        out[0]  = x0;
        out[1]  = y0;
        out[2]  = z0;
        out[3]  = 0;
        out[4]  = x1;
        out[5]  = y1;
        out[6]  = z1;
        out[7]  = 0;
        out[8]  = x2;
        out[9]  = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -( x0 * eyex + x1 * eyey + x2 * eyez );
        out[13] = -( y0 * eyex + y1 * eyey + y2 * eyez );
        out[14] = -( z0 * eyex + z1 * eyey + z2 * eyez );
        out[15] = 1;

        return out;
    }

    /** out creates a World Matrix, not a View Matrix. Use fromLook for a View Matrix */
    static fromTarget( eye: TVec3, target: TVec3, up: TVec3, out ?: TMat4 ) : TMat4{
        const eyex = eye[0],
              eyey = eye[1],
              eyez = eye[2],
              upx  = up[0],
              upy  = up[1],
              upz  = up[2];

        let   z0   = eyex - target[0],
              z1   = eyey - target[1],
              z2   = eyez - target[2],
              len  = z0*z0 + z1*z1 + z2*z2;

        if( len > 0 ){
            len = 1 / Math.sqrt( len );
            z0  *= len;
            z1  *= len;
            z2  *= len;
        }

        let x0 = upy * z2 - upz * z1,
            x1 = upz * z0 - upx * z2,
            x2 = upx * z1 - upy * z0;

        len = x0*x0 + x1*x1 + x2*x2;
        if( len > 0 ){
            len = 1 / Math.sqrt( len );
            x0  *= len;
            x1  *= len;
            x2  *= len;
        }

        out     = out || new Array( 16 );
        out[0]  = x0;
        out[1]  = x1;
        out[2]  = x2;
        out[3]  = 0;
        out[4]  = z1 * x2 - z2 * x1;
        out[5]  = z2 * x0 - z0 * x2;
        out[6]  = z0 * x1 - z1 * x0;
        out[7]  = 0;
        out[8]  = z0;
        out[9]  = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return out;
    }

    static fromAxisAngle( axis: TVec3, rad: number, out ?: TMat4 ) : TMat4{
        let x   = axis[0],
            y   = axis[1],
            z   = axis[2],
            len = Math.hypot( x, y, z );
        
        out = out || this.identity();
        if( len < 0.000001 ) return out;
      
        len = 1 / len;
        x   *= len;
        y   *= len;
        z   *= len;
        const s   = Math.sin(rad);
        const c   = Math.cos(rad);
        const t   = 1 - c;
      
        // Perform rotation-specific matrix multiplication
        out[0] = x * x * t + c;
        out[1]  = y * x * t + z * s;
        out[2]  = z * x * t - y * s;
        out[3]  = 0;
        out[4]  = x * y * t - z * s;
        out[5]  = y * y * t + c;
        out[6]  = z * y * t + x * s;
        out[7]  = 0;
        out[8]  = x * z * t + y * s;
        out[9]  = y * z * t - x * s;
        out[10] = z * z * t + c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        return out;
    }
      
    static fromRotX( rad: number, out ?: TMat4 ) : TMat4 {
        const   s = Math.sin( rad ),
                c = Math.cos( rad );
        out     = out || new Array( 16 );
        out[0]  = 1;
        out[1]  = 0;
        out[2]  = 0;
        out[3]  = 0;
        out[4]  = 0;
        out[5]  = c;
        out[6]  = s;
        out[7]  = 0;
        out[8]  = 0;
        out[9]  = -s;
        out[10] = c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }
    
    static fromRotY( rad: number, out ?: TMat4 ) : TMat4{
        const   s = Math.sin( rad ),
                c = Math.cos( rad );
        out     = out || new Array( 16 );
        out[0]  = c;
        out[1]  = 0;
        out[2]  = -s;
        out[3]  = 0;
        out[4]  = 0;
        out[5]  = 1;
        out[6]  = 0;
        out[7]  = 0;
        out[8]  = s;
        out[9]  = 0;
        out[10] = c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }

    static fromRotZ( rad: number, out ?: TMat4 ) : TMat4{
        const   s = Math.sin( rad ),
                c = Math.cos( rad );
        out     = out || new Array( 16 );
        out[0]  = c;
        out[1]  = s;
        out[2]  = 0;
        out[3]  = 0;
        out[4]  = -s;
        out[5]  = c;
        out[6]  = 0;
        out[7]  = 0;
        out[8]  = 0;
        out[9]  = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }
    // #endregion


    // #region FLAT BUFFERS

    /** Used to get data from a flat buffer of matrices */
    static fromBuf( ary : Array<number> | Float32Array, idx: number, out ?: TMat4 ) : TMat4 {
        out       = out || new Array( 16 );
        out[ 0 ]  = ary[ idx ];
        out[ 1 ]  = ary[ idx + 1 ];
        out[ 2 ]  = ary[ idx + 2 ];
        out[ 3 ]  = ary[ idx + 3 ];
        out[ 4 ]  = ary[ idx + 4 ];
        out[ 5 ]  = ary[ idx + 5 ];
        out[ 6 ]  = ary[ idx + 6 ];
        out[ 7 ]  = ary[ idx + 7 ];
        out[ 8 ]  = ary[ idx + 8 ];
        out[ 9 ]  = ary[ idx + 9 ];
        out[ 10 ] = ary[ idx + 10 ];
        out[ 11 ] = ary[ idx + 11 ];
        out[ 12 ] = ary[ idx + 12 ];
        out[ 13 ] = ary[ idx + 13 ];
        out[ 14 ] = ary[ idx + 14 ];
        out[ 15 ] = ary[ idx + 15 ];
        return out;
    }

    /** Put data into a flat buffer of matrices */
    static toBuf( ary : Array<number> | Float32Array, idx: number, m: TMat4 ) : void { 
        ary[ idx ]      = m[ 0 ];
        ary[ idx + 1 ]  = m[ 1 ];
        ary[ idx + 2 ]  = m[ 2 ];
        ary[ idx + 3 ]  = m[ 3 ];
        ary[ idx + 4 ]  = m[ 4 ];
        ary[ idx + 5 ]  = m[ 5 ];
        ary[ idx + 6 ]  = m[ 6 ];
        ary[ idx + 7 ]  = m[ 7 ];
        ary[ idx + 8 ]  = m[ 8 ];
        ary[ idx + 9 ]  = m[ 9 ];
        ary[ idx + 10 ] = m[ 10 ];
        ary[ idx + 11 ] = m[ 11 ];
        ary[ idx + 12 ] = m[ 12 ];
        ary[ idx + 13 ] = m[ 13 ];
        ary[ idx + 14 ] = m[ 14 ];
        ary[ idx + 15 ] = m[ 15 ];
    }

    //#endregion


    // #region OPERATIONS
    static add( a:TMat4, b: TMat4, out ?: TMat4 ) : TMat4{
        out     = out || a;
        out[0]  = a[0]  + b[0];
        out[1]  = a[1]  + b[1];
        out[2]  = a[2]  + b[2];
        out[3]  = a[3]  + b[3];
        out[4]  = a[4]  + b[4];
        out[5]  = a[5]  + b[5];
        out[6]  = a[6]  + b[6];
        out[7]  = a[7]  + b[7];
        out[8]  = a[8]  + b[8];
        out[9]  = a[9]  + b[9];
        out[10] = a[10] + b[10];
        out[11] = a[11] + b[11];
        out[12] = a[12] + b[12];
        out[13] = a[13] + b[13];
        out[14] = a[14] + b[14];
        out[15] = a[15] + b[15];
        return out;
    }

    static sub( a:TMat4, b: TMat4, out ?: TMat4 ) : TMat4{
        out     = out || a;
        out[0]  = a[0]  - b[0];
        out[1]  = a[1]  - b[1];
        out[2]  = a[2]  - b[2];
        out[3]  = a[3]  - b[3];
        out[4]  = a[4]  - b[4];
        out[5]  = a[5]  - b[5];
        out[6]  = a[6]  - b[6];
        out[7]  = a[7]  - b[7];
        out[8]  = a[8]  - b[8];
        out[9]  = a[9]  - b[9];
        out[10] = a[10] - b[10];
        out[11] = a[11] - b[11];
        out[12] = a[12] - b[12];
        out[13] = a[13] - b[13];
        out[14] = a[14] - b[14];
        out[15] = a[15] - b[15];
        return out;
    }

    static mul( a: TMat4, b: TMat4, out ?: TMat4 ) : TMat4{ 
        const   a00 = a[0],  a01 = a[1],  a02 = a[2],  a03 = a[3],
                a10 = a[4],  a11 = a[5],  a12 = a[6],  a13 = a[7],
                a20 = a[8],  a21 = a[9],  a22 = a[10], a23 = a[11],
                a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        
        out = out || a;

        // Cache only the current line of the second matrix
        let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0     = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0      = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        out[8]  = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[9]  = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0      = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
        return out;	
    }

    static invert( mat: TMat4, out ?: TMat4 ) : TMat4{
        const a00 = mat[0],  a01 = mat[1],  a02 = mat[2],  a03 = mat[3],
                a10 = mat[4],  a11 = mat[5],  a12 = mat[6],  a13 = mat[7],
                a20 = mat[8],  a21 = mat[9],  a22 = mat[10], a23 = mat[11],
                a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; // Calculate the determinant
        out = out || mat;

        if( !det ) return out;
        det = 1.0 / det;

        out[0]  = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1]  = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2]  = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3]  = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4]  = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5]  = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6]  = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7]  = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8]  = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9]  = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return out;
    }

    static translate( a: TMat4, v: TVec3, out ?: TMat4 ) : TMat4{
        const xx = v[0];
        const yy = v[1];
        const zz = v[2];

        out     = out || a;
        out[12] = a[0] * xx + a[4] * yy + a[8]	* zz + a[12];
        out[13] = a[1] * xx + a[5] * yy + a[9]	* zz + a[13];
        out[14] = a[2] * xx + a[6] * yy + a[10]	* zz + a[14];
        out[15] = a[3] * xx + a[7] * yy + a[11]	* zz + a[15];

        return out;
    }

    static scale( a: TMat4, v: TVec3, out ?: TMat4 ) : TMat4{
        const x = v[0];
        const y = v[1];
        const z = v[2];

        out     = out || a;
        out[0]  = a[0] * x;
        out[1]  = a[1] * x;
        out[2]  = a[2] * x;
        out[3]  = a[3] * x;
        out[4]  = a[4] * y;
        out[5]  = a[5] * y;
        out[6]  = a[6] * y;
        out[7]  = a[7] * y;
        out[8]  = a[8] * z;
        out[9]  = a[9] * z;
        out[10] = a[10] * z;
        out[11] = a[11] * z;
        return out;
    }

    /** Make the rows into the columns */
    static transpose( m: TMat4, out ?: TMat4 ) : TMat4 {
        const   a01 = m[1], 
                a02 = m[2], 
                a03 = m[3], 
                a12 = m[6], 
                a13 = m[7], 
                a23 = m[11];
        out     = out || m;
        out[1]  = m[4];
        out[2]  = m[8];
        out[3]  = m[12];
        out[4]  = a01;
        out[6]  = m[9];
        out[7]  = m[13];
        out[8]  = a02;
        out[9]  = a12;
        out[11] = m[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
        return out;
    }

    static adjugate( a: TMat4, out ?: TMat4 ) : TMat4 {
        const
            a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3],
            a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7],
            a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11],
            a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32;
        
        out     = out || a;
        out[0]  = a11 * b11 - a12 * b10 + a13 * b09;
        out[1]  = a02 * b10 - a01 * b11 - a03 * b09;
        out[2]  = a31 * b05 - a32 * b04 + a33 * b03;
        out[3]  = a22 * b04 - a21 * b05 - a23 * b03;
        out[4]  = a12 * b08 - a10 * b11 - a13 * b07;
        out[5]  = a00 * b11 - a02 * b08 + a03 * b07;
        out[6]  = a32 * b02 - a30 * b05 - a33 * b01;
        out[7]  = a20 * b05 - a22 * b02 + a23 * b01;
        out[8]  = a10 * b10 - a11 * b08 + a13 * b06;
        out[9]  = a01 * b08 - a00 * b10 - a03 * b06;
        out[10] = a30 * b04 - a31 * b02 + a33 * b00;
        out[11] = a21 * b02 - a20 * b04 - a23 * b00;
        out[12] = a11 * b07 - a10 * b09 - a12 * b06;
        out[13] = a00 * b09 - a01 * b07 + a02 * b06;
        out[14] = a31 * b01 - a30 * b03 - a32 * b00;
        out[15] = a20 * b03 - a21 * b01 + a22 * b00;
        return out;
    }

    // #endregion
    
    
    // #region ROTATION OPS
    static rotX( m:TMat4, rad: number, out ?: TMat4 ) : TMat4 {
        const   s   = Math.sin( rad ),
                c   = Math.cos( rad ),
                a10 = m[4],
                a11 = m[5],
                a12 = m[6],
                a13 = m[7],
                a20 = m[8],
                a21 = m[9],
                a22 = m[10],
                a23 = m[11];

        // Perform axis-specific matrix multiplication
        out     = out || m;
        out[4]  = a10 * c + a20 * s;
        out[5]  = a11 * c + a21 * s;
        out[6]  = a12 * c + a22 * s;
        out[7]  = a13 * c + a23 * s;
        out[8]  = a20 * c - a10 * s;
        out[9]  = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        return out;
    }

    static rotY( m:TMat4, rad: number, out ?: TMat4 ) : TMat4 {
        const   s   = Math.sin( rad ),
                c   = Math.cos( rad ),
                a00 = m[0],
                a01 = m[1],
                a02 = m[2],
                a03 = m[3],
                a20 = m[8],
                a21 = m[9],
                a22 = m[10],
                a23 = m[11];

        // Perform axis-specific matrix multiplication
        out     = out || m;
        out[0]  = a00 * c - a20 * s;
        out[1]  = a01 * c - a21 * s;
        out[2]  = a02 * c - a22 * s;
        out[3]  = a03 * c - a23 * s;
        out[8]  = a00 * s + a20 * c;
        out[9]  = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        return out;
    }

    static rotZ( m:TMat4, rad: number, out ?: TMat4 ) : TMat4 {
        const   s   = Math.sin( rad ),
                c   = Math.cos( rad ),
                a00 = m[0],
                a01 = m[1],
                a02 = m[2],
                a03 = m[3],
                a10 = m[4],
                a11 = m[5],
                a12 = m[6],
                a13 = m[7];

        // Perform axis-specific matrix multiplication
        out    = out || m;
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        return out;
    }

    static rotAxisAngle( m:TMat4, axis: TVec3, rad: number, out ?: TMat4 ) : TMat4 {
        let x   = axis[0], 
            y   = axis[1], 
            z   = axis[2],
            len = Math.sqrt( x * x + y * y + z * z );

        out    = out || m;
        if( Math.abs( len ) < 0.000001 ) return out;

        len = 1 / len;
        x   *= len;
        y   *= len;
        z   *= len;

        const s   = Math.sin( rad );
        const c   = Math.cos( rad );
        const t   = 1 - c;

        const a00 = m[0]; const a01 = m[1]; const a02 = m[2];  const a03 = m[3];
        const a10 = m[4]; const a11 = m[5]; const a12 = m[6];  const a13 = m[7];
        const a20 = m[8]; const a21 = m[9]; const a22 = m[10]; const a23 = m[11];

        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c;        const b01 = y * x * t + z * s;    const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s;    const b11 = y * y * t + c;        const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s;    const b21 = y * z * t - x * s;    const b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        out[0]  = a00 * b00 + a10 * b01 + a20 * b02;
        out[1]  = a01 * b00 + a11 * b01 + a21 * b02;
        out[2]  = a02 * b00 + a12 * b01 + a22 * b02;
        out[3]  = a03 * b00 + a13 * b01 + a23 * b02;
        out[4]  = a00 * b10 + a10 * b11 + a20 * b12;
        out[5]  = a01 * b10 + a11 * b11 + a21 * b12;
        out[6]  = a02 * b10 + a12 * b11 + a22 * b12;
        out[7]  = a03 * b10 + a13 * b11 + a23 * b12;
        out[8]  = a00 * b20 + a10 * b21 + a20 * b22;
        out[9]  = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;
        return out;
    }
    // #endregion


    // #region TRANSFORMS
    static transformVec3( m: TMat4, v: TVec3, out ?: TVec3 ) : TVec3{
        const x = v[0], y = v[1], z = v[2];
        out    = out || v;
        out[0] = m[0] * x + m[4] * y + m[8]  * z + m[12];
        out[1] = m[1] * x + m[5] * y + m[9]  * z + m[13];
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
        return out;
    }
    
    static transformVec4( m: TMat4, v: TVec4, out ?: TVec4 ) : TVec4{
        const x = v[0], y = v[1], z = v[2], w = v[3];
        out    = out || v;
        out[0] = m[0] * x + m[4] * y + m[8]  * z + m[12] * w;
        out[1] = m[1] * x + m[5] * y + m[9]  * z + m[13] * w;
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return out;
    }

    // Calculates a 3x3 normal matrix ( transpose & inverse ) from out 4x4 matrix
    static toNormalMat3( m: TMat4, out ?: TMat3 ) : TMat3{
        const a00   = m[0],  a01 = m[1],  a02 = m[2],  a03 = m[3],
                a10 = m[4],  a11 = m[5],  a12 = m[6],  a13 = m[7],
                a20 = m[8],  a21 = m[9],  a22 = m[10], a23 = m[11],
                a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15],

                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32;

        
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; // Calculate the determinant
        out     = out || [ 0,0,0, 0,0,0, 0,0,0 ];
        if( !det ) return out;

        det    = 1.0 / det;
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        return out;
    }
    // #endregion

    
    // #region DECOMPOSE
    static getTranslation( m: TMat4, out ?: TVec3 ) : TVec3{
        out    = out || [ 0, 0, 0 ];
        out[0] = m[12];
        out[1] = m[13];
        out[2] = m[14];
        return out;
    }

    static getScale( m: TMat4, out ?: TVec3 ) : TVec3{
        const m11 = m[0],
              m12 = m[1],
              m13 = m[2],
              m21 = m[4],
              m22 = m[5],
              m23 = m[6],
              m31 = m[8],
              m32 = m[9],
              m33 = m[10];

        out    = out || [0,0,0];
        out[0] = Math.sqrt( m11 * m11 + m12 * m12 + m13 * m13 );
        out[1] = Math.sqrt( m21 * m21 + m22 * m22 + m23 * m23 );
        out[2] = Math.sqrt( m31 * m31 + m32 * m32 + m33 * m33 );
        return out;
    }

    static getQuaternion( m: TMat4, out?: TVec4 ) : TVec3{
        // Returns a quaternion representing the rotational component of a transformation matrix.
        // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
        const trace	= m[0] + m[5] + m[10];
        let   S		= 0;

        out = out || [0,0,0,1];
        if( trace > 0){
            S = Math.sqrt(trace + 1.0) * 2;
            out[3] = 0.25 * S;
            out[0] = (m[6] - m[9]) / S;
            out[1] = (m[8] - m[2]) / S; 
            out[2] = (m[1] - m[4]) / S; 
        }else if( (m[0] > m[5]) && (m[0] > m[10]) ){ 
            S = Math.sqrt(1.0 + m[0] - m[5] - m[10]) * 2;
            out[3] = (m[6] - m[9]) / S;
            out[0] = 0.25 * S;
            out[1] = (m[1] + m[4]) / S; 
            out[2] = (m[8] + m[2]) / S; 
        }else if(m[5] > m[10]){ 
            S = Math.sqrt(1.0 + m[5] - m[0] - m[10]) * 2;
            out[3] = (m[8] - m[2]) / S;
            out[0] = (m[1] + m[4]) / S; 
            out[1] = 0.25 * S;
            out[2] = (m[6] + m[9]) / S; 
        }else{ 
            S = Math.sqrt(1.0 + m[10] - m[0] - m[5]) * 2;
            out[3] = (m[1] - m[4]) / S;
            out[0] = (m[8] + m[2]) / S;
            out[1] = (m[6] + m[9]) / S;
            out[2] = 0.25 * S;
        }
        return out;
    }

    static decompose( m: TMat4, out_r: TVec4, out_t: TVec3, out_s: TVec3) : void{
        out_t[0]  = m[12];
        out_t[1]  = m[13];
        out_t[2]  = m[14];
        
        const m11 = m[0];
        const m12 = m[1];
        const m13 = m[2];
        const m21 = m[4];
        const m22 = m[5];
        const m23 = m[6];
        const m31 = m[8];
        const m32 = m[9];
        const m33 = m[10];
        
        out_s[0]  = Math.hypot( m11, m12, m13 );
        out_s[1]  = Math.hypot( m21, m22, m23 );
        out_s[2]  = Math.hypot( m31, m32, m33 );
        
        const is1 = 1 / out_s[0];
        const is2 = 1 / out_s[1];
        const is3 = 1 / out_s[2];
        
        const sm11 = m11 * is1;
        const sm12 = m12 * is2;
        const sm13 = m13 * is3;
        const sm21 = m21 * is1;
        const sm22 = m22 * is2;
        const sm23 = m23 * is3;
        const sm31 = m31 * is1;
        const sm32 = m32 * is2;
        const sm33 = m33 * is3;
        
        const trace = sm11 + sm22 + sm33;
        let S = 0;
        
        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out_r[3] = 0.25 * S;
            out_r[0] = (sm23 - sm32) / S;
            out_r[1] = (sm31 - sm13) / S;
            out_r[2] = (sm12 - sm21) / S;
        } else if (sm11 > sm22 && sm11 > sm33) {
            S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
            out_r[3] = (sm23 - sm32) / S;
            out_r[0] = 0.25 * S;
            out_r[1] = (sm12 + sm21) / S;
            out_r[2] = (sm31 + sm13) / S;
        } else if (sm22 > sm33) {
            S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
            out_r[3] = (sm31 - sm13) / S;
            out_r[0] = (sm12 + sm21) / S;
            out_r[1] = 0.25 * S;
            out_r[2] = (sm23 + sm32) / S;
        } else {
            S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
            out_r[3] = (sm12 - sm21) / S;
            out_r[0] = (sm31 + sm13) / S;
            out_r[1] = (sm23 + sm32) / S;
            out_r[2] = 0.25 * S;
        }
    }
    // #endregion
}

export default mat4