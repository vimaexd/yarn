import axios from "axios";
import Discord, { GuildMember, MessageEmbed } from "discord.js"
import Cotton from "../../classes/Cotton"
import dayjs from "dayjs";

const activities = [
  {
    name: "YouTube Together",
    slug: "youtube",
    aid: "755600276941176913"
  },
  {
    name: "Betrayal.io",
    slug: "betrayal",
    aid: "773336526917861400"
  },
  {
    name: "Poker Night",
    slug: "poker",
    aid: "755827207812677713"
  },
  {
    name: "Fishington.io",
    slug: "fishington",
    aid: "814288819477020702"
  },
  {
    name: "Chess in the Park",
    slug: "chess",
    aid: "832012774040141894"
  },
  /* datamined from the js but unsure what it is? */
  // {
  //   name: "Xbox",
  //   slug: "xbox",
  //   aid: "438122941302046720"
  // },
]

const Cmd = new Cotton({
    enabled: true,
    name: "activity",
    description: "Do activities in a voice channel!",
    options: [{
      name: 'type',
      description: 'What activity you would like to initiate',
      type: 'STRING',
      choices: activities.map(a => {
        return {"name": a.name, "value": a.slug}
      }),
      required: true
    }]
}, async (client, interaction, globals) => {
  const activityKey = interaction.options.getString('type')
  const activity = activities.find(a => (activityKey === a.slug))

  const member = await interaction.guild.members.fetch(interaction.user.id);
  if(!.voice.channelId) return interaction.reply({content: "You must be in a Voice Channel to use this command!", ephemeral: true});

  try {
    const res = await axios.post(
      `https://discord.com/api/v8/channels/${member.voice.channelId}/invites`, 
      JSON.stringify({
        max_age: 86400,
        max_uses: 0,
        target_application_id: activity.aid, // YouTube Together application ID
        target_type: 2,
        temporary: false,
        validate: null
      }),
      {
        headers: {
          "Authorization": `Bot ${client.token}`,
          "Content-Type": "application/json"
        }
      }
    )
    
    if(res.data.error) {
      console.log(res.data)
      throw "DiscordError"
    }

    return interaction.reply({
      content: `**${activity.name}** has been started! Click the link below to start:
      > <https://discord.gg/${res.data.code}>`
    });
  } catch(err: any) {
    console.log(err.response.data)
    return interaction.reply({content: "An error occured while trying to start that activity!", ephemeral: true});
  }
})

export default Cmd