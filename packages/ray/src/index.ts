// #region OBJECTS
import Ray from './Ray';
export { Ray };
// #endregion

// #region RAY INTERSECTS
import intersectPlane   from './intersects/intersectPlane';
import intersectQuad    from './intersects/intersectQuad';
import intersectCircle  from './intersects/intersectCircle';
import intersectTri     from './intersects/intersectTri';
import intersectAABB    from './intersects/intersectAABB';

import { intersectSphere, RaySphereResult } 
    from './intersects/intersectSphere';

import { intersectCapsule, RayCapsuleResult }
    from './intersects/intersectCapsule';

import { intersectObb, RayObbResult }
    from './intersects/intersectObb';

export { 
    intersectPlane, intersectQuad, intersectCircle, intersectTri, intersectAABB,
    intersectSphere,  RaySphereResult,
    intersectCapsule, RayCapsuleResult,
    intersectObb,     RayObbResult,
};
// #endregion


// #region SHAPES
import Frustum  from './shapes/Frustum';
import Obb      from './shapes/Obb';
import Aabb     from './shapes/Aabb';
import Sphere   from './shapes/Sphere';
import Plane   from './shapes/Plane';
export { Frustum, Obb, Aabb, Sphere, Plane };
// #endregion


// #region OVERLAP / COLLISIONS
import overlap2OBB          from './overlap/overlap2OBB';
import overlap2Spheres      from './overlap/overlap2Spheres';
import overlapSphereAABB    from './overlap/overlapSphereAABB';
import overlapTriAABB       from './overlap/overlapTriAABB';
import pointInAABB          from './overlap/pointInAABB';
import pointInOBB           from './overlap/pointInOBB';
export { 
    overlap2OBB, overlap2Spheres, overlapSphereAABB, overlapTriAABB,
    pointInAABB, pointInOBB
};
// #endregion


// #region MISC
import nearPoint                            from './misc/nearPoint';
import { nearSegment, NearSegmentResult }   from './misc/nearSegment';
export {
    nearPoint,
    nearSegment, NearSegmentResult,
};
// #endregion