export default class Maths {
    static TAU: number;
    static PI_H: number;
    static TAU_INV: number;
    static PI_Q: number;
    static PI_Q3: number;
    static PI_270: number;
    static DEG2RAD: number;
    static RAD2DEG: number;
    static EPSILON: number;
    static PHI: number;
    static clamp(v: number, min: number, max: number): number;
    static clamp01(v: number): number;
    static fract(f: number): number;
    static nearZero(v: number): number;
    static toRad(v: number): number;
    static toDeg(v: number): number;
    static dotToDeg(dot: number): number;
    static map(x: number, xMin: number, xMax: number, zMin: number, zMax: number): number;
    static snap(x: number, step: number): number;
    static norm(min: number, max: number, v: number): number;
    /** Modulas that handles Negatives
     * @example
     * Maths.mod( -1, 5 ) = 4 */
    static mod(a: number, b: number): number;
    static asinc(x0: number): number;
    static wrap(value: number, min: number, max: number): number;
    static damp(x: number, y: number, lambda: number, dt: number): number;
    static negateIf(val: number, b: boolean): number;
    static lerp(a: number, b: number, t: number): number;
    static eerp(a: number, b: number, t: number): number;
    /** CLerp - Circular Lerp - is like lerp but handles the wraparound from 0 to 360.
    This is useful when interpolating eulerAngles and the object crosses the 0/360 boundary. */
    static clerp(start: number, end: number, v: number): number;
    static lawcosSSS(aLen: number, bLen: number, cLen: number): number;
    static rnd(min: number, max: number): number;
    static rndLcg(seed: number): () => number;
    /** Loops between 0 and Len, once over len, starts over again at 0, like a sawtooth wave  */
    static repeat(t: number, len: number): number;
    /** Loops back and forth between 0 and len, it functions like a triangle wave. */
    static pingPong(t: number, len: number): number;
    /** Remove Negitive Bit, then output binary string of the number */
    static dec2bin(dec: number): string;
}
