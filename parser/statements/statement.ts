import {TOKEN, Token} from "../../lexer/token";
import {Parser} from "../parser";

export abstract class Statement {
    skipSemicolon(p: Parser): void {
        while(p.peekToken().getToken() === TOKEN.SEMICOLON) {
            p.readToken();
        }
    }
    abstract isApplicable(token: Token): boolean;
    abstract parse(p: Parser): Statement;
    abstract toString(): string;
}
