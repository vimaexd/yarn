import dayjs from "dayjs";
import Discord, { MessageEmbed } from "discord.js"
import Cotton from "../../classes/Command"

import UInfoCommand from '../commands/utils/info/_userinfo';

const Cmd = new Cotton({
  enabled: true,
  name: "View user information",
  description: "",
  options: [],
  type: "USER"
}, async (client, interaction, globals) => {
  UInfoCommand(client, interaction, globals)
})

export default Cmd