/**
 * @file  : callExpr.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 29.06.2022
 */

import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {FuncLiteral} from "./functionLiteral";
import {Identifier} from "./identifier";
import {PRECEDENCE} from "./precedence";

export class CallExpr implements Expr {
    func: Expr; // Identifier or FunctionLiteral
    callArgs: Expr[];
    isApplicable(): boolean {
        return false;
    }

    parse(p: Parser, func: Expr): Expr {
        p.readExpectedToken(TOKEN.LPAREN);
        const args = this.parseCallArgs(p);
        return CallExpr.create(func, args);
    }

    static create(func: Expr, args: Expr[]): Expr {
        const exp = new CallExpr();
        exp.func = func;
        exp.callArgs = args;
        return exp;
    }

    parseCallArgs(p: Parser) {
        const args: Expr[] = [];
        if (p.curTokenIs(TOKEN.RPAREN)) {
            p.readToken();
            return args;
        }
        let arg = p.parseExpr(PRECEDENCE.LOWEST);
        args.push(arg);
        while (p.curTokenIs(TOKEN.COMMA)) {
            p.readExpectedToken(TOKEN.COMMA);
            arg = p.parseExpr(PRECEDENCE.LOWEST);
            args.push(arg);
        }
        p.readExpectedToken(TOKEN.RPAREN, "Syntax Error: Reading Function Call, Cannot find ending )");
        return args;
    }

    eval() {
        let fn: any = this.func;

        if (this.func instanceof Identifier) {
            fn = fn.eval();
        }

        if (!(fn instanceof FuncLiteral)) {
            throw new Error(`Runtime Error: Called Expression ${this.func.toString()} is not a function`);
        }

        const evalArgs = this.callArgs.map(ca => ca.eval());
        return (fn as FuncLiteral).execute(evalArgs);
    }

    toString(): string {
        return `${this.func.toString()}(${this.callArgs.join(", ")})`
    }
}
