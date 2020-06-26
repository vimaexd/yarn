let Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(":x: You don't have permission to use this command.");

     let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
     if(!toMute) return message.channel.send(":warning: Invalid user mention.");

     if(toMute.id === message.author.id) return message.channel.send(":x: Nice try, but you cannot bean yourself.");
     if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot bean a member who is higher or has the same role as you.");


     message.channel.send(`:white_check_mark: **${toMute.displayName}** has been beaned.`);
}

module.exports.help = {
    name: "bean",
    category: "moderation",
    description: "Allows you to bean a user. Requires BAN_MEMBERS permission.",
    usage: "+bean [user]"
}
