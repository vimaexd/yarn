import Discord, { TextChannel } from "discord.js"
import BooruCommand from "../../../classes/commands/BooruCommand"

const Cmd: BooruCommand = new BooruCommand({
    enabled: true,
    name: "e621",
    trigger: ["e621", "e6"],
    description: "Get images from e621.net",
    usage: "e621 [tags]",
    category: "NSFW"
}, async (client, message, args, globals) => Cmd.fetch("e621", args, message, client, globals))

export default Cmd