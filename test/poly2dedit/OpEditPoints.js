import OpBase from './OpBase.js';

export default class EditPointsOp extends OpBase {
    // #region MAIN
    name      = 'editPoints';
    polygon   = null;   // Polygon Object
    isDown    = false;  // Is mouse down, allow drag to work if true
    selected  = [];     // List of selected elements
    selPos    = [];     // Localspace position for selected elements
    offset    = [0, 0]; // Mouse offset
  
    pointPool = null;
    constructor(editor){ super(editor); }
    // #endregion
  
    // #region STATE MACHINE INTERFACE
    onInit() {
        if (this.editor) {
            this.pointPool  = this.editor.pointPool;
            this.polygon    = this.editor.selectedPolygon || null;
            this.editor.pointPool.releaseAll();
            this.drawPolygon();
        }
    }
  
    onRelease(){
        if (this.pointPool) {
            this.pointPool.releaseAll();
            this.pointPool = null;
        }
    
        this.polygon            = null;
        this.isDown             = false;
        this.selected.length    = 0;
        this.selPos.length      = 0;
    }
  
    onSuspend() {
        this.deselectAll();
        this.isDown         = false;
        this.selPos.length  = 0;
    }
  
    onWakeup() {
      if (this.pointPool) {
        this.pointPool.releaseAll();
        this.drawPolygon();
      }
    }
    // #endregion
  
    // #region HELPERS
    drawPolygon() {
        if (this.polygon && this.pointPool) {
            let i = 0;
            for (const p of this.polygon.points) {
                this.pointPool.getElement(i++, p[0], p[1]);
            }
        }
    }
  
    savePoints() {
        if (this.polygon) {
            let p;
            for (const elm of this.selected) {
                p       = this.polygon.points[parseInt(elm.dataset.idx, 10)];
                p[0]    = parseInt(elm.getAttributeNS(null, 'cx'), 10);
                p[1]    = parseInt(elm.getAttributeNS(null, 'cy'), 10);
            }
            this.polygon.render();
        }
    }
  
    prepareDrag(x, y) {
      if (this.polygon) {
        if (this.selected.length === 1) {
          // HANDLE SINGLE POINT
          const elm = this.selected[0];
          const p   = this.polygon.points[parseInt(elm.dataset.idx, 10)];
  
          this.selPos.length = 0;
          this.selPos.push([0, 0]);
  
          this.offset[0] = p[0] - x;
          this.offset[1] = p[1] - y;

        } else {
          // HANDLE MULTIPLE POINTS
  
          // Compute centroid
          const cp = [0, 0];
          let p;
  
          for (const elm of this.selected) {
            p = this.polygon.points[parseInt(elm.dataset.idx, 10)];
            cp[0] += p[0];
            cp[1] += p[1];
          }
  
          cp[0] = Math.round(cp[0] / this.selected.length);
          cp[1] = Math.round(cp[1] / this.selected.length);
  
          this.offset[0] = cp[0] - x;
          this.offset[1] = cp[1] - y;
  
          this.selPos.length = 0;
          for (const elm of this.selected) {
            p = this.polygon.points[parseInt(elm.dataset.idx, 10)];
            this.selPos.push([p[0] - cp[0], p[1] - cp[1]]);
          }
        }
      }
    }
    // #endregion
  
    // #region SELECTION
    selectPoint(elm) {
        if (this.selected.indexOf(elm) === -1) {
            this.pointPool?.selElement(elm);
            this.selected.push(elm);
        }
    }
  
    deselectPoint(elm){
        const idx = this.selected.indexOf(elm);
        if (idx !== -1) {
            this.pointPool?.selElement(elm, false);
            this.selected.splice(idx, 1);
            return true;
        }
    
        return false;
    }
  
    deselectAll(){
      while (this.selected.length > 0) {
        this.pointPool?.selElement(this.selected.pop(), false);
      }
    }
    // #endregion
  
    // #region MACHINE OPERATION INTERFACE
    onPointerDown(x, y, e){
      const elm = e.target;
  
      if (elm.nodeName !== 'circle') { return false; }
  
      if (e.shiftKey) {
        // Multi-selection
        if (!this.deselectPoint(elm)) this.selectPoint(elm);
      } else {
        // Only handle things if no multiple things selected
        if (this.selected.length <= 1) {
          this.deselectAll();
          this.selectPoint(elm);
        } else {
          this.selectPoint(elm);
        }
      }
  
      this.prepareDrag(x, y);
      this.isDown = true;
      return true;
    }
  
    onPointerMove(x, y, _e){
        if (!this.isDown) return;
    
        let elm;
        let p;
        for (let i = 0; i < this.selected.length; i++) {
            elm = this.selected[i];
            p   = this.selPos[i];
            elm.setAttribute('cx', Math.round(p[0] + this.offset[0] + x).toString());
            elm.setAttribute('cy', Math.round(p[1] + this.offset[1] + y).toString());
        }
    }
  
    onPointerUp(_e){
        this.isDown = false;
        this.savePoints();
    }
  
    onDblClick(e){
        const elm = e.target;
        if (elm.nodeName === 'svg' && this.selected.length > 1) {
            this.deselectAll();
            return true;
        }
    
        return false;
    }
  
    removeSelected() {
        if (this.selected.length === 0) {
            console.log( 'No point selected', true );
            return;
        }
  
        if (this.polygon && this.pointPool) {
            const poly = this.polygon;
    
            if (poly.points.length - this.selected.length < 3) {
                console.log( 'Can not delete point, polygon needs a min of 3 points' );
                return;
            }
    
            // Sort points in descendng order
            if (this.selected.length > 1) {
                this.selected.sort((a, b) => {
                    return a.dataset.idx === b.dataset.idx
                    ? 0
                    : a.dataset.idx < b.dataset.idx
                        ? 1
                        : -1;
                });
            }
    
            for (const elm of this.selected) {
                poly.points.splice(parseInt(elm.dataset.idx, 10), 1);
            }
    
            poly.render();                  // Refresh polygon
            this.deselectAll();             // Items have been deleted, deselect.
            this.pointPool?.releaseAll();   // Clear all points
            this.drawPolygon();             // Redraw points
        }
    }
    // #endregion
  }
  