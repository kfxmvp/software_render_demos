import { Color } from "../../base/color";
import { CalcUtil } from "../../base/util/calc";
import { Vec4 } from "../../base/vec4";
import { Light, LightType } from "./light";

export class SpotLight extends Light {
    /**聚光源方向 */
    private _direction: Vec4;
    public getDirection() {
        return this._direction;
    }
    public setDirection(direction: Vec4) {
        if (!this._direction) this._direction = direction.clone()
        else this._direction.set(direction.x, direction.y, direction.z, direction.w);
    }

    //切光角
    private _cutOffAngle: number;
    public getCutOffAngle(): number {
        return this._cutOffAngle;
    }
    public setCutoffAngle(angle: number) {
        this._cutOffAngle = angle;
    }

    // 外圆锥角度
    private _outCutOffAngle: number;
    public getCutOutOffAngle(): number {
        return this._outCutOffAngle;
    }
    public setCutOutOffAngle(angle: number) {
        this._outCutOffAngle = angle;
    }
    constructor() {
        super();
        this._type = LightType.Spot;
        this._direction = new Vec4();
        this._cutOffAngle = 0;
    }

    /**计算光照信息 用Phong模型 */
    public calc(viewDir: Vec4, wordPosition: Vec4, normal: Vec4): Color {
        const { _position, _direction, _cutOffAngle, _outCutOffAngle: _outOffAngle } = this;
        
        //首先计算了lightDir和取反的direction向量
        const lightDir = _position.sub(wordPosition).normalize();
        //取反的是因为我们想让向量指向光源而不是从光源出发
        const spotDir = _direction.clone().mul3(-1).normalize();
        // 计算lightDir和spotDir夹角的余弦值
        const cosTheta = lightDir.dotVec3(spotDir);

        const cosCutoff = Math.cos((Math.PI / 180) * _cutOffAngle);
        const cosOutCutoff = Math.cos((Math.PI / 180) * this._outCutOffAngle);

        // 角度小于切光角 但因为用的是余弦值 余弦值在角度越小时 值越大 所以是 > 而不是 < 
        // return cosTheta > cosCutoff ? super.calc(viewDir,lightDir,normal) : Color.BLACK.clone();

        // 边缘平滑处理
        const epsilon = cosCutoff - cosOutCutoff;
        const intensity = CalcUtil.clamp((cosTheta - cosOutCutoff) / epsilon, 0.0, 1.0);

        return super.calc(viewDir, lightDir, normal).mul3(intensity);
    }
}