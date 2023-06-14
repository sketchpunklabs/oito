// #region TYPES
type TMap  = { [key:string] : number | boolean };
type Props = {
    width       : number,
    height      : number,
    center      : boolean,
    vertical    : boolean,
};
// #endregion

export default class Quad{

    static create( _props: TMap ): TGeo{
        const props: Props = Object.assign({
            width       : 1,
            height      : 1,
            center      : true,
            vertical    : false,
        }, _props );
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let wp: number;
        let hp: number;
        let wn: number;
        let hn: number;

        if( props.center ){
            wp = props.width  * 0.5;
            hp = props.height * 0.5;
            wn = -props.width  * 0.5;
            hn = -props.height * 0.5;
        }else{
            wp = props.width;
            hp = props.height;
            wn = 0;
            hn = 0;
        }

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const norm  : Array<number> = [];
        const verts : Array<number> = [];
        const rtn   : TGeo = { 
            indices     : [ 0,1,2, 2,3,0 ],
            texcoord    : [ 0,0,  0,1,  1,1,  1,0 ],
            normals     : norm,
            vertices    : verts,
        };
    
        if( props.vertical ){ 
            // Quad Facing Forward
            norm.push( 0,0,1,  0,0,1,  0,0,1,  0,0,1 );
            verts.push( 
                wn, hp, 0.0,
                wn, hn, 0.0,
                wp, hn, 0.0,
                wp, hp, 0.0 );
    
        }else{
            // Quad Facing Up
            norm.push( 0,1,0,  0,1,0,  0,1,0,  0,1,0 );
            verts.push(
                wn, 0.0, hn,
                wn, 0.0, hp,
                wp, 0.0, hp,
                wp, 0.0, hn );
        }

        return rtn;
    }

}

// static getInterleaved() : { indices:Array<number>, buffer:Array<number> }{
//     return {
//         indices : [ 0,1,2, 2,3,0 ],
//         buffer  : [ 
//             -0.5,  0.5, 0.0,   0,0,1,   0,0,
//             -0.5, -0.5, 0.0,   0,0,1,   0,1,
//              0.5, -0.5, 0.0,   0,0,1,   1,1, 
//              0.5,  0.5, 0.0,   0,0,1,   1,0 ]
//     };
// }