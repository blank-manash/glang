import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {PRECEDENCE} from "./precedence";

export class IndexExpr implements Expr {
    left: Expr;
    right: Expr;
    isApplicable(token: TOKEN): boolean {
        return false;
    }
    parse(p: Parser, left: Expr): Expr {
        p.readExpectedToken(TOKEN.LBRACK);
        const right = p.parseExpr(PRECEDENCE.LOWEST);
        p.readExpectedToken(TOKEN.RBRACK);
        return IndexExpr.create(left, right);
    }

    static create(left: Expr, right: Expr): Expr {
        const ex = new IndexExpr();
        ex.left = left;
        ex.right = right;
        return ex;
    }

    toString(): string {
        return '(' + this.left.toString() + '[' + this.right.toString() + '])';
    }
    eval() {
        const left = this.left.eval();
        const right = this.right.eval();
        if (Array.isArray(left)) {
            return this.evalArrayIndex(right, left);
        }
        if (left instanceof Map) {
            return this.evalHashIndex(left, right);
        }
        throw new Error(this.left.toString() + ' is not an element to be indexed');
    }

    evalHashIndex(left: Map<any, any>, right: any) {
        if (!left.has(right)) {
            return null;
        }
        return left.get(right)!;
    }

    private evalArrayIndex(right: any, left: any[]) {
        if (!Number.isInteger(right)) {
            throw new Error(`${this.right.toString()} doesn't evaluate to an integer for an index`);
        }
        const n = left.length;
        if (right >= n) {
            throw new Error(`${n} is out of bounds for array ${this.left.toString()}`);
        }
        return left[(right + n) % n];
    }
}
