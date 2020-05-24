const Discord = require("discord.js")
const DabiImages = require("dabi-images");
const DabiClient = new DabiImages.Client();

module.exports.run = async (client, message, args,) => {
  if(!message.channel.nsfw) return message.channel.send(":x: You can only use this command in an NSFW channel.")
  DabiClient.nsfw.hentai.ass().then(json => {
    let embed = new Discord.RichEmbed()
      .setImage(json.url)
      .setColor("#34363C")
    message.channel.send({embed: embed})
  }).catch(error => {
      console.log(error);
      // outputs error
  });
}

module.exports.help = {
  name: "hentai",
  category: "nsfw",
  description: "Displays a random hentai image."
}