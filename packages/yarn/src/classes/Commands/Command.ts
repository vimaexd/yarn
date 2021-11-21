import Discord, { AutocompleteInteraction, CommandInteraction, Interaction } from "discord.js"
import { YarnGlobals } from "../../utils/types"

export interface CommandMeta {
    name: string,
    enabled: boolean,
    description: string,
    options?: Discord.ApplicationCommandOptionData[],
    type?: Discord.ApplicationCommandType,
    usage?: string
    autocomplete?: (interaction: AutocompleteInteraction, client: Discord.Client, globals: object) => any;
}

export default class Command {
    meta: CommandMeta
    run: (client: Discord.Client, interaction: CommandInteraction, globals: object) => any

    constructor(meta: CommandMeta, run: (client: Discord.Client, interaction: CommandInteraction, globals: YarnGlobals) => any){
        this.meta = meta
        this.run = run
    }
}