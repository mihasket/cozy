import { ParseError } from '../error';

export abstract class MpdParse {
    abstract next(key: string, value: string): void;

    parse(lines: string[]): void {
        for (const line of lines) {
            const lowercase = line.toLowerCase();
            const [key, value] = this.parseLine(lowercase);

            this.next(key, value);
        }
    }

    private parseLine(line: string): [string, string] {
        const colonIndex = line.indexOf(':');

        if (colonIndex === -1) {
            throw new ParseError(`Line parsing error: ${line}`);
        }

        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();

        return [key, value];
    }
}
