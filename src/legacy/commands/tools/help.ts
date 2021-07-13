import Discord, { MessageEmbed } from "discord.js"
import dayjs from "dayjs"
import Command from "../../../classes/Command"

const Cmd = new Command({
    enabled: true,
    name: "help",
    trigger: ["help"],
    description: "Get a list of commands that the bot has",
    usage: "help <command>",
    category: "Tools"
}, async (client, message, args, globals) => {
    let categories: Array<string> = []
    globals.commands.forEach((v: Command, k: string) => {
        if(v.meta.category == "dev") return;
        if(v.meta.category == "perserver") return;
        (categories.indexOf(v.meta.category) !== -1) ? void(0) : categories.push(v.meta.category)
    })

    let embed = new MessageEmbed()
        .setTitle("Command List")
        .setDescription("WIP")
        .setColor(globals.config.embedColors.default)
        .setFooter("Yarn", client.user.displayAvatarURL())
        .setTimestamp(dayjs().valueOf())

    categories.forEach(cat => {
        let names: Array<string> = []
        globals.commands.forEach((v: Command, k: string) => {
            (v.meta.category == cat) && names.push(v.meta.name)
        })
        embed.addField(cat, names.map(n => `\`${n}\``).join(" "))
    })
    
    message.channel.send({embed: embed})
})

export default Cmd