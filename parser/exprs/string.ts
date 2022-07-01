import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";

export class StringExpr implements Expr {
    value: string;
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.STR;
    }
    parse(p: Parser): Expr {
        const value = p.readToken().getLiteral();
        return StringExpr.create(value);
    }
    static create(value: string): Expr {
        const ex = new StringExpr();
        ex.value = value;
        return ex;
    }
    toString(): string {
        return this.value;
    }
    eval() {
        return this.toString();
    }
}
