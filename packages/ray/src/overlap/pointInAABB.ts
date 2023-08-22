export default function pointInAABB( p: ConstVec3, min: ConstVec3, max: ConstVec3 ): boolean{
    return ( 
        min[ 0 ] <= p[ 0 ] && p[ 0 ] <= max[ 0 ] &&
        min[ 1 ] <= p[ 1 ] && p[ 1 ] <= max[ 1 ] &&
        min[ 2 ] <= p[ 2 ] && p[ 2 ] <= max[ 2 ]
    );
}