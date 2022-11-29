import { vec3, quat, mat4 } from 'gl-matrix';

// https://gabormakesgames.com/blog_transforms_transforms.html
// https://gabormakesgames.com/blog_transforms_transform_world.html

// #region MISC
export function create( rot=null, pos=null, scl=null ){ 
    return { 
        rot : ( rot )? rot.slice() : [0,0,0,1], 
        pos : ( pos )? pos.slice() : [0,0,0], 
        scl : ( scl )? scl.slice() : [1,1,1],
    };
}

export function clone( a ){ return { pos: a.pos.slice(), rot: a.rot.slice(), scl: a.scl.slice() }; }

export function copy( out, a ){
    out.pos[ 0 ] = a.pos[ 0 ];
    out.pos[ 1 ] = a.pos[ 1 ];
    out.pos[ 2 ] = a.pos[ 2 ];

    out.scl[ 0 ] = a.scl[ 0 ];
    out.scl[ 1 ] = a.scl[ 1 ];
    out.scl[ 2 ] = a.scl[ 2 ];

    out.rot[ 0 ] = a.rot[ 0 ];
    out.rot[ 1 ] = a.rot[ 1 ];
    out.rot[ 2 ] = a.rot[ 2 ];
    out.rot[ 3 ] = a.rot[ 3 ];
    return out;
}

export function reset( out ){
    out.pos[ 0 ] = 0;
    out.pos[ 1 ] = 0;
    out.pos[ 2 ] = 0;

    out.scl[ 0 ] = 1;
    out.scl[ 1 ] = 1;
    out.scl[ 2 ] = 1;

    out.rot[ 0 ] = 0;
    out.rot[ 1 ] = 0;
    out.rot[ 2 ] = 0;
    out.rot[ 3 ] = 1;
    return out;
}

export function fromMat4( out, m ){
    mat4.getRotation(    out.rot, m );
    mat4.getScaling(     out.scl, m );
    mat4.getTranslation( out.pos, m );
    quat.normalize( out.rot, out.rot );
    return out;
}
// #endregion

// #region OPs
export function mul( out, a, b ){
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // POSITION : parent.position + ( parent.rotation * ( parent.scale * child.position ) )
    const pos  = [
        a.scl[ 0 ] * b.pos[ 0 ],
        a.scl[ 1 ] * b.pos[ 1 ],
        a.scl[ 2 ] * b.pos[ 2 ],
    ];
    
    vec3.transformQuat( pos, pos, a.rot );

    out.pos[ 0 ] = a.pos[ 0 ] + pos[ 0 ];
    out.pos[ 1 ] = a.pos[ 1 ] + pos[ 1 ];
    out.pos[ 2 ] = a.pos[ 2 ] + pos[ 2 ];

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // SCALE : parent.scale * child.scale
    out.scl[ 0 ] = a.scl[ 0 ] * b.scl[ 0 ];
    out.scl[ 1 ] = a.scl[ 1 ] * b.scl[ 1 ];
    out.scl[ 2 ] = a.scl[ 2 ] * b.scl[ 2 ];

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ROTATION : parent.rotation * child.rotation
    quat.mul( out.rot, a.rot, b.rot );

    return out;
}

export function addPos( out, a, pos ){
    // POSITION : parent.position + ( parent.rotation * ( parent.scale * child.position ) )

    const v = [
        pos[ 0 ] * a.scl[ 0 ],
        pos[ 1 ] * a.scl[ 1 ],
        pos[ 2 ] * a.scl[ 2 ],
    ];

    vec3.transformQuat( out.pos, pos, a.rot );
    out.pos[ 0 ] += a.pos[ 0 ];
    out.pos[ 1 ] += a.pos[ 1 ];
    out.pos[ 2 ] += a.pos[ 2 ];

    if( a !== out ){
        vec3.copy( out.scl, a.scl );
        quat.copy( out.rot, a.rot );
    }

    return out;
}

export function invert( out, a ){
    // Invert Rotation
    quat.invert( out.rot, a.rot );

    // Invert Scale
    vec3.inverse( out.scl, a.scl );

    // Invert Position : rotInv * ( invScl * -Pos )
    const p = [
        out.scl[ 0 ] * -a.pos[ 0 ],
        out.scl[ 1 ] * -a.pos[ 1 ],
        out.scl[ 2 ] * -a.pos[ 2 ],
    ];
    
    vec3.transformQuat( out.pos, p, out.rot );
    return out;
}
// #endregion

// #region TRANSFORM
export function transformVec3( out, t, v ){
    // GLSL - vecQuatRotation( model.rotation, a_position.xyz * model.scale ) + model.position;

    out[ 0 ] = t.scl[ 0 ] * v[ 0 ];
    out[ 1 ] = t.scl[ 1 ] * v[ 1 ];
    out[ 2 ] = t.scl[ 2 ] * v[ 2 ];

    vec3.transformQuat( out, out, t.rot );

    out[ 0 ] += t.pos[ 0 ];
    out[ 1 ] += t.pos[ 1 ];
    out[ 2 ] += t.pos[ 2 ];
    return out;
}

// Apply transform differently on a vector. Offset the position, then apply rotation
// Used for 3D Tile Positioning.
export function pivotOffsetTransformVec3( out, t, v ){
    vec3.add( out, v, t.pos );                     // Translation First
    return vec3.transformQuat( out, out, t.rot );  // Then Rotation
}

// Operation meant for applying y2z Rotation + pos offset then preApply
// an offset rotation which can be a z2y Rotation.
// This is made for positioning 3D tile GLTF Meshes.
export function y2zPivotOffsetRotation( out, t, offsetPos, offsetRot ){
    // z2yMatrix * ( worldMatrix * y2zMatrix + offsetPosition )
    const pos = vec3.add( out.pos, t.pos, offsetPos );
    const rot = quat.mul( out.rot, t.rot, [ 0.7071067811865475, 0, 0, 0.7071067811865476 ] ); // y to z rotation ( -90deg X rotation )

    vec3.transformQuat( out.pos, out.pos, offsetRot );
    quat.mul( out.rot, offsetRot, out.rot );
    return out;
}
// #endregion


/*
	World Space Position to Local Space.
	V	.copy( gBWorld.eye_lid_upper_mid_l.pos ) // World Space Postion
	 	.add( [0, -0.05 * t, 0 ] )	// Change it
		.sub( gBWorld.eye_l.pos )	// Subtract from Parent's WS Position
		.div( gBWorld.eye_l.scl )	// Div by Parent's WS Scale
		.transform_quat( gBWorld.eye_l.rot_inv );	// Rotate by Parent's WS Inverse Rotation

	get_world_transform( tf=null ){
		tf = tf || new Transform();
		tf.copy( this.local );

		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		if( this.parent != null ){ 
			// Parents Exist, loop till reaching the root
			let n = this;
			while( n.parent != null ){
				n = n.parent; 
				tf.add_rev( n.local );  // mul( local, )
			}
		}
		return tf;
	}

		// Computing Transforms in reverse, Child - > Parent
		add_rev( pr, pp, ps = null ){
			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			// POSITION - parent.position + ( parent.rotation * ( parent.scale * child.position ) )
			// The only difference for this func, We use the IN.scl & IN.rot instead of THIS.scl * THIS.rot
			// Consider that this Object is the child and the input is the Parent.
			this.pos.mul( ps ).transform_quat( pr ).add( pp );

			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			// SCALE - parent.scale * child.scale
			if( ps ) this.scl.mul( ps );

			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			// ROTATION - parent.rotation * child.rotation
			this.rot.pmul( pr ); // Must Rotate from Parent->Child, need PMUL

			return this
		}
*/