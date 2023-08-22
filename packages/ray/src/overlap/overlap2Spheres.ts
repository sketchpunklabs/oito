export default function overlap2Spheres( aPos: ConstVec3, aRadius: number, bPos: ConstVec3, bRadius: number ): boolean{
    const sqRng  = ( aRadius + bRadius ) ** 2;     // Max distance
    const sqDist = ( aPos[0] - bPos[0] ) ** 2 +    // Distance between the 2 centers
                   ( aPos[1] - bPos[1] ) ** 2 + 
                   ( aPos[2] - bPos[2] ) ** 2;
    return sqDist <= sqRng;
}