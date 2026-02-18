export class MpdError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export class SocketError extends MpdError {
    constructor(message: string) {
        super(message);
        console.error(`Socket error: ${message}`);
    }
}

export class ResponseError extends MpdError {
    constructor(message: string) {
        super(message);
        console.error(`MPD response error: ${message}`);
    }
}

export class ParseError extends MpdError {
    constructor(message: string) {
        super(message);
        console.error(`Parse error: ${message}`);
    }
}

export class ClientError extends MpdError {
    constructor(message: string) {
        super(message);
        console.error(`Client error: ${message}`);
    }
}

export class VersionError extends MpdError {
    constructor(message: string) {
        super(message);
        console.error(`Unsupported MPD version: ${message}`);
    }
}
