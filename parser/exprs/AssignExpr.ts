import {TOKEN} from "../../lexer/token";
import {context} from "../context";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {Identifier} from "./identifier";
import {PRECEDENCE} from "./precedence";

export class AssignExpr implements Expr {
    left: Expr;
    right: Expr;
    isApplicable(token: TOKEN): boolean {
        return false;
    }
    parse(p: Parser, left: Expr): Expr {
        p.readExpectedToken(TOKEN.ASSIGN);
        const right = p.parseExpr(PRECEDENCE.EQUALS);
        return AssignExpr.create(left, right);
    }
    static create(left: Expr, right: Expr): Expr {
        const ex = new AssignExpr();
        ex.left = left;
        ex.right = right;
        return ex;
    }

    toString(): string {
        return '(' + this.left.toString() + " = " + this.right.toString() + ')';
    }
    eval() {
        if (!(this.left instanceof Identifier)) {
            throw new Error(`${this.left.toString()} is not a variable that can be assigned`);
        }
        const name = this.left.name;
        const val = this.right.eval();
        context.setForce(name, val);
    }
}
