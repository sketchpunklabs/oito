export default class SvgPolygon {
    // #region MAIN
    #id           = '';
    points        = []; // Array< [number, number] >
    color         = '#00ff00';
    #isSelected   = false;
    element       = document.createElementNS( 'http://www.w3.org/2000/svg', 'polygon' );

    constructor( pnts=null, id=null ){
        this.element.setAttribute( 'class', 'poly' );

        this.id = id || window.crypto.randomUUID();

        if(pnts){
            this.points = pnts;
            this.render();
        }
    }
    // #endregion

    // #region GETTER / SETTERS
    get id(){ return this.#id; }
    set id(id){ this.#id = id; this.element.setAttribute('id', this.#id); }

    get isSelected(){ return this.#isSelected; }
    set isSelected(b){
        this.#isSelected = b;
        if (b) {
            this.element.setAttribute('class', 'poly sel');
            this.element.setAttribute('fill', 'transparent');
        } else {
            this.element.setAttribute('class', 'poly');
            this.element.setAttribute('fill', this.color);
        }
    }

    getCenter(out = [0, 0]){
        out[0] = 0;
        out[1] = 0;

        for (const p of this.points) {
            out[0] += p[0];
            out[1] += p[1];
        }

        out[0] /= this.points.length;
        out[1] /= this.points.length;

        return out;
    }

    copy(poly){
        this.id     = poly.id;
        this.color  = poly.color;

        // Clone points with new references for each vec2
        this.points = [];
        for (const p of poly.points) this.points.push( p.slice() );
        return this;
    }
  // #endregion

    // #region MISC
    render() {
        // points='0,0 100,100, 100,50'
        let pStr = '';
        for (const p of this.points) pStr += p[0] + ',' + p[1] + ' ';

        this.element.setAttribute('points', pStr);
        if (!this.#isSelected) this.element.setAttribute('fill', this.color);
    }
    // #endregion
}