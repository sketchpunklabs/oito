import BezierCubic          from './bezier/BezierCubic';
import BezierCubicSpline    from './bezier/BezierCubicSpline';
import BezierQuad           from './bezier/BezierQuad';
import BezierQuadSpline     from './bezier/BezierQuadSpline';
// import Hermite              from './hermite/Hermite';

import Nurbs                from './bspline/Nurbs'
import NurbsSpline          from './bspline/NurbsSpline'

import SplineSampler        from './util/SplineSamples'
import SplineMinSamples     from './util/SplineMinSamples'

export {
    BezierCubic, BezierCubicSpline,
    BezierQuad, BezierQuadSpline,
    Nurbs, NurbsSpline,
    // Hermite,
    SplineSampler, SplineMinSamples,
};

// https://github.com/framer/motion/blob/main/packages/framer-motion/src/easing/cubic-bezier.ts
// https://github.com/framer/motion/blob/main/packages/framer-motion/src/easing/modifiers/mirror.ts
// https://github.com/framer/motion/blob/main/packages/framer-motion/src/easing/modifiers/reverse.ts