import {Token} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {PRECEDENCE} from "./precedence";

export class Infix implements Expr {

    isApplicable(): boolean {
        return false;
    }

    parse(p: Parser): Expr {
        return p.parseExpr(PRECEDENCE.LOWEST);
    }

    private _left: Expr;
    private _right: Expr;
    private _token: Token;

    toString(): string {
        return `(${this.left.toString()} ${this.token.getLiteral()} ${this.right.toString()})`
    }

    static create(left: Expr, token: Token, right: Expr): Expr {
        const infix = new Infix();
        infix.left = left;
        infix.right = right;
        infix.token = token;
        return infix;
    }
    public get left(): Expr { return this._left; }
    public set left(value: Expr) { this._left = value; }
    public get token(): Token { return this._token; }
    public set token(value: Token) { this._token = value; }
    public get right(): Expr { return this._right; }
    public set right(value: Expr) { this._right = value; }
}
