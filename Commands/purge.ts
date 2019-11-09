import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class purge implements IBotCommand{
    
    private readonly _command = "purge"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void> {
        if(!message.member.hasPermission('ADMINISTRATOR')){
            message.channel.send(`Sorry ${message.author}, you do not have the required permissions.`).then(msg => {(msg as Discord.Message).delete(5000)})
            return;
        }
 
        if(!args[0]){
            message.channel.send(`Please include the number of messages to be deleted ${message.author}`).then(msg => {(msg as Discord.Message).delete(5000)})
            return;
        }
        
        let userDeleteRequest = Number(args[0])
         
        if(isNaN(userDeleteRequest))
        {
            message.channel.send(`This command requires a number ${message.author}`).then(msg => {(msg as Discord.Message).delete(5000)})
            return;  
        }
         
        else {
            userDeleteRequest = Math.round(userDeleteRequest)
             
            let deletedMessages = userDeleteRequest + 1
 
            message.channel.bulkDelete(deletedMessages)
            .catch(console.error)  
        }
    }
}
    