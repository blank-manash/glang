/**
 * @file  : context.ts
 * @author: Manash Baul <mximpaid@gmail.com>
 * Date   : 29.06.2022
 */
/*
 * What are the expectations?
 * Every Function call generates a new context.
 * Return from call stack restores the context;
 * New blocks have scoped variables.
 *
 */
class Stack<T> {
    private storage: T[] = [];

    constructor(private capacity: number = Infinity) {}

    push(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Stack has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1]!;
    }

    size(): number {
        return this.storage.length;
    }

    empty(): boolean {
        return this.storage.length === 0;
    }
}

class ExecutionContext {
    stack: Stack<Map<string, any>>;
    pushClean() {
        this.stack.push(new Map<string, any>());
    }
    private getTop() {
        return this.stack.peek()!;
    }
    pushCopy() {
        this.stack.push(new Map<string, any>(this.getTop()));
    }
    setVariable(name: string, val: any) {
        const mp = this.getTop();
        if (mp.has(name)) {
            throw new Error(`Variable ${name} is already declared`);
        }
        mp.set(name, val);
    }
    getVariable(name: string) {
        const mp = this.getTop();
        if (!mp.has(name)) {
            throw new Error(`Variable ${name} is not declared`);
        }
        return mp.get(name)!;
    }
    constructor() {
        this.stack = new Stack<Map<string, any>>();
        this.pushClean()
    }
    clear() {
        while(!this.stack.empty()) {
            this.stack.pop();
        }
        this.pushClean();
    }
    pop() {
        this.stack.pop();
    }
}

export const context = new ExecutionContext();

