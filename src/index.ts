import Discord, { Intents } from "discord.js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { YarnGlobals } from "./utils/types"
import config from "../config/conf.json";
import Command from "./classes/Command";
import Loaders from "./loaders";

dotenv.config()
const client: Discord.Client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

let token: string | undefined = process.env.TOKEN;
let globals: YarnGlobals = {}

globals.cottons = new Map;
globals.aliases = new Map;

globals.config = config as any
(process.env.NODE_ENV === "production") ? globals.env = "production" : globals.env = "development"

client.login(token)

// Load commands & events
globals.loader = new Loaders(client)
globals.loader.loadJobs(path.join(__dirname, 'jobs'), client)
globals.loader.loadInteractions(path.join(__dirname, 'commands'), false)
globals.loader.loadEvents(path.join(__dirname, 'events'), client)

export { globals }