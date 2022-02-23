import { Shader } from "./shader/shader";
import { Texture } from "./texture";

export class Material {
    private _texture: Texture;
    private _shader: Shader;

    public setShader(shader: Shader) {
        this._shader = shader;
    }

    public getShader() {
        return this._shader;
    }

    public getTexture() {
        return this._texture;
    }

    public setTexture(texture: Texture) {
        this._texture = texture;
        this._shader.setTexture(texture);
    }
}