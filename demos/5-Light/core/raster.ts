import { Color } from "../base/color";
import { Mat4 } from "../base/mat4";
import { CalcUtil } from "../base/util/calc";
import { CommonUtil } from "../base/util/common";
import { Vec4 } from "../base/vec4";
import { FrameBuffer } from "./buffer";
import { Camera } from "./camera";
import { Mesh } from "./mesh";
import { Scene } from "./scene";
import { Shader } from "./shader/shader";
import { Vert2Frag } from "./shader/vertex_to_fragment";

export class Raster {
    private _width: number;
    public get width() {
        return this._width;
    }
    private _height: number;
    public get height() {
        return this._height;
    }

    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _imageData: ImageData;

    private _buffer: FrameBuffer;

    constructor() {
        this._canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this._ctx = this._canvas.getContext('2d');

        const { width, height } = this._canvas;
        this._width = width;
        this._height = height;

        this._imageData = this._ctx.createImageData(width, height);
        this._buffer = new FrameBuffer(this._imageData.data, width, height);
    }

    /**
     * 渲染场景
     * @param {Scene} scene 场景
     * @returns 
     * 
     * @memberOf Raster
     */
    public render(scene: Scene) {
        if (!scene) return;
        const { _buffer, _ctx, _imageData } = this;
        _buffer.clear();
        scene.children.forEach(node => {
            node.model.object.forEach(object => {
                const mesh = object?.getMesh();
                const shader = object?.getMaterial()?.getShader();
                this._renderMesh(mesh, shader, scene.camera);
            })
        })
        _ctx.putImageData(_imageData, 0, 0);
    }

    /**
     * 屏幕坐标标准化
     * @private
     * @param {Vert2Frag} v2f 
     * 
     * @memberOf Raster
     */
    private _NDC(v2f: Vert2Frag): void {
        v2f.windowPosition.standardize();
        v2f.windowPosition.z = (v2f.windowPosition.z + 1) * 0.5;
    }

    /**
     * 光栅化
     * @private
     * @param {Vert2Frag} vf1 顶点1
     * @param {Vert2Frag} vf2 顶点2
     * @param {Vert2Frag} vf3 顶点3
     * @param {Shader} shader 着色器
     * 
     * @memberOf Raster
     */
    private _raster(vf1: Vert2Frag, vf2: Vert2Frag, vf3: Vert2Frag, shader: Shader) {
        const { xMin, xMax, yMin, yMax } = CommonUtil.getBoundingBox(
            vf1.windowPosition,
            vf2.windowPosition,
            vf3.windowPosition,
            this._width,
            this._height);

        for (let x = xMin; x < xMax; ++x) {
            for (let y = yMin; y < yMax; ++y) {
                const barycentricCoord = CalcUtil.barycentric(
                    x + 0.5,
                    y + 0.5,
                    vf1.windowPosition,
                    vf2.windowPosition,
                    vf3.windowPosition,
                );
                const { x: barycentricX, y: barycentricY, z: barycentricZ } = barycentricCoord;
                if (barycentricX < 0 || barycentricY < 0 || barycentricZ < 0) continue;

                const v2f = new Vert2Frag();
                v2f.barycentric(barycentricCoord, vf1, vf2, vf3);

                //恢复坐标
                const z = 1 / v2f.Z;
                v2f.worldPosition.mul4(z);
                v2f.color.mul4(z);
                v2f.normal?.mul3(z);
                v2f.u *= z;
                v2f.v *= z;

                if (!this._buffer.zBufferTest(x, y, v2f.windowPosition.z)) continue;

                const renderColor = shader.fragmentShader(v2f);
                this._buffer.setColor(x, y, renderColor);
            }
        }
    }

    /**
     * 面剔除
     * @private
     * @param {Vec4} v1 顶点1
     * @param {Vec4} v2 顶点2
     * @param {Vec4} v3 顶点3
     * @returns 
     * 
     * @memberOf Raster
     */
    private _faceCulling(v1: Vec4, v2: Vec4, v3: Vec4, camera: Camera) {
        const line1 = v2.sub(v1);
        const line2 = v3.sub(v1);

        const normal = line1.cross(line2).normalize();
        const view = camera.z.clone().mul3(-1);
        const dot = normal.dotVec3(view);
        return dot < 0;
    }

    /**
     * 渲染网格
     * @private
     * @param {Mesh} mesh 网格数据
     * @param {Shader} shader 着色器
     * 
     * @memberOf Raster
     */
    private _renderMesh(mesh: Mesh, shader: Shader, camera: Camera) {
        const { EBO, VBO } = mesh;
        const { _width, _height } = this;

        const viewPortVertex = CommonUtil.getViewPortVertex(_width, _height);

        for (let i = 0; i < EBO.length; i += 3) {
            const vertex1 = VBO[EBO[i]];
            const vertex2 = VBO[EBO[i + 1]];
            const vertex3 = VBO[EBO[i + 2]];

            const vf1 = shader.vertexShader(vertex1);
            const vf2 = shader.vertexShader(vertex2);
            const vf3 = shader.vertexShader(vertex3);

            this._NDC(vf1);
            this._NDC(vf2);
            this._NDC(vf3);

            if (this._faceCulling(vf1.windowPosition, vf2.windowPosition, vf3.windowPosition, camera)) continue;

            CalcUtil.vec4MulMat4(vf1.windowPosition, viewPortVertex, vf1.windowPosition);
            CalcUtil.vec4MulMat4(vf2.windowPosition, viewPortVertex, vf2.windowPosition);
            CalcUtil.vec4MulMat4(vf3.windowPosition, viewPortVertex, vf3.windowPosition);


            this._raster(vf1, vf2, vf3, shader);
        }
    }

    /**
    * 画三维辅助坐标系
    * @param modelMatrix 
    * @param viewMatrix 
    * @param projectionMatrix 
    */
    public renderAxisHelp(modelMatrix: Mat4, viewMatrix: Mat4, projectionMatrix: Mat4) {
        const origin = new Vec4(0, 0, 0, 1);
        const xPoint = new Vec4(100, 0, 0, 1);
        const yPoint = new Vec4(0, 100, 0, 1);
        const zPoint = new Vec4(0, 0, 100, 1);
        const mvp = CalcUtil.mat4MulArr([
            projectionMatrix,
            viewMatrix,
            modelMatrix
        ]);
        const viewport = CommonUtil.getViewPortVertex(this.width, this.height);

        this._buffer.clear();

        // 画x轴
        for (let x = 0; x < xPoint.x; ++x) {
            const point = new Vec4(x, origin.y, origin.z, 1);
            CalcUtil.vec4MulMat4(point, mvp, point);
            CalcUtil.vec4MulMat4(point, viewport, point);
            this._buffer.setColor(Math.round(point.x), Math.round(point.y), Color.RED.clone());
        }
        // 画y轴
        for (let y = 0; y < yPoint.y; ++y) {
            const point = new Vec4(origin.x, y, origin.z, 1);
            CalcUtil.vec4MulMat4(point, mvp, point);
            CalcUtil.vec4MulMat4(point, viewport, point);
            this._buffer.setColor(Math.round(point.x), Math.round(point.y), Color.GREEN.clone());
        }
        // 画z轴
        for (let z = 0; z < zPoint.z; ++z) {
            const point = new Vec4(origin.x, origin.y, z, 1);
            CalcUtil.vec4MulMat4(point, mvp, point);
            CalcUtil.vec4MulMat4(point, viewport, point);
            this._buffer.setColor(Math.round(point.x), Math.round(point.y), Color.BLUE.clone());
        }

        this._ctx.putImageData(this._imageData, 0, 0);
    }
}