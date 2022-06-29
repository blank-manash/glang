import repl from 'repl'
import {Lexer} from './lexer/lexer';
import {Token} from './lexer/token';
import {Parser} from './parser/parser';

function startRepl(replOptions: object) {
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
    return Parser.create(uinput).parse().getString();
}

const evalFun = parsing;

function evaluator(uinput: string, context, filename, callback) {
    callback(null, evalFun(uinput));
}
;
const replOptions = {
    prompt: "GL-USER >> ",
    eval: evaluator
}


startRepl(replOptions);

