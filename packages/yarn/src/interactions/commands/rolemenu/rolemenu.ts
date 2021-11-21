import axios from "axios";
import Discord, { ButtonInteraction, GuildMember, MessageEmbed } from "discord.js"
import Command from "../../../classes/Commands/Command"
import dayjs from "dayjs";
import getGuild from "../../../db/utils/getGuild";

import { noBtn, deleteBtn } from '../../../utils/buttons';
import { generateButtons, generateMessage, generateRows} from './_generateButtons';

const Cmd = new Command({
    enabled: true,
    name: "rolemenu",
    description: "Create a reaction menu to let users self-assign roles",
    options: [
    {
      name: "post",
      type: "SUB_COMMAND",
      description: "Post a message with buttons which allows users to self-assign roles"
    },
    {
      name: "add",
      type: "SUB_COMMAND",
      description: "Add a role reaction to the role menu",
      options: [
        {
          name: "role",
          type: "ROLE",
          description: "The role to give a user when a button is clicked",
          required: true
        },
        {
          name: "text",
          type: "STRING",
          description: "The text displayed in the button",
          required: true
        },
        {
          name: "emoji",
          type: "STRING",
          description: "The emoji to use on the role button",
          required: true
        }
      ]
    },
    {
      name: "remove",
      type: "SUB_COMMAND",
      description: "Remove a role from the role menu",
      options: [
        {
          name: "role",
          type: "ROLE",
          description: "The role associated with a reaction button",
          required: true,
        }
      ]
    }]
}, async (client, interaction, globals) => {
  if(!(interaction.member as Discord.GuildMember).permissions.has("MANAGE_GUILD"))
    return interaction.reply({"content": ":x: You must have the **Manage Guild** permission to use this command!"})

  const guild = await getGuild(interaction.guild);

  switch(interaction.options.getSubcommand()){
    case "add":
      const customEmojiRGX = /<a?:.+?:.+?>/gm;
      const emojiRGX = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

      const role = interaction.options.getRole("role");
      const emoji = interaction.options.getString("emoji");
      const text = interaction.options.getString("text");

      // Validate emoji
      const isCustomEmoji = emoji.match(customEmojiRGX);
      const isUnicodeEmoji = emoji.match(emojiRGX);
      if(!isCustomEmoji && !isUnicodeEmoji) return interaction.reply({"content": "Invalid emoji provided!", ephemeral: true})

      // Validate text
      if(text.length > 60) return interaction.reply({"content": "Button title must be 1-60 characters", ephemeral: true})

      // Validate length of current thing
      if(guild.roleMenu.length + 1 > 25) return interaction.reply({"content": "You can only make a max of 25 role buttons!", ephemeral: true})

      await globals.db.guild.update({
        where: { id: guild.id },
        data: {
          roleMenu: {
            create: {
              role: role.id,
              emoji: emoji,
              text: text
            }
          }
        }
      })

      interaction.reply(`:white_check_mark: A button will now assign the **${role.name}** role.`)
      break;
    case "remove":
      const _target = guild.roleMenu.find(r => r.role);
      if(!_target) return interaction.reply({"content": "This role isn't attached to a button!", ephemeral: true})
    
      const collector = new Discord.InteractionCollector(client, { componentType: "BUTTON" })
    
      collector.on('collect', async (newInteraction) => {
        if(!newInteraction.isButton) return;
        
        const btnInteraction = (newInteraction as ButtonInteraction);
        if(!btnInteraction.message.interaction) return;
        if(interaction.id != btnInteraction.message.interaction.id) return;
        if(btnInteraction.member.user.id != interaction.member.user.id) return btnInteraction.reply("You can't push that!")
        
        switch(btnInteraction.customId){
          case "no":
            await interaction.deleteReply();
            break;
          
          case "yes":
            try {
              await globals.db.guild.update({
                where: { id: guild.id },
                data: {
                  roleMenu: {
                    delete: {
                      id: _target.id
                    }
                  }
                }
              })
        
              btnInteraction.update({ 
                content: `:white_check_mark: The reaction has been removed.`, 
                components: []
              })
            } catch(err) {
              console.log(err)
              btnInteraction.update({ 
                content: `:x: An error occured while trying to remove that button role!`, 
                components: []
              })
            }
        }
      })

      await interaction.reply({
        content: `Are you sure you want to do remove this role button?`,
        components: [new Discord.MessageActionRow().addComponents([deleteBtn, noBtn])]
      })
      break;
    case "post":
      const btns = generateButtons(guild.roleMenu);
      const rows = generateRows(btns);

      try {
        await interaction.channel.send(generateMessage(rows))
        interaction.reply({content: 'Message posted!', ephemeral: true})
      } catch(err) {
        console.log(err)
        interaction.reply({content: 'Error posting message! Does the bot have permissions to send messages here?', ephemeral: true})
      }
      break;
    default:
      interaction.reply(`nah it brokey`)

  }
})

export default Cmd