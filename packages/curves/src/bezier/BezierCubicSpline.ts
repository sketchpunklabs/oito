// #region IMPORTS
import { Spline, Point }    from '../Spline';
import BezierCubic          from './BezierCubic';

import { Maths }            from '@oito/core';
// #endregion

export default class BezierCubicSpline extends Spline{
    // #region MANAGE POINTS
    add( pos: TVec3 ) : Point{
        const o = super.add( pos );
        this._curveCnt = Math.max( 0, Math.floor( (this._pointCnt - 1) / 3 ) );
        return o;
    }
    // #endregion

    // #region GETTERS
    get curveCount() : number{ 
        return ( !this._isLoop )? this._curveCnt : this._curveCnt + 1;
    }
    // #endregion

    // #region SPLINE OPERATIONS
    /** Get Position and Dertivates of the Spline at T */
    at( t: number, pos ?: TVec3, dxdy ?: TVec3, dxdy2 ?: TVec3 ): void{
        if( t > 1 )      t = 1;
        else if( t < 0 ) t = 0;

        const p                  = this.points;
        const [ a, b, c, d, tt ] = ( !this._isLoop )?
            this._computeCurveIdx( t ) :
            this._computeLoopIdx( t ) ;

        if( pos )   BezierCubic.at(    p[a].pos, p[b].pos, p[c].pos, p[d].pos, tt, pos );
        if( dxdy )  BezierCubic.dxdy(  p[a].pos, p[b].pos, p[c].pos, p[d].pos, tt, dxdy );
        if( dxdy2 ) BezierCubic.dxdy2( p[a].pos, p[b].pos, p[c].pos, p[d].pos, tt, dxdy2 );
    }

    atCurve( cIdx: number, t: number, pos ?: TVec3, dxdy ?: TVec3, dxdy2 ?: TVec3 ): void{
        if( t > 1 )      t = 1;
        else if( t < 0 ) t = 0;

        const p = this.points;
        const a = cIdx * 3;
        const b = Maths.mod( a + 1, this._pointCnt );
        const c = Maths.mod( a + 2, this._pointCnt );
        const d = Maths.mod( a + 3, this._pointCnt );

        if( pos )   BezierCubic.at(    p[a].pos, p[b].pos, p[c].pos, p[d].pos, t, pos );
        if( dxdy )  BezierCubic.dxdy(  p[a].pos, p[b].pos, p[c].pos, p[d].pos, t, dxdy );
        if( dxdy2 ) BezierCubic.dxdy2( p[a].pos, p[b].pos, p[c].pos, p[d].pos, t, dxdy2 );
    }
    // #endregion

    // #region HELPERS
    /** Compute the point indices for open spline : Return: [ aIdx, bIdx, cIdx, dIdx, t ] */
    _computeCurveIdx( t: number ) : [number,number,number,number,number]{
        let i, tt;

        if( t != 1 ){
            tt  = t * this._curveCnt;   // Using Curve count as a way to get the Index and the remainder is the T of the curve
            i   = tt | 0;	            // BitwiseOR 0 same op as Floor
            tt -= i;		            // Strip out the whole number to get the decimal to be used for the T of curve ( FRACT )
            i  *= 3;                    // Every 3 points Plus one back counts as 1 bezier cubic curve
        }else{
            i	= ( this._curveCnt - 1 ) * 3;
            tt	= 1;                        // The end of the final curve.
        }

        return [ i, i+1, i+2, i+3, tt ];
    }

    /** Compute the point indices for closed spline : Return: [ aIdx, bIdx, cIdx, dIdx, t ] */
    _computeLoopIdx( t: number ) : [number,number,number,number,number]{
        let i, tt;

        if( t != 1 ){
            tt  = t * ( this._curveCnt + 1 );   // Using Curve count as a way to get the Index and the remainder is the T of the curve
            i   = tt | 0;	            // BitwiseOR 0 same op as Floor
            tt -= i;		            // Strip out the whole number to get the decimal to be used for the T of curve ( FRACT )
            i  *= 3;                    // Every 3 points Plus one back counts as 1 bezier cubic curve
        }else{
            i	= this._pointCnt - 3;
            tt	= 1;                    // The end of the final curve.
        }

        return [ 
            i, 
            Maths.mod( i+1, this._pointCnt ), 
            Maths.mod( i+2, this._pointCnt ), 
            Maths.mod( i+3, this._pointCnt ), 
            tt
        ];
    }
    // #endregion
}