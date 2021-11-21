import dayjs from "dayjs";
import Discord, { DiscordAPIError, Emoji, Message, MessageEmbed } from "discord.js"
import Command from "../../../../classes/Commands/Command"

import UserInfo from './_userinfo'

export default new Command({
    enabled: true,
    name: "info",
    description: "Get information about anything on Discord",
    options: [{
      type: "SUB_COMMAND",
      name: "user",
      description: "Get information on a specific user",
      options: [{
        name: "user",
        type: 'USER',
        description: "The user to get info on"
      }]
    }]
}, async (client, interaction, globals) => {
  switch(interaction.options.getSubcommand()){
    case "user":
      UserInfo(client, interaction, globals)
      break;
  }
})