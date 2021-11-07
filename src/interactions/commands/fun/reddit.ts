import dayjs from "dayjs";
import { reddit } from '../../../utils/apis'
import Discord, { MessageEmbed, TextChannel } from "discord.js"
import Cotton from "../../../classes/Command"
import Utils from "../../../classes/Utils";

const utils = new Utils();
const Cmd = new Cotton({
    enabled: true,
    name: "reddit",
    description: "Browse a subreddit",
    options: [{
        name: "subreddit",
        type: 'STRING',
        description: "The subreddit you would like to browse",
        required: true,
        autocomplete: true
    }],
    autocomplete: async (interaction, client, globals) => {
      try {
        const r = await reddit.post(`/api/search_reddit_names?include_over_18=false&query=${interaction.options.getString('subreddit')}`);
        interaction.respond(r.data.names.map((n: string) => ({
          "name": n,
          "value": n
        })))
      } catch(err) {
        console.log(err)
      }
    }
}, async (client, interaction, globals) => {
  const sub = await interaction.options.getString("subreddit").replace("r/", "");
  const r = reddit.get(`/r/${sub}/top?limit=500&t=day`)
    .then(res => {
      let posts = res.data.data.children
      if(!interaction.channel.isText || !(interaction.channel as TextChannel).nsfw){
        posts = posts.filter((p: any) => (p.data.over_18 == false))
      }

      if(posts.length <= 0) return interaction.reply("There are no posts in this subreddit!")
      const post = posts[utils.rng(0, posts.length)].data
      
      let description = "";
      if (post.selftext) description += post.selftext;
      description += `\n[**[Permalink]**](https://reddit.com${post.permalink})`
      
      let flair = "";
      if (post.link_flair_text) flair = `[${post.link_flair_text}]`;
      
      const embed = new Discord.MessageEmbed();
      embed.setAuthor(`${post.title} ${flair}`);
      embed.setImage(post.url);
      embed.setDescription(description);
      embed.setFooter(`u/${post.author} • 🔼 ${post.score} • 🗨️ ${post.num_comments}`);
      embed.setTimestamp(dayjs().valueOf());
      embed.setColor(`#FF4500`);

      interaction.reply({embeds: [embed]});
    })
    .catch(err => {
      interaction.reply('Error getting posts from reddit!');
      console.log(err);
    })
})

export default Cmd