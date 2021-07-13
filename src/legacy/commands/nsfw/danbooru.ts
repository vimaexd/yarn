import Discord, { TextChannel } from "discord.js"
import BooruCommand from "../../../classes/commands/BooruCommand"

const Cmd: BooruCommand = new BooruCommand({
    enabled: true,
    name: "danbooru",
    trigger: ["danbooru", "dan"],
    description: "Get images from danbooru.donmai.us",
    usage: "danbooru [tags]",
    category: "NSFW"
}, async (client, message, args, globals) => Cmd.fetch("danbooru", args, message, client, globals))

export default Cmd