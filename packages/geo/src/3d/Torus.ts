// #region IMPORT
import { Maths }    from '@oito/core';
import { Vec3 }     from '@oito/oop';
// #endregion

// #region TYPES
type TMap  = { [key:string] : number | boolean };
type Props = {
    outerRadius : number,
    outerSteps  : number,
    innerRadius : number,
    innerSteps  : number,
};
// #endregion

export default class Torus{
    // https://github.com/glo-js/primitive-torus
    static create( _props: TMap ): TGeo{
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const props: Props = Object.assign({
            outerRadius : 0.5,
            outerSteps  : 8, 
            innerRadius : 0.15,
            innerSteps  : 6,
        }, _props );

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const ind  : Array<number> = [];
        const norm : Array<number> = [];
        const uv   : Array<number> = [];
        const rtn  : TGeo = { 
            vertices : [],
            indices  : ind,
            normals  : norm,
            texcoord : uv,
        };

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create Vertices + Normals + UV
        const pv = new Vec3();
        const cv = [0,0,0]; // Center Point

        let u_cos: number, u_sin: number, v_cos: number, v_sin: number;
        let i: number, j: number;
        let u = 0, v= 0 , jt = 0, ti = 0;

        for( j=0; j <= props.innerSteps; j++ ){
            jt      = j /  props.innerSteps
            v       = jt * Maths.TAU;
            v_cos   = Math.cos( v );
            v_sin   = Math.sin( v );

            for( i=0; i <=  props.outerSteps; i++ ){
                ti      = i /  props.outerSteps;
                u       = ti * Maths.TAU;
                u_cos   = Math.cos( u );
                u_sin   = Math.sin( u );

                // Center Point Around
                cv[ 0 ] =  props.outerRadius * u_cos;
                cv[ 2 ] =  props.outerRadius * u_sin;

                // Point Round Center
                pv[ 0 ] = ( props.outerRadius +  props.innerRadius * v_cos ) * u_cos;
                pv[ 1 ] =   props.innerRadius * v_sin;
                pv[ 2 ] = ( props.outerRadius +  props.innerRadius * v_cos ) * u_sin;
                
                pv  .pushTo( rtn.vertices )
                    .sub( cv )
                    .norm()
                    .pushTo( norm );

                uv.push( ti, jt );
            }
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let a: number, b: number, c: number, d: number;
        for( j=1; j <= props.innerSteps; j++ ){
            for( i=1; i <= props.outerSteps; i++ ){
                a = ( props.outerSteps + 1 ) * j + i - 1
                b = ( props.outerSteps + 1 ) * ( j - 1 ) + i - 1
                c = ( props.outerSteps + 1 ) * ( j - 1 ) + i
                d = ( props.outerSteps + 1 ) * j + i
                ind.push( a, d, c, c, b, a );
            }
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        return rtn;
    }

}