import {TOKEN, Token} from "../../lexer/token";
import {Parser} from "../parser";
import {Statement} from "./statement";

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
    public get statements(): Statement[] { return this._statements; }
    public set statements(value: Statement[]) { this._statements = value; }
}
