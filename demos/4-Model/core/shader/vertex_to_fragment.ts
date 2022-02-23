import { Color } from "../../base/color";
import { Vec4 } from "../../base/vec4";

export class Vert2Frag {
    wordPosition: Vec4;
    windowPosition: Vec4;
    color: Color;
    normal: Vec4;
    u: number;
    v: number;
    Z: number;

    constructor() {
        this.windowPosition = new Vec4();
        this.wordPosition = new Vec4();
        this.color = new Color();
        this.normal = new Vec4();
    }

    barycentric(
        barycentricCoord: Vec4,
        v2f1: Vert2Frag,
        v2f2: Vert2Frag,
        v2f3: Vert2Frag
    ): void {
        this.wordPosition.x =
            v2f1.wordPosition.x * barycentricCoord.x +
            v2f2.wordPosition.x * barycentricCoord.y +
            v2f3.wordPosition.x * barycentricCoord.z;
        this.wordPosition.y =
            v2f1.wordPosition.y * barycentricCoord.x +
            v2f2.wordPosition.y * barycentricCoord.y +
            v2f3.wordPosition.y * barycentricCoord.z;
        this.wordPosition.z =
            v2f1.wordPosition.z * barycentricCoord.x +
            v2f2.wordPosition.z * barycentricCoord.y +
            v2f3.wordPosition.z * barycentricCoord.z;

        this.color.r =
            v2f1.color.r * barycentricCoord.x +
            v2f2.color.r * barycentricCoord.y +
            v2f3.color.r * barycentricCoord.z;
        this.color.g =
            v2f1.color.g * barycentricCoord.x +
            v2f2.color.g * barycentricCoord.y +
            v2f3.color.g * barycentricCoord.z;
        this.color.b =
            v2f1.color.b * barycentricCoord.x +
            v2f2.color.b * barycentricCoord.y +
            v2f3.color.b * barycentricCoord.z;
        this.color.a =
            v2f1.color.a * barycentricCoord.x +
            v2f2.color.a * barycentricCoord.y +
            v2f3.color.a * barycentricCoord.z;

        this.windowPosition.x =
            v2f1.windowPosition.x * barycentricCoord.x +
            v2f2.windowPosition.x * barycentricCoord.y +
            v2f3.windowPosition.x * barycentricCoord.z;
        this.windowPosition.y =
            v2f1.windowPosition.y * barycentricCoord.x +
            v2f2.windowPosition.y * barycentricCoord.y +
            v2f3.windowPosition.y * barycentricCoord.z;
        this.windowPosition.z =
            v2f1.windowPosition.z * barycentricCoord.x +
            v2f2.windowPosition.z * barycentricCoord.y +
            v2f3.windowPosition.z * barycentricCoord.z;

        if (v2f1.normal && v2f2.normal && v2f3.normal) {
            this.normal.x =
                v2f1.normal.x * barycentricCoord.x +
                v2f2.normal.x * barycentricCoord.y +
                v2f3.normal.x * barycentricCoord.z;
            this.normal.y =
                v2f1.normal.y * barycentricCoord.x +
                v2f2.normal.y * barycentricCoord.y +
                v2f3.normal.y * barycentricCoord.z;
            this.normal.z =
                v2f1.normal.z * barycentricCoord.x +
                v2f2.normal.z * barycentricCoord.y +
                v2f3.normal.z * barycentricCoord.z;
        }

        this.u =
            v2f1.u * barycentricCoord.x +
            v2f2.u * barycentricCoord.y +
            v2f3.u * barycentricCoord.z;

        this.v =
            v2f1.v * barycentricCoord.x +
            v2f2.v * barycentricCoord.y +
            v2f3.v * barycentricCoord.z;

        this.Z =
            v2f1.Z * barycentricCoord.x +
            v2f2.Z * barycentricCoord.y +
            v2f3.Z * barycentricCoord.z;
    }
}