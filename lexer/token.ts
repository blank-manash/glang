export enum TOKEN {
    ILLEGAL = "ILLEGAL",
    EOF = "EOF",
    IDENT = "IDENT",
    INT = "INT",
    GT = ">",
    LT = "<",
    LPAREN = "(",
    RPAREN = ")",
    RBRACE = "}",
    LBRACE = "{",
    ASSIGN = "=",
    PLUS = "+",
    EQUAL = "==",
    NEQUAL = "!=",
    BANG = "!",
    COMMA = ",",
    SEMICOLON = ";",
    FUNCTION = "func",
    LET = "let",
    TRUE = "true",
    FALSE = "false",
    IF = "if",
    ELSE = "else",
    RETURN = "return"
}

const keywords: Map<string, TOKEN> = new Map<string, TOKEN>();

keywords.set("return", TOKEN.RETURN);
keywords.set("else", TOKEN.ELSE);
keywords.set("if", TOKEN.IF);
keywords.set("false", TOKEN.FALSE);
keywords.set("true", TOKEN.TRUE);
keywords.set("let", TOKEN.LET);
keywords.set("func", TOKEN.FUNCTION);

export class Token {
    private _token: TOKEN;
    private _literal: string;
    static isKeyword(word: string): TOKEN | false {
        if (keywords.has(word))
            return keywords.get(word)!;
        return false;
    }


    /**
     * Creates a token, whose TokenType and Literal string is token
     * @param {TOKEN} token The token type and literal string
     * @return {Token} The token object
     */
    static create(token: TOKEN): Token {
        return new Token(token, token);
    }

    /**
     * Get an array of tokens that are created.
     * @param {Array<TOKEN>} tokens The tokens to create with
     * @return {Array<Token} The array of Token objects
     */
    static list(...tokens: Array<TOKEN>): Array<Token> {
        const ar = [];
        for (const token of tokens) {
            ar.push(Token.create(token));
        }
        return ar;
    }

    constructor(token: TOKEN, literal: string) {
        this._token = token;
        this._literal = literal;
    }

    getToken() {return this._token;}
    getLiteral() {return this._literal;};
}


export const TokenFactory = {
    ILLEGAL: Token.create(TOKEN.ILLEGAL),
    EOF: Token.create(TOKEN.EOF),
    LT: Token.create(TOKEN.LT),
    GT: Token.create(TOKEN.GT),
    LPAREN: Token.create(TOKEN.LPAREN),
    RPAREN: Token.create(TOKEN.RPAREN),
    RBRACE: Token.create(TOKEN.RBRACE),
    LBRACE: Token.create(TOKEN.LBRACE),
    ASSIGN: Token.create(TOKEN.ASSIGN),
    PLUS: Token.create(TOKEN.PLUS),
    EQUAL: Token.create(TOKEN.EQUAL),
    NEQUAL: Token.create(TOKEN.NEQUAL),
    BANG: Token.create(TOKEN.BANG),
    COMMA: Token.create(TOKEN.COMMA),
    SEMICOLON: Token.create(TOKEN.SEMICOLON),
    FUNCTION: Token.create(TOKEN.FUNCTION),
    LET: Token.create(TOKEN.LET),
    TRUE: Token.create(TOKEN.TRUE),
    FALSE: Token.create(TOKEN.FALSE),
    IF: Token.create(TOKEN.IF),
    ELSE: Token.create(TOKEN.ELSE),
    RETURN: Token.create(TOKEN.RETURN),

    IDENT: (literal: string) => new Token(TOKEN.IDENT, literal),
    INT: (num: string) => new Token(TOKEN.INT, num)
}

