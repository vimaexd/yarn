const booru = require("booru");
const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if(!message.channel.nsfw) return message.channel.send(":x: You can only use this command in an NSFW channel.")
    if(!args[0]) return message.channel.send(":warning: You need to provide a search tag - +r34 [tag]")
    
    let tagarray = [];
    tagarray.push("-lolita", "-shota");
    for(var i = 0; i > args.length; i++)
    {
        tagarray.push(args[i])
    }

    booru.search("rule34.xxx", tagarray, { limit: 1, random: true })
        .then(booru.commonfy)
        .then(images => {
            for (let image of images) {
                let imgRating = "";
                if (image.rating === "s") {
                    imgRating = "Safe";
                } else if (image.rating === "q") {
                    imgRating = "Questionable";
                } else if (image.rating === "e") {
                    imgRating = "Explicit";
                } else {
                    imgRating = "Unknown";
                }

                // message.channel.send(`**__<https://rule34.xxx/post/show/${image.id}>__**\n\n**🔞 Rating**: ${imgRating}\n**🏆 Score**: ${image.common.score}\n**📛 Tags**: \`\`${image.common.tags.join(" ")}\`\`\n\n${image.common.file_url}`);
                let r34Embed = new Discord.RichEmbed()
                    .setImage(image.common.file_url)
                    .setColor("#34363C")
                    .setFooter(`Rating: ${imgRating} | Score: ${image.common.score}`)
                message.channel.send({embed: r34Embed})
            }
        })
        .catch(err => {
            if (err.name === "booruError" && err.message === "You didn't give any images") {
                message.channel.send(":x: No results were found.");
            } else {
                console.log(err);
            }
        });
}

module.exports.help = {
    name: "r34",
    category: "nsfw",
    description: "Displays a specified hentai image from Rule34. No parameters will display a random image.",
    usage: "+r34 [search]"
}