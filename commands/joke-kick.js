let Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(":x: You don't have permission to use this command.");

     let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
     if(!toMute) return message.channel.send(":warning: Invalid user mention.");
    
     if(toMute.id === client.user.id) return message.channel.send("No.")
     if(toMute.id === message.author.id) return message.channel.send(":x: Nice try, but you cannot kek yourself.");
     if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot kek a member who is higher or has the same role as you.");
    message.channel.send(`:white_check_mark: **${toMute.displayName}** has been keked.`);
}

module.exports.help = {
  name: "kek",
  category: "moderation",
  description: "Allows you to 'kek' a 'user'. Requires KICK_MEMBERS permission.",
  usage: "+kek [user]"
}
