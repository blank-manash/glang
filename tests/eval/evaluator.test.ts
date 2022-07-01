import {context} from "../../parser/context";
import {Parser} from "../../parser/parser";


const testInput = (inp: string, expected: any) => {
    const actual = Parser.create(inp).parse().eval();
    expect(actual).toStrictEqual(expected);
};

describe("Evaluation Queries", () => {
    beforeEach(() => {
        context.clear();
    });
    describe("1. If Conditions", () => {
        it("a. Simple If", () => {
            const inp = `if (true) { 5 } else { 10 }`;
            const exp = 5;
            testInput(inp, exp);
        });
        it("b. Nested Return", () => {
            const inp = `if (true) { if (10 > 1) { return 5 } } return 50`;
            const exp = 5;
            testInput(inp, exp);
        });
    });

    describe("2. Variable Binding", () => {
        it("a. Create a variable", () => {
            const inp = `let x = 5; return x`
            const exp = 5;
            testInput(inp, exp);
        });

        it("b. Not create duplicate variable", () => {
            const inp = `let x = 5; let x = 23`
            expect(() => Parser.create(inp).parse().eval()).toThrowError();
        });

        it("c. Have Scoped Expressions", () => {
            const inp = `
            let x = 5;
            if (x == 5) {
                let y = 2
            }
            return y;`
            expect(() => Parser.create(inp).parse().eval()).toThrowError();
        });
    });

    describe("3. Function Calls", () => {

        it("a. Use Functions", () => {
            const inp = `let add = func(a, b) { return a + b }; add(5, 6 * 10)`;
            const exp = 65;
            testInput(inp, exp);
        });
        it("b. In a complicated Way", () => {
            const inp = `let cross = func(a) {
                let b = func(a) {
                    return 25 + a;
                }
                let ba = func(c) {
                    return c + 10
                }
                b(a) + ba(a);
            }
            cross(func(a, b) { a + b }(2, 3))`
            const exp = 45;
            testInput(inp, exp);
        });
        it("c. Passing around", () => {
            const inp = `
                let recTwice = func(fn, arg) { fn(fn(arg)) };
                let fn = func(x) { x + 2 };
                recTwice(fn, 10);
                `
            const exp = 14;
            testInput(inp, exp);
        });
        it("d. Partial Type Functions", () => {
            const inp = `
            let add = func(x) { func(n) { x + n }; };
            let addTwo = add(2);
            addTwo(3)
            `
            const exp = 5;
            testInput(inp, exp);
        })

        it("e. Apply Function", () => {
            const inp = `
            let add = func(a, b) { a + b };
            let sub = func(a, b) { a - b };
            let apply = func(a, b, fn) { return fn(a, b) };
            return apply(2, 5, add);`
            testInput(inp, 7);
        });
    });
    describe("4. String Operations", () => {
        it("a. Concatenation", () => {
            const inp = `"Extreme" + " " + "Emotions"`;
            const exp = "Extreme Emotions"
            testInput(inp, exp);
        });
        it("b. Comparisions", () => {
            let inp = `"abc" < "ac"`;
            testInput(inp, true);
            inp = `"aaaa" > "aa"`
            testInput(inp, true);
            inp = `"aaa" == "aaa"`
            testInput(inp, true);
            inp = `"aaac" > "b"`;
            testInput(inp, false);
        });
    });

    describe("5. Builtin Functions", () => {
        it("a. len()", () => {
            const inp: string[] = [
                `len("Blah Bluh")`,
                `len("Bonjur")`,
                `len("Cute")`
            ];
            const exp: number[] = [9, 6, 4];
            for (let i = 0; i < 3; ++i) {
                testInput(inp[i], exp[i]);
            }
        });
        it("b. Can't declare Builtin", () => {
            let inp = `let len = 24`;
            expect(() => Parser.create(inp).parse().eval()).toThrowError();
            inp = `let x = func(len, a) { return len(5) + a }; return x(24, 2);`;
            expect(() => Parser.create(inp).parse().eval()).toThrowError();
        });

        it("c. push()", () => {
            const inp = `let str = "Hello";
            let btr = "World";
            str = push(str, " ");
            str = push(str, btr);
            return str;
            `
            const exp = 'Hello World';
            testInput(inp, exp);
        });

        it("d. tail()", () => {
            let inp = `let x = [1, "bee", 8]; return tail(x)`
            let exp = ["bee", 8];
            testInput(inp, exp);
        });

        it("e. head()", () => {
            let inp = `let y = ['boo', 42, 'every', 12]; return head(tail(y))`;
            const exp = 42;
            testInput(inp, exp);
        });
    });

    describe('6. Arrays', () => {
        test("a. Random access", () => {
            const inp = `[1, 2, 4][2]`;
            const exp = 4;
            testInput(inp, exp);
        });
    });
});

