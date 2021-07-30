import * as fs from "fs";
import * as path from "path";
import * as Discord from "discord.js";
import ora, { Ora } from "ora";
import { YarnGlobals, YarnInteractionObject } from "./utils/types"
import { globals } from './index';
import Cotton from "./classes/Cotton";

/**
 * @classdesc Command & event loader for Yarn
 * @param client Discord Client instance
 */

class Loaders {
    private client: Discord.Client
    speen: Ora
    cmdCount: number;
    
    constructor(client: Discord.Client){
        this.client = client;
        this.cmdCount = 0;
    }

    /**
     * Loads interactions (commands v2) with .js and .ts extension in folder recursively
     * @param directory Directory of commands (usually "commands")
     */
    loadInteractions = async (directory: string, noAnnounce: boolean) => {
        let spinner;
        if(!noAnnounce) spinner = ora(`Loading cottons in folder ${directory.replace(__dirname, "").replace(path.sep, "")}`).start()
        await this.loadInteractionFolder(directory)
        spinner.stopAndPersist({text: `Cottons loaded!  `, symbol: "🌟"})
    }
    
    private loadInteractionFolder = async (directory: string) => {
        fs.readdir(directory, {withFileTypes: true}, async (err, files: fs.Dirent[]) => {
            if(err) throw err;
            if(files.length < 0) return console.log(`No files to load in ${directory}`)

            files.forEach(async (f: fs.Dirent) => {
                if(f.isDirectory()) return this.loadInteractionFolder(path.join(directory, f.name))
                let cmdSpinner = ora(`Loading interaction ${f.name}`)
                const cmdLoadStatus = await this.loadInteractionFile(f, directory)

                if(cmdLoadStatus === "disabled") return cmdSpinner.info(`Interaction ${f.name} is disabled`)
                if(cmdLoadStatus === "subcmd") return cmdSpinner.info(`Interaction ${f.name} is not an interaction`)
                if(!cmdLoadStatus) return cmdSpinner.fail(`Error loading interaction ${f.name}!`)
                else cmdSpinner.succeed(`Loaded interaction ${f.name}!`)
            })
        })
    }

    private loadInteractionFile = async (f: fs.Dirent, dir: string): Promise<string | boolean> => {
        let fileExtension = f.name.split(".")[f.name.split(".").length - 1]
        let moduleName = f.name.replace(".js", "")

        if(!f.name.endsWith(".js") && !f.name.endsWith(".ts") || f.name.endsWith(".map")) return;
        if(f.name.split("")[0] == "_") return "subcmd";
    
        try {
            const cmd: YarnInteractionObject = await import(path.join(dir, moduleName))
            if(!cmd.default.meta.enabled) return "disabled";
            globals.cottons.set(cmd.default.meta.name, cmd.default)
            return true;
        } catch(err) {
            console.log(err)
            return false;
        }
    }

    updateSlashCommands = async (client: Discord.Client) => {
        let spinner = ora(`Updating Slash commands`).start()
        try {
            if (!this.client.application?.owner) await this.client.application?.fetch();

            let data: Discord.ApplicationCommandData[] = []
            let dev_data: Discord.ApplicationCommandData[] = []

            globals.cottons.forEach((value: Cotton, key: string) => {
                if(value.meta.category === "dev") return dev_data.push({
                    name: value.meta.name,
                    description: value.meta.description,
                    options: value.meta.options
                });

                data.push({
                    name: value.meta.name,
                    description: value.meta.description,
                    options: value.meta.options
                })
            })
            if(globals.env === "development") {
                const devsrv = await client.guilds.fetch(globals.config.serverId)
                await devsrv.commands.set(data.concat(dev_data));
            }
            await this.client.application?.commands.set(data);
        } catch(err) {
            console.log(err)
            spinner.fail("Error updating slash commands!")
        } finally {
            spinner.succeed("Slash commands updated!")
        }
    }

    /**
     * Loads events from .js or .ts files in one folder.
     * @param directory Directory of events (usually "events")
     */
    loadEvents = async (directory: string, client: Discord.Client): Promise<void> => {
        const speen = ora(`Loading events in folder ${directory.replace(__dirname, "").replace(path.sep, "")}`).start()

        fs.readdir(directory, {withFileTypes: true}, async (err, files: fs.Dirent[]) => {
            if(err) throw err;
            if(files.length === 0) return speen.stopAndPersist({text: ` No events to load  `, symbol: "⚠️"})
    
            let processed = 0, loaded = 0;

            files.forEach((f: fs.Dirent) => {
                let fileExtension = f.name.split(".")[f.name.split(".").length - 1]
                let moduleName = f.name.replace(".js", "").replace(".ts", "")
    
                processed++;

                if(f.isDirectory()) return;
                if(!f.name.endsWith(".js") && !f.name.endsWith(".ts")) return;
    
                let eventSpinner = ora(`Loading event ${f.name}`)
                let relativePath = directory.split(path.sep).slice(directory.split(path.sep).indexOf("commands")).join("/")
    
                import("./" + path.join(relativePath, moduleName))
                    .then((event) => {
                        loaded++;
                        this.client.on(moduleName, (...args) => event.default(...args, client, globals));
                        eventSpinner.succeed(`Loaded event ${f.name}`);
                    })
                    .catch((err) => {
                        eventSpinner.fail(`Error loading event ${f.name}!`)
                        console.log(err)
                    })
                    
                speen.text = `${loaded} events loaded!  `

                if(processed === files.length) speen.stopAndPersist({symbol: "🌟"})
            })
        })
    }

    /**
    * Loads jobs from .js or .ts files in one folder.
    * @param directory Directory of events (usually "events")
    */
    loadJobs = async (directory: string, client: Discord.Client): Promise<void> => {
        const speen = ora(`Loading jobs in folder ${directory.replace(__dirname, "").replace(path.sep, "")}`).start()

        fs.readdir(directory, {withFileTypes: true}, async (err, files: fs.Dirent[]) => {
            if(err) throw err;
            if(files.length === 0) return console.log(`No files to load in ${directory}`)
    
            let loaded = 0;

            files.forEach((f: fs.Dirent) => {
                let fileExtension = f.name.split(".")[f.name.split(".").length - 1]
                let moduleName = f.name.replace(".js", "").replace(".ts", "")
    
                if(f.isDirectory()) return;
                if(!f.name.endsWith(".js") && !f.name.endsWith(".ts")) return;
    
                let eventSpinner = ora(`Loading event ${f.name}`)
                let relativePath = directory.split(path.sep).slice(directory.split(path.sep).indexOf("commands")).join("/")
    
                import("./" + path.join(relativePath, moduleName))
                    .then((job) => {
                        setInterval(job.run, job.delay, [client])
                        eventSpinner.succeed(`Loaded job ${f.name}`)
                    })
                    .catch((err) => {
                        eventSpinner.fail(`Error loading job ${f.name}!`)
                        console.log(err)
                    })

                loaded++;
                if(loaded == files.length) speen.stopAndPersist({text: "Events loaded!  ", symbol: "🌟"})
            })
        })
    }

    cry(){
        console.log(";w;")
    }
}

export default Loaders;