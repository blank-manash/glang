import {Token, TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {PRECEDENCE} from "./precedence";

export class Prefix implements Expr {
    private _token: Token;
    private _expr: Expr;

    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.BANG || token === TOKEN.MINUS;
    }

    parse(p: Parser): Expr {
        const token = p.readToken();
        const expr = p.parseExpr(PRECEDENCE.PREFIX);
        return Prefix.create(token, expr);
    }

    static create(token: Token, expr: Expr) {
        const prefixExpr = new Prefix();
        prefixExpr.expr = expr;
        prefixExpr.token = token;
        return prefixExpr;
    }

    toString(): string {
        return `(${this._token.getLiteral()}${this._expr})`;
    }

    set token(token: Token) { this._token = token; };
    get token() { return this._token };
    get expr() { return this._expr };
    set expr(expr: Expr) { this._expr = expr; };
}
