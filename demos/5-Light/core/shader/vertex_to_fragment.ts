import { Color } from "../../base/color";
import { Vec4 } from "../../base/vec4";

export class Vert2Frag {
    worldPosition: Vec4;
    windowPosition: Vec4;
    color: Color;
    normal: Vec4;
    u: number;
    v: number;
    Z: number;

    constructor() {
        this.windowPosition = new Vec4();
        this.worldPosition = new Vec4();
        this.color = new Color();
        this.normal = new Vec4();
    }

    barycentric(
        barycentricCoord: Vec4,
        v2f1: Vert2Frag,
        v2f2: Vert2Frag,
        v2f3: Vert2Frag
    ): void {
        this.worldPosition.x =
            v2f1.worldPosition.x * barycentricCoord.x +
            v2f2.worldPosition.x * barycentricCoord.y +
            v2f3.worldPosition.x * barycentricCoord.z;
        this.worldPosition.y =
            v2f1.worldPosition.y * barycentricCoord.x +
            v2f2.worldPosition.y * barycentricCoord.y +
            v2f3.worldPosition.y * barycentricCoord.z;
        this.worldPosition.z =
            v2f1.worldPosition.z * barycentricCoord.x +
            v2f2.worldPosition.z * barycentricCoord.y +
            v2f3.worldPosition.z * barycentricCoord.z;

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