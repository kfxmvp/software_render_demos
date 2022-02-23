import { Color } from "../../base/color";
import { Vec4 } from "../../base/vec4";
import { Light, LightType } from "./light";

// 平行光
export class DirectLight extends Light {
    /**光源方向 */
    private _direction: Vec4;
    public getDirection() {
        return this._direction;
    }
    public setDirection(direction: Vec4) {
        if (!this._direction) this._direction = direction.clone()
        else this._direction.set(direction.x, direction.y, direction.z, direction.w);
    }

    constructor() {
        super();
        this._type = LightType.Direct;
    }

    /**计算光照信息 用Phong模型 */
    public calc(viewDir: Vec4, worldPosition: Vec4, normal: Vec4): Color {
        return super.calc(viewDir, this._direction.clone().mul3(-1).normalize(), normal);
    }
}