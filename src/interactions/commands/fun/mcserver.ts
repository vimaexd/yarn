import dayjs from "dayjs";
import axios from "axios";
import Discord, { MessageEmbed } from "discord.js"
import Cotton from "../../../classes/Command"
import { inputToUuid } from "./hypixel";

const Cmd = new Cotton({
    enabled: true,
    name: "minecraft",
    description: "Get details about Minecraft",
    options: [{
        name: "server",
        type: "SUB_COMMAND",
        description: "Get the status of a Minecraft: Java Edition server",
        options: [{
            name: "address",
            type: 'STRING',
            description: "Minecraft server IP",
            required: true
        }]
    },
    {
        name: "player",
        type: "SUB_COMMAND",
        description: "Get the player data of a Minecraft player",
        options: [{
            name: "player",
            type: 'STRING',
            description: "Username/UUID",
            required: true
        }]
    }]
}, async (client, interaction, globals) => {
    switch(interaction.options.getSubcommand()){
        case "server":
            try {
                let adr = interaction.options.getString("address");
        
                let res = await axios.get(`https://api.mcsrvstat.us/2/${adr}`);
                let server = res.data;
        
                let embed = new MessageEmbed()
                    .setTitle(server.hostname || server.ip)
                    .setColor("#db1f29")
                    .setTimestamp(dayjs().valueOf())
                    .setThumbnail(`https://api.mcsrvstat.us/icon/${adr}`)
        
                if(server.online){
                    embed
                        .setDescription(server.motd.raw.toString().replace(/§./g, "").replace(",", "\n"))
                        .setFooter(`${(server.software !== undefined) ? server.software : "Minecraft"} - ${(server.version)}`);
                        
                    (server.players.list) && embed.addField(`
                        Players online (${server.players.online}/${server.players.max})`, 
                        (server.players.list as string[]).join(", ")
                    );
                    (server.plugins) && embed.addField("Plugins", (server.plugins.names as string[]).join(", "));
                } else {
                    embed
                        .setDescription("Server is offline")
                }
            
                interaction.reply({embeds: [embed]})
            } catch(err) {
                console.log(err)
                interaction.reply({ephemeral: true, content: ":warning: An error occured while getting that Minecraft Server Status!"})
            }

        case "player":
            const uuid = await inputToUuid(interaction.options.getString("player"))
            if(!uuid) return interaction.reply({ephemeral: true, content: "Invalid UUID/Username entered"})
            
            try {
                const _names = await axios.get(`https://api.mojang.com/user/profiles/${uuid}/names`)
                const names = _names.data;
                console.log(names)
                if(names.error) throw "MojangError";

                const row = new Discord.MessageActionRow()
                const btn = new Discord.MessageButton()
                    .setStyle("LINK")
                    .setURL(`https://namemc.com/profile/${uuid}`)
                    .setLabel("NameMC")
                row.addComponents([btn])
    
                const currentName = names[names.length - 1].name
                const embed = new Discord.MessageEmbed()
                    .setAuthor(currentName, `https://crafatar.com/avatars/${uuid}`)
                    .setThumbnail(`https://crafatar.com/renders/body/${uuid}?overlay=true&scale=10`)
                    .addField("Name History", names.map((n: any) => {
                        const bold = ((n.name == currentName) ? "**" : "")
                        return `${bold}${n.name}${bold} ${(n.changedToAt) ? `(Changed <t:${Math.floor(n.changedToAt / 1000)}:R>)` : ''}`
                    }).join("\n"))
                    .addField("Details", `
                        UUID - \`${uuid}\`
                    `)
                    .setColor("#db1f29")
                    .setTimestamp(dayjs().valueOf())
                
                interaction.reply({embeds: [embed], components: [row]})
            } catch(err) {
                console.log(err)
                interaction.reply({ephemeral: true, content: ":warning: An error occured while fetching that player!"})
            }

    }
})

export default Cmd