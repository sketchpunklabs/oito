import Transform2D      from './Transform2D.js';
import StateMachine     from './StateMachine.js';

import LayerGrid        from './LayerGrid.js';
import LayerImage       from './LayerImage.js';
import LayerSvg         from './LayerSvg.js';

import OpManagePoly     from './OpManagePoly.js';
import OpEditPoints     from './OpEditPoints.js';
import OpAppendPoint    from './OpAppendPoint.js';

import SVGPolygon       from './SVGPolygon.js';
import PointPool        from './PointPool.js';

export default class Editor{
    // #region MAIN
    elmContainer    = null;
    elmView         = document.createElement( 'div' ); // Container to hold the content & layers
    transform       = new Transform2D();
    contentWidth    = 0;
    contentHeight   = 0;

    resizeObserver  = null; // Observer HTML element for when they resize
    dragPointer     = -1; // Drag Pointer ID, also an indicator dragging is active
    selectedPolygon = new SVGPolygon( null, '' );
    polygons        = {}; // All polygons in the editor {[key: string]: SvgPolygon}
    polyGroup       = {}; // SVG Group to store & render polygons

    layers = {
        img     : new LayerImage( this ),
        grid    : new LayerGrid( this ),
        svg     : new LayerSvg( this ),
    };
    
    // pointPool;
    stateMachine = new StateMachine();

    constructor( name ){
        this.elmContainer = document.querySelector( '#' + name );
        this.elmContainer.appendChild( this.elmView );

        this.elmView.className = 'mainView';
        this.elmView.style.transformOrigin = 'top left';

        this.stateMachine.reg(
            new OpManagePoly(this),
            new OpEditPoints(this),
            new OpAppendPoint(this),
        );

        this.stateMachine.push( 'managePolygon' );

        const svgLayer = this.layers.svg;
        svgLayer.on( 'pointerdown', this.onPointerDown );
        svgLayer.on( 'pointerup',   this.onPointerUp );
        svgLayer.on( 'pointermove', this.onPointerMove );
        svgLayer.on( 'dblclick',    this.onDBLClick );
    
        // Layout default SVG Elements
        this.polyGroup = svgLayer.createGroup('grpPoly');
        
        this.selectedPolygon.id = '';
        svgLayer.append( this.selectedPolygon.element );

        // --
        this.pointPool = new PointPool( svgLayer.createGroup('grpPnts') );
    }
    // #endregion

    // #region MISC
    useParentElementToResize(elm){
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        this.resizeObserver = new ResizeObserver(entries => {
            const ent = entries[0];
            const w = Math.round(ent.contentRect.width);
            const h = Math.round(ent.contentRect.height);
            this.setViewportSize(w, h);
        });

        this.resizeObserver.observe(elm.parentNode);
    }

    useTest(){
        const poly = this.addPolygon( [[20,20], [100,20], [100, 100]] );
    }
    // #endregion

    // #region VIEWPORT
    setViewportSize(w, h){
        if (this.elmContainer) {
            this.elmContainer.style.width = w + 'px';
            this.elmContainer.style.height = h + 'px';
        }
        return this;
    }

    setContentSize(w, h){
        this.elmView.style.width  = w + 'px';
        this.elmView.style.height = h + 'px';

        this.contentWidth  = w;
        this.contentHeight = h;

        for (const l of Object.values(this.layers)) l.setContentSize(w, h);

        return this;
    }

    transformCoordinates(x, y){
        const p = [x, y];
        return this.transform.applyInvTo(p);
    }

    zoomStep(s){
        this.setContentScale( this.transform.scl[0] + s );
    }

    setContentScale(v){
        const s = Math.max(1, v); // Prevent a scale less then 1
        this.transform.scl[0] = s;
        this.transform.scl[1] = s;
        this.updateContentTransform();
        // this.pointPool.setScale(v);
    }

    setContentRotation(){
        // Increment Rotation by 90 degrees while clamping it to 360
        const t = this.transform;
        t.rot = (t.rot + Math.PI * 0.5) % (Math.PI * 2);

        // Because of CSS transformation, things will be rotated out of the
        // viewport. So we need to adjust the position to compensate.
        const deg = Math.floor(t.rot * (180 / Math.PI));

        switch (deg) {
        case 0:
            t.pos[0] = 0;
            t.pos[1] = 0;
            break;
        case 90:
            t.pos[0] = 0;
            t.pos[1] = -this.contentHeight;
            break;
        case 180:
            t.pos[0] = -this.contentWidth;
            t.pos[1] = -this.contentHeight;
            break;
        case 270:
            t.pos[0] = -this.contentWidth;
            t.pos[1] = 0;
            break;
        }

        // Update Layers
        this.updateContentTransform();
    }

