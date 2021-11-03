import dayjs from "dayjs";
import Discord, { MessageEmbed } from "discord.js"
import Cotton from "../../../classes/Command"

import bank from '../../../banks/hug.json';

const Cmd = new Cotton({
    enabled: true,
    name: "hug",
    description: "Hug someone! (displays a GIF)",
    options: [{
        name: "user",
        type: 'USER',
        description: "The person you want to give hugs to",
        required: false
    }]
}, async (client, interaction, globals) => {
  const images = bank.links;
  const target = interaction.options.getUser("user");
  
  const member = await interaction.guild.members.fetch(interaction.member.user.id);

  let targetMember: Discord.GuildMember;
  try {
    targetMember = await interaction.guild.members.fetch(target.id);
  } catch(err) {} // it never existed anyway

  let desc;
  (targetMember && targetMember.id != member.id)
  ? desc = `**${member.nickname || member.user.username}** is hugging **${targetMember.nickname || targetMember.user.username}**`
  : desc = `**${member.nickname || member.user.username}** has no one to hug, so they hug themselves instead`

  const image = images[Math.floor(Math.random() * images.length)]
  const embed = new MessageEmbed()
    .setImage(image)
    .setDescription(desc)
    .setColor("#fa93ff")
  
  interaction.reply({embeds: [embed]});
})

export default Cmd