import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { deleteMember } from "../Handlers/memberFunctions";

export default class ban implements IBotCommand{
    
    private readonly _command = "ban"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void> {
        let mentionedUser = message.mentions.users.first();
        let suppliedReason = args.slice(1).join(" ") || "";
        let banLog = `${message.author.username}: ${suppliedReason}`;

        message.delete(0)

        if(!message.member.hasPermission("ADMINISTRATOR")){
            message.channel.send(`Sorry ${message.author}, you do not have the required permissions.`).then(msg => {(msg as Discord.Message).delete(4000)})
            return;
        }

        if(!mentionedUser){
            message.channel.send(`You must mention another user to enable the ban command ${message.author}.`).then(msg => {(msg as Discord.Message).delete(4000)})
            return;
        }
        
        try{
            if(message.member.hasPermission("ADMINISTRATOR")){
                message.guild.member(mentionedUser).send(`Hello ${message.guild.member(mentionedUser)} you have been banned from the ${message.guild.name} Discord server.`);
            }
        }
        catch(exception){
                console.log(exception)
            }
        
            
        setTimeout(() => {
            message.guild.member(mentionedUser).ban(banLog)
            .catch(console.error)

            deleteMember(message.member)
        }, 1000)
    }
}