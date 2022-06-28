import {TokenFactory} from "../../lexer/token";
import {Identifier} from "../../parser/exprs/identifier";
import {Infix} from "../../parser/exprs/infix";
import {Integer} from "../../parser/exprs/integer";
import {Prefix} from "../../parser/exprs/prefix";
import {Parser} from "../../parser/parser";
import {ExprStatement} from "../../parser/statements/exprStatement";
import {LetStatement} from "../../parser/statements/letStatement";
import {Statement} from "../../parser/statements/statement";

describe("Integar variable let statements", () => {
    test("1.Simple Let", () => {
        const inp = `let x = 5;
        let y = 23;
        let billion = 1000000;`
        const parser = Parser.create(inp);
        parser.parse();
        const actual: Array<Statement> = parser.statements;
        const expected = [
            LetStatement.create("x", Integer.create(5)),
            LetStatement.create("y", Integer.create(23)),
            LetStatement.create("billion", Integer.create(1000000))
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("2. Semicolon Test", () => {
        const inp = `let z = 5;;; let q = 21`;
        const parser = Parser.create(inp);
        parser.parse();
        const actual: Array<Statement> = parser.statements;
        const expected = [
            LetStatement.create("z", Integer.create(5)),
            LetStatement.create("q", Integer.create(21))
        ]
        expect(actual).toStrictEqual(expected);
    });
});

describe("Expression Statements", () => {
    test("1.Identifiers", () => {
        const inp = `xxy; zzz`
        const actual = Parser.create(inp).parse().statements;
        const expected = [
            ExprStatement.create(Identifier.create(TokenFactory.IDENT('xxy'))),
            ExprStatement.create(Identifier.create(TokenFactory.IDENT('zzz')))];
        expect(actual).toStrictEqual(expected);
    });

    test("2. Prefix Expresssions", () => {
        const inp = `!5; -10`
        const actual = Parser.create(inp).parse().statements;
        const expected = [
            ExprStatement.create(Prefix.create(TokenFactory.BANG, Integer.create(5))),
            ExprStatement.create(Prefix.create(TokenFactory.MINUS, Integer.create(10)))];
        expect(actual).toStrictEqual(expected);
    });

    describe("3. Infix Expressions", () => {
        test("a. Addition and Multiplication", () => {
            const inp = `5+10; 5-2`
            const actual = Parser.create(inp).parse().statements;
            const expected = [
                ExprStatement.create(Infix.create(Integer.create(5), TokenFactory.PLUS, Integer.create(10))),
                ExprStatement.create(Infix.create(Integer.create(5), TokenFactory.MINUS, Integer.create(2))),
            ];
            expect(actual).toStrictEqual(expected);
        });
        test("b. Nested Expressions", () => {
            const inp = `5 + 10 * 3`
            const actual = Parser.create(inp).parse().statements;
            const expected = [
                ExprStatement.create(Infix.create
                                     (Integer.create(5), TokenFactory.PLUS, Infix.create
                                      (Integer.create(10), TokenFactory.MUL, Integer.create(3)))),
            ];
            expect(actual).toStrictEqual(expected);
        });
    });
});
