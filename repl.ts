import repl from 'repl'
import {Lexer} from './lexer/lexer';
import {Token} from './lexer/token';

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

function evaluator(uinput, context, filename, callback) {
    callback(null, lexing(uinput));
}
;
const replOptions = {
    prompt: "GL-USER >> ",
    eval: evaluator
}


startRepl(replOptions);

