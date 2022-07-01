import {FuncLiteral} from "../functionLiteral";

export class HeadFn extends FuncLiteral {
    execute(args: any[]) {
        if (args.length !== 1) {
            throw new SyntaxError("head() needs exactly one argument which is an array");
        }
        const arg = args.at(0)!;
        if (Array.isArray(arg)) {
            return arg.length === 0 ? null : arg.at(0);
        }
        throw new Error("head(): Argument is not an array");
    }

    private constructor() {
        super();
    };
    static create() {
        return new HeadFn();
    }
}
