import { Status } from './status';

export interface MpdCommands {
    sendStatus(): Promise<Status>;
}
