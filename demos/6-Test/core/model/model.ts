import { Vec4 } from "../../base/vec4";
import { Material } from "../material";
import { Face } from "./face";
import { ModelObject } from "./object";

export class Model {
    private _object: Array<ModelObject>;
    public get object(): Array<ModelObject> {
        return this._object;
    }

    constructor() {
        this._object = [];
    }

    public static toVec3f(line: string, key: string): Vec4 {
        line = line.substring(key.length);
        line = line.trim();
        const splits = line.split(" ");
        const x = parseFloat(splits[0]);
        const y = parseFloat(splits[1]);
        let z = 0;
        if (splits.length > 2) {
            z = parseFloat(splits[2]);
        }
        return new Vec4(x, y, z);
    }

    public static toVec4f(line: string, key: string): Vec4 {
        const vec4 = Model.toVec3f(line, key);
        vec4.w = 1;
        return vec4;
    }

    public static toFace(line: string, key: string): Face {
        line = line.substring('f '.length);
        const face = new Face(key);
        const vers = line.split(' ');
        for (let idx = 0; idx < 3; ++idx) {
            const data = vers[idx].split('/');
            face.v.push(parseFloat(data[0]));
            if (data.length > 1) {
                face.t.push(parseFloat(data[1]));
            }
            if (data.length > 2) {
                face.n.push(parseFloat(data[2]));
            }
        }

        return face;
    }

    public addObject(object: ModelObject) {
        this._object.push(object);
    }

    public getObject(index: number) {
        return this._object[index];
    }

    public setMaterial(index: number, material: Material) {
        this._object[index]?.setMaterial(material);
    }
}