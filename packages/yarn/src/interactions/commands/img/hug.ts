import dayjs from "dayjs";
import Discord, { MessageEmbed } from "discord.js"

import bank from '../../../banks/hug.json';
import RandomImageCommand from "../../../classes/Commands/RandomImageCommand";

const Cmd = new RandomImageCommand({
    enabled: true,
    name: "hug",
    description: "Hug someone! (displays a GIF)",
    options: [{
        name: "user",
        type: 'USER',
        description: "The person you want to give hugs to",
        required: false
    }],

    imageUrls: bank.links,
    responseTemplate: (s, t) => {
      return `**${s.user.username}** is hugging **${t.user.username}**!`;
    },
    responseTemplateSelf: (s) => {
      return `**${s.user.username}** has no one to hug, so they hug themselves instead...`;
    }
})

export default Cmd;