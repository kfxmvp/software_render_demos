import { Color } from "../../base/color";
import { Vec4 } from "../../base/vec4";
import { CalcUtil } from "../../base/util/calc";

export enum LightType {
    Direct,
    Point,
    Spot
}

export class Light {
    // 光源类型
    protected _type: LightType = LightType.Direct;
    public getLightType(): LightType {
        return this._type;
    }
    public setLightType(type: LightType) {
        this._type = type;
    }

    /**光源位置 */
    protected _position: Vec4;
    public getPosition(): Vec4 {
        return this._position;
    }
    public setPosition(position: Vec4) {
        if (!this._position) this._position = position.clone()
        else this._position.set(position.x, position.y, position.z, position.w);
    }

    /**是否使用环境光 */
    protected _useAmbient: boolean;
    public isUseAmbient(): boolean {
        return this._useAmbient;
    }
    public useAmbient() {
        this._useAmbient = true;
    }
    public unUseAmbient() {
        this._useAmbient = false;
    }

    /**环境光颜色 */
    protected _ambientColor: Color;
    public getAmbientColor(): Color {
        return this._ambientColor;
    }
    public setAmbientColor(color: Color) {
        this._ambientColor = color;
    }

    /**环境光系数 */
    protected _ambientIntensity: number;
    public getAmbientIntensity(): number {
        return this._ambientIntensity;
    }
    public setAmbientIntensity(intensity: number) {
        this._ambientIntensity = intensity;
    }

    /**光源颜色 */
    protected _color: Color;
    public getColor() {
        return this._color.clone().mul3(this._intensity);
    }
    public setColor(color: Color) {
        if (!this._color) this._color = color.clone()
        else this._color.set(color.r, color.g, color.b, color.a);
    }

    /**光源强度 */
    protected _intensity: number;
    public getIntensity(): number {
        return this._intensity;
    }
    public setIntensity(intensity: number) {
        this._intensity = intensity;
    }

    /**镜面光颜色 */
    protected _specularColor: Color;
    public getSpecularColor(): Color {
        return this._specularColor;
    }
    public setSpecularColor(color: Color) {
        if (!this._specularColor) this._specularColor = color.clone()
        else this._specularColor.set(color.r, color.g, color.b, color.a);
    }

    /**镜面反射强度 */
    protected _specularIntensity: number;
    public getSpecularIntensity(): number {
        return this._specularIntensity;
    }
    public setSpecularIntensity(intensity: number) {
        this._specularIntensity = intensity;
    }

    /**计算光照信息 用Phong模型 */
    public calc(viewDir: Vec4, lightDir: Vec4, normal: Vec4): Color {
        // 反射方向
        const reflectDir = CalcUtil.reflect(lightDir, normal);

        // 环境光
        const ambient = this._useAmbient ? this._ambientColor.mul3(this._ambientIntensity) : new Color();

        //用法向量 点乘 片元到光的方向 就是余弦值
        const cos = normal.normalize().dotVec3(lightDir);
        // 漫反射
        const diffuse = this._color.clone().mul3(Math.max(cos, 0));

        // 高光
        const spec = Math.pow(Math.max(viewDir.dotVec3(reflectDir), 0), 32)
        const specular = this._specularColor.clone().mul3(this._specularIntensity * spec);

        return ambient.add(diffuse).add(specular);
    }

    constructor() {
        // 光源设置
        this._position = new Vec4();
        this._color = Color.WHITE.clone();
        this._intensity = 1;

        // 环境光设置
        this._useAmbient = true;
        this._ambientColor = Color.WHITE.clone();
        this._ambientIntensity = 1;

        // 高光设置
        this._specularColor = new Color();
        this._specularIntensity = 1;
    }
}