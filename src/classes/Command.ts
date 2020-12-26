import Discord from "discord.js"
import { YarnGlobals } from "../utils/types"

interface CommandMeta {
    name: string,
    enabled: boolean,
    trigger: Array<string>,
    description: string,
    category: string,
    usage: string
}

export default class Command {
    meta: CommandMeta
    run: (client: Discord.Client, message: Discord.Message, args: Array<string>, globals: object) => any

    constructor(meta: CommandMeta, run: (client: Discord.Client, message: Discord.Message, args: Array<string>, globals: YarnGlobals) => any){
        this.meta = meta
        this.run = run
    }
}