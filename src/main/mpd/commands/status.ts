export class Status {
    // The name of the current partition
    partition: string;

    // 0-100 (deprecated: -1 if the volume cannot be determined)
    volume: number;

    repeat: number;
    random: number;
    single: Toggle;
    consume: Toggle;

    // 31-bit unsigned integer, the playlist version number
    playlist?: number;

    // integer, the length of the playlist
    playlistlength: number;

    state: SongState;

    // playlist song number of the current song stopped on or playing
    song?: number;

    // playlist songid of the current song stopped on or playing
    songid?: number;

    // playlist song number of the next song to be played
    nextsong?: number;

    // playlist songid of the next song to be played
    nextsongid?: number;

    // Total time elapsed within the current song in seconds, but with higher resolution.
    elapsed: number; // Duration in seconds (as number, not Duration object)

    duration: number; // Duration in seconds

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

    constructor(data: Partial<Status>) {
        this.partition = data.partition ?? '';
        this.volume = data.volume ?? 0;
        this.repeat = data.repeat ?? 0;
        this.random = data.random ?? 0;
        this.single = data.single ?? Toggle.Zero;
        this.consume = data.consume ?? Toggle.Zero;
        this.playlist = data.playlist;
        this.playlistlength = data.playlistlength ?? 0;
        this.state = data.state ?? SongState.Stop;
        this.song = data.song;
        this.songid = data.songid;
        this.nextsong = data.nextsong;
        this.nextsongid = data.nextsongid;
        this.elapsed = data.elapsed ?? 0;
        this.duration = data.duration ?? 0;
        this.bitrate = data.bitrate;
        this.xfade = data.xfade;
        this.mixrampdb = data.mixrampdb;
        this.mixrampdelay = data.mixrampdelay;
        this.audio = data.audio;
        this.updating_db = data.updating_db;
        this.error = data.error;
        this.lastloadedplaylist = data.lastloadedplaylist;
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
