const Discord = require("discord.js")
const meme = require('@blad3mak3r/reddit-memes')

module.exports.run = async (client, message, args) => {
    message.channel.startTyping()

    meme.getRandomMeme()
        .then(json => {
            const memeEmbed = new Discord.RichEmbed()
                    .setTitle(json.title)
                    .setImage(json.image)
                    .setFooter(`r/${json.subreddit}`)
                    .setColor("#24ed82")

            message.channel.send({embed: memeEmbed})
        })
        .catch(err => console.log(err))
    message.channel.stopTyping()
}

module.exports.help = {
    name: "meme",
    category: "fun",
    description: "Displays a meme from a meme subreddit.",
    usage: "+meme"
}