/**
 * @file  : functionLiteral.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 29.06.2022
 */
import {TOKEN} from "../../lexer/token";
import {context} from "../context";
import {Parser} from "../parser";
import {BlockStatements} from "../statements/blockStatements";
import {ReturnExpression} from "../statements/returnStatement";
import {Statement} from "../statements/statement";
import {Expr} from "./expr";
import {Identifier} from "./identifier";

export class FuncLiteral implements Expr {
    execute(evalArgs: any[]) {
        if (evalArgs.length !== this.args.length) {
            throw new Error("Incorrect number of functions arguments");
        }
        context.pushClean();
        for(let i = 0; i < evalArgs.length; ++i) {
            const name = this.args.at(i)!.toString();
            const val = evalArgs.at(i)!;
            context.setVariable(name, val);
        }
        let ret = this.body.eval();
        if (ret instanceof ReturnExpression) {
            ret = ret.value;
        }
        context.pop();
        return ret;
    }
    args: Expr[];
    body: Statement; // BlockStatements
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

    eval() {
        return this;
    }

    toString(): string {
        return `func(${this.args.join(", ")}) ${this.body.toString()}`;
    }
}
