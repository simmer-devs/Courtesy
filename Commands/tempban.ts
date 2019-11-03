import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { deleteMember } from "../Handlers/memberFunctions";

export default class tempban implements IBotCommand{
    
    private readonly _command = "tempban"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void> {
        message.delete()
        let modChannel = message.guild.channels.find(ch => ch.name === 'courtesy-log') as Discord.TextChannel
        if(!message.member.hasPermission('BAN_MEMBERS')){
            message.channel.send(`Sorry ${message.author}, you do not have permission to ban users in this server.`)
        }

        let mentionedUser = message.mentions.users.first();
        args.shift()
        let time = Number(args[0])
        let timeMS = time*24*60*60*1000
        args.shift()
        let reason = args.join(' ')
        if(!reason){
            reason = 'No reason given.'
        }
        //update ban and unban embeds to look better, maybe with an emoji for bullet points 
        message.guild.ban(mentionedUser, {reason: reason}).then(member => {
            let bannedMember = member as Discord.GuildMember
            deleteMember(bannedMember)
            let modEmbed = new Discord.RichEmbed()
                    .setColor([206, 145, 190])
                    .setTitle("__Courtesy: Ban Moderator Report__")
                    .setAuthor('Courtesy', client.user.avatarURL)
                    .setDescription(`**User Temporarily Banned from ${message.guild.name}** \n**User Tag:** ${mentionedUser.tag} \n**User ID:** ${mentionedUser.id} \n**Ban Duration:** ${time} days \n**Reason Given:** ${reason}`)
                    .setTimestamp()
                modChannel.send(modEmbed)
        }).catch(err => {
            if(err){
                message.reply('Please provide a valid user ID to ban.').then(m => {(m as Discord.Message).delete(5000)})
                return
            }
        }) 
        
        setTimeout(() => {
            message.guild.unban(mentionedUser, 'Temporary ban lifted.')
            let unbanEmbed = new Discord.RichEmbed()
                .setColor([206, 145, 190])
                .setTitle('__Courtesy: Ban Moderator Report__')
                .setAuthor('Courtesy', client.user.avatarURL)
                .setDescription(`Temporary ban lifted on user: ${mentionedUser.tag}`)
            modChannel.send(unbanEmbed)
        }, timeMS)
    }
}