import Discord from 'discord.js';
import dayjs from 'dayjs';

export const generateMapEmbed = (map: any) => {

  // pre-populate difficulties
  const v = map.versions[map.versions.length - 1]
  const diffs: string[] = v.diffs.map((m: any) => (m.difficulty))

  const embed = new Discord.MessageEmbed()
    .setTitle(map.name)
    .setDescription(`
    *${map.description}*
    `)
    .addField("Stats", `
    ${(map.metadata.automapper) ? `**Auto-Mapped by ${map.metadata.automapper}**` : ""}
    👍 ${map.stats.upvotes} - 👎 ${map.stats.downvotes}
    Rating - **${Math.floor(map.stats.score * 2)}%**
    Downloads - **${map.stats.downloads}**
    `)
    .addField("Details", `
    Hash: \`${v.hash}\`
    Uploader: [${map.uploader.name}](https://beatsaver.com/profile/${map.uploader.id})
    Version: v${map.versions.length}
    Uploaded <t:${dayjs(map.uploaded).unix()}:R>
    `)
    .addField("Difficulties", `
    **Easy**: ${(diffs.includes("Easy")) ? ":white_check_mark:" : ":x:"}
    **Normal**: ${(diffs.includes("Normal")) ? ":white_check_mark:" : ":x:"}
    **Hard**: ${(diffs.includes("Hard")) ? ":white_check_mark:" : ":x:"}
    **Expert**: ${(diffs.includes("Expert")) ? ":white_check_mark:" : ":x:"}
    **Expert+**: ${(diffs.includes("ExpertPlus")) ? ":white_check_mark:" : ":x:"}
    `, true)
    .addField("Song Info", `
    BPM: **${map.metadata.bpm}**
    Song Name: **${map.metadata.songName || "N/A"}**
    Song Subname: **${map.metadata.songSubName || "N/A"}**
    Song Author: **${map.metadata.songAuthorName || "N/A"}**
    Level Author: **${map.metadata.levelAuthorName || "N/A"}**
    `, true)
    .setURL(`https://beatsaver.com/maps/${map.id}`)
    .setThumbnail(v.coverURL)
    .setColor("#3d81f5")

  return embed;
}

export const generateMapButtons = (map: any) => {
  const row1 = new Discord.MessageActionRow()
  const row2 = new Discord.MessageActionRow()
  const btn1 = new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("BeatSaver")
    .setURL(`https://beatsaver.com/maps/${map.id}`)
  
  const btn2 = new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("BeastSaber")
    .setURL(`https://bsaber.com/songs/${map.id}`)

  const btn3 = new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("One-click Install")
    .setURL("https://spx.vercel.app/1/beatsaver%3A%2F%2F" + map.id)
  
  const btn4 = new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("Download .zip")
    .setURL(map.versions[map.versions.length - 1].downloadURL)


  row1.addComponents([btn1, btn2])
  row2.addComponents([btn3, btn4])

  return [row1, row2]
}
