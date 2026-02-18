import { Socket } from 'net';
import { ParseError, SocketError, VersionError } from './error';
import EventEmitter from 'events';
import { Version } from '../version';

export class MpdClient extends EventEmitter {
    private address: string;
    private port: number;
    private timeout: number;
    private socket: Socket | null = null;
    private isUnix: boolean = false;

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
                    this.handleRequests();

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

    private handleRequests() {
        if (this.socket == null) {
            throw new SocketError('Cannot send: socket not connected');
        }

        this.socket.on('data', (data) => {
            console.log(`MPD sent: ${data}`);
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

    sendCommand(command: string) {
        if (this.socket == null) {
            throw new SocketError('Cannot send: socket not connected');
        }

        this.socket.write(`${command}\n`);
    }
}
