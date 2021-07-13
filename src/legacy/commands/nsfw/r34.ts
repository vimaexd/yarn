import Discord, { TextChannel } from "discord.js"
import BooruCommand from "../../../classes/commands/BooruCommand"

const Cmd: BooruCommand = new BooruCommand({
    enabled: true,
    name: "rule34",
    trigger: ["rule34", "r34"],
    description: "Get images from rule34.xxx",
    usage: "rule34 [tags]",
    category: "NSFW"
}, async (client, message, args, globals) => Cmd.fetch("rule34", args, message, client, globals))

export default Cmd