/**
 * @file  : infix.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 29.06.2022
 */
import {TOKEN, Token} from "../../lexer/token";
import {Parser} from "../parser";
import {CallExpr} from "./callExpr";
import {Expr} from "./expr";
import {getInfixPrec} from "./precedence";

export class Infix implements Expr {
    callExpr: Expr | undefined;
    isApplicable(token: TOKEN): boolean {
        const acceptedTokens = [
            TOKEN.PLUS,
            TOKEN.MINUS,
            TOKEN.DIV,
            TOKEN.MUL,
            TOKEN.EQUAL,
            TOKEN.NEQUAL,
            TOKEN.LT,
            TOKEN.GT,
            TOKEN.LPAREN
        ];
        return acceptedTokens.includes(token);
    }

    parse(p: Parser, left: Expr): Expr {
        const token = p.peekToken();
        if (p.curTokenIs(TOKEN.LPAREN)) {
            p.readToken();
            return this.parseCallExpr(p, left);
        }
        const curPrec = getInfixPrec(token.getToken());
        p.readToken();
        const right = p.parseExpr(curPrec);
        return Infix.create(left, token, right);
    }

    parseCallExpr(p: Parser, func: Expr): Expr {
        this.callExpr = new CallExpr().parse(p, func);
        return this.callExpr;
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
    eval() {
        const leftEval = this.left.eval();
        const rightEval = this.right.eval();
        switch (this.token.getToken()) {
            case TOKEN.PLUS: return leftEval + rightEval;
            case TOKEN.MINUS: return leftEval - rightEval;
            case TOKEN.DIV: return leftEval / rightEval;
            case TOKEN.MUL: return leftEval * rightEval;
            case TOKEN.EQUAL: return leftEval === rightEval;
            case TOKEN.NEQUAL:return leftEval !== rightEval;
            case TOKEN.LT: return leftEval < rightEval;
            case TOKEN.GT:return leftEval > rightEval;
        }
    }
    public get left(): Expr { return this._left; }
    public set left(value: Expr) { this._left = value; }
    public get token(): Token { return this._token; }
    public set token(value: Token) { this._token = value; }
    public get right(): Expr { return this._right; }
    public set right(value: Expr) { this._right = value; }
}
