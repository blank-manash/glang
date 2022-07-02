import {readFile} from "fs";
import {Parser} from "./parser/parser";
import {startRepl} from "./repl";

const args = process.argv;

function sourceFile() {
    const path = args.at(2)!;
    readFile(path, (err, data) => {
        if (err) {
            console.error(`${err.message}: For file ${path}`);
        }
        try {
            Parser.create(data.toString()).parse().eval();
        } catch (err: any) {
            console.error(err.message);
        }
    });
}
function start() {
    if (args.length > 2) {
        sourceFile();
        return;
    }
    startRepl();
}

start();
