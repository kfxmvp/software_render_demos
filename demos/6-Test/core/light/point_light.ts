import { Color } from "../../base/color";
import { Vec4 } from "../../base/vec4";
import { Light, LightType } from "./light";

export class PointLight extends Light {
    //常数项Kc
    private _constant: number;
    //一次项Kl
    private _linear: number;
    //二次项Kq
    private _quadratic: number;

    constructor() {
        super();
        this._type = LightType.Point;
        this._constant = 1;
        this._linear = 0.09;
        this._quadratic = 0.032;
    }

    /**计算光照信息 用Phong模型 */
    public calc(viewDir: Vec4, worldPosition: Vec4, normal: Vec4): Color {
        const { _constant, _linear, _quadratic } = this;
        // 片元到光源的距离
        const distance = this._position.sub(worldPosition).length;

        // 光照衰减系数
        const attenuation = 1 / (_constant + _linear * distance + _quadratic * (distance * distance));

        //片元到光的反向，拿光的位置减去片元的位置即worldPos
        const lightDir = this._position.sub(worldPosition).normalize();

        const result = super.calc(viewDir, lightDir, normal);

        // 进行光照衰减
        return result.mul3(attenuation);
    }
}