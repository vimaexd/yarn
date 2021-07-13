import Discord, { TextChannel } from "discord.js"
import BooruCommand from "../../../classes/commands/BooruCommand"

const Cmd: BooruCommand = new BooruCommand({
    enabled: true,
    name: "hypnohub",
    trigger: ["hypnohub", "hypno"],
    description: "Get images from Hypnohub",
    usage: "hypnohub [tags]",
    category: "NSFW"
}, async (client, message, args, globals) => Cmd.fetch("hypnohub", args, message, client, globals))

export default Cmd