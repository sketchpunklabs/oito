/* eslint-disable @typescript-eslint/no-explicit-any */
type TFunc = (...args: any) => any;

export default class Fn{

    // delay in milliseconds
    // eslint-disable-next-line @typescript-eslint/ban-types
    static debounce<T extends TFunc>( fn: T, delay: number = 20 ): T{
        let id: number = -1;
        const caller: TFunc = ( ...args: any )=>{
            if( id !== -1 ) clearTimeout( id );
            // id = setTimeout( ()=>fn.apply( null, arguments ), delay );
            id = setTimeout( ()=>fn( ...args ), delay );
        };

        return <T>caller; // ((caller as any) as T)
    }
    
    // eslint-disable-next-line @typescript-eslint/ban-types
    static memorize<T extends Function>( fn: T ): T{
        const cache: Record<string, any> = {};
        const caller = ( ...args: any ): any => {
            const key = args.toString();
            if( key in cache ) return cache[ key ];
    
            const result = fn( ...args );
            cache[ key ] = result;
            return result;
        }

        return <T>(<any>caller);
    }
    
    // delay in milliseconds
    // eslint-disable-next-line @typescript-eslint/ban-types
    static throttle<T extends Function>( fn: T, delay: number = 20 ): T{
        let lastTime = 0;
        const caller = ( ...args: any )=>{
            const now = new Date().getTime();
            if( now - lastTime < delay ) return;
            lastTime = now;
            fn( ...args );
        };
        
        return <T>(<any>caller);
    }

    static pipe( ...fnArray: Array<any> ): any {
        const caller = ( ...args: any )=>{
            let result = fnArray[ 0 ]( ...args );

            for( let i=1; i < fnArray.length; i++ ){
                result = fnArray[ i ]( result );
            }

            return result;
        };

        return caller;
    }

    // static compose( ...functions){
    //     return ( input ) => {
    //         return functions.reduceRight(
    //             ( acc, fn ) => { return fn(acc); }
    //         , input );
    //     };
    // }

    static promise( fn: TFunc ){
        const caller = ( ...args: any )=>{
            return new Promise( ( resolve, reject ) => {
                try{
                    resolve( fn( ...args ) );
                }catch( e ){ 
                    reject( e );
                }
            });
        };

        return caller;
    }

    static promiseNow<T>( fn: TFunc, ...args: any ): Promise<T>{
        return new Promise( ( resolve, reject ) => {
            try{
                resolve( fn( ...args ) );
            }catch( e ){ 
                reject( e );
            }
        });
    }

}