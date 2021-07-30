import dayjs from "dayjs";
import { urban } from '../../utils/apis'
import Discord, { DiscordAPIError, Emoji, Message, MessageEmbed } from "discord.js"
import Cotton from "../../classes/Cotton"

enum UserInfoPage {
  Info = "info",
  Roles = "roles",
  Badges = "badges",
  Avatar = "avatar",
  Mod = "mod"
}

const flagsReadable: any = {
  "DISCORD_EMPLOYEE": "<:badge_staff:869920704722796565> Discord Staff",
  "PARTNERED_SERVER_OWNER": "<:badge_partner:869920704722796566> Partnered Server Owner",
  "HYPESQUAD_EVENTS": "<:hypesquad_events:869920704672432159> HypeSquad Events",
  "BUGHUNTER_LEVEL_1": "<:badge_bug_1:869920704827621396> Bug Hunter Level 1",
  "BUGHUNTER_LEVEL_2": "<:badge_bug_2:869920704873779240> Bug Hunter Level 2",
  "HOUSE_BRAVERY": "<:hypesquad_bravery:869920704898932766> HypeSquad Bravery",
  "HOUSE_BRILLIANCE": "<:hypesquad_brilliance:869920704869564418> HypeSquad Brilliance",
  "HOUSE_BALANCE": "<:hypesquad_balance:869920704919928842> HypeSquad Balance",
  "EARLY_SUPPORTER": "<:badge_earlysupporter:869920704844406814> Early Supporter",
  "TEAM_USER": ":grey_question: Team User",
  "SYSTEM": ":grey_question: System",
  "VERIFIED_BOT": ":grey_question: Verified Bot",
  "EARLY_VERIFIED_BOT_DEVELOPER": "<:badge_verifiedbotdev:869920705163165716> Early Verified Bot Developer",
  "DISCORD_PARTNER": "<:badge_partner:869920704722796566> Discord Partner (Legacy)",
  "VERIFIED_DEVELOPER": "<:badge_verifiedbotdev:869920705163165716> Verified Bot Developer (Legacy)",
  "DISCORD_CERTIFIED_MODERATOR": "<:badge_certifiedmod:869920704592744489> Discord Certified Moderator"
}

