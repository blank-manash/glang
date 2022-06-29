import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {PRECEDENCE} from "./precedence";

export class CallExpr implements Expr {
    func: Expr; // Identifier or FunctionLiteral
    callArgs: Expr[];

    isApplicable(): boolean {
        return false;
    }

    parse(p: Parser, func: Expr): Expr {
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
        p.readExpectedToken(TOKEN.RPAREN, "Error Reading Function Call, Cannot find ending )");
        return args;
    }

    toString(): string {
        return `${this.func.toString()}(${this.callArgs.join(", ")})`
    }
}
