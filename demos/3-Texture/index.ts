import { Color } from "./color";
import { Vec4 } from "./vec4";
import {
    getCanvas,
    getContext,
    createFrameBuffer,
    getFrameBufferData,
    clear,
    writeColor,
    render,
} from "./raster";
import { getBoundingBox, barycentric, lerp, mat4MulArr, vec4MulMat4, getViewPortVertex } from "./util";
import { Mesh } from "./mesh";
import { Camera } from "./camera";
import { Mat4 } from "./mat4";
import { Texture } from "./texture";
import { Vertex } from './vertex';
//@ts-ignore
import T1 from './resources/1.jpg';
//@ts-ignore
import T2 from './resources/2.jpg';

const canvas = getCanvas();
const ctx = getContext(canvas);
const frameBuffer = createFrameBuffer(canvas, ctx);
const frameData = getFrameBufferData(frameBuffer);

const { width, height } = canvas;

// 摄像机
const near = 1;
const far = 100;
const fov = 30;
const aspect = width / height;
const camera = new Camera();
camera.setPosition(0, 0, -10);
camera.lookAt(0, 0, -1);
// 使用正交摄像机
// camera.useOrthographicCamera();
// 使用透视摄像机
camera.usePerspectiveCamera();

const viewMat = camera.getViewMatrix();
const projectionMat = camera.isOrthographicCamera()
    ? camera.getOrthographicMatrix(-width / 2, width / 2, height / 2, -height / 2, near, far)
    : camera.getPerspectiveMatrix(fov, aspect, near, far);

// 网格
const mesh = new Mesh();
if (camera.isOrthographicCamera()) {
    mesh.createBox(new Vec4(0, 0, 1), 100);
}
else {
    mesh.createBox(new Vec4(0, 0, -1), 1);
}

let textureLoaded = false;
const texture = new Texture();
texture.setImageDataWithSrc(T1).then(() => textureLoaded = true)

// 深度信息
let zBuffer: Float32Array;

// 每帧需要清除深度信息 重新获取
function clearZBuffer() {
    zBuffer = new Float32Array(width * height).fill(Infinity);
}

// 根据当前像素位置信息(x,y)获取深度信息数组中的下标index
function getZBufferIndexWithPosition(x: number, y: number): number {
    return x + y * width;
}

// 根据当前像素位置信息(x,y) 设置对应深度的值为zIndex
function setZBufferWithPosition(x: number, y: number, zIndex: number) {
    zBuffer[getZBufferIndexWithPosition(x, y)] = zIndex;
}

// 根据当前像素位置信息(x,y) 获取对应深度的值zIndex
function getZBufferWithPosition(x: number, y: number): number {
    return zBuffer[getZBufferIndexWithPosition(x, y)];
}

// 深度检测 根据当前像素位置信息(x,y) 检测是否需要更新对应的深度信息，并且该颜色需要渲染到该像素上
function zBufferTest(x: number, y: number, zIndex: number): boolean {
    const oldZIndex = getZBufferWithPosition(x, y);
    // z越小 离人眼越近
    if (oldZIndex > zIndex) {
        setZBufferWithPosition(x, y, zIndex);
        return true;
    }
    return false;
}

