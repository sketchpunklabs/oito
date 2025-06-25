// #region IMPORTS
import { Spline, Point }    from '../Spline';
import Nurbs                from './Nurbs';
// #endregion


export default class NurbsSpline extends Spline{
    // #region MAIN
    degree : number        = 2;     // Kind of related topoint count, deg = p.len - 1 but, you can have deg=2 and p.len=5
    knots  : Array<number> = [];    // Knot Scalars
    wgts   : Array<number> = [];    // Weight values per point
    constructor(){ super(); }
    // #endregion

    // #region MANAGE POINTS
    add( pos: TVec3, wgt: number = 1 ): Point{
        const o = super.add( pos );
        
        this.wgts.push( wgt );
        this.degree = this.points.length - 1;
        return o;
    }
    // #endregion

    // #region GETTERS
    get curveCount() : number{ return 1; }
    // #endregion

    // #region SPLINE OPERATIONS

    /** Get Position and Dertivates of the Spline at T */
    at( t: number, pos ?: TVec3, dxdy ?: TVec3 ): void{
        if( t > 1 )      t = 1;
        else if( t < 0 ) t = 0;

        // Because of the algorithm, position is needed to compute tangent, so if pos id not
        // passed then pass one in to make the function work.
        Nurbs.at( t, this.degree, this.knots, this.points, this.wgts, pos ?? [0,0,0], dxdy );
    }

    generateKnots( clampStart=true, clampEnd=true ): this{
        const knots = Nurbs.calcKnots( this.degree, this.points.length, clampStart, clampEnd );
        if( knots ) this.knots = knots;
        return this
    }

    // #endregion
}
