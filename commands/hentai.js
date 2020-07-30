const Discord = require("discord.js") 
const tcli = require("tnai");
const tnai = new tcli();

module.exports.run = async (client, message, args,) => {
  if(!message.channel.nsfw) return message.channel.send(":x: You can only use this command in an NSFW channel.")

  let img = await tnai.nsfw.hentai()

  let embed = await new Discord.RichEmbed()
    .setImage(img)
    .setColor("#34363C")
  await message.channel.send({embed: embed})
}

module.exports.help = {
  name: "hentai",
  category: "nsfw",
  description: "Displays a random hentai image.",
  usage: "+hentai"
}