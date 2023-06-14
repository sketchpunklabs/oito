import * as THREE   from 'three';

export default class Util{

    static geoBuffer( props ){
        const p = Object.assign( {
            indices     : null,
            normal      : null,
            uv          : null,
            joints      : null,
            weights     : null,
            skinSize    : 4,
        }, props );

        const geo = new THREE.BufferGeometry();
        geo.setAttribute( 'position', new THREE.BufferAttribute( 
            ( p.vertices instanceof Float32Array )? p.vertices : new Float32Array( p.vertices ),
            3
        ));

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Optional vertex buffers
        if( p.indices ) geo.setIndex( new THREE.BufferAttribute( 
            ( p.indices instanceof Uint16Array )? p.indices : new Uint16Array( p.indices ),
            1 
        ));

        if( p.normal ) geo.setAttribute( 'normal', new THREE.BufferAttribute( 
            ( p.normal instanceof Float32Array )? p.normal : new Float32Array( p.normal ),
            3
        ));

        if( p.uv ) geo.setAttribute( 'uv', new THREE.BufferAttribute( 
            ( p.uv instanceof Float32Array )? p.uv : new Float32Array( p.uv ), 
            2
        ));
        
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Skinned Buffers
        if( p.joints && p.weights ){
            geo.setAttribute( 'skinWeight', new THREE.BufferAttribute(
                ( p.weights instanceof Float32Array )? p.weights : new Float32Array( p.weights ), 
                p.skinSize 
            ));

            geo.setAttribute( 'skinIndex',  new THREE.BufferAttribute(
                ( p.joints instanceof Float32Array )? p.joints : new Float32Array( p.joints ), 
                p.skinSize 
            ));
        }

        return geo;
    }

}