import dayjs from "dayjs";
import Discord, { MessageEmbed } from "discord.js"
import Command from "../../classes/Commands/Command"

import UInfoCommand from '../commands/utils/info/_userinfo';

const Cmd = new Command({
  enabled: true,
  name: "View user information",
  description: "",
  options: [],
  type: "USER"
}, async (client, interaction, globals) => {
  UInfoCommand(client, interaction, globals)
})

export default Cmd