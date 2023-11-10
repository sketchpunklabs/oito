// Common free hash algorithm
// Performance tests of javascript hash functions, FunHash is on the list : https://output.jsbin.com/leqifey

export default class FunHash {
    // Original algorithm for hashing string data
    static string( s: string ): number {
        let h: number = 0xdeadbeef;
        for (let i: number = 0; i < s.length; i++) {
            h = Math.imul( h ^ s.charCodeAt( i ), 2654435761 );
        }
        return ( h ^ ( h >>> 16 ) ) >>> 0;
    }

    // Modified version that takes in a number array
    // Very small float changes is not detected by the hash, passing
    // in a scale value can help fix the problem
    static numberArray( ary: Array<number>, scale: number = 1): number {
        let h: number = 0xdeadbeef;
        for (let i = 0; i < ary.length; i++) {
            h = Math.imul( h ^ ( ary[ i ] * scale ), 2654435761 );
        }
        return ( h ^ ( h >>> 16 ) ) >>> 0;
    }
}