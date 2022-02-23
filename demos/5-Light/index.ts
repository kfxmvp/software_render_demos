import { Raster } from "./core/raster";
import { Scene } from "./core/scene";
import { Node } from "./core/node";
import { Material } from "./core/material";
import { Shader } from "./core/shader/shader";
import { Texture } from "./core/texture";
import { CalcUtil } from "./base/util/calc";
import { Mat4 } from "./base/mat4";
import { Vec4 } from "./base/vec4";
import { Color } from "./base/color";
import { Mesh } from "./core/mesh";
import { Model } from "./core/model/model";
import { ModelObject } from "./core/model/object";
import { Light } from "./core/light/light";
import { DirectLight } from "./core/light/direct_light";
import { PointLight } from "./core/light/point_light";
import { SpotLight } from "./core/light/spot_light";

// @ts-ignore
import Tex1 from "./resources/1.png";
// @ts-ignore
import Tex2 from "./resources/2.png";

const scene = new Scene();
const camera = scene.camera;
camera.setPosition(0, 0, -10);
camera.lookAt(0, 0, -1);
camera.usePerspectiveCamera();
camera.fov = 30;
camera.near = 1;
camera.far = 100;

// 灯光
let light: DirectLight | PointLight | SpotLight;

const raster = new Raster();
const { width, height } = raster;

// 使用基础灯光
const useBaseLight = () => {
    // @ts-ignore
    light = new Light();
    light.setColor(Color.WHITE.clone());
    light.setPosition(new Vec4(0, 0, 0, 1));
    light.setIntensity(1);

    // 环境光
    light.useAmbient();
    light.setAmbientColor(Color.WHITE.clone());
    light.setAmbientIntensity(0.3);

    // 镜面高光
    light.setSpecularColor(Color.RED.clone());
    light.setSpecularIntensity(0.5);
}

// 使用平行光
const useDirectLight = () => {
    light = new DirectLight();
    light.setColor(Color.WHITE.clone());
    light.setDirection(new Vec4(-0.2, -1, -0.3, 0));
    light.setPosition(new Vec4(10, 0, 0, 1));
    light.setIntensity(1);

    // 环境光
    light.useAmbient();
    light.setAmbientColor(Color.WHITE.clone());
    light.setAmbientIntensity(0.3);

    // 镜面高光
    light.setSpecularColor(Color.WHITE.clone());
    light.setSpecularIntensity(0.5);
}

// 使用点光源
const usePointLight = () => {
    light = new PointLight();
    light.setColor(Color.WHITE.clone());
    light.setPosition(new Vec4(-2, 0, 0, 1));
    light.setIntensity(1);

    // 环境光
    light.useAmbient();
    light.setAmbientColor(Color.WHITE.clone());
    light.setAmbientIntensity(0.1);

    // 镜面高光
    light.setSpecularColor(Color.WHITE.clone());
    light.setSpecularIntensity(0.5);
}

// 使用聚光灯
const useSpotLight = () => {
    light = new SpotLight();
    light.setColor(Color.WHITE.clone());
    light.setPosition(new Vec4(0, 0, 5, 1));
    light.setDirection(new Vec4(0, 0, -1, 0));
    light.setCutoffAngle(5);
    light.setCutOutOffAngle(7.5);
    light.setIntensity(1);

    // 环境光
    light.useAmbient();
    light.setAmbientColor(Color.WHITE.clone());
    light.setAmbientIntensity(0.1);

    // 镜面高光
    light.setSpecularColor(Color.WHITE.clone());
    light.setSpecularIntensity(0.5);
}

let angle = 0;
let autoRotation = true;
const dealAutoRotation = () => {
    angle += 1;
    scene.children.forEach(child => {
        const model = child.model;
        const objects = model.object;
        for (let i = 0; i < objects.length; ++i) {
            const object = objects[i];
            const shader = object.getMaterial()?.getShader();
            if (!shader) continue;
            // 更新model矩阵
            shader.modelMatrix = CalcUtil.mat4MulArr([
                child.positionMat4,
                // Mat4.getRotationMat4X(angle),
                Mat4.getRotationMat4Y(angle),
                // Mat4.getRotationMat4Z(angle),
            ])
        }
    })
}

let loaded = false;
const loadResource = async () => {
    const node = new Node();
    const mesh = new Mesh();
    const model = new Model();
    const object = new ModelObject();
    const material = new Material();
    const shader = new Shader();
    const texture = new Texture();

    node.model = model;

    mesh.createBox(new Vec4(0, 0, 0), 1);
    object.setMaterial(material);
    object.setMesh(mesh);

    model.addObject(object);

    await texture.setImageDataWithSrc(Tex2);
    material.setShader(shader);
    material.setTexture(texture);

    // 材质参数
    shader.addUniform('camera', camera);
    shader.addUniform('light', light);

    // mvp矩阵
    shader.modelMatrix = CalcUtil.mat4MulArr([
        node.positionMat4,
        Mat4.getRotationMat4X(angle)
    ])

    shader.viewMatrix = camera.getViewMatrix();

    const { near, far, fov } = camera;
    const aspect = width / height;

    shader.projectionMatrix = camera.isOrthographicCamera()
        ? camera.getOrthographicMatrix(-width / 2, width / 2, height / 2, -height / 2, near, far)
        : camera.getPerspectiveMatrix(fov, aspect, near, far);

    scene.addChild(node);
}

const update = () => {
    if (loaded) {
        if (autoRotation) dealAutoRotation();
        raster.render(scene);
    }
    requestAnimationFrame(update);
}

loadResource().then(() => loaded = true)

useBaseLight();
// useDirectLight();
// usePointLight();
// useSpotLight();

update();