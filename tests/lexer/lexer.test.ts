import {Lexer} from "../../lexer/lexer";
import {Token, TOKEN, TokenFactory} from "../../lexer/token";

describe("Simple Lexer Statements", () => {
    it("Parsing ASSIGN statements", () => {
        const input = "let x = 52 + 21;";
        const lex = Lexer.create(input);
        const expected = [
            Token.create(TOKEN.LET),
            new Token(TOKEN.IDENT, "x"),
            Token.create(TOKEN.ASSIGN),
            new Token(TOKEN.INT, "52"),
            Token.create(TOKEN.PLUS),
            new Token(TOKEN.INT, "21"),
            Token.create(TOKEN.SEMICOLON)];

        const actual = [];
        while (!lex.isEnd()) {
            actual.push(lex.nextToken());
        }
        expect(actual).toStrictEqual(expected);
    });

    it("Complex Statement", () => {
        const input = `let x = 51;
if (x < 5) {
    return false;
} else {
    return true;
}
let c = func(a, b) {
    let z = 22;
    return z;
};`
        const expected = 
        [TokenFactory.LET,
        TokenFactory.IDENT("x"),
        TokenFactory.ASSIGN,
        TokenFactory.INT("51"),
        TokenFactory.SEMICOLON,
        TokenFactory.IF,
        TokenFactory.LPAREN,
        TokenFactory.IDENT("x"),
        TokenFactory.LT,
        TokenFactory.INT("5"),
        TokenFactory.RPAREN,
        TokenFactory.LBRACE,
        TokenFactory.RETURN,
        TokenFactory.FALSE,
        TokenFactory.SEMICOLON,
        TokenFactory.RBRACE,
        TokenFactory.ELSE,
        TokenFactory.LBRACE,
        TokenFactory.RETURN,
        TokenFactory.TRUE,
        TokenFactory.SEMICOLON,
        TokenFactory.RBRACE,
        TokenFactory.LET,
        TokenFactory.IDENT("c"),
        TokenFactory.ASSIGN,
        TokenFactory.FUNCTION,
        TokenFactory.LPAREN,
        TokenFactory.IDENT("a"),
        TokenFactory.COMMA,
        TokenFactory.IDENT("b"),
        TokenFactory.RPAREN,
        TokenFactory.LBRACE,
        TokenFactory.LET,
        TokenFactory.IDENT("z"),
        TokenFactory.ASSIGN,
        TokenFactory.INT("22"),
        TokenFactory.SEMICOLON,
        TokenFactory.RETURN,
        TokenFactory.IDENT("z"),
        TokenFactory.SEMICOLON,
        TokenFactory.RBRACE,
        TokenFactory.SEMICOLON,
        ];

        const lex = Lexer.create(input);
        const actual = [];
        while (!lex.isEnd()) {
            actual.push(lex.nextToken());
        }
        expect(actual).toStrictEqual(expected);
    });
});
