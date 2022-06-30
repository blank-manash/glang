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
        it ("d. Partial Type Functions", () => {
            const inp = `
            let add = func(x) { func(n) { x + n }; };
            let addTwo = add(2);
            addTwo(3)
            `
            const exp = 5;
            testInput(inp, exp);
        })
    });
});

