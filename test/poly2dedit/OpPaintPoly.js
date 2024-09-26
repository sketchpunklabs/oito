
export default class PaintPolyOp{
    // #region MAIN
    name        = 'paintPoly';
    editor      = null;
    layer       = null;
    isDown      = false;
    points      = [];
    hitRange    = 10 ** 2; // Pixel Distance Squared

    constructor( editor ){ this.editor = editor; }
    // #endregion

    // #region STATE MACHINE INTERFACE
    onInit(_obj){
        this.layer          = this.editor.layers.pixel; 
        this.points.length  = 0;
        this.editor.setCursor( 'cell' );
    }

    onRelease(_obj){
        this.editor.setCursor();
        this.layer.clearPreview().setErase( false );
        this.layer = null;
    }

    onSuspend(_obj){}
    onWakeup(_obj){}
    validateStartup(_obj){ return true; }
    dispose(){ 
        this.onRelease(); 
        this.editor = null;
    }
    // #endregion

    // #region INPUT INTERFACE
    onPointerDown( x, y, e, obj ){
        const pnt       = [x,y];
        const lastIdx   = this.points.length;

        if( lastIdx > 0 ){
            const fpos = this.points[ 0 ];
            const dist = ( fpos[0] - pnt[0] )**2 + ( fpos[1] - pnt[1] )**2;

            if( dist <= this.hitRange ){
                this.layer
                    .setErase( this.editor.painting.isErase )
                    .setFillColor( this.editor.painting.color )
                    .drawPolygon( this.points, false );

                this.reset();
                return;
            }

            this.layer.drawLine( this.points[ lastIdx-1 ], pnt );
        }

        this.points.push( pnt );
        this.layer.drawCircle( pnt, 5 );
        return false;
    }

    onPointerMove( x, y, e, obj ){}
    onPointerUp( _e, _obj ){ }
    onPointerCancel( _e, _obj ){ }
    onDblClick( _e, _obj ){ 
        this.reset();
        return false;
    }
    // #endregion

    // #region METHODS

    reset(){
        this.points.length = 0;
        this.layer.clearPreview();
    }

    // #endregion
}
