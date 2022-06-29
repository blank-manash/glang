import {TOKEN, Token} from "../../lexer/token";
import {context} from "../context";
import {Expr} from "../exprs/expr";import {Identifier} from "../exprs/identifier";
 import {PRECEDENCE} from "../exprs/precedence";
import {Parser} from "../parser";
import {Statement, STATEMENTS} from "./statement";

export class LetStatement extends Statement {
    private _name: string = "";
    private _value: Expr;

    static create(__name: string, __value: Expr) {
        const stmt = new LetStatement();
        stmt.value = __value;
        stmt.name = __name;
        return stmt;
    }

    public get value(): Expr {
        return this._value!;
    }
    public set value(value: Expr) {
        this._value = value;
    }
    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    isApplicable(token: Token): boolean {
        return token.getToken() === TOKEN.LET;
    }

    eval() {
        const val = this.value.eval();
        context.setVariable(this.name, val);
        return '';
    }

    parse(p: Parser): Statement {
        let token = p.readExpectedToken(TOKEN.LET);
        token = p.readExpectedToken(TOKEN.IDENT);
        const name = token.getLiteral();
        p.readExpectedToken(TOKEN.ASSIGN);
        const value = p.parseExpr(PRECEDENCE.LOWEST);
        this.skipSemicolon(p);
        return LetStatement.create(name, value);
    }
    toString(): string {
       return `let ${this._name} = ${this._value.toString()}; ` 
    }
    type(): STATEMENTS { return STATEMENTS.LET; }
}
