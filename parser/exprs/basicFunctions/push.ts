import {FuncLiteral} from "../functionLiteral";

export class PushFn extends FuncLiteral {
    execute(evalArgs: any[]) {
        if (evalArgs.length < 2) {
            return;
        }
        const val = evalArgs.pop();
        const ret = evalArgs.map(ar => this.execArg(ar, val));
        return ret.length === 1 ? ret.at(0) : ret;
    }
    execArg(arg: any, val: any) {
        const type: string = typeof arg;
        if (type == "string") {
            arg += val.toString() || JSON.stringify(val)
            return arg;
        } else if (Array.isArray(arg)) {
            arg.push(val);
            return arg;
        }
        throw new Error(`Unknown Argument Type ${arg} for push()`);
    }

    private constructor() {
        super();
    }
    static create() {
        return new PushFn();
    }
}
