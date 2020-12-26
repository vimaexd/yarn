import Discord from "discord.js"
import Command from "../../classes/Command"

const Cmd = new Command({
    enabled: true,
    name: "ping",
    trigger: ["ping", "pong"],
    description: "Get the latency between the Bot and the Discord API.",
    usage: "ping",
    category: "Tools"
}, async (client, message, args, config) => {
    message.channel.send("pong")
})

export default Cmd