import { beatsaver } from "../../../utils/apis";
import Discord, { MessageEmbed } from "discord.js"
import Cotton from "../../../classes/Command"

import { generateMapButtons, generateMapEmbed } from './_shared'

const Cmd = new Cotton({
    enabled: true,
    name: "beatsaver",
    description: "Get information about the Minecraft server, Hypixel",
    options: [{
        name: "map",
        type: "SUB_COMMAND",
        description: "Get map using a map key",
        options: [{
          name: "key",
          description: "BeatSaver Map key",
          type: "STRING",
          required: true
        }]
    },
    {
      name: "search",
      type: "SUB_COMMAND",
      description: "Search for maps from BeatSaver",
      options: [{
        name: "query",
        description: "Search query",
        type: "STRING",
        required: true
      },
      {
        name: "automapped",
        description: "Specify whever to search for automapped maps or not",
        type: "BOOLEAN",
        required: true
      }]
     }]
}, async (client, interaction, globals) => {
  switch(interaction.options.getSubcommand()){
    case "map":
      const key = interaction.options.getString("key");
      beatsaver.get(`/maps/id/${key}`)
        .then(res => {
          const map = res.data;

          const embed = generateMapEmbed(map)
          const buttons = generateMapButtons(map)
          interaction.reply({embeds: [embed], components: buttons})
        })
        .catch(err => {
          console.log(err)
          console.log(err.response)
          if(err.response.status == 404) return interaction.reply({ephemeral: true, content: "Invalid map key!"})
          else interaction.reply({ephemeral: true, content: "An unexpected error occured getting that map from BeatSaver!"})
        })
      break;
    case "search":
      interaction.reply({ephemeral: true, content: "Coming soon! For now, only getting a map via key is supported."})
      break;
  }
})

export default Cmd;