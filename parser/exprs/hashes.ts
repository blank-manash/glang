import {TOKEN} from "../../lexer/token";
import {Parser} from "../parser";
import {Expr} from "./expr";
import {PRECEDENCE} from "./precedence";


export class Hash implements Expr {
    map: Map<Expr, Expr>;
    isApplicable(token: TOKEN): boolean {
        return token === TOKEN.LBRACE;
    }
    parse(p: Parser): Expr {
        const mp = new Map<Expr, Expr>();
        p.readExpectedToken(TOKEN.LBRACE);
        if (p.curTokenIs(TOKEN.RBRACE)) {
            p.readToken();
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

    parseEntry(p: Parser, mp: Map<Expr, Expr>): void {
        const name = p.parseExpr(PRECEDENCE.LOWEST);
        p.readExpectedToken(TOKEN.COLON);
        const val = p.parseExpr(PRECEDENCE.LOWEST);
        if (mp.has(name)) {
            throw Error(`${name} is already declared in the object`);
        }
        mp.set(name, val);
    }

    static create(mp: Map<Expr, Expr>) {
        const h = new Hash();
        h.map = mp;
        return h;
    }

    static empty(): Expr {
        const mp = new Map<Expr, Expr>();
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
        const mp: Map<any, any> = new Map<any, any>();
        for(const [k, v] of this.map.entries()) {
            mp.set(k.eval(), v.eval());
        }
        return mp;
    }

}
