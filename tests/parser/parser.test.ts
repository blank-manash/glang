import {TokenFactory} from "../../lexer/token";
import {BooleanExpr} from "../../parser/exprs/boolean";
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
        let billion = 1000000;
        let gazi = false`
        const parser = Parser.create(inp);
        parser.parse();
        const actual: Array<Statement> = parser.statements;
        const expected = [
            LetStatement.create("x", Integer.create(5)),
            LetStatement.create("y", Integer.create(23)),
            LetStatement.create("billion", Integer.create(1000000)),
            LetStatement.create("gazi", BooleanExpr.create(false))
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

    describe("4. Infix Expressions", () => {
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
        test("c. Nested Funcition Calls", () => {
            const inp = `add(5, 6 * 10)`
            const actual = Parser.create(inp).parse().getString();
            const expected = `add(5, (6 * 10))`;
            expect(actual).toStrictEqual(expected);
        })
        describe("c. Complex Nested Expressions", () => {
            const inpA = `5 + 7 - 21 / 4`
            const inpB = `510 > 97 != 77 < 64`
            const inpC = `a + b * c - d / f * e`
            const inpD = `3 + 4; -5 * 4`
            const inpE = `3 + 4 * 5 == 3 * 1 + 4 * 5`
            test(`* Input A: ${inpA}`, () => {
                const actual = Parser.create(inpA).parse().getString();
                const expected = "((5 + 7) - (21 / 4))";
                expect(actual).toStrictEqual(expected);
            });

            test(`* Input B: ${inpB}`, () => {
                const actual = Parser.create(inpB).parse().getString();
                const expected = "((510 > 97) != (77 < 64))";
                expect(actual).toStrictEqual(expected);
            });

            test(`* Input C: ${inpC}`, () => {
                const actual = Parser.create(inpC).parse().getString();
                const expected = "((a + (b * c)) - ((d / f) * e))"
                expect(actual).toStrictEqual(expected);
            });

            test(`* Input D: ${inpD}`, () => {
                const actual = Parser.create(inpD).parse().getString();
                const expected = "(3 + 4)((-5) * 4)"
                expect(actual).toStrictEqual(expected);
            });

            test(`* Input E: ${inpE}`, () => {
                const actual = Parser.create(inpE).parse().getString();
                const expected = "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"
                expect(actual).toStrictEqual(expected);
            });
        });

        test("d. Grouped Expressions", () => {
            const inp = `5 + 9 - d / (f * 3)`;
            const actual = Parser.create(inp).parse().getString();
            const expected = `((5 + 9) - (d / ((f * 3))))`;
            expect(actual).toStrictEqual(expected);
        })
    });

    test("3. Boolean Expression", () => {
        const inp = `5 < 4 == false`;
        const actual = Parser.create(inp).parse().getString();
        const expected = `((5 < 4) == false)`;
        expect(actual).toStrictEqual(expected);
    });

    describe("5. If Else Expressions", () => {
        test("a. if (true) {x} else if (false) {z} else {z};", () => {
            const inp = `if (true) {x} elif (false) {z} else {z};`;
            const actual = Parser.create(inp).parse().getString();
            const expected = `if (true) {x} elif (false) {z} else {z}`
            expect(actual).toStrictEqual(expected);
        });
        test("b. if (5 < 10 == 91) { let z = 5; let b = c; } elif (21 - 56 == 20) { let excuse = false } else { let nothing = 1;}", () => {
            const inp = `if (5 < 10 == 91) { let z = 5; let b = c; } elif (21 - 56 == 20) { let excuse = false } else { let nothing = 1;}`
            const actual = Parser.create(inp).parse().getString();
            const expected = `if (((5 < 10) == 91)) {let z = 5; let b = c; } elif (((21 - 56) == 20)) {let excuse = false; } else {let nothing = 1; }`
            expect(actual).toStrictEqual(expected);
        });
    });

    describe("6. Function Literal", () => {
        test("a. func(a, b) { a + b };", () => {
            const inp = `func(a, b) { a + b }`
            const acutal = Parser.create(inp).parse().getString();
            const expected = `func(a, b) {(a + b)}`;
            expect(acutal).toStrictEqual(expected);
        });
        test("b. func() { 5 }", () => {
            const inp = `func() { 5 }`;
            const acutal = Parser.create(inp).parse().getString();
            const expected = `func() {5}`;
            expect(acutal).toStrictEqual(expected);
        });
    });

    describe("7. Call Expressions", () => {
        it("a. add(2, 3 * 3, -5 + 6)", () => {
            const inp = `add(2, 3 * 3, -5 + 6)`;
            const actual = Parser.create(inp).parse().getString();
            const expected = `add(2, (3 * 3), ((-5) + 6))`;
            expect(actual).toStrictEqual(expected);
        });

        it("b. sub(5, 45, func(x, y) { add() }", () => {
            const inp = `sub(5, 45, func(x, y) { return add() })`
            const actual = Parser.create(inp).parse().getString();
            const expected = `sub(5, 45, func(x, y) {return add()})`
            expect(actual).toStrictEqual(expected);
        });
    });

});
