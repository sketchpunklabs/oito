export default class SvgLayer{
    // #region MAIN
    elmContainer = null;
    constructor( editor ){
        this.elmContainer = Elm( 'svg' );
        this.elmContainer.style.transformOrigin = 'top left';
        Atr( this.elmContainer, 'class', 'svgLayer' );

        if( editor ) this.init( editor );
    }
    // #endregion

    // #region ELEMENTS
    createGroup( id ){
        const elm = Elm('g');
        if (id !== undefined) Atr(elm, 'id', id);

        this.elmContainer.appendChild(elm);
        return elm;
    }

    append(elm){ this.elmContainer.appendChild(elm); }
    // #endregion

    // #region INTERFACE
    init(editor){ editor.elmView.appendChild( this.elmContainer ); return this; }

    dispose() {}

    setContentSize(w, h){
        this.elmContainer.style.width  = w + 'px';
        this.elmContainer.style.height = h + 'px';
    }
    // #endregion

    // #region EVENTS
    once( evtName, fn ){ this.elmContainer.addEventListener(evtName, fn, {once: true}); return this; }
    on( evtName, fn ){ this.elmContainer.addEventListener(evtName, fn); return this; }
    off(evtName, fn) { this.elmContainer.removeEventListener(evtName, fn); return this; }
    capturePointer(id){ this.elmContainer.setPointerCapture(id); return this; }
    releasePointer(id){ this.elmContainer.releasePointerCapture(id); return this; }
    // #endregion
}

// #region HELPERS
function Elm( name ){ return document.createElementNS( 'http://www.w3.org/2000/svg', name ); }
function Atr( elm, name, val ){ elm.setAttributeNS( null, name, val ); }
// #endregion