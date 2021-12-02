import { Shard, ShardingManager } from 'discord.js';
import path from 'path';
import dotenv from 'dotenv';
import figlet from 'figlet';
import { default as gradient } from 'gradient-string';
import chalk from 'chalk';
import worker from 'worker_threads';
import Log from './classes/Log';
import Yarn from './classes/Yarn';
import { YarnShardMessage, YarnShardMessageType } from './utils/types';

let bot: Yarn | undefined;
dotenv.config({
  path: path.join(__dirname, '..', '..')
})


if(worker.isMainThread && process.env.SHARD !== "FALSE"){
  // fancy startup
  const stringy = gradient(["#8548f5", "#fa93ff"]);
  console.log(gradient.pastel(figlet.textSync('yarn', 'Univers')));
  console.log(`🧶 • env ${process.env.NODE_ENV}`)

  // sharding
  const shardlog = new Log({ prefix: "ShardManager", color: "cyan" })
  const shardmanager = new ShardingManager(
    __filename, 
    {
      "mode": "worker",
      "token": process.env.AUTH_TOKEN
    }
  );

  shardmanager.on('shardCreate', (shard: Shard) => {
    shardlog.log(`Shard ${chalk.bgWhite(shard.id.toString())} spawned`)
    shard.on('message', (msg: YarnShardMessage) => {
      switch(msg.t){
        case YarnShardMessageType.GET_SHARD_ID:
          shard.worker.postMessage({t: YarnShardMessageType.GET_SHARD_ID, d: shard.id})
          break;
      }
    })
  })

  shardmanager.spawn({timeout: 60000});

} else {
  bot = new Yarn();
}
export { bot }