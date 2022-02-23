export class Vec4 {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**向量长度 */
    public get length(): number {
        const { x, y, z, w } = this;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    public set(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    public clone(): Vec4 {
        const { x, y, z, w } = this;
        const vec4 = new Vec4(x, y, z, w);
        return vec4;
    }

    public sub(v1: Vec4, out?: Vec4): Vec4 {
        if (!out) out = new Vec4();
        out.x = this.x - v1.x;
        out.y = this.y - v1.y;
        out.z = this.z - v1.z;
        return out;
    }

    /**
     * 点乘
     * x1*x2 + y1*y2 + z1*z2
     */
    public dot(v1: Vec4): number {
        const { x: x1, y: y1, z: z1 } = this;
        const { x: x2, y: y2, z: z2 } = v1;
        return x1 * x2 + y1 * y2 + z1 * z2;
    }

    /**
     * 叉乘
     * x:(y1z2 - y2z1)  
     * y:(x2z1 - x1z2) 
     * z:(x1y2 - x2y1)
     */
    public cross(v1: Vec4, out?: Vec4): Vec4 {
        const { x: x1, y: y1, z: z1 } = this;
        const { x: x2, y: y2, z: z2 } = v1;
        if (!out) out = new Vec4();
        out.set(
            y1 * z2 - y2 * z1,
            x2 * z1 - x1 * z2,
            x1 * y2 - x2 * y1,
            0
        )
        return out;
    }

    /**归一化 */
    public normalize(): Vec4 {
        const { x, y, z, w } = this;
        if (this.length > 0) {
            const scale = 1 / this.length;
            this.set(x * scale, y * scale, z * scale, w * scale);
        }
        return this;
    }

    /**标准化 */
    public standardize(): Vec4 {
        if (this.w === 0) {
            return;
        }
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
        this.w = 1;
        return this;
    }

    public toString() {
        const str = `x:${this.x},y${this.y}z${this.z},w:${this.w}`;
        console.log(str);
    }
}