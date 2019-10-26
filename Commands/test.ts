import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class test implements IBotCommand{
    
    private readonly _command = "test"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void> {
       console.log(message.guild.roles.map(r => r.id))
        message.delete()
        
    }
}
    
