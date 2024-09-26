// https://library.superhi.com/posts/how-to-paint-with-code-creating-paintbrushes
// https://dev.to/ascorbic/a-more-realistic-html-canvas-paint-tool-313b
// http://perfectionkills.com/exploring-canvas-drawing-techniques/
// https://lazybrush.dulnan.net/
// https://jsfiddle.net/Fidel90/x35uou5w/ ERASE TOOL

// https://medium.com/@kozo002/how-to-draw-without-antialiasing-on-html5-canvas-cf13294a8e58
// https://github.com/kozo002/non-antialias-painting/
// https://kozo002.github.io/non-antialias-painting/

// http://members.chello.at/easyfilter/canvas.html
// http://members.chello.at/easyfilter/bresenham.js

// TODO - All Canvas operations should be moved to its own class
// so that each drawing layer is an instance of it. Will
// clean up layer class by doing this.

export default class PixelDrawLayer{
    // #region MAIN
    elmContainer  = null;
    elmPreview    = null;
    elmDraw       = null;
    elmFinal      = null;
    ctxDraw       = null;
    ctxPreview    = null;
    ctxFinal      = null;
    size          = [0, 0]; // Width & height of the canvas

    constructor( editor ){
        this.elmContainer = document.createElement( 'div' );
        this.elmContainer.style.transformOrigin = 'top left';
        this.elmContainer.className             = 'pixelLayer';

        this.elmPreview = document.createElement( 'canvas' );
        this.elmDraw    = document.createElement( 'canvas' );
        this.elmFinal    = document.createElement( 'canvas' );

        this.elmDraw.style.imageRendering    = 'pixelated';
        this.elmPreview.style.imageRendering = 'pixelated';
        this.elmFinal.style.imageRendering = 'pixelated';

        this.elmContainer.appendChild( this.elmFinal );
        this.elmContainer.appendChild( this.elmDraw );
        this.elmContainer.appendChild( this.elmPreview );

        this.ctxFinal   = this.elmFinal.getContext( '2d', { willReadFrequently: true } );
        this.ctxDraw    = this.elmDraw.getContext( '2d', { willReadFrequently: true } );
        this.ctxPreview = this.elmPreview.getContext( '2d' );

        this.elmFinal.imageSmoothingQuality    = false;
        this.ctxDraw.imageSmoothingQuality     = false;
        this.ctxPreview.imageSmoothingQuality  = false;

        if( editor ) this.init( editor );
    }
    // #endregion

    // #region METHODS
    getCurrentSize(){ return [this.size[0], this.size[1]]; }

    setOpacity(v){ this.elmContainer.style.opacity = v.toString(); return this; }

    clearPreview(){ this.ctxPreview.clearRect( 0, 0, this.size[0], this.size[1] ); return this; }
    clearDraw(){ this.ctxDraw.clearRect( 0, 0, this.size[0], this.size[1] ); return this; }
    clearFinal(){ this.ctxFinal.clearRect( 0, 0, this.size[0], this.size[1] ); return this; }

    getDrawData(){ return this.ctxDraw.getImageData( 0, 0, this.size[0], this.size[1] ); }
    getFinalData(){ return this.ctxFinal.getImageData( 0, 0, this.size[0], this.size[1] );}

    setFinalData( imgData ){ this.ctxFinal.putImageData( imgData, 0, 0 ); return this; }
    // #endregion

    // #region DRAWING METHODS
    setFillColor( c ){ this.ctxDraw.fillStyle = c; return this; }
    setErase( b ){ this.ctxFinal.globalCompositeOperation = b ? 'destination-out' : 'source-over'; return this; }

    drawCircle( pos, r, usePreview=true ){
        const ctx = ( usePreview )? this.ctxPreview : this.ctxDraw;
        ctx.beginPath();
        ctx.arc( pos[0], pos[1], r, 0, 2*Math.PI );
        ctx.fill(); // ctx.stroke();
    }

