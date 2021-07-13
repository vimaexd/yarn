import Discord, { CommandInteraction, MessageComponentInteraction } from "discord.js";
import Cotton from "../classes/Cotton"
import { YarnGlobals } from "../utils/types";

import BeatSaverButtonHandler from '../commands/beatsaver/_btn';

export default (_interaction: Discord.Interaction, client: Discord.Client, globals: YarnGlobals) => {
  let interaction;

  switch(_interaction.type){
    case "APPLICATION_COMMAND":
      interaction = _interaction as CommandInteraction;
      if(interaction.user.bot) return;
      let cmd: Cotton = globals.cottons.get(interaction.commandName);

      if(!cmd) return;
      if(!cmd.meta.enabled) return;
      cmd.run(client, interaction, globals)
      break;

    case "MESSAGE_COMPONENT":
      interaction = _interaction as MessageComponentInteraction;
      if(!interaction.isButton()) return;

      switch(interaction.customId){
        case "beatsaver_nextpage":
        case "beatsaver_prevpage":
          BeatSaverButtonHandler(interaction)
          break;
          
        default:
          return;
      }
  }
}