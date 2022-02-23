import { Material } from "../material";
import { Mesh } from "../mesh";

export class ModelObject {
    private _mesh: Mesh;
    private _material: Material;

    constructor() {
        this._mesh = new Mesh();
        this._material = new Material();
    }

    public setMaterial(material: Material) {
        this._material = material;
    }

    public getMaterial(): Material {
        return this._material;
    }

    public setMesh(mesh: Mesh) {
        this._mesh = mesh;
    }

    public getMesh(): Mesh {
        return this._mesh;
    }
}