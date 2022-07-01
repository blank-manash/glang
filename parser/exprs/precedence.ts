import {TOKEN} from "../../lexer/token";

export const enum PRECEDENCE {
    LOWEST,
    EQUALS,
    LESSGREATER,
    SUM,
    PRODUCT,
    PREFIX,
    CALL,
    INDEX,
}


const infixPreMap: Map<TOKEN, number> = new Map();

infixPreMap.set(TOKEN.EQUAL, PRECEDENCE.EQUALS);
infixPreMap.set(TOKEN.NEQUAL, PRECEDENCE.EQUALS);
infixPreMap.set(TOKEN.GT, PRECEDENCE.LESSGREATER);
infixPreMap.set(TOKEN.LT, PRECEDENCE.LESSGREATER);
infixPreMap.set(TOKEN.PLUS, PRECEDENCE.SUM);
infixPreMap.set(TOKEN.MINUS, PRECEDENCE.SUM);
infixPreMap.set(TOKEN.MUL, PRECEDENCE.PRODUCT);
infixPreMap.set(TOKEN.DIV, PRECEDENCE.PRODUCT);
infixPreMap.set(TOKEN.LPAREN, PRECEDENCE.CALL);
infixPreMap.set(TOKEN.ASSIGN, PRECEDENCE.EQUALS);
infixPreMap.set(TOKEN.LBRACK, PRECEDENCE.INDEX);

export function getInfixPrec(token: TOKEN) {
    if (!infixPreMap.has(token)) {
        return PRECEDENCE.LOWEST;
    }
    return infixPreMap.get(token)!;
}
