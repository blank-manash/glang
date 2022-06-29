import {TOKEN, Token} from "../../lexer/token";
import {Expr} from "../exprs/expr";
import {PRECEDENCE} from "../exprs/precedence";
import {Parser} from "../parser";
import {Statement} from "./statement";

export class ReturnStatement extends Statement {
    returnExpr: Expr;
    isApplicable(token: Token): boolean {
        return token.getToken() === TOKEN.RETURN;
    }
    parse(p: Parser): Statement {
        p.readExpectedToken(TOKEN.RETURN);
        const expr = p.parseExpr(PRECEDENCE.LOWEST);
        return ReturnStatement.create(expr);
    }
    static create(expr: Expr): Statement {
        const ex = new ReturnStatement();
        ex.returnExpr = expr;
        return ex;
    }

    toString(): string {
        return `return ${this.returnExpr.toString()}`
    }
}
