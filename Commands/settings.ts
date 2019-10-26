import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { updateGuild } from "../Handlers/dbFunctions";

export default class settings implements IBotCommand{
    
    private readonly _command = "settings"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void> {
        message.delete()
        if(message.author.id === message.guild.owner.id){
            const setting = args[0]
            const settingUpdate = args.slice(1).join(' ')
            switch(setting){
                case 'prefix': {
                    if(!settingUpdate){
                        message.channel.send(`Current Prefix: \`${settings.prefix}\``)
                        return;
                    }
                    try{
                        await updateGuild(message.guild, { prefix: settingUpdate})
                        message.channel.send(`Guild Prefix has been updated to: \`${settingUpdate}\``)
                    }catch(err){
                        message.channel.send(`An error occured: ${err.message}`)
                    }
                    break;
                }
                default: {
                    message.channel.send('Please provide a setting to view/update')
                    break;
                } 
            }
        }
    }
}