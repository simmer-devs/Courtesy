import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class hackban implements IBotCommand{
    
    private readonly _command = "hackban"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void> {
        message.delete()
        if(message.author.id !== message.guild.owner.id){
           message.channel.send(`Sorry ${message.author}, only the server owner can use this command.`).then(m => {(m as Discord.Message).delete(5000)})
           return
        }

        let userID = args[0]
        args.shift()
        let reason = args.join(' ')
       
        message.guild.ban(userID, {reason: reason}).then(member => {
            //perhaps log to the generated courtesy-log channel for clarity
            message.channel.send(`User banned by ID: **${userID}** with reason: **${reason}**`).then(m => {(m as Discord.Message).delete(5000)})
        }).catch(err => {
            if(err){
                message.reply('Please provide a valid user ID to ban.').then(m => {(m as Discord.Message).delete(5000)})
                return
            }
        })  
    }
}