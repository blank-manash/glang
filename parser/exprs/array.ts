import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {arrayElemParser, Expr} from "./expr";

export class ArrayExpr implements Expr {
    size: number;
    elems: Expr[];
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.LBRACK;
    }
    parse(p: Parser): Expr {
        const elements = arrayElemParser(p);
        return ArrayExpr.create(elements);
    }
    static create(elements: Expr[]): Expr {
        const ar = new ArrayExpr();
        ar.elems = elements;
        ar.size = elements.length;
        return ar;
    }
    toString(): string {
        return '[' + this.elems.join(', ') + ']';
    }
    eval() {
        return this.elems.map(e => e.eval());
    }
}
