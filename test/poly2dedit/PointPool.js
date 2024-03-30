const DEFAULT_PNT_SIZE = 6;

export default class PointPool {
    // #region MAIN
    cache       = [];   // Collection of reusable elements
    active      = [];   // Collection of currently used elements
    group       = null; // SVG Group to add all circle elements
    scaleFactor = 1;    // Scale the point size

    constructor(grp){
        this.group = grp;
    }
    // #endregion

    // #region METHODS
    setScale(v){
        // Invert scale. As it gets larger we want points to scale smaller & vice versa
        // This creates the illusion that the point size is constant no matter the zoom level
        this.scaleFactor = 1 / v;

        // Update all active points of new size
        for (const elm of this.active) {
            elm.style.strokeWidth = DEFAULT_PNT_SIZE * this.scaleFactor;
        }
    }
    // #endregion

    // #region OBJECT POOL
    getElement(idx, x, y){
        let elm;

        if (this.cache.length > 0) {
            // Recycle item
            elm = this.cache.pop();
        } else {
            // Create new item
            elm = document.createElementNS('http://www.w3.org/2000/svg', 'circle' );
            elm.setAttributeNS(null, 'r', '1');
            elm.setAttribute('class', 'pnt');
            this.group.appendChild(elm);
        }

        // Setup element
        elm.dataset.idx = idx;
        elm.setAttribute('cx', x.toString());
        elm.setAttribute('cy', y.toString());
        elm.setAttribute('visibility', 'visible');
        elm.style.strokeWidth = DEFAULT_PNT_SIZE * this.scaleFactor;

        // Save
        this.active.push(elm);
        return elm;
    }

    selElement(elm, isSel = true) {
        if (isSel)  elm.setAttribute('class', 'pnt sel' );
        else        elm.setAttribute('class', 'pnt' );
    }

    releaseElement(elm){
        elm.setAttribute('visibility', 'collapse');
        elm.setAttribute('class', 'pnt');

        if (this.cache.indexOf(elm) >= 0) return;

        this.cache.push(elm);

        if(this.active.length > 1){
            const max = this.active.length - 1;     // Max Index
            const idx = this.active.indexOf(elm);   // Find index of item to release

            this.active[idx]   = this.active[max];  // Move last item to deleted item
            this.active.length = max;               // Shrink Array
        } else {
            this.active.length = 0;
        }
    }

    releaseAll(){
        let elm;
        while( this.active.length > 0 ){
            elm = this.active.pop();
            elm.setAttribute( 'visibility', 'collapse' );
            elm.setAttribute( 'class', 'pnt' );
            this.cache.push(elm);
        }

        return this;
    }
    // #endregion
}
