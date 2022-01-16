import Discord, { MessageAttachment, MessageContextMenuInteraction, MessageEmbed, MessageInteraction } from "discord.js"
import axios from 'axios';
import Command from "../../classes/Commands/Command"
import Sharp from 'sharp';
import { getMaxUploadSize } from "../../utils/attachment";

const Cmd = new Command({
  enabled: true,
  name: "Render SVG",
  description: "",
  options: [],
  type: "MESSAGE"
}, async (client, _interaction, globals) => {
  const interaction = _interaction as MessageContextMenuInteraction;

  // todo: make this line less shit
  const files = interaction.targetMessage.attachments as Discord.Collection<string, Discord.MessageAttachment>;
  const svgs = files.filter((a: MessageAttachment) => a.contentType.includes("image/svg+xml"));

  if(svgs.size == 0) return interaction.reply({ephemeral: true, content: "No SVGs were found attached to that message"});
  await interaction.deferReply();
  // download the svg
  const raw = (await axios({ url: svgs.first().url, responseType: "arraybuffer" })).data as Buffer;
  
  // render the svg
  const sh = Sharp(raw)
    .png()
    .toBuffer()
    .then(d => {
      const attachment = new MessageAttachment(d, "rendered.png");
      if(attachment.size > getMaxUploadSize(interaction.guild)) return interaction.reply({ 
        content: `This render is too big to upload! (${(attachment.size / 1000000).toFixed(2).toString()}MB)`
      })
      
      interaction.editReply({ 
        files: [attachment]
      })
    })
    .catch(e => {
      console.log(e)
      interaction.reply({ 
        ephemeral: true,
        content: "Something went wrong rendering that SVG!"
      })
    })
})

export default Cmd