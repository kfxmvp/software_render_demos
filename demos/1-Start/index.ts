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
import { getBoundingBox, barycentric, lerp } from "./util";

const canvas = getCanvas();
const ctx = getContext(canvas);
const frameBuffer = createFrameBuffer(canvas, ctx);
const frameData = getFrameBufferData(frameBuffer);
clear(canvas, ctx, frameBuffer);

const { width, height } = canvas;

const v1 = new Vec4(0, 0);
const v2 = new Vec4(300, 0);
const v3 = new Vec4(150, 150);

// drawCoordinateSystem();
drawTriangle(v1, v2, v3);

render(canvas, ctx, frameBuffer);

// 画坐标系
function drawCoordinateSystem() {
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            // x轴
            if (y == 0) {
                writeColor(frameData, x, y, width, new Color(255 * x / width, 0, 0, 255));
            }
            // y轴
            if (x == 0) {
                writeColor(frameData, x, y, width, new Color(0, 255 * y / height, 0, 255));
            }
        }
    }
}

// 画渐变三角形
function drawTriangle(vertex1: Vec4, vertex2: Vec4, vertex3: Vec4) {
    const { xMin, xMax, yMin, yMax } = getBoundingBox(vertex1, vertex2, vertex3, width, height);
    for (let x = xMin; x < xMax; ++x) {
        for (let y = yMin; y < yMax; ++y) {
            const barycentricCoord = barycentric(x, y, vertex1, vertex2, vertex3);
            if (barycentricCoord.x < 0 ||
                barycentricCoord.y < 0 ||
                barycentricCoord.z < 0
            )
                continue;
            writeColor(frameData, x, y, width, lerp(barycentricCoord, Color.RED, Color.GREEN, Color.BLUE));
        }
    }
}
