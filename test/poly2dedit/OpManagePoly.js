import OpBase from './OpBase.js';

export default class ManagePolyOp extends OpBase {
    // #region MAIN
    name        = 'managePolygon';
    polygon     = null;   // Polygon Object
    dragElm     = null;   // Polygon SVG Element
    dragOffset  = [0, 0]; // Drag offset, for realistic dragging effect
    dragPoints  = null;   // Localspace coordinates of polygon with centroid as origin
    constructor( editor ){ super( editor ); }
    // #endregion
  
    // #region HELPERS
    dragPrepare(x, y){
      if (this.polygon) {
        // Drag Offset
        const pnts          = this.polygon.points;
        const center        = this.polygon.getCenter();
        this.dragOffset[0]  = center[0] - x;
        this.dragOffset[1]  = center[1] - y;

        // Point coordinates with centroid as origin
        this.dragPoints = [];
        for (const p of pnts) {
            this.dragPoints.push( [p[0] - center[0], p[1] - center[1]] );
        }
      }
    }
    // #endregion
  
    // #region MACHINE OPERATION INTERFACE
    onPointerDown(x, y, e){
      if (e.target.nodeName !== 'polygon') return false;
  
      const id = e.target.getAttribute('id');

      if( this.editor.selectedPolygon.id !== id ){
        this.editor.selectPolygon( id );
      }
  
      if (id === this.editor.selectedPolygon.id) {
        this.polygon = this.editor.selectedPolygon;
        this.dragPrepare(x, y);
      }
  
      return true;
    }
  
    onPointerMove(x, y, _e){
        if (this.polygon && this.dragPoints) {
            // Compute new worldspace position for polygon
            let pp; // Polygon Point
            let dp; // Drag Point
            for (let i = 0; i < this.dragPoints.length; i++) {
                pp      = this.polygon.points[i];
                dp      = this.dragPoints[i];
                pp[0]   = Math.round(dp[0] + x + this.dragOffset[0]);
                pp[1]   = Math.round(dp[1] + y + this.dragOffset[1]);
            }

            // Show results of dragged polygon
            this.polygon?.render();
        }
    }
  
    onPointerUp(_e){ this.polygon = null; }
  
    removeSelected(){
        if (!this.editor.selectedPolygon){ console.log('No polygon selected to delete'); return; }

        const id = this.editor.selectedPolygon.id;
        if (!this.editor.polygons[id]){ console.log('Polygon ID not found ' + id); return; }

        const elm     = this.editor.selectedPolygon.element;
        const parent  = elm.parentNode;

        if( parent ){
            parent.removeChild(elm);            // Remove element from DOM
            delete this.editor.polygons[id];    // Remove polygon fronm collection
        } else {
            console.log('Parent node is null');
        }
    }
    // #endregion
  }
  