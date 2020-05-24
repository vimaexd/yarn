const Discord = require("discord.js")

module.exports.run = async (client, message, args,) => {
  message.channel.send(`:ping_pong:  \`${new Date().getTime() - message.createdTimestamp}\` ms `)
}

module.exports.help = {
  name: "ping",
  category: "util",
  description: "Displays the latency between your message and the bot.",
  usage: "+ping"
}