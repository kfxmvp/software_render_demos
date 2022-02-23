import { Mat4 } from "../base/mat4";
import { Vec4 } from "../base/vec4";
import { Model } from "./model/model";

export class Node {
    private _id: string;
    public get id(): string {
        return this._id;
    }
    public set id(id: string) {
        if (!this._id) this._id = id;
    }

    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(name: string) {
        this._name = name;
    }

    private _position: Vec4;
    public set position(position: Vec4) {
        if (!this._position) this._position = position.clone();
        else this._position.set(position.x, position.y, position.z, position.w);
    }
    public get position(): Vec4 {
        return this._position;
    }

    private _model: Model;
    public set model(model: Model) {
        this._model = model;
    }
    public get model(): Model {
        return this._model;
    }

    private _mat: Mat4;
    public get positionMat4(): Mat4 {
        return this._mat;
    }

    constructor(model?: Model) {
        if (!!model) this._model = model;
        this._position = new Vec4(0, 0, 0, 1);
        this.setPosition(0, 0, 0);
    }

    setPosition(x: number, y: number, z: number) {
        this._position.set(x, y, z, 1);
        if (!this._mat) this._mat = new Mat4();
        this._mat.setWithNum(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        )
    }

    destroy() {
        this._position = null;
        this._model = null;
        this._mat = null;
    }
}