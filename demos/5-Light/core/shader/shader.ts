import { Color } from "../../base/color";
import { Light } from "../light/light";
import { Mat4 } from "../../base/mat4";
import { CalcUtil } from "../../base/util/calc";
import { Vertex } from "../../base/vertex";
import { Camera } from "../camera";
import { Loader } from "../loader";
import { Texture } from "../texture";
import { Vert2Frag } from "./vertex_to_fragment";

export type ShaderUniform = Record<string, any>;
export class Shader {
    constructor(uniform?: ShaderUniform) {
        if (uniform) this._uniform = uniform;
        else this._uniform = {};
    }

    private _uniform: ShaderUniform;
    public addUniform(key: string, value: any) {
        if (this._uniform[key]) return;
        this._uniform[key] = value;
    }
    public getUniform(key: string) {
        return this._uniform[key];
    }
    public modifyUniform(key: string, value: any) {
        this._uniform[key] = value;
    }

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
        v2f.worldPosition = CalcUtil.vec4MulMat4(position, modelMatrix);
        // 裁切空间坐标
        v2f.windowPosition = CalcUtil.vec4MulMat4(position, mvpVertex);
        v2f.color = color?.clone();
        v2f.normal = normal?.clone();
        v2f.u = u;
        v2f.v = v;

        //投影之后 w=-z, 所以直接取Z=-1/w即可
        v2f.Z = -1 / v2f.windowPosition.w;
        v2f.worldPosition?.mul4(v2f.Z);
        v2f.color?.mul4(v2f.Z);
        v2f.normal?.mul3(v2f.Z);
        v2f.u *= v2f.Z;
        v2f.v *= v2f.Z;

        // v2f.normal = CalcUtil.vec4MulMat4(v2f.normal.clone(), this._getNormalMatrix()).normalize();

        return v2f;
    }

    /**片元着色 */
    public fragmentShader(vert2frag: Vert2Frag): Color {
        const { u, v, color: vColor, worldPosition, normal } = vert2frag;
        const color = new Color();
        if (!!this._texture) color.setWithColor(this._texture.getColorWithUV(u, v))
        else color.setWithColor(vColor)

        const light = this.getUniform('light') as Light;
        const camera = this.getUniform('camera') as Camera;

        // 光照计算放在Light中
        // if (light && camera) {
        //     const viewDir = camera.position.sub(wordPosition).normalize();
        //     const phongColor = light.calc(viewDir, wordPosition, normal);
        //     color.mul(phongColor, color);
        // }

        // 光照计算放在shader中
        if (light && camera) {
            // 入射方向
            const lightDir = light.getPosition().clone().sub(worldPosition);

             // 漫反射
            //用法向量 点乘 片元到光的方向 就是余弦值
            const cos = normal.normalize().dotVec3(lightDir);
            const diffuse = light.getColor().clone().mul3(Math.max(cos, 0));


            // 高光
            // 折射方向
            const reflectDir = CalcUtil.reflect(lightDir, normal);
            const viewDir = camera.position.sub(worldPosition).normalize();
            const spec = Math.pow(Math.max(viewDir.dotVec3(reflectDir), 0), 32)
            const specular = light.getSpecularColor().clone().mul3(light.getSpecularIntensity() * spec);

            // 漫反射 + 高光
            const phongColor = diffuse.add(specular);

            if (light.useAmbient) {
                // 环境光
                const ambient = light.getAmbientColor().clone();
                const intensity = light.getAmbientIntensity();
                phongColor.add(ambient.mul3(intensity));

                color.mul(phongColor, color);
            }
        }

        return color;
    }

    // 法线矩形
    private _getNormalMatrix(): Mat4 {
        const res = this._modelMatrix.invert();
        res.transpose();
        return res;
    }
}