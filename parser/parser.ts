import {Lexer} from "../lexer/lexer";
import {TOKEN, Token} from "../lexer/token";
import {ArrayExpr} from "./exprs/array";
import {BooleanExpr} from "./exprs/boolean";
import {Expr} from "./exprs/expr";
import {FuncLiteral} from "./exprs/functionLiteral";
import {Grouped} from "./exprs/grouped";
import {Identifier} from "./exprs/identifier";
import {IfExpr} from "./exprs/if";
import {Infix} from "./exprs/infix";
import {Integer} from "./exprs/integer";
import {NullExpr} from "./exprs/nullExpr";
import {getInfixPrec, PRECEDENCE} from "./exprs/precedence";
import {Prefix} from "./exprs/prefix";
import {StringExpr} from "./exprs/string";
import {BlockStatements} from "./statements/blockStatements";
import {ExprStatement} from "./statements/exprStatement";
import {LetStatement} from "./statements/letStatement";
import {ReturnExpression, ReturnStatement} from "./statements/returnStatement";
import {Statement} from "./statements/statement";

export function evalStatements(statements: Statement[]) {
    let last: any = null;
    for(let i = 0; i < statements.length; ++i) {
        last = statements.at(i)!.eval();
        if (last instanceof ReturnExpression)
            return last;
    }
    return last;
};

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
            new BlockStatements(),
            new ReturnStatement()
        ];
        this.exprTypes = [
            new Identifier(),
            new Integer(),
            new StringExpr(),
            new Prefix(),
            new BooleanExpr(),
            new Grouped(),
            new IfExpr(),
            new FuncLiteral(),
            new NullExpr(),
            new ArrayExpr(),
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
    readExpectedToken(expectedToken: TOKEN, msg?: string) {
        const token = this.peekToken();
        if (token.getToken() !== expectedToken) {
            if (msg) {
                throw new Error(msg);
            } else {
                throw Error(`Incorrect Token Type: Expected: ${token}\nButReceived ${this.nextToken}`);
            }
        }
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
            throw new Error(`Expected Expression: Unidentified Token ${this.curToken}`);
        }

        let res = leftExprArray.at(0)!;
        while (this.isInfix(order)) {
            res = new Infix().parse(this, res);
        }
        return res;
    }
    isInfix(prece: PRECEDENCE) {
        const token: TOKEN = this.peekToken().getToken();
        const infixObject = new Infix();
        return infixObject.isApplicable(token) && getInfixPrec(token) > prece;
    }

    getString(): string {
        let astString = '';
        for (let i = 0; i < this.statements.length; ++i) {
            astString += this.statements.at(i)!.toString();
        }
        return astString;
    }

    nextTokenIs(token: TOKEN) {
        return this.nextToken.getToken() === token;
    }

    curTokenIs(token: TOKEN) {
        return this.curToken.getToken() === token;
    }

    eval() {
        const val = evalStatements(this.statements);
        if (val instanceof ReturnExpression)
            return val.value;
        return val;
    }

    get statements(): Array<Statement> {
        return this._statements;
    }
    set statements(value: Array<Statement>) {
        this._statements = value;
    }
}
