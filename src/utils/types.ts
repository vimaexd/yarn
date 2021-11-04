import { PrismaClient } from "@prisma/client";
import Command from "../classes/Command"
import Loaders from "../loaders";

export interface YarnGlobals {
    prefix?: string;
    config?: any;
    db?: PrismaClient;
    env?: string;
    commands?: Map<string, Command>;
    aliases?: Map<string, string>
    loader?: Loaders
}