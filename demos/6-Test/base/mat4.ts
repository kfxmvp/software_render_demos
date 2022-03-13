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
     * 转置
     * a b c d      a e i m
     * e f g h  →   b f j n
     * i j k l  →   c g k o
     * m n o p      d h l p
    */
    transpose() {
        let tmp;
        for (let i = 0; i < 4; ++i) {
            for (let j = i; j < 4; ++j) {
                if (i === j) continue;
                tmp = this.data[i + j * 4];
                this.data[i + j * 4] = this.data[j + i * 4];
                this.data[j + i * 4] = tmp;
            }
        }
        return this;
    }


    /**
     * 矩阵的逆
     * @param {Mat4} out 输出矩阵
     */
    invert(out?: Mat4): Mat4 {
        let m00 = this.get(0),
            m01 = this.get(1),
            m02 = this.get(2),
            m03 = this.get(3),
            m10 = this.get(4),
            m11 = this.get(5),
            m12 = this.get(6),
            m13 = this.get(7),
            m20 = this.get(8),
            m21 = this.get(9),
            m22 = this.get(10),
            m23 = this.get(11),
            m30 = this.get(12),
            m31 = this.get(13),
            m32 = this.get(14),
            m33 = this.get(15);
        m00 =
            m12 * m23 * m31 -
            m13 * m22 * m31 +
            m13 * m21 * m32 -
            m11 * m23 * m32 -
            m12 * m21 * m33 +
            m11 * m22 * m33;
        m01 =
            m03 * m22 * m31 -
            m02 * m23 * m31 -
            m03 * m21 * m32 +
            m01 * m23 * m32 +
            m02 * m21 * m33 -
            m01 * m22 * m33;
        m02 =
            m02 * m13 * m31 -
            m03 * m12 * m31 +
            m03 * m11 * m32 -
            m01 * m13 * m32 -
            m02 * m11 * m33 +
            m01 * m12 * m33;
        m03 =
            m03 * m12 * m21 -
            m02 * m13 * m21 -
            m03 * m11 * m22 +
            m01 * m13 * m22 +
            m02 * m11 * m23 -
            m01 * m12 * m23;
        m10 =
            m13 * m22 * m30 -
            m12 * m23 * m30 -
            m13 * m20 * m32 +
            m10 * m23 * m32 +
            m12 * m20 * m33 -
            m10 * m22 * m33;
        m11 =
            m02 * m23 * m30 -
            m03 * m22 * m30 +
            m03 * m20 * m32 -
            m00 * m23 * m32 -
            m02 * m20 * m33 +
            m00 * m22 * m33;
        m12 =
            m03 * m12 * m30 -
            m02 * m13 * m30 -
            m03 * m10 * m32 +
            m00 * m13 * m32 +
            m02 * m10 * m33 -
            m00 * m12 * m33;
        m13 =
            m02 * m13 * m20 -
            m03 * m12 * m20 +
            m03 * m10 * m22 -
            m00 * m13 * m22 -
            m02 * m10 * m23 +
            m00 * m12 * m23;
        m20 =
            m11 * m23 * m30 -
            m13 * m21 * m30 +
            m13 * m20 * m31 -
            m10 * m23 * m31 -
            m11 * m20 * m33 +
            m10 * m21 * m33;
        m21 =
            m03 * m21 * m30 -
            m01 * m23 * m30 -
            m03 * m20 * m31 +
            m00 * m23 * m31 +
            m01 * m20 * m33 -
            m00 * m21 * m33;
        m22 =
            m01 * m13 * m30 -
            m03 * m11 * m30 +
            m03 * m10 * m31 -
            m00 * m13 * m31 -
            m01 * m10 * m33 +
            m00 * m11 * m33;
        m23 =
            m03 * m11 * m20 -
            m01 * m13 * m20 -
            m03 * m10 * m21 +
            m00 * m13 * m21 +
            m01 * m10 * m23 -
            m00 * m11 * m23;
        m30 =
            m12 * m21 * m30 -
            m11 * m22 * m30 -
            m12 * m20 * m31 +
            m10 * m22 * m31 +
            m11 * m20 * m32 -
            m10 * m21 * m32;
        m31 =
            m01 * m22 * m30 -
            m02 * m21 * m30 +
            m02 * m20 * m31 -
            m00 * m22 * m31 -
            m01 * m20 * m32 +
            m00 * m21 * m32;
        m32 =
            m02 * m11 * m30 -
            m01 * m12 * m30 -
            m02 * m10 * m31 +
            m00 * m12 * m31 +
            m01 * m10 * m32 -
            m00 * m11 * m32;
        m33 =
            m01 * m12 * m20 -
            m02 * m11 * m20 +
            m02 * m10 * m21 -
            m00 * m12 * m21 -
            m01 * m10 * m22 +
            m00 * m11 * m22;

        const det = this.determinant();

        if (!out) out = new Mat4();
        out.setWithNum(
            m00 / det,
            m01 / det,
            m02 / det,
            m03 / det,
            m10 / det,
            m11 / det,
            m12 / det,
            m13 / det,
            m20 / det,
            m21 / det,
            m22 / det,
            m23 / det,
            m30 / det,
            m31 / det,
            m32 / det,
            m33 / det
        );

        return out;
    }

    /**
     * 矩阵行列式
     * @returns {number} 
     */
    determinant(): number {
        const m00 = this.get(0),
            m01 = this.get(1),
            m02 = this.get(2),
            m03 = this.get(3),
            m10 = this.get(4),
            m11 = this.get(5),
            m12 = this.get(6),
            m13 = this.get(7),
            m20 = this.get(8),
            m21 = this.get(9),
            m22 = this.get(10),
            m23 = this.get(11),
            m30 = this.get(12),
            m31 = this.get(13),
            m32 = this.get(14),
            m33 = this.get(15);
        const value =
            m03 * m12 * m21 * m30 -
            m02 * m13 * m21 * m30 -
            m03 * m11 * m22 * m30 +
            m01 * m13 * m22 * m30 +
            m02 * m11 * m23 * m30 -
            m01 * m12 * m23 * m30 -
            m03 * m12 * m20 * m31 +
            m02 * m13 * m20 * m31 +
            m03 * m10 * m22 * m31 -
            m00 * m13 * m22 * m31 -
            m02 * m10 * m23 * m31 +
            m00 * m12 * m23 * m31 +
            m03 * m11 * m20 * m32 -
            m01 * m13 * m20 * m32 -
            m03 * m10 * m21 * m32 +
            m00 * m13 * m21 * m32 +
            m01 * m10 * m23 * m32 -
            m00 * m11 * m23 * m32 -
            m02 * m11 * m20 * m33 +
            m01 * m12 * m20 * m33 +
            m02 * m10 * m21 * m33 -
            m00 * m12 * m21 * m33 -
            m01 * m10 * m22 * m33 +
            m00 * m11 * m22 * m33;
        return value;
    }

    /**
     * 单位矩阵
     */
    static identity(): Mat4 {
        const mat = new Mat4();
        mat.setWithNum(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
        return mat;
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