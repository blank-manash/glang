/**
 * @file  : identifier.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 29.06.2022
 */
import {TOKEN, Token} from "../../lexer/token";
import {context} from "../context";
import {Parser} from "../parser";
import {Expr} from "./expr";

export class Identifier implements Expr {
    name: string;
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.IDENT;
    }

    parse(p: Parser): Expr {
        const token = p.readToken();
        return Identifier.create(token);
    }

    static create(_token: Token,) {
        const iden = new Identifier();
        iden.name = _token.getLiteral();
        return iden;
    }

    eval() {
        return context.getVariable(this.name);
    }

    toString(): string {
        return `${this.name}`;
    }
}
