import {TOKEN, Token} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";

export class Identifier implements Expr {
    private _token: Token;

    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.IDENT;
    }

    parse(p: Parser): Expr {
        const token = p.readToken();
        return Identifier.create(token);
    }

    static create(_token: Token) {
        const iden = new Identifier();
        iden.token = _token;
        return iden;
    }

    set token(__token: Token) {
        this._token = __token;
    }
    get value() {
        return this._token!.getLiteral();
    }

    toString(): string {
        return `${this._token.getLiteral()}`;
    }
}
