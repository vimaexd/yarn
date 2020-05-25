const Discord = require("discord.js")
const osu = require("node-osu")

module.exports.run = async (client, message, args,) => {
  if(!args.join(" ")) return message.channel.send("You need to supply which user you want to get info for! - +osuuser [user]")

  const osuApi = new osu.Api(process.env.OSUTOKEN, {
    notFoundAsError: false, // Throw an error on not found instead of returning nothing. (default: true)
    completeScores: false, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
    parseNumeric: false // Parse numeric values into numbers/floats, excluding ids
  });

  osuApi.getUser({ u: args.join(" ") })
  .then(user => {
    if(user.length === 0) return message.channel.send(":x: We couldnt find that user, check if you spelt their name correctly")
    // console.log(user)
    let osuEmbed = new Discord.RichEmbed()
        .setTitle("osu! player info for " + args.join(" "))
        .addField("ID", user.id, true)
        .addField("PP", user.pp.raw, true)
        .addField("Country", user.country, true)
        .addField("Join Date", user.raw_joinDate, true )
        .addField("Accuracy", user.accuracyFormatted, true)
        .addField("Total Plays", user.counts.plays, true)
        // .addField("SS (Silver)", user.counts.SSH, true)
        // .addField("SS", user.counts.SS, true)
        // .addField("S (Silver)", user.counts.SH, true)
        // .addField("S", user.counts.S, true)
        // .addField("A", user.counts.A)

        // TODO: Replace characters with Custom Emoji
        .addField("Scores", `<:osuSSSilver:714277119500353617> ${user.counts.SSH}  <:osuSS:714277119319867394> ${user.counts.SS}  <:osuSSilver:714277119714394132> ${user.counts.SH}  <:osuS:714277119517261874> ${user.counts.S}  <:osuA:714277119328518155> ${user.counts.A}`)
        .setColor("#ff66aa")
    message.channel.send({embed: osuEmbed})
  })
  .catch(err => {
    message.channel.send(":x: Something went wrong!")
  })
}

module.exports.help = {
  name: "osuuser",
  category: "osu",
  description: "Displays osu! stats about a certain user.",
  usage: "+osuuser [username]"
}