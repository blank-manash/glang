/**
 * @file  : functionLiteral.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 29.06.2022
 */
import {TOKEN} from "../../lexer/token";
import {context} from "../context";
import {parseBracedStatements, Parser} from "../parser";
import {BlockStatements} from "../statements/blockStatements";
import {ReturnExpression} from "../statements/returnStatement";
import {Statement} from "../statements/statement";
import {Expr, functionArgsParser} from "./expr";

export class FuncLiteral implements Expr {
    args: Expr[];
    body: Statement; // BlockStatements
    env: Map<string, any> = new Map<string, any>(); 
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.FUNCTION;
    }
    parse(p: Parser): Expr {
        p.readExpectedToken(TOKEN.FUNCTION);
        const args = this.parseArgs(p);
        const body = BlockStatements.create(parseBracedStatements(p));
        return FuncLiteral.create(args, body);
    }

    parseArgs(p: Parser) {
        return functionArgsParser(p);
    }

    execute(evalArgs: any[]) {
        if (evalArgs.length !== this.args.length) {
            throw new Error("Runtime Error: Incorrect number of functions arguments: " + this.toString());
        }
        context.pushContext(this.env);
        for (let i = 0; i < evalArgs.length; ++i) {
            const name = this.args.at(i)!.toString();
            const val = evalArgs.at(i)!;
            context.setForce(name, val);
        }
        let ret = this.body.eval();
        if (ret instanceof ReturnExpression) {
            ret = ret.value;
        }
        context.pop();
        return ret;
    }

    static create(args: Expr[], body: Statement): Expr {
        const ex = new FuncLiteral();
        ex.args = args;
        ex.body = body;
        return ex;
    }

    eval() {
        this.env = new Map<string, any>(context.getTop());
        return this;
    }

    toString(): string {
        return `func(${this.args.join(", ")}) ${this.body.toString()}`;
    }
}
