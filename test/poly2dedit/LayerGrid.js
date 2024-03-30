export default class GridLayer{
    // #region MAIN
    elmContainer = null;
    constructor( editor=null ) {
        this.elmContainer = document.createElement( 'div' );
        this.elmContainer.style.transformOrigin = 'top left';
        this.elmContainer.className = 'gridLayer dark';

        if( editor ) this.init( editor );
    }
    // #endregion

    // #region LAYER INTERFACE
    init( editor ){
        editor.elmView.appendChild( this.elmContainer );
        return this;
    }

    dispose() {}

    setContentSize(w, h){
        this.elmContainer.style.width  = w + 'px';
        this.elmContainer.style.height = h + 'px';
    }

    visibility(v){
        this.elmContainer.style.display = v ? 'block' : 'none';
    }
    // #endregion
}