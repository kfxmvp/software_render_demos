import { Color } from "./color";

// canvas画布
export function getCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    return canvas;
}

// canvas 2d上下文
export function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    return ctx;
}

// canvas像素数据 
export function createFrameBuffer(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): ImageData {
    const imageData: ImageData = ctx.createImageData(canvas.width, canvas.height);
    return imageData;
}

// canvas像素数据数组
export function getFrameBufferData(imageData: ImageData) {
    return imageData?.data;
}

// 根据x列+y行,获取像素值在imageData中的真实index
export function getIndex(x: number, y: number, width: number): number {
    return (x + y * width) * 4;
}

// 将像素数据放回canvas 达到渲染到canvas的效果
export function render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, imageData: ImageData) {
    ctx.putImageData(imageData, 0, 0);
}

// 清除canvas颜色
export function clear(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, imageData: ImageData, clearColor?: Color) {
    const frameData = getFrameBufferData(imageData);
    const { width, height } = canvas;
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            const index = getIndex(x, y, width);
            frameData[index] = clearColor ? clearColor.r : 255;
            frameData[index + 1] = clearColor ? clearColor.g : 255;
            frameData[index + 2] = clearColor ? clearColor.b : 255;
            frameData[index + 3] = clearColor ? clearColor.a : 255;
        }
    }
}

export function readColor(frameBufferData: Uint8ClampedArray, x: number, y: number, width: number): Color {
    const index = getIndex(x, y, width);
    return new Color(
        frameBufferData[index],
        frameBufferData[index + 1],
        frameBufferData[index + 2],
        frameBufferData[index + 3])
}

export function writeColor(frameBufferData: Uint8ClampedArray, x: number, y: number, width: number, color: Color) {
    const index = getIndex(x, y, width);
    const { r, g, b, a } = color;
    frameBufferData[index] = r;
    frameBufferData[index + 1] = g;
    frameBufferData[index + 2] = b;
    frameBufferData[index + 3] = a;
}