// 画渐变三角形
function drawTriangle(vertex1: Vertex, vertex2: Vertex, vertex3: Vertex) {
    const { xMin, xMax, yMin, yMax } = getBoundingBox(vertex1.position, vertex2.position, vertex3.position, width, height);
    for (let x = xMin; x < xMax; ++x) {
        for (let y = yMin; y < yMax; ++y) {
            const barycentricCoord = barycentric(x, y, vertex1.position, vertex2.position, vertex3.position);
            if (barycentricCoord.x < 0 ||
                barycentricCoord.y < 0 ||
                barycentricCoord.z < 0
            )
                continue;

            const Z =
                vertex1.Z * barycentricCoord.x +
                vertex2.Z * barycentricCoord.y +
                vertex3.Z * barycentricCoord.z;

            let u =
                vertex1.u * barycentricCoord.x +
                vertex2.u * barycentricCoord.y +
                vertex3.u * barycentricCoord.z;

            let v =
                vertex1.v * barycentricCoord.x +
                vertex2.v * barycentricCoord.y +
                vertex3.v * barycentricCoord.z;

            u *= 1 / Z;
            v *= 1 / Z;

            const z =
                vertex1.position.z * barycentricCoord.x
                + vertex2.position.z * barycentricCoord.y
                + vertex3.position.z * barycentricCoord.z;
            if (!zBufferTest(x, y, z)) continue;

            if (textureLoaded) {
                writeColor(frameData, x, y, width, texture.getColorWithUV(u, v));
            }
            else {
                writeColor(frameData, x, y, width, lerp(barycentricCoord, Color.RED, Color.GREEN, Color.BLUE));
            }
        }
    }
}

// 画网格
function drawMesh(modelMat: Mat4) {
    for (let i = 0; i < mesh.EBO.length; i += 3) {
        const v1 = mesh.VBO[mesh.EBO[i]];
        const v2 = mesh.VBO[mesh.EBO[i + 1]];
        const v3 = mesh.VBO[mesh.EBO[i + 2]];

        const mvp = mat4MulArr([projectionMat, viewMat, modelMat]);

        // local空间转换到clip空间
        // mvp变换
        const windowPos1 = vec4MulMat4(v1.position, mvp);
        const windowPos2 = vec4MulMat4(v2.position, mvp);
        const windowPos3 = vec4MulMat4(v3.position, mvp);

        const v1z = -1 / windowPos1.w;
        const v2z = -1 / windowPos2.w;
        const v3z = -1 / windowPos3.w;

        NDC(windowPos1);
        NDC(windowPos2);
        NDC(windowPos3);

        if (faceCulling(windowPos1, windowPos2, windowPos3)) continue;

        const viewportMat = getViewPortVertex(width, height);

        // 视口变换
        vec4MulMat4(windowPos1, viewportMat, windowPos1);
        vec4MulMat4(windowPos2, viewportMat, windowPos2);
        vec4MulMat4(windowPos3, viewportMat, windowPos3);

        const v2f1 = new Vertex(windowPos1.x, windowPos1.y, windowPos1.z, windowPos1.w);
        const v2f2 = new Vertex(windowPos2.x, windowPos2.y, windowPos2.z, windowPos2.w);
        const v2f3 = new Vertex(windowPos3.x, windowPos3.y, windowPos3.z, windowPos3.w);
        v2f1.Z = v1z;
        v2f2.Z = v2z;
        v2f3.Z = v3z;

        v2f1.u = v1.u * v1z;
        v2f1.v = v1.v * v1z;
        v2f2.u = v2.u * v2z;
        v2f2.v = v2.v * v2z;
        v2f3.u = v3.u * v3z;
        v2f3.v = v3.v * v3z;

        // 画三角形
        drawTriangle(v2f1, v2f2, v2f3);
    }
}

// 屏幕坐标标准化
function NDC(position: Vec4) {
    position.standardize();
    position.z = (position.z + 1) * 0.5;
}

// 面剔除
function faceCulling(v1: Vec4, v2: Vec4, v3: Vec4) {
    const line1 = v2.sub(v1);
    const line2 = v3.sub(v1);

    const normal = line1.cross(line2).normalize();
    const view = new Vec4(0, 0, 1);
    const dot = normal.dot(view);
    return dot < 0;
}

let angle = 0;
const update = () => {
    angle += 1;
    // 旋转
    const modelMat = mat4MulArr([
        Mat4.getRotationMat4X(angle),
        // Mat4.getRotationMat4Y(angle),
        // Mat4.getRotationMat4Z(angle),
    ]);
    clear(canvas, ctx, frameBuffer, Color.BLACK);
    clearZBuffer();
    drawMesh(modelMat);
    render(canvas, ctx, frameBuffer);
    requestAnimationFrame(update);
}
update();

