import Discord, { Intents } from "discord.js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

import * as figlet from 'figlet';
import {default as gradient} from 'gradient-string';

import { PrismaClient } from '@prisma/client'
import { YarnGlobals } from "./utils/types"
import config from "../config/conf.json";
import Loaders from "./loaders";

dotenv.config()
class Bot {
  client: Discord.Client;
  globals: YarnGlobals;

  constructor(){
    // Globals
    this.globals = {}
    this.globals.commands = new Map;
    this.globals.aliases = new Map;
    this.globals.config = config as any
    (process.env.NODE_ENV === "production") ? this.globals.env = "production" : this.globals.env = "development"

    // Client
    this.client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
    this.init();
  }

  async init(){
    console.log(`🧶 • env ${this.globals.env} • `)

    this.globals.loader = new Loaders(this.client, this.globals)
    this.globals.db = new PrismaClient()

    // Load commands from multiple folders and merge maps
    const dirs = [
      path.join(__dirname, 'interactions', 'commands'),
      path.join(__dirname, 'interactions', 'ctx')
    ];

    for await (const dir of dirs){
      const ints = await this.globals.loader.loadInteractions(dir);
      ints.forEach((v, k) => { 
        this.globals.commands.set(k, v) 
      })
    }

    await this.globals.loader.loadEvents(path.join(__dirname, 'events'))
    // await globals.loader.loadJobs(path.join(__dirname, 'jobs'), client)

    await this.client.login(process.env.AUTH_TOKEN)
    await this.globals.loader.updateSlashCommands(this.globals.commands)
  }
}

const stringy = gradient(["#8548f5", "#fa93ff"]);
console.log(gradient.pastel(figlet.textSync('yarn', 'Univers')));

const bot = new Bot();
export { bot }