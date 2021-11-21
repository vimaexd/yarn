import Discord from "discord.js";
import { YarnGlobals } from "../utils/types";

export default (args: any, client: Discord.Client, globals: YarnGlobals) => {
    globals.log.log(`Connected to Discord!`)
}