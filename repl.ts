import repl from 'repl'
import {Lexer} from './lexer/lexer';
import {Token} from './lexer/token';
import {Parser} from './parser/parser';

function startReplWith(replOptions: object) {
    console.log("Welcome to Glang! This is for Gamakshi!");
    console.log("Start writing your commands below, press <C-d> or type .exit to exit");
    repl.start(replOptions);
}

function lexing(uinput: string): Array<Token> {
    const lex: Lexer = Lexer.create(uinput);
    const arr: Token[] = [];
    while(!lex.isEnd()) {
        arr.push(lex.nextToken());
    }
    return arr;
}

function parsing(uinput: string): string {
    try {
        return Parser.create(uinput).parse().getString();
    } catch (err: any) {
        return "Heya! You might have some syntax errors".concat(' ==> ', err.message);
    }
}

function executor(uinput: string) {
    try {
        return Parser.create(uinput).parse().eval();
    } catch (err: any) {
        return err.message;
    }
}

const evalFun = executor;

function evaluator(uinput: string, context, filename, callback) {
    callback(null, evalFun(uinput));
}
;
const replOptions = {
    prompt: "GL-USER >> ",
    eval: evaluator
}
startReplWith(replOptions);
// export const startRepl = () => startReplWith(replOptions);
