import dayjs from "dayjs";
import _ from "lodash";
import { urban } from '../../../utils/apis'
import Discord, { Emoji, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js"
import Command from "../../../classes/Commands/Command"

export default new Command({
    enabled: true,
    name: "invite",
    description: "Retrieve info on a Discord invite",
    options: [{
        name: "invite",
        type: 'STRING',
        description: "A Discord invite URL/code",
        required: true
    }]
}, async (client, interaction, globals) => {
  const code = interaction.options.getString("invite");  

  let invite;
  try {
    invite = await client.fetchInvite(code);
  } catch(err) {
    return interaction.reply({content: "Invalid invite URL/code!", ephemeral: true})
  }

  const guildBadges = []
  if(invite.guild.partnered) guildBadges.push("<:badge_partner:869920704722796566>")
  if(invite.guild.verified) guildBadges.push("<:discord_verified:870659652508074004>")

  const guildImages = []
  if(invite.guild.icon) guildImages.push(`[Server Icon](${invite.guild.iconURL({size: 2048})})`)
  if(invite.guild.banner) guildImages.push(`[Server Banner](${invite.guild.bannerURL({size: 2048})})`)
  if(invite.guild.splash) guildImages.push(`[Invite Splash](${invite.guild.splashURL({size: 2048})})`)

  const invitee = (invite.inviter) ? `${invite.inviter.tag} (<@${invite.inviter.id}>)` : "System (@everyone)"
  const expire = dayjs(invite.expiresAt);

  const embed = new MessageEmbed();
  embed.setColor("BLURPLE")
  embed.setTitle(`${invite.guild.name}  ${guildBadges.join(" ")}`)
  embed.setDescription(`
  > *${invite.guild.description || "No description"}*

  **Vanity URL**: ${(invite.guild.vanityURLCode) ? `<https://discord.gg/${invite.guild.vanityURLCode}>` : `None`}
  **Server ID**: ${invite.guild.id}
  **Verification Level**: ${_.capitalize(invite.guild.verificationLevel)}
  **NSFW Level**: ${_.capitalize(invite.guild.nsfwLevel)}
  `)
  
  embed.addField("Features", invite.guild.features
    .map(f => (
      f.split("_").map(a => (_.capitalize(a))).join(" ")
    ))
    .join(", ") || "None"
  )

  if(guildImages.length > 0) 
    embed.addField("Assets", guildImages.map(i => `● ${i}`).join("\n"), true)

  if(code !== invite.guild.vanityURLCode) {
    embed.addField("Invite settings", `
      **Channel**: ${invite.channel.name} (<#${invite.channel.id}>)
      **Inviter**: ${invitee}
      **Max Uses**: ${invite.maxUses || "Infinite"}
      **Max Age**: ${invite.maxAge || "Infinite"}
      **Expires**: ${(invite.expiresAt) ? `${expire.format('DD-MM-YYYY HH:mm:ss')} (<t:${expire.unix()}:R>)` : `Never`}
    `, true)
  }
  embed.addField("Invite Code", `\`${code}\``)
  embed.setTimestamp(dayjs().valueOf())
  if(invite.guild.icon) embed.setThumbnail(invite.guild.iconURL({size: 1024}))
  
  const row = new MessageActionRow();
  const joinBtn = new MessageButton()
    .setURL("https://discord.gg/" + invite.code)
    .setStyle("LINK")
    .setLabel("Join server")

  row.addComponents([joinBtn])

  interaction.reply({
    embeds: [embed],
    components: [row]
  })
})