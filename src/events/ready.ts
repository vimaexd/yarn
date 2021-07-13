import Discord from "discord.js";
import { YarnGlobals } from "../utils/types";

export default (client: Discord.Client, globals: YarnGlobals) => {
    let guildAmount = client.guilds.cache.size
    client.user?.setActivity(`${guildAmount} ${guildAmount > 1 ? "servers" : "server"} `, {type: 'LISTENING'})
    
    globals.loader.updateSlashCommands(client)
    console.log(`✅ - Yarn is up. - ${globals.env} env`)
}