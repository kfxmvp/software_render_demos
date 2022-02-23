import { Color } from "../base/color";

export class FrameBuffer {
    private _buffer: Uint8ClampedArray;
    private _zBuffer: Float32Array;
    private _clearColor: Color = Color.BLACK;

    public width: number;
    public height: number;

    get length(): number {
        return this._buffer.length;
    }

    constructor(buffer: Uint8ClampedArray, width: number, height: number) {
        this._buffer = buffer;
        this._zBuffer = new Float32Array(width * height).fill(Infinity);
        this.width = width;
        this.height = height;
    }

    public setBuffer(buffer: Uint8ClampedArray) {
        this._buffer = buffer;
    }

    public getBuffer() {
        return this._buffer;
    }

    private getZBufferIndexWithPosition(x: number, y: number): number {
        return x + y * this.width;
    }

    public setZBufferWithPosition(x: number, y: number, zIndex: number) {
        this._zBuffer[this.getZBufferIndexWithPosition(x, y)] = zIndex;
    }

    public getZBufferWithPosition(x: number, y: number): number {
        return this._zBuffer[this.getZBufferIndexWithPosition(x, y)];
    }

    public zBufferTest(x: number, y: number, zIndex: number): boolean {
        const oldZIndex = this.getZBufferWithPosition(x, y);
        // z越小 离人眼越近
        if (oldZIndex > zIndex) {
            this.setZBufferWithPosition(x, y, zIndex);
            return true;
        }
        return false;
    }

    public setClearColor(color: Color) {
        this._clearColor = color.clone();
    }

    public clear() {
        const { r, g, b, a } = this._clearColor;

        // 将像素值全部设置为清除色
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const index = (x + y * this.width) * 4;
                this._buffer[index] = r;
                this._buffer[index + 1] = g;
                this._buffer[index + 2] = b;
                this._buffer[index + 3] = a;
            }
        }

        // 清除zBuffer
        this._zBuffer.fill(Infinity);
    }

    public setColor(x: number, y: number, color: Color) {
        const index = (x + y * this.width) * 4;
        const { r, g, b, a } = color;
        this._buffer[index] = r;
        this._buffer[index + 1] = g;
        this._buffer[index + 2] = b;
        this._buffer[index + 3] = a;
    }

    public getColor(x: number, y: number, out?: Color): Color {
        if (!out) out = new Color();
        const index = (x + y * this.width) * 4;
        out.r = this._buffer[index];
        out.g = this._buffer[index + 1];
        out.b = this._buffer[index + 2];
        out.a = this._buffer[index + 3];
        return out;
    }
}