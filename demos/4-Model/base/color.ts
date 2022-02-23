import { Vec4 } from "./vec4";

export class Color extends Vec4 {
    static WHITE = new Color(255, 255, 255, 255);
    static BLACK = new Color(0, 0, 0, 255);
    static RED = new Color(255, 0, 0, 255);
    static GREEN = new Color(0, 255, 0, 255);
    static BLUE = new Color(0, 0, 255, 255);
    static YELLOW = new Color(255, 255, 0, 255);
    static PURPLE = new Color(255, 0, 255, 255);

    public get r(): number {
        return this.x;
    }
    public set r(r: number) {
        this.x = r;
    }

    public get g(): number {
        return this.y;
    }
    public set g(g: number) {
        this.y = g;
    }

    public get b(): number {
        return this.z;
    }
    public set b(b: number) {
        this.z = b;
    }

    public get a(): number {
        return this.w;
    }
    public set a(a: number) {
        this.w = a;
    }

    public clone(): Color {
        const { r, g, b, a } = this;
        const color = new Color(r, g, b, a);
        return color;
    }


    public mul3(num: number): Color {
        this.r *= num;
        this.g *= num;
        this.b *= num;
        return this;
    }

    public mul4(num: number): Color {
        this.r *= num;
        this.g *= num;
        this.b *= num;
        this.a *= num;
        return this;
    }

    public add(v1: Color, out?: Color): Color {
        if (!out) out = new Color();
        out.r = this.r + v1.r;
        out.g = this.g + v1.g;
        out.b = this.b + v1.b;
        out.a = this.a;
        return out;
    }

    public add4(v1: Color, out?: Color): Color {
        if (!out) out = new Color();
        out.r = this.r + v1.r;
        out.g = this.g + v1.g;
        out.b = this.b + v1.b;
        out.a = this.a + v1.a;
        return out;
    }


    public mul(v1: Color, out?: Color): Color {
        if (!out) out = new Color();
        out.r = this.r * v1.r / 255;
        out.g = this.g * v1.g / 255;
        out.b = this.b * v1.b / 255;
        out.a = this.a * v1.a / 255;
        return out;
    }

    public setWithColor(color: Color) {
        const { r, g, b, a } = color;
        this.set(r, g, b, a);
    }
}