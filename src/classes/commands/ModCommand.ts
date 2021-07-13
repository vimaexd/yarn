import Discord from "discord.js";
import Command from "../Command";
import Utils from "../../classes/Utils"
import { YarnGlobals } from "../../utils/types";
import { CommandMeta } from '../Command';

const utils = new Utils()

class ModCommand extends Command {
    constructor(meta: CommandMeta, run: (client: Discord.Client, message: Discord.Message, args: Array<string>, globals: YarnGlobals) => any){
        super(meta, run)
    }

    async check(
      action: string, 
      client: Discord.Client, 
      message: Discord.Message, 
      args: Array<string>, 
      globals: YarnGlobals,
      callback: (botMessage: Discord.Message) => void
    ){
      let target: Discord.GuildMember = message.mentions.members.first() || await message.guild.members.fetch(args[0])
      const position = message.member.roles.highest.comparePositionTo(target.roles.highest)
      if(position < 1) return message.channel.send(`:x: Your role is too low to ${action} this user!`)
      
      const botMessage = await message.channel.send(`Are you sure you want to ${action} the user **${target.user.username}#${target.user.discriminator}**?`)

      let confirmed = false;
      const filter = (r: Discord.ReactionEmoji, u: Discord.User): boolean => { return u.id === message.author.id };
      const collector = message.createReactionCollector(filter, { time: 15000 });
  
      collector.on('collect', (reaction, user) => {
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
      });
      
      collector.on('end', collected => {
          console.log(`Collected ${collected.size} items`);
      });
    }
}

export default ModCommand;