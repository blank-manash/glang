import {FuncLiteral} from "../functionLiteral";

export class Puts extends FuncLiteral {
    execute(evalArgs: any[]) {
        for(const v of evalArgs) {
            console.log(v);
        }
        return null;
    }
    private constructor() {
        super();
    }
    static create() {
        return new Puts();
    }
}
