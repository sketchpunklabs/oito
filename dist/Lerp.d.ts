export default class Lerp {
    static linear(a: number, b: number, t: number): number;
    static cosine(a: number, b: number, t: number): number;
    static cubic(a: number, b: number, c: number, d: number, t: number): number;
    static cubicSmooth(a: number, b: number, c: number, d: number, t: number): number;
    static hermite(a: number, b: number, c: number, d: number, t: number, tension: number, bias: number): number;
}
