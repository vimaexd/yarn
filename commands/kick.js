let Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(":x: You don't have permission to use this command.");

     let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
     if(!toMute) return message.channel.send(":warning: Invalid user mention.");

     if(toMute.id === message.author.id) return message.channel.send(":x: Nice try, but you cannot kick yourself.");
     if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot kick a member who is higher or has the same role as you.");

     toMute.kick()
       .then(() => {
         message.channel.send(`:white_check_mark: **${toMute.displayName}** has been kicked.`);
       })
       .catch(err => {
         message.channel.send("Oops! An error occured trying to kick that user.")
         console.log(err)
        });
     }

module.exports.help = {
    name: "kick",
    category: "moderation",
    description: "Allows you to kick a user. Requires KICK_MEMBERS permission.",
    usage: "+kick [user]"
}
