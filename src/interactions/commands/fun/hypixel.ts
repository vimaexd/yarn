import { hypixel } from "../../../utils/apis";
import axios from "axios";
import Discord, { MessageEmbed } from "discord.js"
import Cotton from "../../../classes/Command"
import dayjs from "dayjs";

/**
 * A function to get a Minecraft UUID from user input
 */
export const inputToUuid = async (input: string): Promise<string> => {
  console.log(input)
  const isValid = new RegExp(/([0-9A-Z]{8})-?([0-9A-Z]{4})-?([0-9A-Z]{4})-?([0-9A-Z]{4})-?([0-9A-Z]{12})/i)
    .test(input)

  if(isValid){
    // replace dashes with "" for mojang api use
    return input.replace("-", "")
  } else {
    // try checking if it's a username
    try {
      const resp = await axios.get(`/users/profiles/minecraft/${input}`, { baseURL: "https://api.mojang.com" })
      if(resp.data.id) return resp.data.id
      if(resp.data.error) return ""
      if(!resp.data.id) return ""
    } catch {
      return ""
    }
  }
}

const cleanRankName = (input: string) => {
  switch(input){
    case "VIP":
      return "[VIP]";
    
    case "VIP_PLUS":
      return "[VIP+]";
    
    case "MVP":
      return "[MVP]";
    
    case "MVP_PLUS":
      return "[MVP+]";
    
    default:
      return "";
  }
}

const Cmd = new Cotton({
    enabled: true,
    name: "hypixel",
    description: "Get information about the Minecraft server, Hypixel",
    options: [{
        name: "player",
        type: "SUB_COMMAND",
        description: "Get player information",
        options: [{
          name: "user",
          description: "Minecraft Username/UUID",
          type: "STRING",
          required: true
        }]
    }]
}, async (client, interaction, globals) => {
  switch(interaction.options.getSubcommand()){
    case "player":
      const uuid = await inputToUuid(interaction.options.getString("user"))
      if(!uuid) return interaction.reply({ephemeral: true, content: "Invalid Username/UUID supplied!"}) 

      hypixel.get('/player', { 
        params: { uuid }
      })
      .then(resp => {
        const player = resp.data.player
        const packageRank = cleanRankName(player.newPackageRank)
        const rank = (player.rank) ? `[${player.rank}]` : ""

        const _level = Object.keys(player)
          .filter(k => k.includes("levelingReward"))
          .sort((a: string, b: string) => {
            return parseInt(b.split("_")[1]) - parseInt(a.split("_")[1])
          })

        const level = (_level.length > 0) ? +_level[0].split("_")[1] : 0

        const embed = new Discord.MessageEmbed()
          .setAuthor(`${player.displayname} ${packageRank} ${rank}`, `https://crafatar.com/avatars/${uuid}`)
          .setDescription(`
            Level - **${level}**
            Karma - **${player.karma}**

            First Login - **<t:${Math.floor(player.firstLogin / 1000)}:R>**
            Last Login - **<t:${Math.floor(player.lastLogin / 1000)}:R>**
          `)
          .setTimestamp(dayjs().valueOf())
          .setColor("#f4c039")
        interaction.reply({embeds: [embed]})
      })
      .catch(err => {
        if(err.response && err.response.data.cause == "Malformed UUID")
          return interaction.reply({ephemeral: true, content: "Invalid Username/UUID supplied!"})

        interaction.reply({ephemeral: true, content: "An error occured while fetching the Hypixel API!"})
        console.log(err)
      })
  }
})

export default Cmd