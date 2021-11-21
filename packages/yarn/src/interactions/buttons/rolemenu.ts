import Discord, { ButtonInteraction } from "discord.js";
import getGuild from "../../db/utils/getGuild";
import { YarnGlobals } from "../../utils/types";

import { generateButtons, generateRows, generateMessage } from '../commands/rolemenu/_generateButtons';

export default async (client: Discord.Client, interaction: ButtonInteraction, globals: YarnGlobals) => {
  const guild = await getGuild(interaction.guild);
  const roleId = interaction.customId.split("rolemenu_")[1];
  
  let doesExistInDb = guild.roleMenu.find(r => r.role == roleId);
  if(!doesExistInDb) return interaction.reply({content: 'Error: Role button dosent exist!', ephemeral: true});

  let doesExistInDiscord: Discord.Role;
  try {
    doesExistInDiscord = await interaction.guild.roles.fetch(roleId);
    if(!doesExistInDiscord) throw new Error("oops!")
  } catch {
    await globals.db.guild.update({
      where: { id: guild.id },
      data: {
        roleMenu: {
          delete: {
            id: doesExistInDb.id
          }
        }
      }
    });
    return interaction.reply({content: 'Error: Role dosen\'t exist in this server anymore!', ephemeral: true})
  }

  let roleVerb = "Added"
  let target = await interaction.guild.members.fetch(interaction.member.user.id);

  try {
    if(!target.roles.cache.has(doesExistInDiscord.id)){
      await target.roles.add(doesExistInDiscord)
      roleVerb = "Gave"
    } else {
      await target.roles.remove(doesExistInDiscord)
      roleVerb = "Removed"
    }
  } catch(err) {
    return interaction.reply({
      content: `Error updating your <@&${doesExistInDiscord.id}> role! Make sure the bot has permission to Manage Roles`,
      ephemeral: true
    })
  }

  interaction.reply({
    content: `**${roleVerb}** the <@&${doesExistInDiscord.id}> role!`,
    ephemeral: true
  })
}