import {TOKEN, Token} from "../lexer/token";
import {Lexer} from "../lexer/lexer";
import {Statement} from "./statements/statement";
import {LetStatement} from "./statements/letStatement";
import {Expr} from "./exprs/expr";
import {getInfixPrec, PRECEDENCE} from "./exprs/precedence";
import {Identifier} from "./exprs/identifier";
import {ExprStatement} from "./statements/exprStatement";
import {Integer} from "./exprs/integer";
import {Prefix} from "./exprs/prefix";
import {Infix} from "./exprs/infix";


export class Parser {
    private _statements: Array<Statement>;
    private statementType: Array<Statement>;
    private exprTypes: Array<Expr>;
    private curToken: Token;
    private nextToken: Token;
    private lexer: Lexer;

    private constructor(_input: string) {
        this._statements = [];
        this.statementType = [
            new LetStatement(),
            new ExprStatement(),
        ];
        this.exprTypes = [
            new Identifier(),
            new Integer(),
            new Prefix()
        ];
        this.lexer = Lexer.create(_input);
        this.curToken = this.lexer.nextToken();
        this.nextToken = this.lexer.nextToken();
    }

    static create(_input: string) {
        return new Parser(_input);
    }

    private advanceTokens() {
        this.curToken = this.nextToken;
        this.nextToken = this.lexer.nextToken();
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

    parse(): Parser {
        while (this.curToken.getToken() !== TOKEN.EOF) {
            const stmt = this.parseStatement();
            this.statements.push(stmt);
        }
        return this;
    }

    parseStatement(): Statement {
        return this.statementType.
            filter(stmt => stmt.isApplicable(this.curToken)).
            map(st => st.parse(this)).
            at(0)!;
    };

    parseExpr(order: PRECEDENCE): Expr {
        let leftExprArray = this.exprTypes.filter(exp => exp.isApplicable(this.curToken.getToken()))
            .map(exp => exp.parse(this));

        if (leftExprArray.length === 0) {
            throw new Error(`Unidentified Token ${this.curToken}`);
        }

        let res = leftExprArray.at(0)!;
        if (this.isInfix(order)) {
            const token = this.curToken;
            const left = res;
            this.advanceTokens();
            const right = this.parseExpr(getInfixPrec(this.peekToken().getToken()));
            return Infix.create(left, token, right);

        }
        return res;
    }
    isInfix(prece: PRECEDENCE) {
        return this.peekToken().getToken() !== TOKEN.SEMICOLON && 
            getInfixPrec(this.peekToken().getToken()) > prece;
    }

    get statements(): Array<Statement> {
        return this._statements;
    }
    set statements(value: Array<Statement>) {
        this._statements = value;
    }
}
