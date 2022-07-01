import {FuncLiteral} from "../functionLiteral";

export class TailFn extends FuncLiteral {
    execute(args: any[]): any[] {
        if (args.length !== 1) {
            throw new SyntaxError("tail() needs an array argument");
        }
        const arg = args.at(0)!;
        if (Array.isArray(arg)) {
            return arg.length <= 1 ? [] : arg.slice(1);
        }
        throw new Error("head(): Argument is not an array");
    }

    private constructor() {
        super();
    };
    static create() {
        return new TailFn();
    }
}
