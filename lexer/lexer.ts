/*
 * @file  : lexer.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 20.06.2022
 */

import {TOKEN, Token} from './token';

function isLetter(char: string): boolean {
    if (char.length != 1)
        return false;
    const charCode = char.charCodeAt(0);
    const smallCase: boolean = 'a'.charCodeAt(0) <= charCode && charCode <= 'z'.charCodeAt(0);
    const largeCase: boolean = 'A'.charCodeAt(0) <= charCode && charCode <= 'Z'.charCodeAt(0);
    return smallCase || largeCase || char === '_';
}

function isDigit(char: string) {
    if (char.length != 1)
        return false;
    const charCode = char.charCodeAt(0);
    return '0'.charCodeAt(0) <= charCode && charCode <= '9'.charCodeAt(0);
}

function isNumber(iden: string) {
    for (let i = 0; i < iden.length; ++i) {
        if (!isDigit(iden.charAt(i)))
            return false;
    }
    return true;
}

function isWhitespace(iden: string) {
    return iden === '\n' || iden === '\t' || iden === '\r' || iden === ' ';
}

export class Lexer {
    private pos: number;
    private length: number;
    private input: string;

    constructor(_input: string) {
        this.input = _input;
        this.pos = 0;
        this.length = this.input.length;
    }

    /**
     * This is a factory method to create new lexers.
     * @param _input The input code
     * @returns @type Lexer A new lexer instance.
     */
    static create(_input: string): Lexer {
        return new Lexer(_input);
    }

    private handleEqualCase() {
        const next = this.peekChar();
        if (next !== "=")
            return Token.create(TOKEN.ASSIGN);
        this.readChar();
        return Token.create(TOKEN.EQUAL);
    };

    private handleBangCase() {
        const next = this.peekChar();
        if (next !== "=")
            return Token.create(TOKEN.BANG);
        this.readChar();
        return Token.create(TOKEN.NEQUAL);
    }

    private handleDefaultCase(ch: string) {
        if (isDigit(ch)) {
            const num = ch + this.readIdentifier();
            return isNumber(num) ? new Token(TOKEN.INT, num) : Token.create(TOKEN.ILLEGAL);
        }
        if (isLetter(ch)) {
            const word = ch + this.readIdentifier();
            const keyword = Token.isKeyword(word);
            return keyword ? Token.create(keyword) : new Token(TOKEN.IDENT, word);
        }
        return Token.create(TOKEN.ILLEGAL);
    }

    private parseChar(ch: string) {
        switch (ch) {
            case "=": return this.handleEqualCase();

            case "!": return this.handleBangCase();

            case "(": return Token.create(TOKEN.LPAREN);

            case ")": return Token.create(TOKEN.RPAREN);

            case "}": return Token.create(TOKEN.RBRACE);

            case "{": return Token.create(TOKEN.LBRACE);

            case "=": return Token.create(TOKEN.ASSIGN);

            case "+": return Token.create(TOKEN.PLUS);

            case "!": return Token.create(TOKEN.BANG);

            case ",": return Token.create(TOKEN.COMMA);

            case ";": return Token.create(TOKEN.SEMICOLON);

            case "<": return Token.create(TOKEN.LT);

            case ">": return Token.create(TOKEN.GT);

            default: return this.handleDefaultCase(ch);
        }
    }


    /**
     * Returns the next token, skips whiteSpace.
     * @returns {@type Token}
     */
    nextToken(): Token {
        this.eatWhitespace();
        if (this.pos >= this.length)
            return new Token(TOKEN.EOF, TOKEN.EOF);
        const ch: string = this.readChar();
        return this.parseChar(ch);
    }

    /**
     * Determines if the input is parsed and EOF is reached.
     * @returns @type boolean True if End, False otherwise.
     */
    isEnd() {
        return this.pos >= this.length;
    }

    private readIdentifier() {
        let ret: string = "";
        let ch = this.peekChar();
        while(!this.isEnd() && (isLetter(ch) || isDigit(ch))) {
            ch = this.readChar();
            ret += ch;
            ch = this.peekChar();
        }
        return ret;
    }

    private peekChar(): string {
        if (this.isEnd()) { return TOKEN.EOF;
        }
        return this.input.charAt(this.pos);
    }

    private readChar(): string {
        if (this.isEnd()) {
            return TOKEN.EOF;
        }
        const ch = this.input.charAt(this.pos);
        this.pos += 1;
        return ch;
    }

    private eatWhitespace() {
        while (!this.isEnd() && isWhitespace(this.peekChar()))
            this.readChar();
    }

}

