import { MessageButton, MessageActionRow, MessageEmbed } from "discord.js";
import { GuildRoleMenuOption } from "@prisma/client";

const generateButtons = (roleMenu: GuildRoleMenuOption[]) => {
  const buttons: MessageButton[] = []
  roleMenu.forEach(b => {
    buttons.push(
      new MessageButton()
      .setStyle("PRIMARY")
      .setLabel(b.text)
      .setEmoji(b.emoji)
      .setCustomId(`rolemenu_${b.role}`)
    )
  })
  return buttons;
}

const generateRows = (btns: MessageButton[]) => {
  let rows = []
  for(let i = 0; i < Math.ceil(btns.length / 5); i++){
    rows.push(
      new MessageActionRow()
        .addComponents(btns.slice(i*5, (i+1)*5))
    )
  }
  return rows
}

const generateMessage = (rows: MessageActionRow[]) => {
  const embed = new MessageEmbed()
    .setAuthor("Reaction Roles", "https://cdn.discordapp.com/emojis/869931416853573703.png")
    .setDescription(`Press the buttons below to obtain different roles!`)
    .setColor('#fa93ff')
  
  return {
    embeds: [embed],
    components: rows
  }
}

export { generateRows, generateButtons, generateMessage };