/**
 * @file  : infix.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 29.06.2022
 */
import {TOKEN, Token} from "../../lexer/token";
import {Parser} from "../parser";
import {AssignExpr} from "./AssignExpr";
import {CallExpr} from "./callExpr";
import {Expr} from "./expr";
import {IndexExpr} from "./indexExpr";
import {getInfixPrec} from "./precedence";

const enum EvalTypes {
    NULL_LEFT,
    NULL_RIGHT,
    INTEGER,
    STRING,
    MISMATCH
}


/**
 * Implements the infix operator for statements, and their evaluation.
 * @author Manash Baul <mximpaid@gmail.com>
 */
export class Infix implements Expr {
    left: Expr;
    right: Expr;
    token: Token;
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
            TOKEN.ASSIGN,
            TOKEN.LPAREN,
            TOKEN.LBRACK
        ];
        return acceptedTokens.includes(token);
    }

    parse(p: Parser, left: Expr): Expr {
        const token = p.peekToken();
        switch(token.getToken()) {
            case TOKEN.LPAREN: return this.parseCallExpr(p, left)
            case TOKEN.LBRACK: return new IndexExpr().parse(p, left);
            case TOKEN.ASSIGN: return new AssignExpr().parse(p, left);
            default: return this.defaultParser(token, p, left);
        }
    }


    private defaultParser(token: Token, p: Parser, left: Expr) {
        const curPrec = getInfixPrec(token.getToken());
        p.readToken();
        const right = p.parseExpr(curPrec);
        return Infix.create(left, token, right);
    }

    parseCallExpr(p: Parser, func: Expr): Expr {
        this.callExpr = new CallExpr().parse(p, func);
        return this.callExpr;
    }


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
    eval() { // TODO: Refactor This, this is ugly.
        return this.defaultEval();
    }

    private defaultEval() {
        const leftEval = this.left.eval();
        const rightEval = this.right.eval();

        switch (this.getEvalType(leftEval, rightEval)) {
            case EvalTypes.INTEGER: return this.integerEval(leftEval, rightEval);
            case EvalTypes.STRING: return this.stringEval(leftEval, rightEval);
            case EvalTypes.NULL_LEFT: throw new Error(`Runtime Error: Cannot Evaluate Expression, ${this.left.toString()} is null`);
            case EvalTypes.NULL_RIGHT: throw new Error(`Runtime Error: Cannot Evaluate Expression, ${this.right.toString()} is null`);
            default: throw new Error(`Evaluation Error: Types of ${this.left.toString()} and ${this.right.toString()} are not compatible`);
        }
    }

    stringEval(leftEval: any, rightEval: any) {
        switch (this.token.getToken()) {
            case TOKEN.PLUS: return leftEval + rightEval;
            case TOKEN.EQUAL: return leftEval === rightEval;
            case TOKEN.NEQUAL: return leftEval !== rightEval;
            case TOKEN.LT: return leftEval < rightEval;
            case TOKEN.GT: return leftEval > rightEval;
            default: throw new Error(`Unidentified operation: ${this.token.getLiteral()} with String Literals`);
        }
    }

    private getEvalType(left: unknown, right: unknown) {
        const l = typeof left;
        const r = typeof right;
        if (l === "number" && r === "number") {
            return EvalTypes.INTEGER;
        }
        if (l === "string" && r === "string") {
            return EvalTypes.STRING;
        }
        if (left == null)
            return EvalTypes.NULL_LEFT;
        if (right == null)
            return EvalTypes.NULL_RIGHT;

        return EvalTypes.MISMATCH;
    }

    private integerEval(leftEval: number, rightEval: number) {
        switch (this.token.getToken()) {
            case TOKEN.PLUS: return leftEval + rightEval;
            case TOKEN.MINUS: return leftEval - rightEval;
            case TOKEN.DIV: return leftEval / rightEval;
            case TOKEN.MUL: return leftEval * rightEval;
            case TOKEN.EQUAL: return leftEval === rightEval;
            case TOKEN.NEQUAL: return leftEval !== rightEval;
            case TOKEN.LT: return leftEval < rightEval;
            case TOKEN.GT: return leftEval > rightEval;
            default: throw new Error(`Unidentified operation: ${this.token.getLiteral()} with Integers`);
        }
    }

}
