import { Color } from "../../base/color";
import { Mat4 } from "../../base/mat4";
import { CalcUtil } from "../../base/util/calc";
import { Vertex } from "../../base/vertex";
import { Loader } from "../loader";
import { Texture } from "../texture";
import { Vert2Frag } from "./vertex_to_fragment";
export class Shader {
    // 模型矩阵
    private _modelMatrix: Mat4;
    public set modelMatrix(matrix: Mat4) {
        this._modelMatrix = matrix;
    }
    public get modelMatrix(): Mat4 {
        return this._modelMatrix;
    }

    // 观察矩阵
    private _viewMatrix: Mat4;
    public set viewMatrix(matrix: Mat4) {
        this._viewMatrix = matrix;
    }
    public get viewMatrix(): Mat4 {
        return this._viewMatrix;
    }

    // 投影矩阵
    private _projectionMatrix: Mat4;
    public set projectionMatrix(matrix: Mat4) {
        this._projectionMatrix = matrix;
    }
    public get projectionMatrix(): Mat4 {
        return this._projectionMatrix;
    }

    // 贴图
    private _texture: Texture;
    public async setTextureWithPath(path: string) {
        if (!this._texture) this._texture = new Texture();
        const imageData = await Loader.loadImage(path);
        this._texture.setImageData(imageData)
    }
    public setTexture(texture: Texture) {
        if (!this._texture) this._texture = new Texture();
        this._texture.setImageData(texture.imageData);
    }

    /**顶点着色 */
    public vertexShader(vertex: Vertex): Vert2Frag {
        const { modelMatrix, viewMatrix, projectionMatrix } = this;
        const { position, color, normal, u, v } = vertex;
        const v2f = new Vert2Frag();

        // mvp矩阵 左乘
        const mvpVertex = CalcUtil.mat4MulArr([
            projectionMatrix,
            viewMatrix,
            modelMatrix
        ]);

        // 世界坐标
        v2f.wordPosition = CalcUtil.vec4MulMat4(position, modelMatrix);
        // 裁切空间坐标
        v2f.windowPosition = CalcUtil.vec4MulMat4(position, mvpVertex);
        v2f.color = color?.clone();
        v2f.normal = normal?.clone();
        v2f.u = u;
        v2f.v = v;

        //投影之后 w=-z, 所以直接取Z=-1/w即可
        v2f.Z = -1 / v2f.windowPosition.w;
        v2f.wordPosition?.mul4(v2f.Z);
        v2f.color?.mul4(v2f.Z);
        v2f.normal?.mul3(v2f.Z);
        v2f.u *= v2f.Z;
        v2f.v *= v2f.Z;

        return v2f;
    }

    /**片元着色 */
    public fragmentShader(vert2frag: Vert2Frag): Color {
        const color = new Color();
        if (!!this._texture) color.setWithColor(this._texture.getColorWithUV(vert2frag.u, vert2frag.v))
        else color.setWithColor(vert2frag.color)
        return color;
    }
}