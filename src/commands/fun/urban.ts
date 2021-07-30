import dayjs from "dayjs";
import { urban } from '../../utils/apis'
import Discord, { MessageEmbed } from "discord.js"
import Cotton from "../../classes/Cotton"

const Cmd = new Cotton({
    enabled: true,
    name: "urban",
    trigger: ["urban", "urbandictionary"],
    description: "Get a definition from urbandictionary.com",
    usage: "urban [term]",
    category: "Fun",
    options: [{
        name: "term",
        type: 'STRING',
        description: "The term to search from the Urban Dictionary",
        required: true
    }]
}, async (client, interaction, globals) => {
    try {
        let _term = interaction.options.getString("term");
        if(!_term) return interaction.reply({ephemeral: true, content: ":x: Please specify a term to search for"})

        let res = await urban.get(`/define?term=${_term}`);
        let terms = res.data;

        if(terms.list.length <= 0) return interaction.reply({ephemeral: true, content: `:x: No results found for \`${_term}\``})
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
        interaction.reply({embeds: [embed]})
    } catch(err) {
        console.log(err)
        interaction.reply({ephemeral: true, content: ":warning: An error occured while getting that definition from Urban Dictionary!"})
    }
})

export default Cmd