import { VersionError } from './error';

export class Version {
    private major: number;
    private minor: number;
    private patch: number;

    constructor(major: number, minor: number, patch: number) {
        if (major < 0 || minor < 0 || patch < 0) {
            throw new VersionError('Version numbers must be non negative');
        }

        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    static parse(semver: string): Version {
        const match = semver.match(/^(\d+)\.(\d+)\.(\d+)$/);
        if (!match) {
            throw new VersionError('Invalid version');
        }

        return new Version(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
    }

    toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    isValidVersion(): boolean {
        // TODO: support older versions
        return this.minor === 24;
    }
}
