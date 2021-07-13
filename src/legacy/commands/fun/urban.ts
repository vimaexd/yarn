import dayjs from "dayjs";
import fetch from "node-fetch";
import Discord, { MessageEmbed } from "discord.js"
import Command from "../../../classes/Command"

const Cmd = new Command({
    enabled: true,
    name: "urban",
    trigger: ["urban", "urbandictionary"],
    description: "Get a definition from the Urban Dictionary",
    usage: "urban [term]",
    category: "Fun"
}, async (client, message, args, globals) => {
    try {
        let _term = args.join()
        if(!_term) return message.channel.send(":x: Please specify a term to search for")

        let res = await fetch(`https://api.urbandictionary.com/v0/define?term=${_term}`);
        let terms = await res.json();

        if(terms.list.length <= 0) return message.channel.send(`:x: No results found for \`${_term}\``)
        let term = terms.list[0]
        
        const urbanMatcher = /\[(.*?)\]/g;
        let embed = new MessageEmbed()
            .setTitle(term.word)
            .setDescription(`
            ${
                term.definition
                    .replace(urbanMatcher, (match: string, p1: string) => {
                        return `${match}(https://www.urbandictionary.com/define.php?term=${encodeURIComponent(p1)})`
                    }) 
            }
            
            *${
                term.example
                    .replace(urbanMatcher, (match: string, p1: string) => {
                        return `${match}(https://www.urbandictionary.com/define.php?term=${encodeURIComponent(p1)})`
                    }) 
            }*
            `)
            .setColor("#EFFF00")
            .setFooter(`Written by ${term.author} - 👍 ${term.thumbs_up} 👎 ${term.thumbs_down}`)
            .setTimestamp(dayjs().valueOf())
        message.channel.send({embed: embed})
    } catch(err) {
        console.log(err)
        message.channel.send(":warning: An error occured while getting that definition from Urban Dictionary!")
    }
})

export default Cmd