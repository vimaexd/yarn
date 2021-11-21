import Discord, { AutocompleteInteraction, ButtonInteraction, CommandInteraction, MessageComponentInteraction } from "discord.js";
import Command from "../classes/Commands/Command"
import { YarnGlobals } from "../utils/types";

import BtnRolemenuHandler from '../interactions/buttons/rolemenu';

export default (_interaction: Discord.Interaction, client: Discord.Client, globals: YarnGlobals) => {
  try {
    let interaction;

    switch(_interaction.type){
      case "APPLICATION_COMMAND":
        interaction = _interaction as CommandInteraction;
        if(interaction.user.bot) return;
        let cmd: Command = globals.commands.get(interaction.commandName);
  
        if(!cmd) return;
        if(!cmd.meta.enabled) return;
        cmd.run(client, interaction, globals)
        globals.log.log(`${interaction.user.username}#${interaction.user.discriminator} ran command /${cmd.meta.name}`)
        break;
        
      case "APPLICATION_COMMAND_AUTOCOMPLETE":
        interaction = _interaction as AutocompleteInteraction
        let ac_cmd: Command = globals.commands.get(interaction.commandName);
        if(!ac_cmd) return;
        if(!ac_cmd.meta.enabled) return;
        if(!ac_cmd.meta.autocomplete) return;
        ac_cmd.meta.autocomplete(interaction, client, globals)
      
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
  } catch(err) {
    console.log(err)
  }
}