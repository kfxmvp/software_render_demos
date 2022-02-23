import { Mat4 } from "../mat4";
import { Vec4 } from "../vec4";


export class CommonUtil {
    /**
    * 视口变换矩阵
    * width/2  0    0  width/2
    *   0  height/2 0  height/2
    *   0      0    1     0
    *   0      0    0     1    
    */
    public static getViewPortVertex(width: number, height: number) {
        const mat4 = new Mat4();
        mat4.setWithNum(
            width / 2, 0, 0, width / 2,
            0, height / 2, 0, height / 2,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
        return mat4;
    }

    /**获取AABB包围盒 */
    public static getBoundingBox(pos1: Vec4, pos2: Vec4, pos3: Vec4, width: number, height: number) {
        return {
            xMin: Math.round(Math.max(0, Math.min(pos1.x, pos2.x, pos3.x))),
            xMax: Math.round(Math.min(Math.max(pos1.x, pos2.x, pos3.x), width)),
            yMin: Math.round(Math.max(0, Math.min(pos1.y, pos2.y, pos3.y))),
            yMax: Math.round(Math.min(Math.max(pos1.y, pos2.y, pos3.y), height))
        }
    }
}