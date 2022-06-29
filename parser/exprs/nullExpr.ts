import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";

export class NullExpr implements Expr {
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.NULL;
    }
    parse(p: Parser): Expr {
        p.readExpectedToken(TOKEN.NULL);
        return NullExpr.create();
    }
    static create(): Expr {
        return new NullExpr();
    }
    toString(): string {
        return `NULL`;
    }
    eval() {
        return null;
    }
}
