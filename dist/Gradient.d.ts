declare class Gradient {
    static step(edge: number, x: number): number;
    /** t must be in the range of 0 to 1 : start & ends slowly*/
    static smoothTStep(t: number): number;
    static smoothStep(min: number, max: number, v: number): number;
    static smootherStep(min: number, max: number, v: number): number;
    /** This is a smooth over shoot easing : t must be in the range of 0 to 1 */
    static overShoot(t: number, n?: number, k?: number): number;
    /** See: https://www.iquilezles.org/www/articles/smin/smin.htm. */
    static smoothMin(a: number, b: number, k: number): number;
    static fade(t: number): number;
    /** Remap 0 > 1 to -1 > 0 > 1 */
    static remapN01(t: number): number;
    /** Remap 0 > 1 to 0 > 1 > 0 */
    static remap010(t: number): number;
    /** bounce ease out */
    static bounce(t: number): number;
    static noise(x: number): number;
    static parabola(x: number, k: number): number;
    static sigmoid(t: number, k?: number): number;
    static bellCurve(t: number): number;
    /** a = 1.5, 2, 4, 9 */
    static betaDistCurve(t: number, a: number): number;
}
export default Gradient;
