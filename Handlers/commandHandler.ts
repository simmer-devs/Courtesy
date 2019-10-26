import * as Discord from "discord.js"
import * as ConfigFile from "../config"
import { IBotCommand } from "../api";
const { client } = require("../index")

export var commands: IBotCommand[] = [];
export const handleCommand = async (msg: Discord.Message, settings: any) => {
    //split string into command and args

    let command = msg.content.split(" ")[0].replace(settings.prefix, "").toLowerCase();
    let args = msg.content.split(" ").slice(1);
    
    for(const commandClass of commands){
        //attempt to execute code with safety
        try{
            if(!commandClass.isThisCommand(command)){
                //go next iteration if this isnt the correct command
                continue;
            }
            await commandClass.runCommand(args, msg, client, settings);
        }
        catch (exception){
            //if there is an error log exception
            console.log(exception);
        }
    }
}

export const loadCommands = (commandsPath: string) => {
    //exit if no commands
    if(!ConfigFile.config.commands || (ConfigFile.config.commands as string[]).length === 0) { return };

    //loop through commands in our config file
    for(const commandName of ConfigFile.config.commands as string[]){

        //Load the command class
        const commandsClass = require(`${commandsPath}/${commandName}`).default; 

        //cast as our custom IBotCommand interface
        const command = new commandsClass() as IBotCommand;

        //add to our commands list for later
        commands.push(command);
    }
}