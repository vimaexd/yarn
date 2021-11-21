import axios from "axios";
import Discord, { ButtonInteraction, GuildMember, MessageEmbed } from "discord.js"
import Command from "../../../classes/Commands/Command"
import dayjs from "dayjs";
import getGuild from "../../../db/utils/getGuild";

import { noBtn, deleteBtn } from '../../../utils/buttons';

const Cmd = new Command({
    enabled: false,
    name: "giveaway",
    description: "Create a giveaway that people can join!",
    options: []
}, async (client, interaction, globals) => {
  if(!(interaction.member as Discord.GuildMember).permissions.has("MANAGE_GUILD"))
    return interaction.reply({"content": ":x: You must have the **Manage Guild** permission to use this command!"})

  // TODO: fucking everything


  // const guild = await getGuild(interaction.guild);
  // await globals.db.guild.update({
  //   where: { id: guild.id },
  //   data: {
  //     giveaways: {
  //       create: {

  //       }
  //     }
  //   }
  // })
})

export default Cmd