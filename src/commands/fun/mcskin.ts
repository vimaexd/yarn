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

    let username = args[0];
    let opts = args.slice(0);
    let endpoint: string;

    if(opts.includes("noouter")) endpoint = "/armor/body"
    else endpoint = "/body"

    let SkinEmbed = new Discord.MessageEmbed()
        .setTitle(`Minecraft Skin for ${username}`)
        .setImage(`https://minotar.net/${endpoint}/${username}/200.png`)
        .setColor(globals.config.embedColors.default)
        .setFooter("Yarn", client.user.displayAvatarURL())
        .setURL(`https://namemc.com/profile/${username}`)
        
    message.channel.send({embed: SkinEmbed})
})

export default Cmd