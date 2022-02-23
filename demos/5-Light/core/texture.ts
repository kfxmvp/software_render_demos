import { Color } from "../base/color";
import { Loader } from "./loader";

export class Texture {
    private _imageData: ImageData;
    public get imageData(): ImageData {
        return this._imageData;
    }

    public get width(): number {
        return this._imageData?.width;
    }

    public get height(): number {
        return this._imageData.height;
    }

    private getColorWithXY(x: number, y: number): Color {
        const index = (x + y * this.width) * 4;
        const data = this._imageData.data;
        return new Color(
            data[index],
            data[index + 1],
            data[index + 2],
            data[index + 3]
        )
    }

    public setImageData(data: ImageData) {
        this._imageData = data;
    }

    public async setImageDataWithSrc(path: string) {
        const imageData = await Loader.loadImage(path);
        if (imageData) this._imageData = imageData;
    }

    public getColorWithUV(u: number, v: number): Color {
        if (!this._imageData) return Color.BLACK;
        if (u < 0 || v < 0 || u > 1 || v > 1) return Color.BLACK;
        const x = (u * this.width - 0.5);
        const y = ((1 - v) * this.height - 0.5);
        return this.getColorWithXY(Math.round(x), Math.round(y));
    }
}