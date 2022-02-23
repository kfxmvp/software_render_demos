import { Color } from "./color";
import { Mat4 } from "./mat4";
import { Vec4 } from "./vec4";

// 向量叉乘
export function vectorCross2Num(pos1: Vec4, pos2: Vec4) {
    return pos1.x * pos2.y - pos2.x * pos1.y;
}

// 向量1减向量2 得到向量21
export function vectorSub(vec1: Vec4, vec2: Vec4) {
    return new Vec4(vec1.x - vec2.x, vec1.y - vec2.y);
}

// 计算屏幕任意点(x,y,z)的重心坐标
export function barycentric(x: number, y: number, pos1: Vec4, pos2: Vec4, pos3: Vec4): Vec4 {
    // 向量12
    const v12 = vectorSub(pos2, pos1);
    // 向量13
    const v13 = vectorSub(pos3, pos1);
    // 整个三角形的面积
    const s = vectorCross2Num(v12, v13) / 2;
    // 如果面积为0 表示至少有两个点共线 返回
    if (s === 0) return new Vec4(-1, -1, -1);

    // 向量p1
    const vp1 = new Vec4(x - pos1.x, y - pos1.y);
    // 向量p2
    const vp2 = new Vec4(x - pos2.x, y - pos2.y);
    // 向量p3
    const vp3 = new Vec4(x - pos3.x, y - pos3.y);

    const alpha = vectorCross2Num(vp2, vp3) / 2 / s;
    const beta = vectorCross2Num(vp3, vp1) / 2 / s;

    // alpha + beta + gamma = 1 重心坐标的定义
    const gamma = 1 - alpha - beta;

    return new Vec4(alpha, beta, gamma, 0);
}

export function lerp(barycentricCoord: Vec4, color1: Color, color2: Color, color3: Color): Color {
    return new Color(
        color1.r * barycentricCoord.x + color2.r * barycentricCoord.x + color3.r * barycentricCoord.x,
        color1.g * barycentricCoord.y + color2.g * barycentricCoord.y + color3.g * barycentricCoord.y,
        color1.b * barycentricCoord.z + color2.b * barycentricCoord.z + color3.b * barycentricCoord.z,
        255
    )
}

// 获取AABB包围盒
export function getBoundingBox(pos1: Vec4, pos2: Vec4, pos3: Vec4, width: number, height: number) {
    return {
        xMin: Math.round(Math.max(0, Math.min(pos1.x, pos2.x, pos3.x))),
        xMax: Math.round(Math.min(Math.max(pos1.x, pos2.x, pos3.x), width)),
        yMin: Math.round(Math.max(0, Math.min(pos1.y, pos2.y, pos3.y))),
        yMax: Math.round(Math.min(Math.max(pos1.y, pos2.y, pos3.y), height))
    }
}

/**
  * 矩阵乘法
  * a00 a01 a02 a03         b00 b01 b02 b03
  * a10 a11 a12 q13         b10 b11 b12 b13
  * a20 a21 a22 q23    x    b20 b21 b22 b23   
  * a30 a31 a32 q33         b30 b31 b32 b33
  */
export function mat4Mul(mat1: Mat4, mat2: Mat4): Mat4 {
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
export function mat4MulArr(mat4Array: Array<Mat4>): Mat4 {
    return mat4Array.reduce(mat4Mul);
}

/**
* 向量乘4x4矩阵
* x     m01 m02 m03 m04
* y  x  m11 m12 m13 m14
* z     m21 m22 m23 m24
* w     m31 m32 m33 m34
*/
export function vec4MulMat4(vec4: Vec4, mat4: Mat4, out?: Vec4): Vec4 {
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
  * 视口变换矩阵
  * width/2  0    0  width/2
  *   0  height/2 0  height/2
  *   0      0    1     0
  *   0      0    0     1    
  */
export function getViewPortVertex(width: number, height: number) {
    const mat4 = new Mat4();
    mat4.setWithNum(
        width / 2, 0, 0, width / 2,
        0, height / 2, 0, height / 2,
        0, 0, 1, 0,
        0, 0, 0, 1
    )
    return mat4;
}