import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {BlockStatements} from "../statements/blockStatements";
import {Statement} from "../statements/statement";
import {ElseExpr} from "./elseExpr";
import {Expr} from "./expr";
import {Grouped} from "./grouped";

export class IfElseExpr implements Expr {
    private _condition: Expr;
    private _then: Statement;
    private _elseExpr: Expr | false = false;

    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.IF;
    }
    parse(p: Parser): Expr {
        p.readExpectedToken(TOKEN.IF); // if
        const condition = new Grouped().parse(p); // ( <expr> )
        const then = new BlockStatements().parse(p); // { <statement>* }
        let elseExpr: Expr | false = false;
        const token = p.peekToken().getToken();
        if (token === TOKEN.ELSE || token === TOKEN.ELSE_IF) { // else 
            elseExpr = new ElseExpr().parse(p);
        }
        return IfElseExpr.create(condition, then, elseExpr);
    }
    static create(condition: Expr, then: Statement, elseExpr: false | Expr): Expr {
        const ex = new IfElseExpr();
        ex.condition = condition;
        ex.elseExpr = elseExpr;
        ex.then = then;
        return ex;
    }
    toString(): string {
        return `if ${this.condition.toString()} ${this.then.toString()} ${this.elseExpr.toString()}`
    }

    public get condition(): Expr { return this._condition; }
    public set condition(value: Expr) { this._condition = value; }
    public get then(): Statement { return this._then; }
    public set then(value: Statement) { this._then = value; }
    public get elseExpr(): Expr | false { return this._elseExpr; }
    public set elseExpr(value: Expr | false) { this._elseExpr = value; }
}
