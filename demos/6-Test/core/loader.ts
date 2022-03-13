import { Vec4 } from "../base/vec4";
import { Vertex } from "../base/vertex";
import { Material } from "./material";
import { Face } from "./model/face";
import { Model } from "./model/model";
import { ModelObject } from "./model/object";
import { Shader } from "./shader/shader";

export class Loader {
    public static async loadImage(path: string): Promise<ImageData> {
        return new Promise<ImageData>((resolve, reject) => {
            try {
                let image = new Image();
                image.crossOrigin = '*';
                image.onload = () => {
                    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
                    const ctx = canvas.getContext('2d');
                    const { width, height } = canvas;
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    const imageData = ctx.getImageData(0, 0, image.width, image.height);
                    image = undefined;
                    canvas.width = width;
                    canvas.height = height;
                    resolve(imageData)
                }

                image.src = path;
            }
            catch (e) { reject(e) }
        })
    }

    public static async loadModel(path: string): Promise<Model> {
        return new Promise<Model>(async (resolve, reject) => {
            try {
                let key = 'default';
                let needCreateObject = false;
                let objectCount = -1;
                const v: Array<Vec4> = [];
                const t: Array<Vec4> = [];
                const n: Array<Vec4> = [];
                const faces: Array<Face> = [];
                const text = await Loader.loadText(path);
                const model = new Model();
                const lines = text.replace(/\r/g, '').split('\n');
                lines.forEach(line => {
                    if (line.startsWith('v ')) {
                        v.push(Model.toVec4f(line, 'v '));
                        if (!needCreateObject) {
                            needCreateObject = true;
                            ++objectCount;
                            const object = new ModelObject();
                            model.addObject(object);
                        }
                    }
                    else if (line.startsWith('vt ')) t.push(Model.toVec4f(line, 'vt '));
                    else if (line.startsWith('vn ')) n.push(Model.toVec4f(line, 'vn '));
                    else if (line.startsWith('usemtl ')) {
                        key = line.substring('usemtl '.length);
                        const object = model.getObject(objectCount);
                        const material = new Material();
                        const shader = new Shader();
                        material.setShader(shader);
                        object.setMaterial(material);
                    }
                    else if (line.startsWith('f ')) {
                        const face = Model.toFace(line, key);
                        faces.push(face);
                        if (needCreateObject) {
                            needCreateObject = false;
                        }
                        const object = model.getObject(objectCount);
                        const mesh = object.getMesh();
                        const vers = [];
                        for (let i = 0; i < 3; ++i) {
                            const vert = new Vertex();
                            vert.position = v[face.v[i] - 1];
                            vert.normal = n[face.n[i] - 1];
                            const { x, y } = t[face.t[i] - 1];
                            vert.u = x;
                            vert.v = y;
                            vers.push(vert);
                        }
                        mesh.createTriangleWithArray(vers);
                    }
                })

                resolve(model);
            }
            catch (e) { reject(e); }
        })
    }

    /**
     * 读取文本文件
     * @param {string} path 文本文件路径
     * @returns {string} 文本内容
     */
    private static async loadText(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path);
            xhr.onreadystatechange = (ev) => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText);
                    }
                    else {
                        reject(`http error, ${xhr.status}`)
                    }
                }
            }
            xhr.send();
        })
    }
}