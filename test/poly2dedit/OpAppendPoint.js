import OpBase from './OpBase.js';
  
export default class AppendPointOp extends OpBase {
    // #region MAIN
    name        = 'appendPoint';
    polygon     = null; // Polygon Object
    dragElm     = null; // Polygon SVG Element
    saveIdx     = -1; // Index of point being saved
    savePos     = [0, 0];
    constructor(editor) { super(editor); }
    // #endregion
  
    // #region STATE MACHINE INTERFACE
    onInit() {
      this.polygon = this.editor.selectedPolygon || null;
      this.dragElm = this.editor.pointPool.getElement(-1, 0, 0);
    }
  
    onRelease() {
      if (this.dragElm) this.editor.pointPool.releaseElement(this.dragElm);  
      this.saveIdx = -1;
    }
    // #endregion
  
    // #region MACHINE OPERATION INTERFACE
    onPointerDown(_x, _y, e){
        if (this.polygon) {
            const poly  = this.polygon;
            const elm   = e.target;
    
            if (elm.nodeName === 'circle') {
                if (this.saveIdx !== -1) {
                    const p = this.savePos.slice();
                    poly.points.splice(this.saveIdx, 0, p);
                    poly.render();
                    this.editor.stateMachine.pop();
                }
            } else {
                this.editor.stateMachine.pop();
            }
        }
    
        return false;
    }
  
    onPointerMove(x, y, _e){
        if (this.polygon) {
            const mpos      = [x, y];       // Mouse position
            const pnts      = this.polygon.points;
            const len       = pnts.length;  // Number of points
    
            let minDist     = Infinity;     // Minimum hit distance
            const minPos    = [0, 0];       // Closest position
            let minIdx      = -1;           // Edge index of hit
    
            const hit       = [0, 0];       // Hit position
            let dist        = 0;            // Hit distance
            let ii;
    
            // Test each edge for closet point to mouse
            for (let i = 0; i < len; i++) {
                ii = (i + 1) % len;
        
                if (nearPoint(pnts[i], pnts[ii], mpos, hit)) {
                    dist = distSq(mpos, hit);
                    if (dist < minDist) {
                        minIdx = i + 1;
                        minDist = dist;
                        minPos[0] = hit[0];
                        minPos[1] = hit[1];
                    }
                }
            }
    
            // Save data if there is a hit
            if (minDist !== Infinity && this.dragElm) {
                this.saveIdx = minIdx;
                this.savePos[0] = Math.round(minPos[0]);
                this.savePos[1] = Math.round(minPos[1]);
        
                this.dragElm.setAttribute('cx', minPos[0].toString());
                this.dragElm.setAttribute('cy', minPos[1].toString());
            }
        }
    }
    // #endregion
  }
  

// #region MATHS

// Find the nearest spot on a segment from a point
function nearPoint( seg0, seg1, p, out = [0, 0] ){
    const vLen  = [seg1[0] - seg0[0], seg1[1] - seg0[1]];                   // Segment vector length
    const v     = [(p[0] - seg0[0]) * vLen[0], (p[1] - seg0[1]) * vLen[1]]; // Distance from segment origin
    const t     = (v[0] + v[1]) / (vLen[0] ** 2 + vLen[1] ** 2);            // Normalize the distance in relation to segment length sqr
  
    // Over / Under shoots the Ray Segment
    if (t < 0 || t > 1) return false;
  
    // Closest point on the segment
    out[0] = seg0[0] + vLen[0] * t;
    out[1] = seg0[1] + vLen[1] * t;
  
    return true;
  }
  
// Distance squared between two points
function distSq(a, b){ return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2; }

// #endregion