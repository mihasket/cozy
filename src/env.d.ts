/// <reference types="vite/client" />

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<unknown, unknown, unknown>;
    export default component;
}

declare namespace NodeJS {
    interface ProcessEnv {
        MPD_HOST: string | undefined;
        MPD_PORT: string | undefined;
        MPD_TIMEOUT: string | undefined;
        XDG_RUNTIME_DIR: string | undefined;
    }
}
