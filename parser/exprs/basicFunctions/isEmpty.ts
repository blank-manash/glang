import {FuncLiteral} from "../functionLiteral";

export class IsEmptyFn extends FuncLiteral {
    execute(evalArgs: any[]) {
        if (evalArgs.length !== 1) {
            throw new Error(`Runtime Error: Invalid Number of arguments in isEmpty()`);
        }
        const arg = evalArgs.at(0)!;
        if (arg instanceof Map) {
            return arg.size === 0;
        }
        const type = typeof arg;
        if (type === 'string' || Array.isArray(arg)) {
            return arg.length === 0;
        }
        throw new Error(`Runtime Error: Invaid type ${type} argument for isEmpty()`);
    }

    private constructor() {
        super()
    }
    static create() {
        return new IsEmptyFn();
    }
}
