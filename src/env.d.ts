/// <reference types="vite/client" />

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined
declare const MAIN_WINDOW_VITE_NAME: string

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<unknown, unknown, unknown>
    export default component
}
