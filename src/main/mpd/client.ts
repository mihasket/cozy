import { Socket } from 'net';
import { ParseError, ResponseError, SocketError, VersionError } from './error';
import EventEmitter from 'events';
import { Version } from './version';
import { MpdCommands } from './commands/client-commands';
import { MpdParse } from './commands/parse';
import { Status } from './commands/status';

interface PendingCommand {
    command: string;
    resolve: (response: string) => void;
    reject: (error: Error) => void;
}

export class MpdClient extends EventEmitter implements MpdCommands {
    private address: string;
    private port: number;
    private timeout: number;
    private responseBuffer: string = '';
    private socket: Socket | null = null;
    private isUnix: boolean = false;
    private commandQueue: PendingCommand[] = [];

    constructor(address: string | null, port: number | null, timeout: number | null) {
        super();
        this.address =
            (address || process.env.MPD_HOST) ??
            (process.env.XDG_RUNTIME_DIR
                ? ((this.isUnix = true), `${process.env.XDG_RUNTIME_DIR}/mpd/socket`)
                : 'localhost');

        this.port = port || (process.env.MPD_PORT ? Number(process.env.MPD_PORT) : 6600);

        this.timeout =
            timeout || (process.env.MPD_TIMEOUT ? Number(process.env.MPD_TIMEOUT) : 3000);
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new Socket();
            this.socket.setEncoding('utf8');

            if (this.isUnix) {
                this.socket.connect(this.address);
            } else {
                this.socket.connect(this.port, this.address);
            }

            this.socket.once('data', (data) => {
                try {
                    // You should always check for the MPD version first
                    // before handling other requests
                    this.handleVersion(data.toString());

                    // Setup a handler for other requests
                    this.socket!.on('data', (data) => {
                        this.handleResponse(data.toString());
                    });

                    resolve();
                } catch (error) {
                    this.socket!.destroy();
                    reject(error);
                }
            });

            this.socket.on('close', () => {
                console.log('Connection closed');
            });

            this.socket.on('error', (err) => {
                if (err instanceof VersionError) {
                    console.error('Version incompatibility:', err.message);
                } else {
                    console.error(`Error: ${err.message}`);
                }
            });
        });
    }

    private handleVersion(data: string) {
        console.log(`Parsing the version: ${data}`);

        const parts = data.trim().split(/\s+/);
        const versionStr = parts[parts.length - 1];

        if (!versionStr) {
            throw new ParseError('Cannot parse version in connection');
        }

        const version = Version.parse(versionStr);

        if (!version.isValidVersion()) {
            throw new VersionError(`Incompatible version: ${version}`);
        }
    }

    private handleResponse(data: string) {
        this.responseBuffer += data;

        // Check if we have a complete response (ends with OK or ACK)
        const lines = this.responseBuffer.split('\n');
        const completionIndex = lines.findIndex(
            (line) => line.startsWith('OK') || line.startsWith('ACK')
        );

        // Response not complete yet, wait for more data
        if (completionIndex === -1) {
            return;
        }

        const responseLines = lines.slice(0, completionIndex);
        const response = responseLines.join('\n');
        const statusLine = lines[completionIndex];

        this.responseBuffer = lines.slice(completionIndex + 1).join('\n');

        const pending = this.commandQueue.shift();

        if (!pending) {
            console.warn('Received response with no pending command:', response);
            return;
        }

        if (statusLine.startsWith('ACK')) {
            const errorMatch = statusLine.match(/ACK \[(\d+)@(\d+)\] \{(.*?)\} (.*)/);
            const errorMessage = errorMatch ? errorMatch[4] : statusLine;
            pending.reject(new ResponseError(errorMessage));
        } else {
            pending.resolve(response);
        }
    }

    private async sendCommand(command: string): Promise<string> {
        if (this.socket == null) {
            throw new SocketError('Cannot send: socket not connected');
        }

        return new Promise<string>((resolve, reject) => {
            this.commandQueue.push({ command, resolve, reject });

            this.socket!.write(`${command}\n`);
        });
    }

    private async sendAndParse<T extends MpdParse>(
        command: string,
        Constructor: new () => T
    ): Promise<T> {
        const response = await this.sendCommand(command);
        const result = new Constructor();
        result.parse(response.split('\n'));
        return result;
    }

    async sendStatus(): Promise<Status> {
        const response: Status = await this.sendAndParse('status', Status);
        return response;
    }
}
