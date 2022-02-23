import { Mat4 } from "./mat4";
import { mat4MulArr } from "./util";
import { Vec4 } from "./vec4";

export enum CameraRenderType {
    Orthographic,
    Perspective
}
export class Camera {

    // 相机位置/视点/观察点
    private _position: Vec4 = new Vec4();
    public get position(): Vec4 {
        return this._position;
    }
    /** 设置相机位置 */
    public setPosition(x: number, y: number, z: number) {
        this._position.set(x, y, z, 1);
    }

    // 视点正上方向
    private _up: Vec4;
    public get up(): Vec4 {
        return this._up;
    }
    /**设置视点正上方向 */
    public setUp(x: number, y: number, z: number) {
        this._up.set(x, y, z, 1);
    }

    // 观察方向
    private _lookAt: Vec4 = new Vec4();
    /**设置相机观察位置 */
    public lookAt(x: number, y: number, z: number) {
        this._lookAt.set(x, y, z, 1);
    }

    /**
     * 相机x轴
     *      t x z
     * x = -------
     *    ||t x z||
     */
    private _x: Vec4;
    public get x(): Vec4 {
        if (!this._x) {
            const t = new Vec4(0, 1, 0);
            this._x = t.cross(this.z).normalize();
        }
        return this._x;
    }

    /**
     * 相机y轴 
     * y = z 叉乘 x
     */
    private _y: Vec4;
    public get y(): Vec4 {
        if (!this._y) {
            this._y = this.z.cross(this.x).normalize();
        }
        return this._y;
    }

    /**
     * 相机z轴 （相机lookAt到position的向量）
     *         g
     * z = -  ---
     *       ||g||
     */
    private _z: Vec4;
    public get z(): Vec4 {
        if (!this._z) {
            const { _position, _lookAt } = this;
            this._z = _position.sub(_lookAt).normalize();
        }
        return this._z;
    }

    /**
     * 旋转矩阵
     * 目标是把 相机坐标系x,y,z旋转到标准坐标系x(1,0,0) y(0,1,0) z(0,0,1) 
     * 即先求把标准坐标系旋转到相机坐标系的旋转矩阵，求逆（因为旋转矩阵是正交矩阵，所以求逆就等于求转置）
     * 即旋转矩阵为 把标准坐标系旋转到相机坐标系的旋转矩阵的转置
     * ux uy uz 0
     * vx vy vz 0
     * wx wy wz 0
     * 0  0  0  1
     */
    private _RMatrix: Mat4;
    public get RMatrix(): Mat4 {
        if (!this._RMatrix) {
            this._RMatrix = new Mat4();
            this._RMatrix.setWithNum(
                this.x.x, this.x.y, this.x.z, 0,
                this.y.x, this.y.y, this.y.z, 0,
                this.z.x, this.z.y, this.z.z, 0,
                0, 0, 0, 1,
            );
        }
        return this._RMatrix;
    }

    /**
     * 平移矩阵
     * 1 0 0 -x
     * 0 1 0 -y
     * 0 0 1 -z
     * 0 0 0 1
     */
    private _TMatrix: Mat4;
    public get TMatrix(): Mat4 {
        const { x, y, z } = this.position;
        if (!this._TMatrix) {
            this._TMatrix = new Mat4();
            this._TMatrix.setWithNum(
                1, 0, 0, -x,
                0, 1, 0, -y,
                0, 0, 1, -z,
                0, 0, 0, 1
            )
        }
        return this._TMatrix;
    }

    /**
     * R * T
     */
    private _RMulT: Mat4;
    public get RMulT(): Mat4 {
        if (!this._RMulT) {
            this._RMulT = mat4MulArr([this.RMatrix, this.TMatrix]);
        }
        return this._RMulT;
    }

    /**获取观察矩阵 */
    public getViewMatrix(): Mat4 {
        return this.RMulT;
    }

    /**
     * 获取正交投影矩阵 
     * 2/(r-l)   0      0     -(r+l)/(r-l)
     *   0    2/(t-b)   0     -(t+b)/(t-b)
     *   0       0   -2/(f-n) -(f+n)/(f-n)
     *   0       0      0           1
     */
    public getOrthographicMatrix(
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number
    ): Mat4 {
        const mat = new Mat4();
        mat.setWithNum(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        )
        return mat;;
    }

    /**
     * 获取透视投影矩阵 
     * 1/aspect*tan(fov/2)       0             0            0
     *    0                 1/tan(fov/2)       0            0
     *    0                      0        -(f+n)/(f-n)  -2fn/(f-n)
     *    0                      0             -1           0
     * */
    public getPerspectiveMatrix(
        fov: number,
        aspect: number,
        near: number,
        far: number
    ): Mat4 {
        const mat = new Mat4();
        const rad = (Math.PI / 180) * fov;
        mat.setWithNum(
            1 / (Math.tan(rad / 2) * aspect), 0, 0, 0,
            0, 1 / Math.tan(rad / 2), 0, 0,
            0, 0, -(far + near) / (far - near), -2 * (far * near) / (far - near),
            0, 0, -1, 0
        )
        return mat;;
    }


    private _renderType: CameraRenderType;
    public get renderType(): CameraRenderType {
        return this._renderType;
    }
    public set renderType(type: CameraRenderType) {
        this._renderType = type;
    }

    /**是否为正交摄像机 */
    public isOrthographicCamera() {
        return this._renderType == CameraRenderType.Orthographic;
    }

    /**是否为透视摄像机 */
    public isPerspectiveCamera() {
        return this._renderType == CameraRenderType.Perspective;
    }

    /**使用正交摄像机 */
    public useOrthographicCamera() {
        this._renderType = CameraRenderType.Orthographic;
    }

    /**使用透视摄像机 */
    public usePerspectiveCamera() {
        this._renderType = CameraRenderType.Perspective;
    }

    private _fov: number;
    public get fov(): number {
        return this._fov;
    }
    public set fov(fov: number) {
        this._fov = fov;
    }

    private _near: number;
    public get near(): number {
        return this._near;
    }
    public set near(near: number) {
        this._near = near;
    }

    private _far: number;
    public get far(): number {
        return this._far;
    }
    public set far(far: number) {
        this._far = far;
    }
}