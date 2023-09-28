// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
// https://en.wikipedia.org/wiki/Lehmer_random_number_generator

export default class RandomLCG{
    // #region MAIN
    _seed !: number;
    _num  !: number;
    constructor( s = 1 ){ this.seed = s; }
    
    _lcg( n:number ): number{ return n * 48271 % 2147483647; }

    set seed( s:number ){
        this._seed = Math.max( s, 1 );
        this._num  = this._lcg( this._seed );
    }
    // #endregion
    
    // #region METHODS
    reset(): this{ this._num = this._lcg( this._seed ); return this; }

    next(): number{ return ( this._num = this._lcg( this._num ) ) / 2147483648; }

    probability( n: number ): boolean{ return ( !!n && this.next() <= n ); }
    // #endregion
}