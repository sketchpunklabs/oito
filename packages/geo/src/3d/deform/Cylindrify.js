// https://github.com/keenanwoodall/Deform/blob/master/Code/Runtime/Mesh/Deformers/CylindrifyDeformer.cs
function yCylindrify( pnts, radius=3, t=0.5 ){
    const ti = 1-t;
    let p;
    let a;
    let b;
    let len;

    for( p of pnts ){
        a = p[0];
        b = p[2] - radius;

        len = Math.sqrt( a**2 + b**2 );
        a   = ( len != 0 )? a / len : 0;
        b   = ( len != 0 )? b / len : 0;

        p[0] = p[0] * ti + a * radius * t;
        p[2] = p[2] * ti + b * radius * t + radius * t;
    }
}

function zCylindrify( pnts, radius=1, t=0.5 ){
    const ti = 1-t;
    let p;
    let a;
    let b;
    let len;

    for( p of pnts ){
        // Get the rotating components with radius offset
        a = p[0];
        b = p[1] - radius;

        // Normalize
        len = Math.sqrt( a**2 + b**2 );
        a   = ( len != 0 )? a / len : 0;
        b   = ( len != 0 )? b / len : 0;

        p[0] = p[0] * ti + a * radius * t;
        p[1] = p[1] * ti + b * radius * t + radius * t;
    }
}
