import Cotton from "../classes/Cotton"
import Loaders from "../loaders";

export interface YarnGlobals {
    prefix?: string;
    // config?: YarnConfig;
    config?: any;
    env?: string;
    cottons?: Map<string, Cotton>
    aliases?: Map<string, string>
    loader?: Loaders
}

export interface YarnInteractionObject {
    default: Cotton
}

export interface YarnConfig {
    defaultPrefix: {
        production: string;
        development: string;
    }
    embedColors: {
        default: string;
    }
    ownerId: string;
}