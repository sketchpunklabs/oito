export default function nanoID( t=21 ){
    const r = crypto.getRandomValues( new Uint8Array( t ) );
    let n, e = '';
    for( ;t--; ){
        n  = 63 & r[ t ];
        e += ( n < 36 )? n.toString( 36 ) : 
             ( n < 62 )? ( n - 26 ).toString( 36 ).toUpperCase() : 
             ( n < 63 )? '_' : '-';
    }
    return e;
}