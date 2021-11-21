import dayjs from "dayjs";
import Discord, { MessageEmbed } from "discord.js"

import bank from '../../../banks/pat.json';
import RandomImageCommand from "../../../classes/Commands/RandomImageCommand";

const Cmd = new RandomImageCommand({
    enabled: true,
    name: "pat",
    description: "Give headpats to someone! (displays a GIF)",
    options: [{
        name: "user",
        type: 'USER',
        description: "The person you want to headpat",
        required: false
    }],

    imageUrls: bank.links,
    responseTemplate: (s, t) => {
      return `**${s.user.username}** is patting **${t.user.username}**!`;
    },
    responseTemplateSelf: (s) => {
      return `**${s.user.username}** wants headpats!`;
    }
})

export default Cmd;