export class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    
    static RED: Color = new Color(255, 0, 0, 255);
    static GREEN: Color = new Color(0, 255, 0, 255);
    static BLUE: Color = new Color(0, 0, 255, 255);

    constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}