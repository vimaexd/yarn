import { PrismaClient } from "@prisma/client";
import Cotton from "../classes/Command"
import Loaders from "../loaders";

export interface YarnGlobals {
    prefix?: string;
    config?: any;
    db?: PrismaClient;
    env?: string;
    cottons?: Map<string, Cotton>
    aliases?: Map<string, string>
    loader?: Loaders
}