    drawLine( a, b, usePreview=true ){
        const ctx = ( usePreview )? this.ctxPreview : this.ctxDraw;
        ctx.beginPath();
        ctx.moveTo( a[0], a[1] );
        ctx.lineTo( b[0], b[1] );
        ctx.stroke();
    }

    drawPolygon( pnts, usePreview=true ){
        const ctx = ( usePreview )? this.ctxPreview : this.ctxDraw;
        ctx.beginPath();
        ctx.moveTo( pnts[0][0], pnts[0][1]);

        for( let i=1; i < pnts.length; i++ ){
            const p = pnts[i];
            ctx.lineTo( p[0], p[1] );
        }

        ctx.lineTo( pnts[0][0], pnts[0][1] );
        ctx.closePath();
        ctx.fill();
    }
    // #endregion

    // #region INTERFACE
    init( editor ){ editor.elmView.appendChild( this.elmContainer ); }

    dispose(){ this.elmContainer.parentNode?.removeChild(this.elmContainer); }

    setContentSize( w, h ){
        // resetting the content size will erase the canvas image
        this.elmDraw.style.width        = w + 'px';
        this.elmDraw.style.height       = h + 'px';
        this.elmDraw.width              = w;
        this.elmDraw.height             = h;

        this.elmPreview.style.width     = w + 'px';
        this.elmPreview.style.height    = h + 'px';
        this.elmPreview.width           = w;
        this.elmPreview.height          = h;

        this.elmFinal.style.width       = w + 'px';
        this.elmFinal.style.height      = h + 'px';
        this.elmFinal.width             = w;
        this.elmFinal.height            = h;

        this.size                       = [w,h];
    }
    // #endregion

    // #region PRIVATE
    // #endregion
}


/*
Bresenham algorithm
http://members.chello.at/easyfilter/canvas.html
http://members.chello.at/easyfilter/bresenham.js


function plotLine( x0, y0, x1, y1 ){
   var dx =  Math.abs(x1-x0), sx = x0<x1 ? 1 : -1;
   var dy = -Math.abs(y1-y0), sy = y0<y1 ? 1 : -1;
   var err = dx+dy, e2;                                   // error value e_xy

   for (;;){                                                          // loop
    setPixel(x0,y0);
    if (x0 == x1 && y0 == y1) break;
    e2 = 2*err;
    if (e2 >= dy) { err += dy; x0 += sx; }                        // x step 
    if (e2 <= dx) { err += dx; y0 += sy; }                        // y step 
 }
}


function plotCircle( xm, ym, r ){
   var x = -r, y = 0, err = 2-2*r;                // bottom left to top right
   do {
    setPixel(xm-x, ym+y);                            //   I. Quadrant +x +y
    setPixel(xm-y, ym-x);                            //  II. Quadrant -x +y
    setPixel(xm+x, ym-y);                            // III. Quadrant -x -y
    setPixel(xm+y, ym+x);                            //  IV. Quadrant +x -y
    r = err;                                       
    if (r <= y) err += ++y*2+1;                                   // y step
    if (r > x || err > y) err += ++x*2+1;                         // x step
 } while (x < 0);
}

function plotEllipse( xm, ym, a, b ){
   var x = -a, y = 0;           // II. quadrant from bottom left to top right 
   var e2, dx = (1+2*x)*b*b;                              // error increment  
   var dy = x*x, err = dx+dy;                              // error of 1.step 

   do {
       setPixel(xm-x, ym+y);                                 //   I. Quadrant 
       setPixel(xm+x, ym+y);                                 //  II. Quadrant 
       setPixel(xm+x, ym-y);                                 // III. Quadrant 
       setPixel(xm-x, ym-y);                                 //  IV. Quadrant 
       e2 = 2*err;                                        
       if (e2 >= dx) { x++; err += dx += 2*b*b; }                   // x step 
       if (e2 <= dy) { y++; err += dy += 2*a*a; }                   // y step 
   } while (x <= 0);

   while (y++ < b) {            // too early stop for flat ellipses with a=1, 
       setPixel(xm, ym+y);                        // -> finish tip of ellipse 
       setPixel(xm, ym-y);
   }
}

*/