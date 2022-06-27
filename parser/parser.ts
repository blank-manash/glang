import {TOKEN, Token} from "../lexer/token";
import {Lexer} from "../lexer/lexer";
import {Statement} from "./statements/statement";
import {LetStatement} from "./statements/letStatement";
import {Expr} from "./exprs/expr";

export class Parser {
    statements: Array<Statement>;
    statementType: Array<Statement>;
    curToken: Token;
    nextToken: Token;
    lexer: Lexer;

    private constructor(_input: string) {
        this.statements = [];
        this.statementType = [
            new LetStatement(),
        ];
        this.lexer = Lexer.create(_input);
        this.curToken = this.lexer.nextToken();
        this.nextToken = this.lexer.nextToken();
    }

    static create(_input: string) {
        return new Parser(_input);
    }

    advanceTokens() {
        this.curToken = this.nextToken;
        this.nextToken = this.lexer.nextToken();
    }

    expectToken(token: TOKEN) {
    }

    peekNextToken() {
        return this.nextToken;
    }
    peekToken() {
        return this.curToken;
    }

    readToken() {
        const token = this.peekToken();
        this.advanceTokens();
        return token;
    }
    readExpectedToken(expectedToken: TOKEN) {
        const token = this.peekToken();
        if (token.getToken() !== expectedToken)
            throw Error(`Incorrect Token Type: Expected: ${token}\nButReceived ${this.nextToken}`);
        this.advanceTokens();
        return token;
    }

    parse() {
        while(this.curToken.getToken() !== TOKEN.EOF) {
            this.parseStatement();
        }
    }

    parseStatement(): Statement {
        return this.statementType.
            filter(stmt => stmt.isApplicable(this.curToken)).
            map(st => st.parse(this)).
            at(0);
    };
    parseExpr(): Expr {};
}
