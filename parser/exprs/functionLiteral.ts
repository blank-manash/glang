import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {BlockStatements} from "../statements/blockStatements";
import {Statement} from "../statements/statement";
import {Expr} from "./expr";
import {Identifier} from "./identifier";

export class FuncLiteral implements Expr {
    args: Expr[];
    body: Statement;
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.FUNCTION;
    }
    parse(p: Parser): Expr {
        p.readExpectedToken(TOKEN.FUNCTION);
        const args = this.parseArgs(p);
        const body = new BlockStatements().parse(p);
        return FuncLiteral.create(args, body);
    }

    parseArgs(p: Parser) {
        p.readExpectedToken(TOKEN.LPAREN);
        const args: Expr[] = [];
        if (p.curTokenIs(TOKEN.RPAREN)) {
            p.readToken();
            return args;
        }

        while (p.nextTokenIs(TOKEN.COMMA)) {
            const iden = new Identifier().parse(p);
            args.push(iden);
            p.readToken();
        }
        args.push(new Identifier().parse(p));
        p.readExpectedToken(TOKEN.RPAREN, "Incorrect Function Expression, Missing ) for (");
        return args;
    }

    static create(args: Expr[], body: Statement): Expr {
        const ex = new FuncLiteral();
        ex.args = args;
        ex.body = body;
        return ex;
    }
    toString(): string {
        return `func(${this.args.join(", ")}) ${this.body.toString()}`;
    }
}
