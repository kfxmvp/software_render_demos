import { Color } from "./color";
import { Vec4 } from "./vec4";

export class Vertex {
    position: Vec4;
    normal: Vec4;
    color: Color;
    u: number;
    v: number;

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        this.position = new Vec4(x, y, z, w);
        this.color = new Color();
        this.normal = new Vec4();
    }
}