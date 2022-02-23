export class Mat4 {
    data: Float32Array;

    constructor() {
        this.data = new Float32Array(16).fill(0);
    }

    set(index: number, value: number) {
        this.data[index] = value;
    }

    get(index: number): number {
        return this.data[index];
    }

    clone(): Mat4 {
        const mat4 = new Mat4();
        mat4.data = Float32Array.from(this.data);
        return mat4;
    }

    setWithNum(
        m01: number, m02: number, m03: number, m04: number,
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
    ) {
        this.data[0] = m01;
        this.data[1] = m02;
        this.data[2] = m03;
        this.data[3] = m04;

        this.data[4] = m11;
        this.data[5] = m12;
        this.data[6] = m13;
        this.data[7] = m14;

        this.data[8] = m21;
        this.data[9] = m22;
        this.data[10] = m23;
        this.data[11] = m24;

        this.data[12] = m31;
        this.data[13] = m32;
        this.data[14] = m33;
        this.data[15] = m34;

        return this;
    }

    /**
     * 获取绕X轴旋转 旋转矩阵
     * 1   0     0    0
     * 0  cos  -sin   0
     * 0  sin   cos   0
     * 0   0     0    1
     * @param {number} angle 
     * @returns {Mat4} 
     */
    static getRotationMat4X(angle: number): Mat4 {
        const mat = new Mat4();
        const radian = (Math.PI / 180) * angle;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        mat.set(0, 1);
        mat.set(5, cos);
        mat.set(6, -sin);
        mat.set(9, sin);
        mat.set(10, cos);
        mat.set(15, 1);
        return mat;
    }

    /**
     * 获取绕Y轴旋转 旋转矩阵
     *  cos  0  sin   0
     *   0   1   0    0
     * -sin  0  cos   0
     *   0   0   0    1
     * @param {number} angle 
     * @returns {Mat4} 
     */
    static getRotationMat4Y(angle: number): Mat4 {
        const mat = new Mat4();
        const radian = (Math.PI / 180) * angle;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        mat.set(0, cos);
        mat.set(2, sin);
        mat.set(5, 1);
        mat.set(8, -sin);
        mat.set(10, cos);
        mat.set(15, 1);
        return mat;
    }

    /**
     * 获取绕Z轴旋转 旋转矩阵
     * cos  -sin   0   0 
     * sin   cos   0   0
     *  0     0    1   0 
     *  0     0    0   1
     * @param {number} angle 
     * @returns {Mat4} 
     */
    static getRotationMat4Z(angle: number): Mat4 {
        const mat = new Mat4();
        const radian = (Math.PI / 180) * angle;
        const cos = Math.cos(radian);
        const sin = Math.sin(radian);
        mat.set(0, cos);
        mat.set(1, -sin);
        mat.set(4, sin);
        mat.set(5, cos);
        mat.set(10, 1);
        mat.set(15, 1);
        return mat;
    }

    toString() {
        let str = '';
        for (let i = 0; i < this.data.length; i += 4) {
            str += this.data.slice(i, i + 4).join(' ') + '\n';
        }
        console.log(str);
    }
}