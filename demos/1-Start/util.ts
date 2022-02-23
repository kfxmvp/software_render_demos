import { Color } from "./color";
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