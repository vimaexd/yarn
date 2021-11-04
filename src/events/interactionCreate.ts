import Discord, { AutocompleteInteraction, ButtonInteraction, CommandInteraction, MessageComponentInteraction } from "discord.js";
import Cotton from "../classes/Command"
import { YarnGlobals } from "../utils/types";

import BtnRolemenuHandler from '../interactions/buttons/rolemenu';

export default (_interaction: Discord.Interaction, client: Discord.Client, globals: YarnGlobals) => {
  let interaction;

  switch(_interaction.type){
    case "APPLICATION_COMMAND":
      interaction = _interaction as CommandInteraction;
      if(interaction.user.bot) return;
      let cmd: Cotton = globals.commands.get(interaction.commandName);

      if(!cmd) return;
      if(!cmd.meta.enabled) return;
      cmd.run(client, interaction, globals)
      break;
      
    // case "APPLICATION_COMMAND_AUTOCOMPLETE":
    //   interaction = _interaction as AutocompleteInteraction
    //   interaction.
    
    case "MESSAGE_COMPONENT":
      interaction = _interaction as MessageComponentInteraction
      switch(interaction.componentType){
        case "BUTTON":
          interaction = _interaction as ButtonInteraction
          if(interaction.customId.startsWith("rolemenu_")){
            BtnRolemenuHandler(client, interaction, globals)
          }
      }
  }
}