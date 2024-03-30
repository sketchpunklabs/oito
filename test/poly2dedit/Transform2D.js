export default class Transform2D {
    // #region MAIN
    scl = [1, 1];   // XY Scaling
    pos = [0, 0];   // Translation position
    rot = 0;        // Rotation in Radians
    constructor() {}
    // #endregion
  
    // #region TRANSFORMATION
  
    // Apply values in matrix order : Scale - Rotation - Translation
    applyTo( out=[0, 0] ){
      // GLSL - vecQuatRotation(model.rotation, a_position.xyz * model.scale) + model.position;
  
      // Scale
      const x = out[0] * this.scl[0];
      const y = out[1] * this.scl[1];
  
      // Rotate
      const cos = Math.cos(this.rot);
      const sin = Math.sin(this.rot);
      out[0] = x * cos - y * sin;
      out[1] = x * sin + y * cos;
  
      // Translate
      out[0] += this.pos[0];
      out[1] += this.pos[1];
      return out;
    }
  
    // Apply values in reverse order : Translation - Rotation - Scale
    // If Transform is an inverse, use this to move worldspace pos to local space.
    applyRevTo(out = [0, 0]){
      // Translate
      const x = out[0] + this.pos[0];
      const y = out[1] + this.pos[1];
  
      // Rotate
      const cos = Math.cos(this.rot);
      const sin = Math.sin(this.rot);
      out[0] = x * cos - y * sin;
      out[1] = x * sin + y * cos;
  
      // Scale
      out[0] *= this.scl[0];
      out[1] *= this.scl[1];
  
      return out;
    }
  
    // Apply the inverse transform to point
    applyInvTo(out = [0, 0]){
      // Scale
      const x = out[0] * (1 / this.scl[0]);
      const y = out[1] * (1 / this.scl[1]);
  
      // Rotate
      const cos = Math.cos(-this.rot);
      const sin = Math.sin(-this.rot);
      out[0] = x * cos - y * sin;
      out[1] = x * sin + y * cos;
  
      // Translation
      out[0] -= this.pos[0];
      out[1] -= this.pos[1];
  
      return out;
    }
  
    // Apply rotation to a 2d vector
    applyRotationTo(out = [0, 0]){
      const cos = Math.cos(this.rot);
      const sin = Math.sin(this.rot);
      const x = out[0];
      const y = out[1];
      out[0] = x * cos - y * sin;
      out[1] = x * sin + y * cos;
      return out;
    }
    // #endregion
  
    // #region SETTERS
    // Create an inverted transform
    fromInvert( t ){
      // Invert rotation
      this.rot = -t.rot;
  
      // Invert Scale
      this.scl[0] = 1 / t.scl[0];
      this.scl[1] = 1 / t.scl[1];
  
      // Invert Position : rotInv * ( invScl * -Pos )
      const x = -t.pos[0] * this.scl[0];
      const y = -t.pos[1] * this.scl[1];
  
      const cos = Math.cos(this.rot);
      const sin = Math.sin(this.rot);
  
      this.pos[0] = x * cos - y * sin;
      this.pos[1] = x * sin + y * cos;
      return this;
    }
    // #endregion
  }
  