import { Vec4 } from "./vec4";
import { Vertex } from "./vertex";

export class Mesh {
    public VBO: Array<Vertex>;
    public EBO: Array<number>;
    constructor() {
        this.VBO = new Array();
        this.EBO = new Array();
    }

    /**
     * 创建三角形
     */
    createTriangle(v1: Vertex, v2: Vertex, v3: Vertex) {
        const { VBO, EBO } = this;
        const idx = VBO.length;
        VBO.push(v1, v2, v3);
        EBO.push(idx, idx + 1, idx + 2);
    }

    public createTriangleWithArray(points: Array<Vertex>) {
        this.createTriangle(points[0], points[1], points[2]);
    }

    /**
     * 创建矩形面
     * 0 --- 3
     * |  \  |
     * |   \ |
     * 1 --- 2
     * 将矩形面分为两个三角形 分别渲染 逆时针存放
     * 左012 右023
     */
    createRect(
        leftTop: Vec4,
        leftBottom: Vec4,
        rightBottom: Vec4,
        rightTop: Vec4,
    ) {
        const mesh = new Mesh();
        const points = [leftTop, leftBottom, rightBottom, rightTop];
        const vertexes: Array<Vertex> = [];
        for (let i = 0; i < 4; ++i) {
            const vertex = new Vertex();
            vertex.position = points[i].clone();
            if (i == 0) {
                vertex.u = 0;
                vertex.v = 0;
            }
            else if (i == 1) {
                vertex.u = 0;
                vertex.v = 1;
            }
            else if (i == 2) {
                vertex.u = 1;
                vertex.v = 1;
            }
            else if (i == 3) {
                vertex.u = 1;
                vertex.v = 0;
            }
            vertexes.push(vertex);

        }
        this.createTriangleWithArray([0, 1, 2].map(idx => vertexes[idx]));
        this.createTriangleWithArray([0, 2, 3].map(idx => vertexes[idx]));
        return mesh;
    }

    private createPlaneWithArray(points: Array<Vec4>) {
        this.createRect(points[0], points[1], points[2], points[3]);
    }

    /**
     * 创建正方体（后续可以优化顶点复用）
     * 只需要8个点 前后各四个(然后分别用点组成6个面即可)
     * 0123前面 4567后面 
     * 4510左面 3267右面 
     * 4037上面 1562下面
     */
    createBox(center: Vec4, radius: number) {
        const { x, y, z } = center;
        // 一共就8个点
        const points = [
            // 前面
            // leftTop
            new Vec4(x - radius, y + radius, z + radius, 1),
            // leftBottom
            new Vec4(x - radius, y - radius, z + radius, 1),
            // rightBottom
            new Vec4(x + radius, y - radius, z + radius, 1),
            // rightTop
            new Vec4(x + radius, y + radius, z + radius, 1),

            // 后面
            // leftTop
            new Vec4(x - radius, y + radius, z - radius, 1),
            // leftBottom
            new Vec4(x - radius, y - radius, z - radius, 1),
            // rightBottom
            new Vec4(x + radius, y - radius, z - radius, 1),
            // rightTop
            new Vec4(x + radius, y + radius, z - radius, 1),
        ];

        // TODO 面顶点顺序为什么和面剔除有关 理清楚关系

        // 前
        this.createPlaneWithArray([0, 1, 2, 3].map(idx => points[idx]).concat(new Vec4(0, 0, 1)));
        // 后
        this.createPlaneWithArray([7, 6, 5, 4].map(idx => points[idx]).concat(new Vec4(0, 0, -1)));
        // 左
        this.createPlaneWithArray([4, 5, 1, 0].map(idx => points[idx]).concat(new Vec4(-1, 0, 0)));
        // 右
        this.createPlaneWithArray([3, 2, 6, 7].map(idx => points[idx]).concat(new Vec4(1, 0, 0)));
        // 上
        this.createPlaneWithArray([3, 7, 4, 0].map(idx => points[idx]).concat(new Vec4(0, 1, 0)));
        // 下
        this.createPlaneWithArray([1, 5, 6, 2].map(idx => points[idx]).concat(new Vec4(0, -1, 0)));
    }
}