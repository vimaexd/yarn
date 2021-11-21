import axios from "axios";
import Discord, { GuildMember, Message, MessageEmbed } from "discord.js"
import Command from "../../../classes/Commands/Command"
import dayjs from "dayjs";

/*
  NOTE
  disabled due to discord breaking this method :(
*/

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

const Cmd = new Command({
    enabled: false,
    name: "activity",
    description: "Do activities in a voice channel!",
    options: [{
      name: 'type',
      description: 'Which game you would like to play from the Discord Game Library',
      type: 'STRING',
      choices: activities.map(a => {
        return {"name": a.name, "value": a.slug}
      }),
      required: true
    },
    {
      name: "vc",
      description: "A voice channel to setup the activity for",
      type: "CHANNEL",
      required: true
    }]
}, async (client, interaction, globals) => {
  const activityKey = interaction.options.getString('type')
  const activity = activities.find(a => (activityKey === a.slug))

  const channel = interaction.options.getChannel("vc");
  if(channel.type != "GUILD_VOICE") return interaction.reply({content: "The channel input must be a Voice Channel. Stage Channels are not supported.", ephemeral: true})

  try {
    const res = await axios.post(
      `https://discord.com/api/v8/channels/${channel.id}/invites`, 
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