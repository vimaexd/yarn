const Discord = require("discord.js")

module.exports.run = async (client, message, args,) => {
  let embed = new Discord.RichEmbed()
      .setTitle("**Nikki Help**")
      .addField(":stuck_out_tongue: Fun", client.commands.filter(map2=> map2.help.category === "fun").map(cmd => `\`${cmd.help.name}\``).join(" "))
      .addField(":wrench: Util", client.commands.filter(map2=> map2.help.category === "util").map(cmd => `\`${cmd.help.name}\``).join(" "))
      .addField(":drooling_face: NSFW", client.commands.filter(map2=> map2.help.category === "nsfw").map(cmd => `\`${cmd.help.name}\``).join(" "))
      .setColor("#34363C")

  message.channel.send({embed: embed})
}

module.exports.help = {
  name: "help",
  category: "util",
  description: "Displays all commands in an easy to read format."
}