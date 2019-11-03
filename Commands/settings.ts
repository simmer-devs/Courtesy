import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { updateGuild, deleteBadword } from "../Handlers/guildFunctions";

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
            //undefined checks for {prefix}settings command
            if(args[0] === undefined){
                //include a current settings embed here showing the values of available settings that can be updated, prefix, badwords, spamFilter etc
                message.channel.send('Please provide a setting to view/update')
                return
            }
            const setting = args[0].toLowerCase()
            const settingUpdate = args.slice(1).join(' ').toLowerCase()
            
            switch(setting){
                case 'prefix': {
                    if(!settingUpdate){
                        message.channel.send(`Current Prefix: \`${settings.prefix}\``)
                        return;
                    }
                    try{
                        await updateGuild(message.guild, { prefix: settingUpdate })
                        message.channel.send(`Guild Prefix has been updated to: \`${settingUpdate}\``)
                    }catch(err){
                        message.channel.send(`An error occured: ${err.message}`)
                    }
                    break;
                }
                case 'censor': {
                    if(!settingUpdate){
                        message.channel.send(`Current censored words: ||${settings.badWords.join(', ')}||`)
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
                        message.channel.send(`Please include a currently censored word to remove. Use '${settings.prefix}settings censor' to see a list of currently censored words.`)
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
                        console.log(settings)
                        message.channel.send(`The current spam filter for this server is ${settings.spamFilter} messages in 10 seconds`)
                        return
                    }
                    //implement update spamfilter if setting update is provided, requires findoneandupdate
                }
            }
        }
        else{
            message.reply('you are not the server owner!').then(m => (m as Discord.Message).delete(5000))
        }
    }
}