const getEmbed = async (user: Discord.User, guildUser: Discord.GuildMember | undefined, page: UserInfoPage | string, interaction: Discord.CommandInteraction): Promise<Discord.MessageEmbed> => {
  const embed = new Discord.MessageEmbed();
  embed.setTimestamp(dayjs().valueOf());
  (guildUser) ? embed.setColor(guildUser.displayColor) : embed.setColor("BLURPLE");

  switch(page){
    case UserInfoPage.Avatar:
      embed.setAuthor(user.tag)
      embed.setImage(user.avatarURL({size: 1024}))
      return embed;
    
    case UserInfoPage.Badges:
      embed.setAuthor(`${user.username}'s Badges`, user.avatarURL())
      embed.setDescription(`
        ${
          user.flags
          .toArray()
          .map(f => (flagsReadable[f] || `:grey_question: ` + f.toLowerCase()))
          .join("\n")
        }
      `)
      return embed;

    case UserInfoPage.Mod:
      embed.setAuthor(user.tag)
      embed.setDescription(`
      Server Deafened - ${(guildUser.voice.serverDeaf) ? "Yes" : "No"}
      Server Muted - ${(guildUser.voice.serverMute) ? "Yes" : "No"}
      `)
      return embed;

    case UserInfoPage.Roles:
      embed.setAuthor(`${user.username}'s Roles`, user.avatarURL())
      embed.setDescription(`
        ${
          guildUser.roles.cache
          .filter(role => role.id !== role.guild.id)
          .map(r => r.toString())
          .join("\n")
        }
      `)
      return embed;

    case UserInfoPage.Info:
    default:
      let isBanned;
      try {
        const ban = await interaction.guild.bans.fetch(user.id);
        isBanned = true;
      } catch(err: any) {
        isBanned = false;
      }
      
      embed.setThumbnail(user.avatarURL({size: 1024}))
      embed.setAuthor(user.tag, user.avatarURL())
      embed.addField("User info", `
        **ID**: \`${user.id}\`
        **Bot**: ${(user.bot) ? "Yes" : "No"}
        **System**: ${(user.system) ? "Yes" : "No"}
      `)
      if(guildUser){
        embed.addField("Server specific info", `
        **In server**: Yes
        **Boosting server**: ${(guildUser.premiumSinceTimestamp) ? "Yes" : "No"}
        **Nickname**: ${guildUser.nickname || "No"}
        **Display color**: \`${guildUser.displayHexColor}\`

        **Top role**: ${guildUser.roles.highest.toString()}
        **Role count**: ${guildUser.roles.cache.size || "0"}/${interaction.guild.roles.cache.size}
        `)
      } else {
        embed.addField("Server specific info", `
        **In server**: No
        **Banned?**: ${(isBanned) ? "Yes" : "No"}
        `)
      }

      const timestamps = []
      if (guildUser && guildUser.premiumSince) { 
        timestamps.push(`**Boosting since**: ${dayjs(guildUser.premiumSince).format('DD-MM-YYYY HH:mm:ss')} (<t:${Math.floor(guildUser.premiumSinceTimestamp / 1000)}:R>)`)
      }

      if (guildUser) {
        timestamps.push(`**Server joined**: ${dayjs(guildUser.joinedAt).format('DD-MM-YYYY HH:mm:ss')} (<t:${Math.floor(guildUser.joinedTimestamp / 1000)}:R>)`)
      }

      embed.addField("Timestamps", `
        ${timestamps.join("\n")}
        **Account created**: ${dayjs(user.createdAt).format('DD-MM-YYYY HH:mm:ss')} (<t:${Math.floor(user.createdTimestamp / 1000)}:R>)
      `)
      return embed;
  }
}

const getButtons = (user: Discord.User, guildMember: Discord.GuildMember | undefined, page: UserInfoPage | string, client?: Discord.Client, perms?: Discord.Permissions): Discord.MessageActionRow[] => {
  switch(page){
    case UserInfoPage.Avatar:
      const avatarRow = new Discord.MessageActionRow();
      const btn1 = new Discord.MessageButton()
        .setLabel("PNG")
        .setStyle("LINK")
        .setURL(user.avatarURL({size: 1024, format: "png"}))
      
      const btn2 = new Discord.MessageButton()
        .setLabel("JPEG")
        .setStyle("LINK")
        .setURL(user.avatarURL({size: 1024, format: "jpeg"}))
      
      const btn3 = new Discord.MessageButton()
        .setLabel("GIF")
        .setStyle("LINK")
        .setURL(user.avatarURL({size: 1024, format: "gif"}))
      
      const btn4 = new Discord.MessageButton()
        .setLabel("WEBP")
        .setStyle("LINK")
        .setURL(user.avatarURL({size: 1024, format: "webp"}))
      avatarRow.addComponents([btn1, btn2, btn3, btn4])
      return [avatarRow];

    case UserInfoPage.Mod:
      const modBtn1 = new Discord.MessageButton()
        .setLabel("Ban")
        .setStyle("DANGER")
        .setEmoji("🔨")
        .setCustomId("ban")
      
      const modCollector1 = new Discord.InteractionCollector(client, {
          interactionType: "MESSAGE_COMPONENT",
          componentType: "BUTTON",
          time: 180000
      })
      .on('collect', i => {
        if(!i.isMessageComponent()) return;
        i.reply({content: "do something", ephemeral: true})
      })
      

      const modBtn2 = new Discord.MessageButton()
        .setLabel("Kick")
        .setStyle("DANGER")
        .setEmoji("👢")
        .setCustomId("kick")

       const modBtn3 = new Discord.MessageButton()
        .setLabel("Mute")
        .setStyle("PRIMARY")
        .setEmoji("🙊")
        .setCustomId("mute")

      const modBtn4 = new Discord.MessageButton()
        .setLabel("Deafen")
        .setStyle("PRIMARY")
        .setEmoji("🙉")
        .setCustomId("deafen")

      const modRow1 = new Discord.MessageActionRow();
      const modRow2 = new Discord.MessageActionRow();

      if (perms.has('BAN_MEMBERS')) modRow1.addComponents([modBtn1]);
      if (perms.has('KICK_MEMBERS')) modRow1.addComponents([modBtn2]);
      if (perms.has('MUTE_MEMBERS')) modRow2.addComponents([modBtn3]);
      if (perms.has('DEAFEN_MEMBERS')) modRow2.addComponents([modBtn4]);
      return [modRow1, modRow2];
    default:
      return []
  }
}

