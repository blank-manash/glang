import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {BlockStatements} from "../statements/blockStatements";
import {Statement} from "../statements/statement";
import {Expr} from "./expr";
import {Grouped} from "./grouped";

export class ElseExpr implements Expr {
    then: Statement;
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.ELSE;
    }

    parse(p: Parser): Expr {
            p.readExpectedToken(TOKEN.ELSE);
            const then = new BlockStatements().parse(p); // { <statements> }
            return ElseExpr.create(then);
    }
    static create(then: Statement): Expr {
        const ex = new ElseExpr();
        ex.then = then;
        return ex;
    }

    toString(): string {
        return `else ${this.then.toString()}`;
    }
}
