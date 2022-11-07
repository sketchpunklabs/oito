export default function uuid(){
    let dt = new Date().getTime();
    if( window.performance && typeof window.performance.now === 'function' ) dt += performance.now(); // use high-precision timer if available
    
    const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, c=>{
        const r = ( dt + Math.random() * 16 ) % 16 | 0;
        dt = Math.floor( dt / 16 );
        return ( ( c == 'x' )? r : ( r & 0x3 | 0x8 ) ).toString( 16 );
    });

    return id;
}