import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {PRECEDENCE} from "./precedence";

export class Grouped implements Expr {
    private _expr: Expr;
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.LPAREN;
    }
    parse(p: Parser): Expr {
        p.readToken();
        const expr = p.parseExpr(PRECEDENCE.LOWEST);
        if (p.readToken().getToken() !== TOKEN.RPAREN) {
            throw new Error("Unmatched ( Parenthesis");
        }
        return Grouped.create(expr);
    }

    static create(expression: Expr) {
        const ex = new Grouped();
        ex.expr = expression;
        return ex;
    }
    toString(): string {
        return `(${this.expr.toString()})`
    }

    public get expr(): Expr { return this._expr; }
    public set expr(value: Expr) { this._expr = value; }
}
