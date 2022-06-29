import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";

export interface Expr {
    isApplicable(token: TOKEN): boolean;
    parse(p: Parser): Expr;
    toString(): string;
}
