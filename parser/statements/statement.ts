import {Token} from "../../lexer/token";
import {Parser} from "../parser";

export interface Statement {
    isApplicable(token: Token): boolean;
    parse(p: Parser): Statement;
}
