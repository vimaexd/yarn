import dayjs from "dayjs";
import { disq } from "../../utils/apis";
import Discord, { MessageEmbed } from "discord.js"
import Cotton from "../../classes/Cotton"

const Cmd = new Cotton({
    enabled: false,
    name: "disq",
    trigger: ["disq"],
    description: "Get data from Disq",
    usage: "disq",
    category: "Disq",
    options: [{
        name: "linkpage",
        type: "SUB_COMMAND",
        description: "Get info for a Linkpage",
        options: [{
          name: "code",
          description: "Get info for a Linkpage by the URL Code",
          type: "STRING"
        }]
    }]
}, async (client, interaction, globals) => {
  switch(interaction.options.first().name){
    case "linkpage":
      try {
        const res = await disq.get(`/profile/${interaction.options.first().options.first().value}`)
        const page = res.data.profile
        const embed = new Discord.MessageEmbed()
          .setTimestamp(dayjs().valueOf())
          .setTitle(page.username)
          .setURL(`https://disq.me/u/${page.url}`)
          .setDescription(page.bio)
          .setFooter(`Returned in ${dayjs().valueOf() - interaction.createdTimestamp * 1000}s`)
          .setThumbnail(page.pfp)
          .addField("Flags", Object.keys(page.flags.filter((k: boolean) => (k === true))).map(k => (k.charAt(0).toUpperCase() + k.slice(1))).join(", "))
          .addField("Links", page.links.map((l: {url: string}) => (l.url)).join("\n") )

        interaction.reply({embeds: [embed]})
      } catch(err: any) {
        interaction.reply({ephemeral: true, content: err.response.data.description || "An unknown error occured!"})
      }
  }
})

export default Cmd