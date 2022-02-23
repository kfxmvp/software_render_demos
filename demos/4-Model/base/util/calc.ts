import { Mat4 } from "../mat4";
import { Vec4 } from "../vec4";

export class CalcUtil {

    /**
     * 矩阵乘法
     * a00 a01 a02 a03         b00 b01 b02 b03
     * a10 a11 a12 q13         b10 b11 b12 b13
     * a20 a21 a22 q23    x    b20 b21 b22 b23   
     * a30 a31 a32 q33         b30 b31 b32 b33
     */
    public static mat4Mul(mat1: Mat4, mat2: Mat4): Mat4 {
        const out = new Mat4();
        // 行
        for (let i = 0; i < 4; ++i) {
            // 列
            for (let j = 0; j < 4; ++j) {
                let mul = 0;
                // 行列对应元素相乘相加
                for (let k = 0; k < 4; ++k) {
                    // i == 0 j == 0 
                    // k == 0 mul += a00 * b00
                    // k == 1 mul += a01 * b10
                    // k == 3 mul += a02 * b20
                    // k == 4 mul += a03 * b30
                    mul += mat1.get(i * 4 + k) * mat2.get(k * 4 + j);
                }
                out.set(i * 4 + j, mul);
            }
        }
        return out;
    }

    /**矩阵连乘 */
    public static mat4MulArr(mat4Array: Array<Mat4>): Mat4 {
        return mat4Array.reduce(CalcUtil.mat4Mul);
    }

    /**
    * 向量乘4x4矩阵
    * x     m01 m02 m03 m04
    * y  x  m11 m12 m13 m14
    * z     m21 m22 m23 m24
    * w     m31 m32 m33 m34
    */
    public static vec4MulMat4(vec4: Vec4, mat4: Mat4, out?: Vec4): Vec4 {
        const { x: vx, y: vy, z: vz, w: vw } = vec4;
        const ret = [];
        for (let i = 0; i < 4; ++i) {
            const index = i * 4;
            ret.push(
                vx * mat4.get(index)
                + vy * mat4.get(index + 1)
                + vz * mat4.get(index + 2)
                + vw * mat4.get(index + 3));
        }
        if (!out) out = new Vec4();
        out.set(ret[0], ret[1], ret[2], ret[3]);
        return out;
    }

    /**
     * 计算重心坐标(面积比)
     *            pos1 
     *             /\
     *            /  \
     *           /  p \  
     *          /      \
     *         pos2----pos3
     */
    public static barycentric(x: number, y: number, pos1: Vec4, pos2: Vec4, pos3: Vec4): Vec4 {
        const v21 = pos2.sub(pos1);
        const v31 = pos3.sub(pos1);
        const s = v21.cross2Num(v31) / 2;
        if (s === 0) return new Vec4(-1, -1, -1);

        const vx1 = new Vec4(x - pos1.x, y - pos1.y);
        const vx2 = new Vec4(x - pos2.x, y - pos2.y);
        const vx3 = new Vec4(x - pos3.x, y - pos3.y);

        const alpha = vx2.cross2Num(vx3) / 2 / s;
        const beta = vx3.cross2Num(vx1) / 2 / s;
        const gamma = 1 - alpha - beta;

        return new Vec4(alpha, beta, gamma, 0);
    }
}