import {TOKEN, Token} from '../../lexer/token';
import {Expr} from '../exprs/expr'
import {Identifier} from '../exprs/identifier';
import {PRECEDENCE} from '../exprs/precedence';
import {Parser} from '../parser';
import {Statement} from './statement';

export class ExprStatement extends Statement {
    private _expr: Expr;
    isApplicable(token: Token): boolean {
        const tokenType: TOKEN = token.getToken();
        return tokenType !== TOKEN.RETURN && tokenType !== TOKEN.LET;
    }
    parse(p: Parser): Statement {
        const exprStmt = new ExprStatement();
        exprStmt.expr = p.parseExpr(PRECEDENCE.LOWEST);
        this.skipSemicolon(p);
        return exprStmt;
    }
    static create(expr: Expr) {
        const exprStmt = new ExprStatement();
        exprStmt.expr = expr;
        return exprStmt;
    }

    toString(): string {
        return `${this._expr.toString()}`
    }

    get expr() {
        return this._expr;
    }
    set expr(value) {
        this._expr = value;
    }
}