export default new Cotton({
    enabled: true,
    name: "userinfo",
    description: "Get someone's info by ID or Mention",
    options: [{
        name: "user",
        type: 'USER',
        description: "The user to get info on"
    }]
}, async (client, interaction, globals) => {
  const user = interaction.options.getUser('user') || interaction.user;
  
  let guildUser: Discord.GuildMember | undefined;
  try {
    guildUser = await interaction.guild.members.fetch(user);
  } catch {
    guildUser = undefined;
  }
  const perms = new Discord.Permissions(interaction.member.permissions);

  const row = new Discord.MessageActionRow()
  const select = new Discord.MessageSelectMenu()
  .setCustomId('userinfo')
  .setPlaceholder('Pick a user information section')
  .addOptions([
    {
      label: "Info",
      description: `View ${user.username}'s user information`,
      value: UserInfoPage.Info,
      emoji: "📄"
    },
    {
      label: "Avatar",
      description: `View ${user.username}'s avatar`,
      value: UserInfoPage.Avatar,
      emoji: "🖼️"
    },
    {
      label: "Badges",
      description: `View ${user.username}'s badges`,
      value: UserInfoPage.Badges,
      emoji: "⭐"
    },
  ])

  if(guildUser) {
    select.addOptions([
      {
        label: "Roles",
        description: `View ${user.username}'s roles in ${interaction.guild.name}`,
        value: UserInfoPage.Roles,
        emoji: "<:discord_at:869931416853573703>"
      }
    ])

    // if(
    //   perms.has('KICK_MEMBERS') || 
    //   perms.has('BAN_MEMBERS') ||
    //   perms.has('MUTE_MEMBERS') ||
    //   perms.has('DEAFEN_MEMBERS')
    // ) {
    //   select.addOptions([
    //     {
    //       label: "Moderator",
    //       description: `Perform moderation actions on ${user.username}`,
    //       value: UserInfoPage.Mod,
    //       emoji: "🛡️"
    //     }
    //   ])
    // }
  }

  row.addComponents([select])

  interaction.reply({
    embeds: [await getEmbed(user, guildUser, UserInfoPage.Info, interaction)],
    components: [row]
  })

  const collector = new Discord.InteractionCollector(client, {
    interactionType: "MESSAGE_COMPONENT",
    componentType: "SELECT_MENU",
    time: 180000
  })

  collector.on('collect', async i => {
    if(!i.isSelectMenu()) return;
    if(i.message.interaction.id !== interaction.id) return;
    if(i.user.id !== interaction.user.id) return i.reply({ content: "You can't press that!", ephemeral: true });


    await i.update({
      embeds: [await getEmbed(user, guildUser, i.values[0], interaction)],
      components: getButtons(user, guildUser, i.values[0], client, perms).concat(row)
    })
  })

  collector.on('end', async interactions => {
    select.setDisabled(true)
    await interaction.editReply({
      embeds: [await getEmbed(user, guildUser, UserInfoPage.Info, interaction)],
      components: []
    })
  })
})