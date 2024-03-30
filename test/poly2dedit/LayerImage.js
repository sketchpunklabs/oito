export default class ImageLayer{
    // #region MAIN
    elmContainer    = null;
    imageSize       = [0, 0];

    constructor( editor ){
        this.elmContainer                         = document.createElement( 'img' );
        this.elmContainer.style.transformOrigin   = 'top left';
        this.elmContainer.className               = 'imageLayer';

        if( editor ) this.init( editor );
    }
    // #endregion
  
    // #region METHODS
    loadImage( img ){
        this.elmContainer.src          = img.src;
        this.elmContainer.style.width  = img.width  + 'px';
        this.elmContainer.style.height = img.height + 'px';
        this.imageSize                 = [img.width, img.height];
    }
  
    getCurrentSize(){
        const box = this.elmContainer.getBoundingClientRect();
        return [box.width, box.height];
    }
    // #endregion
  
    // #region INTERFACE
    init(editor){
        editor.elmView.appendChild( this.elmContainer );
    }
  
    dispose(){}
  
    setContentSize( w, h ){
        this.elmContainer.style.width     = w + 'px';
        this.elmContainer.style.height    = h + 'px';
    }
    // #endregion
  }
  