import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {Identifier} from "./identifier";
import {PRECEDENCE} from "./precedence";


export class Hash implements Expr {
    map: Map<string, Expr>;
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.LBRACE;
    }
    parse(p: Parser): Expr {
        const mp = new Map<string, Expr>();
        p.readExpectedToken(TOKEN.LBRACE);
        if (p.nextTokenIs(TOKEN.RBRACE)) {
            return Hash.empty();
        }
        this.parseEntry(p, mp);
        while (p.curTokenIs(TOKEN.COMMA)) {
            p.readToken();
            this.parseEntry(p, mp);
        }
        p.readExpectedToken(TOKEN.RBRACE);
        return Hash.create(mp);
    }

    parseEntry(p: Parser, mp: Map<string, Expr>): void {
        const name = new Identifier().parse(p).toString();
        p.readExpectedToken(TOKEN.ASSIGN);
        const val = p.parseExpr(PRECEDENCE.LOWEST);
        if (mp.has(name)) {
            throw Error(`${name} is already declared in the object`);
        }
        mp.set(name, val);
    }

    static create(mp: Map<string, Expr>) {
        const h = new Hash();
        h.map = mp;
        return h;
    }

    static empty(): Expr {
        const mp = new Map<string, Expr>();
        const h = new Hash();
        h.map = mp;
        return h;
    }

    toString(): string {
        let str = '{\n';
        for (const [k, v] of this.map.entries()) {
            const val = () => {
                if (typeof v === 'string') { return `'${v}'` }
                return v;
            }
            str += `\t${k} = ${val()};\n`;
        }
        str += '}';
        return str;
    }

    eval() {
        const mp: Map<string, any> = new Map<string, any>();
        for(const [k, v] of this.map.entries()) {
            mp.set(k, v.eval());
        }
        return mp;
    }

}
