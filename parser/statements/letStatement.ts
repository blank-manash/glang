import {TOKEN, Token} from "../../lexer/token";
import {Parser} from "../parser";
import {Statement} from "./statement";

export class LetStatement implements Statement {
    private _name: string;
    private _value: Expr;

    static create(__name: string, __value: Expr) {
        const stmt = new LetStatement();
        stmt.value = __value;
        stmt.name = __name;
        return stmt;
    }

    public get value(): Expr {
        return this._value;
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
    parse(p: Parser): Statement {
        let token = p.readExpectedToken(TOKEN.LET);
        token = p.readExpectedToken(TOKEN.IDENT);
        const name = token.getLiteral();
        p.readExpectedToken(TOKEN.ASSIGN);
        const value = Expr.parse(p);
        return LetStatement.create(name, value);
    }
}


