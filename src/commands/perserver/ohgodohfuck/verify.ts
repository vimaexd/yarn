import Discord, { MessageEmbed } from "discord.js"
import Command from "../../../classes/Command"

const Cmd = new Command({
    enabled: true,
    name: "OGOFVerify",
    trigger: ["ogofverify"],
    description: "Verify someone in OhGodOhFuck",
    usage: "verify [id]",
    category: "perserver"
}, async (client, message, args, globals) => {

    let godRoleId: string = "790371941160189952"
    let targetUserId: string = args[0] || message.mentions.members.first().id

    if(message.guild.id != "790369875116687371") return;
    if(!message.member.roles.cache.has(godRoleId)) return message.channel.send(":x: You do not have permission to use this command.")
    if(!targetUserId) return message.channel.send(`Please supply a UserID/tag to verify. Usage: \`${globals.prefix}\`ogofverify [userid/tag] `)

    let targetUser = await message.guild.members.fetch({ user: targetUserId, limit: 1 })
    if(!targetUser) return message.channel.send(`Invalid UserID/tag supplied! Usage: \`${globals.prefix}\`ogofverify [userid/tag] `)
    if(targetUser.roles.cache.has(godRoleId)) return message.channel.send("This user is already verified!")

    targetUser.roles.add(godRoleId)
    message.channel.send(`:white_check_mark: ${targetUser.user.tag} has been verified.`)
})

export default Cmd