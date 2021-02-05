import fetch from "node-fetch";
import Discord, { MessageEmbed } from "discord.js"
import Command from "../../classes/Command"

const Cmd = new Command({
    enabled: true,
    name: "mcskin",
    trigger: ["mcskin"],
    description: "View someone's Minecraft skin",
    usage: "mcskin [username]",
    category: "Fun"
}, async (client, message, args, globals) => {
    if(!args[0]) return message.channel.send("Please provide a Minecraft Username!");

    let SkinEmbed = new Discord.MessageEmbed()
        .setTitle(`Minecraft Skin for ${args[0]}`)
        .setImage(`https://minotar.net/body/${args[0]}/200.png`)
        .setColor(globals.config.embedColors.default)
        .setFooter("Yarn", client.user.displayAvatarURL())
        
    message.channel.send({embed: SkinEmbed})
})

export default Cmd