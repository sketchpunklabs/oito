export default function nanoID( t: number = 21 ): string{
    const r = crypto.getRandomValues( new Uint8Array( t ) );
    let n: number;
    let e: string = '';
    for( ;t--; ){
        n  = 63 & r[ t ];
        e += ( n < 36 )? n.toString( 36 ) : 
             ( n < 62 )? ( n - 26 ).toString( 36 ).toUpperCase() : 
             ( n < 63 )? '_' : '-';
    }
    return e;
}