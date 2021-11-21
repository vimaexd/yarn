import Discord, { CommandInteraction, GuildMember, MessageEmbed } from "discord.js"
import { YarnGlobals } from "../../utils/types"
import Command, { CommandMeta } from "./Command"

export interface RandomImageCommandMeta extends CommandMeta {
    imageUrls: string[];
    responseTemplate: (source: GuildMember, target: GuildMember) => string;
    responseTemplateSelf: (source: GuildMember) => string;
    
}

export default class RandomImageCommand extends Command {
    meta: RandomImageCommandMeta

    constructor(meta: RandomImageCommandMeta){
      super(
        meta, 
        async (client: Discord.Client, interaction: CommandInteraction, globals: YarnGlobals) => {
          const images = meta.imageUrls;
          const _target = interaction.options.getUser("user");
          const source = await interaction.guild.members.fetch(interaction.member.user.id);
        
          let target: Discord.GuildMember;
          try {
            target = await interaction.guild.members.fetch(_target.id);
          } catch(err) {} // it never existed anyway
        
          let desc;
          (target && target.id != source.id)
          ? desc = meta.responseTemplate(source, target)
          : desc = meta.responseTemplateSelf(source)
        
          const image = images[Math.floor(Math.random() * images.length)]
          const embed = new MessageEmbed()
            .setImage(image)
            .setDescription(desc)
            .setColor("#fa93ff")
          
          interaction.reply({content: `<@${target.id}>`, embeds: [embed]});
        }
      );
    }
}