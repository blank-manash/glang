
describe("Integar variable let statements", () => {
    test("Let Statements", () => {
        const inp = `let x = 5;
        let y = 23;
        let billion = 1000000;`
        const parser = Parser.create();
        const actual: Array<Statement> = parser.parse(inp).getStatements();
        const expected = [
            Statement.letStatement("x", 5),
            Statement.letStatement("y", 23),
            Statement.letStatement("billion", 1000000)
        ];
        expect(actual).toStrictEqual(expected);
    });
});
