import {FuncLiteral} from "../functionLiteral";

export class Length extends FuncLiteral {
    execute(evalArgs: any[]) {
        const ret = evalArgs.map(this.execArg);
        return ret.length === 1 ? ret.at(0) : ret;
    }
    execArg(arg: any) {
        const type: string = typeof arg;
        if (type == "string" || Array.isArray(arg)) {
            return arg.length;
        }
        throw new Error(`Unknown Argument Type ${arg} for len()`);
    }

    private constructor() {
        super();
    }
    static create() {
        return new Length();
    }
}
