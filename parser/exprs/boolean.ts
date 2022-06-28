import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";

export class BooleanExpr implements Expr {
    private _value: boolean;

    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.TRUE || token === TOKEN.FALSE;
    }
    parse(p: Parser): Expr {
        const token = p.readToken();
        return BooleanExpr.create(token.getToken() === TOKEN.TRUE);
    }
    static create(val: boolean) {
        const bol = new BooleanExpr();
        bol.value = val;
        return bol;
    }

    toString(): string {
        return this.value ? "true" : "false";
    }

    public get value(): boolean { return this._value; }
    public set value(value: boolean) { this._value = value; }
}
