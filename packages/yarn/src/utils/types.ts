import { PrismaClient } from "@prisma/client";
import Command from "../classes/Commands/Command"
import Loaders from "../classes/Loaders";
import Log from "../classes/Log";

export interface YarnGlobals {
  prefix?: string;
  config?: any;
  db?: PrismaClient;
  env?: string;
  commands?: Map<string, Command>;
  aliases?: Map<string, string>
  log?: Log;
  shardId?: number;
}

export enum YarnShardMessageType {
  GET_SHARD_ID = "yarn/getShardId"
}
export interface YarnShardMessage {
  t: YarnShardMessageType;
  d: any;
}