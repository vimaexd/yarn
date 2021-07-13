import Discord, { TextChannel } from "discord.js";
import Booru from "booru";
import Command from "../Command";
import Utils from "../../classes/Utils"
import { YarnGlobals } from "../../utils/types";
import { CommandMeta } from '../Command';

const utils = new Utils()
const blacklist = [
    "loli", "lolita", "shota", "cub", "young", // Illegal
    "gore", "scat", "watersports" // Disgusting
];

class BooruCommand extends Command {
    constructor(meta: CommandMeta, run: (client: Discord.Client, message: Discord.Message, args: Array<string>, globals: YarnGlobals) => any){
        super(meta, run)
    }

    fetch = async (site: string, tags: Array<string>, message: Discord.Message, client: Discord.Client, globals: YarnGlobals) => {

        if(!(message.channel as TextChannel).nsfw) return message.channel.send(":underage: You must be in an NSFW channel to use this command.")

        for(const b in blacklist){
            if(tags.includes(b)) return message.channel.send(":x: You requested a globally blacklisted tag.")
        }

        tags.concat(blacklist.map(b => (`-${b}`))) // Apply blacklist
        const results = await Booru(site).search(tags, { limit: 1, random: true })
    
        if(results.length == 0) return message.channel.send("No results found")
        if(!results) return message.channel.send("No results found")
    
        const post = results[0]
    
        let NSFWEmbed = new Discord.MessageEmbed()
            .setTitle(`${site} post ${post.id}`)
            .setDescription(`If the image does not display below, [Click Here](${post.fileUrl})`)
            .setImage(post.fileUrl)
            .setColor(globals.config.embedColors.default)
            .setFooter(`❔ ${post.rating} 🔼 ${post.score}`, client.user.displayAvatarURL())
            .setURL(post.postView)

        message.channel.send({embed: NSFWEmbed})
    }
}

export default BooruCommand;