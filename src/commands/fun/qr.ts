import jsQR from "jsqr";
import fetch from "node-fetch";
import Discord, { MessageEmbed } from "discord.js"
import Command from "../../classes/Command"

const Cmd = new Command({
    enabled: false,
    name: "qr",
    trigger: ["qr", "decodeqr", "qrcode"],
    description: "Decode a QR code easily!",
    usage: "qr [url of image OR image]",
    category: "Fun"
}, async (client, message, args, globals) => {
    let img: ArrayBuffer;

    if(message.attachments.size > 0){
        let res = await fetch(Array.from(message.attachments)[0].toString())
        img = await res.arrayBuffer()
    } else if(args[0]) {
        let res = await fetch(args[0])
        img = await res.arrayBuffer()
    } else {
        return message.channel.send(`No image provided to decode! Usage: \`${globals.prefix}qr [url of image OR image]\``)
    }


    // let embed = new MessageEmbed()
    //     .setTitle("About the bot")
    //     .setDescription("WIP")
    //     .setColor(globals.config.embedColors.default)
    // message.channel.send({embed: embed})
})

export default Cmd