import { Color } from "../base/color";
export enum StencilType {
    Always,
    Equal,
    NoEqual
}

export class FrameBuffer {
    private _buffer: Uint8ClampedArray;
    private _zBuffer: Float32Array;
    private _stencilBuffer: Float32Array;
    private _clearColor: Color = Color.BLACK;

    public width: number;
    public height: number;

    get length(): number {
        return this._buffer.length;
    }

    constructor(buffer: Uint8ClampedArray, width: number, height: number) {
        this._buffer = buffer;
        this._zBuffer = new Float32Array(width * height).fill(Infinity);
        this._stencilBuffer = new Float32Array(width * height).fill(1);
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

    private getIndex(x: number, y: number) {
        return (x + y * this.width) * 4;
    }

    public clear() {
        const { r, g, b, a } = this._clearColor;

        // 将像素值全部设置为清除色
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const index = this.getIndex(x, y);
                this._buffer[index] = r;
                this._buffer[index + 1] = g;
                this._buffer[index + 2] = b;
                this._buffer[index + 3] = a;
            }
        }

        // 清除zBuffer
        this._zBuffer.fill(Infinity);

        // 清除模板测试
        this._stencilBuffer.fill(1);
    }

    public setColor(x: number, y: number, color: Color) {
        const index = this.getIndex(x, y);
        const { r, g, b, a } = color;
        this._buffer[index] = r;
        this._buffer[index + 1] = g;
        this._buffer[index + 2] = b;
        this._buffer[index + 3] = a;
    }

    public getColor(x: number, y: number, out?: Color): Color {
        if (!out) out = new Color();
        const index = this.getIndex(x, y);
        out.r = this._buffer[index];
        out.g = this._buffer[index + 1];
        out.b = this._buffer[index + 2];
        out.a = this._buffer[index + 3];
        return out;
    }

    //获取模板测试Buffer值
    public getStencilValue(x: number, y: number) {
        const index = this.getIndex(x, y);
        return this._stencilBuffer[index];
    }

    //设置模板测试Buffer值
    public setStencilValue(x: number, y: number, value: number) {
        const index = this.getIndex(x, y);
        this._stencilBuffer[index] = value;
    }

    //模板测试
    public stencilTest(type: StencilType, x: number, y: number) {
        let write: boolean = true;
        switch (type) {
            case StencilType.Always:
                write = true;
                break;
            case StencilType.Equal:
                write = 1 === this.getStencilValue(x, y)
                break;
            case StencilType.NoEqual:
                write = 1 !== this.getStencilValue(x, y);
                break;
            default:
                write = true;
                break;
        }

        write && this.setStencilValue(x, y, 1);

        return write;
    }
}