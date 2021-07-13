import Discord, { CommandInteraction, Interaction } from "discord.js"
import { YarnGlobals } from "../utils/types"

export interface CottonMeta {
    name: string,
    enabled: boolean,
    trigger?: Array<string>,
    description: string,
    options?: Discord.ApplicationCommandOption[],
    category?: string,
    usage?: string
}

export default class Cotton {
    client: Discord.Client
    meta: CottonMeta
    run: (client: Discord.Client, interaction: CommandInteraction, globals: object) => any

    constructor(meta: CottonMeta, run: (client: Discord.Client, interaction: CommandInteraction, globals: YarnGlobals) => any){
        this.meta = meta
        this.run = run
    }
}