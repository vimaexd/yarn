import Discord, { MessageEmbed } from "discord.js"
import Command from "../../classes/Command"

const Cmd = new Command({
    enabled: true,
    name: "botinfo",
    trigger: ["botinfo", "aboutme"],
    description: "Find out more about me, the bot!",
    category: "Tools"
}, async (client, message, args, globals) => {
    let embed = new MessageEmbed()
        .setTitle("About the bot")
        .setDescription("WIP")
        .setColor(globals.config.embedColors.default)
    message.channel.send({embed: embed})
})

export default Cmd