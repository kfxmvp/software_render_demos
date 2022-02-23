export class Face {
    public v: Array<number>;
    public t: Array<number>;
    public n: Array<number>;

    public key: string;

    constructor(key?: string) {
        this.v = [];
        this.t = [];
        this.n = [];
        this.key = !!key ? key : '';
    }
}