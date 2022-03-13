import { Camera } from "./camera";
import { Node } from "./node";

export class Scene {
    private _camera: Camera;
    public get camera(): Camera {
        return this._camera;
    }

    private _child: Array<Node>;
    public get children(): Array<Node> {
        return this._child;
    }
    public set children(children: Array<Node>) {
        this._child = children;
    }

    public get childrenCount(): number {
        return this._child.length;
    }

    constructor(camera?: Camera) {
        if (!!camera) this._camera = camera;
        else this._camera = new Camera();

        this._child = [];
    }

    public getChildByIndex(index: number): Node {
        return this._child[index];
    }

    public getChildByName(name: string): Node {
        return this._child.find(child => child.name === name);
    }

    public getChildById(id: string): Node {
        return this._child.find(child => child.id === id);
    }

    public addChild(node: Node) {
        this._child.push(node);
    }

    public removeChild(node: Node) {
        this._child.splice(this._child.findIndex(child => child === node), 1);
    }

    public removeChildById(id: string) {
        this._child.splice(this._child.findIndex(child => child.id === id), 1);
    }

    public removeAllChild() {
        this._child.forEach(child => child.destroy());
        this._child = [];
    }
}