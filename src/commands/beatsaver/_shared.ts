import Discord from 'discord.js';
import dayjs from 'dayjs';

export const generateMapEmbed = (map: any) => {
  const embed = new Discord.MessageEmbed()
    .setTitle(map.name)
    .setDescription(`
    *${map.description}*
    `)
    .addField("Stats", `
    ${(map.metadata.automapper) ? `**Auto-Mapped by ${map.metadata.automapper}**` : ""}
    👍 ${map.stats.upVotes} - 👎 ${map.stats.downVotes}
    Rating - **${(map.stats.rating).toFixed(2)}**
    Downloads - **${map.stats.downloads}**
    `)
    .addField("Difficulties", `
    **Easy** - ${(map.metadata.difficulties.easy) ? ":white_check_mark:" : ":x:"}
    **Normal** - ${(map.metadata.difficulties.normal) ? ":white_check_mark:" : ":x:"}
    **Hard** - ${(map.metadata.difficulties.hard) ? ":white_check_mark:" : ":x:"}
    **Expert** - ${(map.metadata.difficulties.expert) ? ":white_check_mark:" : ":x:"}
    **Expert+** - ${(map.metadata.difficulties.expertPlus) ? ":white_check_mark:" : ":x:"}
    `)
    .addField("Song Info", `
    BPM - **${map.metadata.bpm}**
    Song Name - **${map.metadata.songName}**
    Song Subname - **${map.metadata.songSubName}**
    Song Author - **${map.metadata.songAuthorName}**
    Level Author - **${map.metadata.levelAuthorName}**
    `)
    .addField("Details", `
    Hash - \`${map.hash}\`
    Uploader - [${map.uploader.username}](https://beatsaver.com/uploader/${map.uploader._id})
    Uploaded <t:${dayjs(map.uploaded).unix()}:R>
    `)
    .setURL(`https://beatsaver.com/beatmap/${map.key}`)
    .setThumbnail(`https://beatsaver.com${map.coverURL}`)
    .setColor("#3d81f5")

  return embed;
}

export const generateMapButtons = (map: any) => {
  const row1 = new Discord.MessageActionRow()
  const row2 = new Discord.MessageActionRow()
  const btn1 = new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("BeatSaver")
    .setURL(`https://beatsaver.com/beatmap/${map.key}`)
  
  const btn2 = new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("BeastSaber")
    .setURL(`https://bsaber.com/songs/${map.key}`)

  const btn3 = new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("One-click Install")
    .setURL("https://spx.vercel.app/1/beatsaver%3A%2F%2F" + map.key)
  
  const btn4 = new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("Download .zip")
    .setURL(`https://beatsaver.com${map.directDownload}`)


  row1.addComponents([btn1, btn2])
  row2.addComponents([btn3, btn4])

  return [row1, row2]
}
