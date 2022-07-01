import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Identifier} from "./identifier";
import {PRECEDENCE} from "./precedence";

export interface Expr {
    isApplicable(token: TOKEN): boolean;
    parse(p: Parser, left?: Expr): Expr;
    toString(): string;
    eval(): any;
}

function argParsers(start: TOKEN, parsingFn : Function, end: TOKEN) {
    return function(p: Parser) {
        p.readExpectedToken(start);
        const args: Expr[] = [];
        if (p.curTokenIs(end)) {
            p.readToken();
            return args;
        }

        args.push(parsingFn(p));
        while (p.curTokenIs(TOKEN.COMMA)) {
            p.readToken();
            const iden = parsingFn(p)
            args.push(iden);
        }
        p.readExpectedToken(end, `Incorrect Function Expression, Missing ${end} for ${start}`);
        return args;
    }
}

function funcParsingFunction (p: Parser) {
    return new Identifier().parse(p);
}
function arrayElemParsingFunction (p: Parser) {
    return p.parseExpr(PRECEDENCE.LOWEST);
}
export const functionArgsParser = argParsers(TOKEN.LPAREN, funcParsingFunction , TOKEN.RPAREN);
export const arrayElemParser = argParsers(TOKEN.LBRACK, arrayElemParsingFunction, TOKEN.RBRACK);

