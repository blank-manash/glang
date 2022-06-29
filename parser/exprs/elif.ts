import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {BlockStatements} from "../statements/blockStatements";
import {Statement} from "../statements/statement";
import {ElseExpr} from "./elseExpr";
import {Expr} from "./expr";
import {Grouped} from "./grouped";

export class Elif implements Expr {
    condition: Expr;
    then: Statement;
    otherwise: Expr | false;
    private elseExprObject = new ElseExpr();
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.ELSE_IF;
    }

    parse(p: Parser): Expr {
        p.readExpectedToken(TOKEN.ELSE_IF);
        const condition = new Grouped().parse(p); // (<expr>)
        const then = new BlockStatements().parse(p); // { <statements> }
        let otherwise: false | Expr = false;

        if (this.isApplicable(p.peekToken().getToken())) {
            otherwise = this.parse(p);
        }

        if (this.elseExprObject.isApplicable(p.peekToken().getToken())) {
            otherwise = this.elseExprObject.parse(p);
        }

        return Elif.create(condition, then, otherwise);
    }
    static create(condition: Expr, then: Statement, otherwise: false | Expr): Expr {
        const exp = new Elif();
        exp.then = then;
        exp.otherwise = otherwise;
        exp.condition = condition;
        return exp;
    }

    toString(): string {
        return `elif ${this.condition.toString()} ${this.then.toString()} ${this.printOtherwise()}`;
    }

    printOtherwise() {
        if (this.otherwise !== false)
            return this.otherwise.toString();
        return '';
    }
}
