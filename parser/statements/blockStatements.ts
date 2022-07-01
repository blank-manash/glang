import {TOKEN, Token} from "../../lexer/token";
import {context} from "../context";
import {evalStatements, parseBlockStatements, Parser} from "../parser";
import {Statement, STATEMENTS} from "./statement";

export class BlockStatements extends Statement {
    private _statements: Statement[];
    isApplicable(token: Token): boolean {
        return token.getToken() === TOKEN.LBRACE;
    }
    parse(p: Parser): Statement {
        const stmts  = parseBlockStatements(p);
        return BlockStatements.create(stmts);
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
