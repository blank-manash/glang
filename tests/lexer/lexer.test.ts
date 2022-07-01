import {Lexer} from "../../lexer/lexer";
import {Token, TOKEN, TokenFactory} from "../../lexer/token";

describe("Simple Lexer Statements", () => {
    function testInput(inp: string, exp: Token[]) {
        const lex = Lexer.create(inp);
        const actual: Token[] = [];
        while (!lex.isEnd()) {
            actual.push(lex.nextToken());
        }
        expect(actual).toStrictEqual(exp);
    }

    it("1. Parsing ASSIGN statements", () => {
        const input = "let x = 52 + 21;";
        const lex = Lexer.create(input);
        const expected: Token[] = [
            Token.create(TOKEN.LET),
            new Token(TOKEN.IDENT, "x"),
            Token.create(TOKEN.ASSIGN),
            new Token(TOKEN.INT, "52"),
            Token.create(TOKEN.PLUS),
            new Token(TOKEN.INT, "21"),
            Token.create(TOKEN.SEMICOLON)];

        const actual: Token[] = [];
        while (!lex.isEnd()) {
            actual.push(lex.nextToken());
        }
        expect(actual).toStrictEqual(expected);
    });

    it("2. Complex Statement", () => {
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
        const actual: Token[] = [];
        while (!lex.isEnd()) {
            actual.push(lex.nextToken());
        }
        expect(actual).toStrictEqual(expected);
    });
    describe("3. Strings", () => {

        it("a. Parsing Strings", () => {
            const inp = `let x = "Hello World"`;
            const exp = [TokenFactory.LET, TokenFactory.IDENT('x'), TokenFactory.ASSIGN, TokenFactory.STR('Hello World')]
            testInput(inp, exp);
        })

        it("a. Parsing Escape Characters", () => {
            const inp = `"This has a \\"Quoted Term\\""`;
            const exp = [TokenFactory.STR('This has a "Quoted Term"')];
            testInput(inp, exp);
        });

        it("b. Escaping Escape", () => {
            const inp = `"Hello \\\\Excuse"`
            const exp = [TokenFactory.STR('Hello \\Excuse')]
            testInput(inp, exp);
        });
    });

    describe("4. Square Brackets", () => {
        test("a. Simple Expression", () => {

            const inp = `[1, 2, 3];`
            const exp = [
                TokenFactory.LBRACK,
                TokenFactory.INT('1'),
                TokenFactory.COMMA,
                TokenFactory.INT('2'),
                TokenFactory.COMMA,
                TokenFactory.INT('3'),
                TokenFactory.RBRACK,
                TokenFactory.SEMICOLON
            ];
            testInput(inp, exp);
        });
    });
});
