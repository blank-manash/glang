import {TOKEN, Token} from "../lexer/token";
import {Lexer} from "../lexer/lexer";
import {Statement} from "./statements/statement";

export class Parser {
    statements: Array<Statement>;
    statementType: Array<Statement>;
    curToken: Token;
    nextToken: Token;
    lexer: Lexer;

    private constructor(_input: string) {
        this.statements = [];
        this.statementType = [ ];
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
}
