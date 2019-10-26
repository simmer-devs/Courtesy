import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class emit implements IBotCommand{
    
    private readonly _command = "emit"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client): Promise<void> {
       client.emit('guildCreate', message.guild)
    }
}