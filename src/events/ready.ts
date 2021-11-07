import Discord from "discord.js";
import { YarnGlobals } from "../utils/types";

export default (args: any, client: Discord.Client, globals: YarnGlobals) => {
    setInterval(() => updateActivityMessage(client), 120000);
    globals.log.log(`Connected to Discord!`)
}

const updateActivityMessage = (client: Discord.Client) => {
    let guildAmount = client.guilds.cache.size
    client.user?.setActivity(`${guildAmount} ${guildAmount > 1 ? "servers" : "server"} `, {type: 'LISTENING'})
}
