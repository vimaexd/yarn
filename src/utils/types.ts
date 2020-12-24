import Command from "../classes/Command";

export interface YarnGlobals {
    prefix?: string;
    config?: YarnConfig;
    env?: string;
    commands?: Map<string, Command>
    aliases?: Map<string, string>
}

export interface YarnCommandObject {
    default: Command
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