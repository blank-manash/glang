import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";

export class Integer implements Expr {
    private _value: number;
    public get value() {
        return this._value!;
    }
    public set value(value) {
        this._value = value;
    }
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.INT;
    }
    parse(p: Parser): Expr {
        const token = p.readToken();
        const num = parseInt(token.getLiteral());
        return Integer.create(num);
    }

    static create(val: number): Integer {
        const num = new Integer();
        num.value = val;
        return num;
    }
    toString(): string {
        return `${this._value}`;
    }

}
