import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { updateGuild, deleteBadword } from "../Handlers/guildFunctions";

export default class settings implements IBotCommand{
    
    private readonly _command = "settings"
    
    help(): string[] {
        return [this._command,"Allows the server owner to customize the server prefix, spam filter and censor list."]
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void> {
        message.delete()
        if(message.author.id === message.guild.owner.id){
            //undefined checks for {prefix}settings command
            if(args[0] === undefined){
                message.channel.send(`Please use ${settings.prefix}help for possible settings customizations.`).then(m => (m as Discord.Message).delete(5000))
                return
            }
            const setting = args[0].toLowerCase()
            const settingUpdate = args.slice(1).join(' ').toLowerCase()
            
            switch(setting){
                case 'prefix': {
                    if(!settingUpdate){
                        message.channel.send(`Current Prefix: \`${settings.prefix}\``).then(m => (m as Discord.Message).delete(5000))
                        return;
                    }
                    try{
                        await updateGuild(message.guild, { prefix: settingUpdate })
                        message.channel.send(`Guild Prefix has been updated to: \`${settingUpdate}\``).then(m => (m as Discord.Message).delete(5000))
                    }catch(err){
                        message.channel.send(`An error occured: ${err.message}`).then(m => (m as Discord.Message).delete(5000))
                    }
                    break;
                }
                case 'censor': {
                    if(!settingUpdate){
                        message.channel.send(`Current censored words: ||${settings.badWords.join(', ')}||`).then(m => (m as Discord.Message).delete(10000))
                        return;
                    }
                    try{
                        await updateGuild(message.guild, { badWords: [...settings.badWords, settingUpdate]})
                    }catch(err){
                        console.log(err)
                    }
                    break;
                }
                case 'censorremove': {
                    if(!settingUpdate){
                        message.channel.send(`Please include a currently censored word to remove. Use '${settings.prefix}settings censor' to see a list of currently censored words.`).then(m => (m as Discord.Message).delete(5000))
                        return;
                    }
                    try{
                        await deleteBadword(settingUpdate, message.guild, settings)
                        return;
                    }catch(err){
                        console.log(err)
                    }
                }
                case 'spamfilter': {
                    if(!settingUpdate){
                        message.channel.send(`The current spam filter for this server is ${settings.spamFilter} messages in 10 seconds`).then(m => (m as Discord.Message).delete(5000))
                        return
                    }
                    try {
                        await updateGuild(message.guild, { spamFilter: settingUpdate})
                        message.channel.send(`Guild Spam Filter has been updated to: \`${settingUpdate}\``).then(m => (m as Discord.Message).delete(5000))
                    } catch(err){
                        console.log(err)
                    }
                }
            }
        }
        else{
            message.reply('you are not the server owner!').then(m => (m as Discord.Message).delete(5000))
        }
    }
}