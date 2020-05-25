let Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(":x: You don't have permission to use this command.");

     let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
     if(!toMute) return message.channel.send(":warning: Invalid user mention.");

     if(toMute.id === message.author.id) return message.channel.send(":x: Nice try, but you cannot ban yourself.");
     if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot ban a member who is higher or has the same role as you.");

     toMute.ban()
       .then(() => {
         message.channel.send(`:white_check_mark: **${toMute.displayName}** has been banned.`);
       })
       .catch(err => {
        if(err.message === "Missing Permissions"){
          return message.channel.send("I don't have permission to ban that user, make sure I have the Ban Members permission. Additionally I cannot ban people with the same/higher role than me, so make sure i'm near the top of your roles list.")
        }
         message.channel.send("Oops! An error occured trying to ban that user.")
         console.log(err)
        });
     }

module.exports.help = {
    name: "ban",
    category: "moderation",
    description: "Allows you to ban a user. Requires BAN_MEMBERS permission.",
    usage: "+ban [user]"
}
