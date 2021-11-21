import Discord from 'discord.js';

const deleteBtn = new Discord.MessageButton()
.setStyle("DANGER")
.setLabel("I understand, delete")
.setEmoji("🗑️")
.setCustomId("yes")

const noBtn = new Discord.MessageButton()
.setStyle("SECONDARY")
.setLabel("No!")
.setEmoji("❌")
.setCustomId("no")

export {
  deleteBtn,
  noBtn
}