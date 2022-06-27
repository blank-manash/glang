import {TOKEN, Token} from '../../lexer/token';
import {Expr} from '../exprs/expr'
import {Parser} from '../parser';
import {Statement} from './statement';

export class ExprStatement implements Statement {
    private _expr: Expr;
    isApplicable(token: Token): boolean {
        const tokenType: TOKEN = token.getToken();
        return tokenType !== TOKEN.RETURN && tokenType !== TOKEN.LET;
    }
    parse(p: Parser): Statement {
        const exprStmt = new ExprStatement();
        exprStmt.expr = p.parseExpr();
        return exprStmt;
    }
    get expr() {
        return this._expr;
    }
    set expr(value) {
        this._expr = value;
    }
}
