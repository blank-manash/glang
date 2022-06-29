import {TOKEN, Token} from "../../lexer/token";
import {context} from "../context";
import {evalStatements, Parser} from "../parser";
import {Statement, STATEMENTS} from "./statement";

export class BlockStatements extends Statement {
    private _statements: Statement[];
    isApplicable(token: Token): boolean {
        return token.getToken() === TOKEN.LBRACE;
    }
    parse(p: Parser): Statement {
        p.readExpectedToken(TOKEN.LBRACE);
        const statements: Statement[] = [];
        while(p.peekToken().getToken() !== TOKEN.RBRACE) {
            if (p.peekToken().getToken() === TOKEN.EOF) {
                throw new Error(`Syntax Error: Unterminated { Brace`);
            }
            const stmt = p.parseStatement();
            statements.push(stmt);
        }
        p.readExpectedToken(TOKEN.RBRACE);
        return BlockStatements.create(statements);
    }

    static create(statements: Statement[]) {
        const stmts = new BlockStatements();
        stmts.statements = statements;
        return stmts;
    }

    toString(): string {
        let str = '';
        this.statements.forEach(s => str += s);
        return `{${str}}`;
    }
    eval() {
        context.pushCopy();
        const ret = evalStatements(this.statements);
        context.pop();
        return ret;
    }
    public get statements(): Statement[] { return this._statements; }
    public set statements(value: Statement[]) { this._statements = value; }
    type(): STATEMENTS { return STATEMENTS.BLOCK; }
}
