/**
 * @file  : elseExpr.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 29.06.2022
 */
import {TOKEN} from "../../lexer/token";
import {parseBracedStatements, Parser} from "../parser";
import {BlockStatements} from "../statements/blockStatements";
import {Statement} from "../statements/statement";
import {Expr} from "./expr";

export class ElseExpr implements Expr {
    then: Statement;
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.ELSE;
    }

    parse(p: Parser): Expr {
        p.readExpectedToken(TOKEN.ELSE);
        const then = BlockStatements.create(parseBracedStatements(p)); // { <statements> }
        return ElseExpr.create(then);
    }
    static create(then: Statement): Expr {
        const ex = new ElseExpr();
        ex.then = then;
        return ex;
    }

    eval() {
        return this.then.eval();
    }

    toString(): string {
        return `else ${this.then.toString()}`;
    }
}
