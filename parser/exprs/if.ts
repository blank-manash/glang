import {TOKEN} from "../../lexer/token";
import {parseBracedStatements, Parser} from "../parser";
import {BlockStatements} from "../statements/blockStatements";
import {Statement} from "../statements/statement";
import {Elif} from "./elif";
import {ElseExpr} from "./elseExpr";
import {Expr} from "./expr";
import {Grouped} from "./grouped";

export class IfExpr implements Expr {
    private _condition: Expr;
    private _then: Statement;
    private _elseExpr: Expr | false = false;

    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.IF;
    }
    parse(p: Parser): Expr {
        p.readExpectedToken(TOKEN.IF); // if
        const condition = new Grouped().parse(p); // ( <expr> )
        const then = BlockStatements.create(parseBracedStatements(p));
        let elseExpr: Expr | false = false;

        if (p.peekToken().getToken() === TOKEN.ELSE) {
            elseExpr = new ElseExpr().parse(p);
        }

        if (p.peekToken().getToken() === TOKEN.ELSE_IF) {
            elseExpr = new Elif().parse(p);
        }

        return IfExpr.create(condition, then, elseExpr);
    }
    static create(condition: Expr, then: Statement, elseExpr: false | Expr): Expr {
        const ex = new IfExpr();
        ex.condition = condition;
        ex.elseExpr = elseExpr;
        ex.then = then;
        return ex;
    }

    eval() {
        const con = this.condition.eval();
        if (con) {
            return this.then.eval();
        }
        if (this.elseExpr !== false) {
            return this.elseExpr.eval();
        }
    }

    toString(): string {
        return `if ${this.condition.toString()} ${this.then.toString()} ${this.printOtherwise()}`
    }

    printOtherwise() {
        if (this.elseExpr !== false)
            return this.elseExpr.toString();
        return '';
    }
    public get condition(): Expr { return this._condition; }
    public set condition(value: Expr) { this._condition = value; }
    public get then(): Statement { return this._then; }
    public set then(value: Statement) { this._then = value; }
    public get elseExpr(): Expr | false { return this._elseExpr; }
    public set elseExpr(value: Expr | false) { this._elseExpr = value; }
}
