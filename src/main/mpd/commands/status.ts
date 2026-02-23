import { ParseError } from '../error';
import { MpdParse } from './parse';

export class Status extends MpdParse {
    // The name of the current partition
    partition: string = '';

    // 0-100 (deprecated: -1 if the volume cannot be determined)
    volume: number = 0;

    repeat: number = 0;
    random: number = 0;
    single: Toggle = Toggle.Zero;
    consume: Toggle = Toggle.Zero;

    // 31-bit unsigned integer, the playlist version number
    playlist?: number;

    // integer, the length of the playlist
    playlistlength: number = 0;

    state: SongState = SongState.Stop;

    // playlist song number of the current song stopped on or playing
    song?: number;

    // playlist songid of the current song stopped on or playing
    songid?: number;

    // playlist song number of the next song to be played
    nextsong?: number;

    // playlist songid of the next song to be played
    nextsongid?: number;

    // Total time elapsed within the current song in seconds, but with higher resolution.
    elapsed: number = 0; // Duration in seconds (as number, not Duration object)

    duration: number = 0; // Duration in seconds

    // instantaneous bitrate in kbps
    bitrate?: number;

    // crossfade in seconds (see Cross-Fading)
    xfade?: number;

    // mixramp threshold in dB
    mixrampdb?: string;

    // mixrampdelay in seconds
    mixrampdelay?: string;

    // The format emitted by the decoder plugin during playback, format: samplerate:bits:channels.
    // See Global Audio Format for a detailed explanation.
    audio?: string;

    // job id
    updating_db?: number;

    // if there is an error, returns message here
    error?: string;

    // last loaded stored playlist
    lastloadedplaylist?: string;

    constructor() {
        super();
    }

    next(key: string, value: string): void {
        switch (key) {
            case 'partition':
                this.partition = value;
                break;

            case 'volume':
                this.volume = this.parseUint8(value, 'Volume');
                break;

            case 'repeat':
                this.repeat = this.parseInt(value, 'Repeat');
                break;

            case 'random':
                this.random = this.parseInt(value, 'Random');
                break;

            case 'single':
                this.single = this.parseToggle(value, 'Single');
                break;

            case 'consume':
                this.consume = this.parseToggle(value, 'Consume');
                break;

            case 'playlist':
                this.playlist = this.parseInt(value, 'Playlist');
                break;

            case 'playlistlength':
                this.playlistlength = this.parseInt(value, 'Playlistlength');
                break;

            case 'state':
                this.state = this.parseSongState(value);
                break;

            case 'song':
                this.song = this.parseInt(value, 'Song');
                break;

            case 'songid':
                this.songid = this.parseInt(value, 'Songid');
                break;

            case 'nextsong':
                this.nextsong = this.parseInt(value, 'Nextsong');
                break;

            case 'nextsongid':
                this.nextsongid = this.parseInt(value, 'Nextsongid');
                break;

            case 'elapsed':
                this.elapsed = this.parseFloat(value, 'Elapsed');
                break;

            case 'duration':
                this.duration = this.parseFloat(value, 'Duration');
                break;

            case 'bitrate':
                this.bitrate = this.parseInt(value, 'Bitrate');
                break;

            case 'xfade':
                this.xfade = this.parseInt(value, 'Xfade');
                break;

            case 'mixrampdb':
                this.mixrampdb = value;
                break;

            case 'mixrampdelay':
                this.mixrampdelay = value;
                break;

            case 'audio':
                this.audio = value;
                break;

            case 'updating_db':
                this.updating_db = this.parseInt(value, 'Updating_db');
                break;

            case 'error':
                this.error = value;
                break;

            case 'lastloadedplaylist':
                this.lastloadedplaylist = value;
                break;
        }
    }

    private parseInt(value: string, fieldName: string): number {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
            throw new ParseError(`${fieldName} parsing error, value: ${value}`);
        }
        return parsed;
    }

    private parseUint8(value: string, fieldName: string): number {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed < 0 || parsed > 255) {
            throw new ParseError(`${fieldName} parsing error, value: ${value}`);
        }
        return parsed;
    }

    private parseFloat(value: string, fieldName: string): number {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            throw new ParseError(`${fieldName} parsing error, value: ${value}`);
        }
        return parsed;
    }

    private parseToggle(value: string, fieldName: string): Toggle {
        switch (value) {
            case '0':
                return Toggle.Zero;
            case '1':
                return Toggle.One;
            case 'oneshot':
                return Toggle.OneShot;
            default:
                throw new ParseError(`${fieldName} parsing error, value: ${value}`);
        }
    }

    private parseSongState(value: string): SongState {
        switch (value) {
            case 'play':
                return SongState.Play;
            case 'pause':
                return SongState.Pause;
            case 'stop':
                return SongState.Stop;
            default:
                throw new ParseError(`State parsing error, value: ${value}`);
        }
    }
}

export enum Toggle {
    Zero,
    One,
    OneShot,
}

export enum SongState {
    Play,
    Pause,
    Stop,
}
