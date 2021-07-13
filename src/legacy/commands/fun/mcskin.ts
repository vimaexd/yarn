import fetch from "node-fetch";
import Discord, { MessageEmbed } from "discord.js"
import Command from "../../../classes/Command"

interface MojangUser extends Response {
    id: string;
    name: string;
}


const Cmd = new Command({
    enabled: true,
    name: "mcskin",
    trigger: ["mcskin"],
    description: "View someone's Minecraft skin",
    usage: "mcskin [username]",
    category: "Fun"
}, async (client, message, args, globals) => {

    let username = args[0];
    let opts = args.slice(0);
    let overlay: string = "";

    if(opts.includes("noouter")) overlay = "&overlay"

    if(!username) return message.channel.send("Please provide a Minecraft Username!");

    fetch(`https://api.mojang.com/profiles/minecraft`, {
        method: "POST",
        body: JSON.stringify([username]),
        headers: {
            "Content-Type": "application/json"
        }
    }) 
    .then(res => res.json())
    .then(userData => {
        let uuid: string | undefined;

        if(!userData[0].id) return message.channel.send("User does not exist!");
        uuid = userData[0].id

        let SkinEmbed = new Discord.MessageEmbed()
            .setTitle(`Minecraft Skin for ${username}`)
            .setImage(`https://crafatar.com/renders/body/${uuid}${overlay}`)
            .setColor(globals.config.embedColors.default)
            .setFooter("Yarn", client.user.displayAvatarURL())
            .setURL(`https://namemc.com/profile/${username}`)
        
        message.channel.send({embed: SkinEmbed})

    })
})

export default Cmd