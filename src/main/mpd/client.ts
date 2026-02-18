import { Socket } from 'net';

export class MpdClient {
    private address: string;
    private port: number;
    private timeout: number;
    private socket: Socket | null = null;
    private isUnix: boolean = false;

    constructor(address: string | null, port: number | null, timeout: number | null) {
        this.address =
            (address || process.env.MPD_HOST) ??
            (process.env.XDG_RUNTIME_DIR
                ? ((this.isUnix = true), `${process.env.XDG_RUNTIME_DIR}/mpd/socket`)
                : 'localhost');

        this.port = port || (process.env.MPD_PORT ? Number(process.env.MPD_PORT) : 6600);

        this.timeout =
            timeout || (process.env.MPD_TIMEOUT ? Number(process.env.MPD_TIMEOUT) : 3000);
    }

    connect() {
        this.socket = new Socket();
        this.socket.setEncoding('utf8');

        if (this.isUnix) {
            this.socket.connect(this.address);
        } else {
            this.socket.connect(this.port, this.address);
        }

        this.socket.on('data', (data) => {
            console.log(`Received from server: ${data.toString()}`);
        });

        this.socket.on('close', () => {
            console.log('Connection closed');
        });

        this.socket.on('error', (err) => {
            console.error(`Error: ${err.message}`);
        });
    }

    sendCommand(command: string) {
        if (this.socket == null) {
            console.error('Cannot send: socket not connected');
            return;
        }

        this.socket.write(`${command}\n`);
    }
}