    updateContentTransform(){
        const t = this.transform;
        this.elmView.style.transform = `scale( ${t.scl[0]} ) rotate( ${t.rot}rad ) translate( ${t.pos[0]}px, ${t.pos[1]}px )`;

        this.scollToPolygonCenter();
    }

    scollToPolygonCenter(){
        if (this.selectedPolygon && this.elmContainer.current) {
        const box = this.elmContainer.current.getBoundingClientRect();

        const cp = this.selectedPolygon.getCenter();
        this.transform.applyRevTo(cp);

        const sx = Math.max(0, Math.round(cp[0] - box.width * 0.5));
        const sy = Math.max(0, Math.round(cp[1] - box.height * 0.5));

        this.elmContainer.scrollLeft = sx;
        this.elmContainer.scrollTop = sy;
        }
    }

    gridVisibility(b){
        this.layers.grid.visibility(b);
    }
    // #endregion

    // #region METHODS
    addPolygon( pnts, id=null ){
        const poly = new SVGPolygon( pnts, id );

        this.polygons[ poly.id ] = poly;
        this.polyGroup.append( poly.element );        
        return poly;
    }

    selectPolygon(id){
        // Stop if already selected
        if ( this.selectedPolygon.id === id) return;

        // Deselect previous polygon
        if ( this.selectedPolygon.id !== '') {
            const p = this.polygons[this.selectedPolygon.id];
            p.element.style.display = '';
            p.render();

            // Deselect
            this.selectedPolygon.id = '';
            this.selectedPolygon.element.style.display = 'none';
            this.stateMachine.clear(null, false);
        }

        // Select new polygon
        if (id !== '' && id != null) {
            const p = this.polygons[id];
            if (p) {
                p.element.style.display = 'none';

                this.selectedPolygon.copy(p).render();
                this.selectedPolygon.isSelected = true;
                this.selectedPolygon.element.style.display = '';
                this.stateMachine.push('managePolygon');

                this.scollToPolygonCenter();
            }
        }

        // Deselecting to no polygons.
        if (id === '') {
            this.selectedPolygon.id = '';
            this.selectedPolygon.element.style.display = 'none';
            this.stateMachine.clear(null, false);
        }
    }

    removeSelected() {
        const sm = this.stateMachine.getCurrent();
        if (sm.removeSelected) sm.removeSelected(this);
    }

    appendPoint() {
        if (!this.selectedPolygon) {
            console.log('Need to select a polygon to add a point', true);
            return;
        }

        if (this.stateMachine.isActive('appendPoint')) {
            console.log('Add point operation is currently on the stack', true);
            return;
        }

        this.stateMachine.push('appendPoint', this);
    }
    // #endregion

    // #region SVG LAYER EVENTS
    onPointerUp = (e) => {
        // console.log('SVG UP');

        // Pass Event to state machine
        const sm = this.stateMachine.getCurrent();
        if (sm) sm.onPointerUp(e);

        if (this.dragPointer !== -1) {
            this.layers.svg.releasePointer( this.dragPointer );
            this.dragPointer = -1;
        }
    };

    onPointerDown = (e) => {
        // console.log( 'SVG DOWN', e.target );

        const coord = this.transformCoordinates(e.layerX, e.layerY);
        const sm = this.stateMachine.getCurrent();
        if (sm && sm.onPointerDown(coord[0], coord[1], e)) {
            // Down will initiate a drag operation
            this.dragPointer = e.pointerId;
        }
    };

    onPointerMove = (e) => {
        // Is a Drag operation in progress?
        if (this.dragPointer !== -1) {
            this.layers.svg.capturePointer(this.dragPointer);
            e.preventDefault();
            e.stopPropagation();
        }

        // Pass event to state machone
        const coord = this.transformCoordinates(e.layerX, e.layerY);
        const sm = this.stateMachine.getCurrent();
        if (sm) sm.onPointerMove(coord[0], coord[1], e);
    };

    onDBLClick = (e) => {
        const elm = e.target;

        switch (elm.nodeName) {
        default:
            this.stateMachine.getCurrent()?.onDblClick(e);
            break;
        }
    };
    // #endregion
}


