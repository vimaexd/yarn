import Discord, { Intents } from "discord.js";
import fs from "fs";
import path from "path";
import worker from 'worker_threads';

import { PrismaClient } from '@prisma/client'
import { YarnGlobals, YarnShardMessage } from "../utils/types"
import Loaders from "./Loaders";
import Log from "./Log";


export default class Yarn {
  private loader: Loaders;
  client: Discord.Client;
  globals: YarnGlobals;

  constructor(){
    // Globals
    this.globals = {}
    this.globals.commands = new Map;
    this.globals.aliases = new Map;
    this.globals.config = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), '..', '..', 'config', 'conf.json'), 
        { encoding: 'utf-8' }
      )
    ) as any;

    // Environment
    (process.env.NODE_ENV === "production") ? this.globals.env = "production" : this.globals.env = "development";
    
    worker.parentPort.on('message', (msg: YarnShardMessage) => {
      switch(msg.t){
        case 'yarn/getShardId':
          this.globals.shardId = +msg.d;
          break;
      }
    })

    // Client
    this.client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

    // Other Globals
    this.globals.db = new PrismaClient()
    this.client.shard.send({ t: 'yarn/getShardId' });

    let canStart: NodeJS.Timer;
    canStart = setInterval(() => {
      if(this.globals.shardId !== undefined) {
        this.init();
        clearInterval(canStart);
      }
    }, 1000)
  }

  async init(){
    this.loader = new Loaders(this.client, this.globals)
    this.globals.log = new Log({ prefix: "Bot", color: 'magenta', shardId: this.globals.shardId });
    this.globals.log.log("Loading Yarn")

    // Load events and jobs
    await this.loader.loadEvents(path.join(__dirname, '..', 'events'))
    await this.loader.loadJobs(path.join(__dirname, '..', 'jobs'))

    await this.client.login(process.env.AUTH_TOKEN)
    this.client.user.setPresence({
      "activities": [
        {"type": "PLAYING", "name": "🔃 starting up.."}
      ]
    })

    // Load commands from multiple folders and merge maps
    const dirs = [
      path.join(__dirname, '..', 'interactions', 'commands'),
      path.join(__dirname, '..', 'interactions', 'ctx')
    ];

    for await (const dir of dirs){
      const ints = await this.loader.loadInteractions(dir);
      ints.forEach((v, k) => { 
        this.globals.commands.set(k, v) 
      })
    }

    await this.loader.updateSlashCommands(this.globals.commands)

    setInterval(async () => {
      const _guildAmount = await this.client.shard.fetchClientValues('guilds.cache.size')
      const guildAmount = (_guildAmount as number[]).reduce((a: number, b: number) => a+b);
      this.client.user.setPresence({
        "activities": [
          {"type": "LISTENING", "name": `${guildAmount} servers`}
        ]
      })
    }, 120000)
    this.globals.log.log("Initialization complete");
  }
}