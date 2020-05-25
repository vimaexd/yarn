let Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":x: You don't have permission to use this command.")
    if(!args[0]) return message.channel.send("You need to provide an amount of messages to delete - +purge [amount]")
    if(isNaN(args[0])) return message.channel.send("Invalid amount of messages! - +purge [amount]")
    message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(`:white_check_mark: Deleted ${args[0]} messages`).then(msg => msg.delete(3000))
    })
}

module.exports.help = {
    name: "purge",
    category: "moderation",
    description: "Allows you to bulk delete messages, up to 200 at a time. Requires MANAGE_MESSAGES permission.",
    usage: "+purge [amount]"
}
