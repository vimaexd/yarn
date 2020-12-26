import { inspect } from "util"
import Discord, { MessageEmbed } from "discord.js"
import Command from "../../classes/Command"

const Cmd = new Command({
    enabled: true,
    name: "eval",
    trigger: ["eval"],
    description: "javascript",
    usage: "None",
    category: "dev"
}, async (client, message, args, globals) => {
    if(message.author.id !== globals.config.ownerId) return message.channel.send(":x: You do not have permission to use this command.")
    if(!args.join(" ")) return message.channel.send(":warning: Nothing to eval")

    function clean(text: any) {
        if (typeof(text) === "string")
          return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }

    let embed = new Discord.MessageEmbed()
        .setTitle("Eval")
        .setColor(globals.config.embedColors.default)
        .setFooter("Yarn", client.user.displayAvatarURL())
        .addField("Input", `\`\`\`${args.join(" ")}\`\`\``)

    try {
        const code = args.join(" ")
        let owod = eval(code)
    
        if (typeof owod !== "string") owod = inspect(owod);
        embed.addField("Output :white_check_mark:", `\`\`\`${clean(owod)}\`\`\``)
    } catch(err) {
        embed.addField("Output :x:", `\`\`\`Error: ${err}\`\`\``)
    }

    message.channel.send({embed: embed, code: "xl"})
})

export default Cmd