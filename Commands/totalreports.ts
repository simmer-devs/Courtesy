import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { pullReports } from "../Handlers/reportFunctions";
const { client } = require('../index')

export default class totalreports implements IBotCommand{
    
    private readonly _command = "totalreports"
    
    help(): string[] {
        return [this._command,"Pulls information about the total amount of open reports."]
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, lient: Discord.Client, settings: any): Promise<void> {
        message.delete()
        if(!message.member.hasPermission('ADMINISTRATOR')){
            message.channel.send(`Sorry ${message.author}, you do not have the required permissions`).then(m => (m as Discord.Message).delete(5000))
            return
        }
        let reportLog = message.guild.channels.find(ch => ch.name === 'report-log') as Discord.TextChannel

        let data = await pullReports(message)
        let activeReports = data.length

        if(activeReports < 5){
            let basicTotalReports = new Discord.RichEmbed()
                .setTitle(`'${message.guild.name}' Server Report Summary`)
                .setThumbnail(client.user.avatarURL)
                .setColor([206, 145, 190])
                .setDescription(`**Hello! There are currently \`${activeReports}\` open reports for '${message.guild.name}'**\n\nThere are currently less than 5 reports available, information will be shown here as more reports are submitted.\n\nYou may use \`${settings.prefix}pullReport <#>\` to pull a report by its identifying number, allowing you to view the full report description. All reports can also be viewed in <#${reportLog.id}>\n\nOnce a report has been handled you may use \`${settings.prefix}closeReport <#>\` to close the report, removing it from the 'open reports' count for this server.`) 
            message.channel.send(basicTotalReports).then(async mess => {
                let msgg = mess as Discord.Message
                await msgg.react('🗑')
                let filterBasic = (reactionBasic: Discord.MessageReaction, userBasic: Discord.User) => reactionBasic.emoji.name === '🗑' && userBasic.id === message.author.id
    
                let resultBasic = msgg.createReactionCollector(filterBasic, {max: 1})
    
                resultBasic.on('collect', (ress) => {
                    msgg.delete()
                })
            })
            return
        }

        //need a fix for if less than five reports exist in the database
        let fiveRecentReports = {
            //most recent to least recent
            report1: {
                title: data[activeReports - 1].Title,
                description: data[activeReports - 1].Description,
                number: data[activeReports - 1].reportNumber,
                userID: data[activeReports - 1].userID
            },
            report2: {
                title: data[activeReports - 2].Title,
                description: data[activeReports - 2].Description,
                number: data[activeReports - 2].reportNumber,
                userID: data[activeReports - 2].userID
            },
            report3: {
                title: data[activeReports - 3].Title,
                description: data[activeReports - 3].Description,
                number: data[activeReports - 3].reportNumber,
                userID: data[activeReports - 3].userID
            },
            report4: {
                title: data[activeReports - 4].Title,
                description: data[activeReports - 4].Description,
                number: data[activeReports - 4].reportNumber,
                userID: data[activeReports - 4].userID
            },
            report5: {
                title: data[activeReports - 5].Title,
                description: data[activeReports - 5].Description,
                number: data[activeReports - 5].reportNumber,
                userID: data[activeReports - 5].userID
            }
        }
        
        let totalReports = new Discord.RichEmbed()
            .setTitle(`'${message.guild.name}' Server Report Summary`)
            .setThumbnail(client.user.avatarURL)
            .setColor([206, 145, 190])
            .setDescription(`**Hello! There are currently \`${activeReports}\` open reports for '${message.guild.name}'**\n\nThe following is an overview of the five most recent reports submitted by server members:\n\n<:bullet:640379888607428632> Report#${fiveRecentReports.report1.number} Submitted By: <@${fiveRecentReports.report1.userID}>\n**Title:** ${fiveRecentReports.report1.title}\n\n<:bullet:640379888607428632> Report#${fiveRecentReports.report2.number} Submitted By: <@${fiveRecentReports.report2.userID}>\n**Title:** ${fiveRecentReports.report2.title}\n\n<:bullet:640379888607428632> Report#${fiveRecentReports.report3.number} Submitted By: <@${fiveRecentReports.report3.userID}>\n**Title:** ${fiveRecentReports.report3.title}\n\n<:bullet:640379888607428632> Report#${fiveRecentReports.report4.number} Submitted By: <@${fiveRecentReports.report4.userID}>\n**Title:** ${fiveRecentReports.report4.title}\n\n<:bullet:640379888607428632> Report#${fiveRecentReports.report5.number} Submitted By: <@${fiveRecentReports.report5.userID}>\n**Title:** ${fiveRecentReports.report5.title}\n\nYou may use \`${settings.prefix}pullReport <#>\` to pull a report by its identifying number, allowing you to view the full report description. All reports can also be viewed in <#${reportLog.id}>\n\nOnce a report has been handled you may use \`${settings.prefix}closeReport <#>\` to close the report, removing it from the 'open reports' count for this server.`)
            /*.setDescription(`**Hello! There are currently \`${activeReports}\` open reports for '${message.guild.name}'** 
                            
                            The following is an overview of the five most recent reports submitted by server members:

                            <:bullet:640379888607428632> Report#${fiveRecentReports.report1.number} Submitted By: <@${fiveRecentReports.report1.userID}> 
                            **Title:** ${fiveRecentReports.report1.title}

                            <:bullet:640379888607428632> Report#${fiveRecentReports.report2.number} Submitted By: <@${fiveRecentReports.report2.userID}> 
                            **Title:** ${fiveRecentReports.report2.title}

                            <:bullet:640379888607428632> Report#${fiveRecentReports.report3.number} Submitted By: <@${fiveRecentReports.report3.userID}>
                            **Title:** ${fiveRecentReports.report3.title}

                            <:bullet:640379888607428632> Report#${fiveRecentReports.report4.number} Submitted By: <@${fiveRecentReports.report4.userID}>
                            **Title:** ${fiveRecentReports.report4.title}

                            <:bullet:640379888607428632> Report#${fiveRecentReports.report5.number} Submitted By: <@${fiveRecentReports.report5.userID}> 
                            **Title:** ${fiveRecentReports.report5.title}
                            
                            You may use \`${settings.prefix}pullReport <#>\` to pull a report by its identifying number, allowing you to view the full report description. All reports can also be viewed in <#${reportLog.id}>
                            
                            Once this report has been handled you may use \`${settings.prefix}closeReport <#>\` to close the report, removing it from the 'open reports' count for this server.`)*/
            .setTimestamp()
        message.channel.send(totalReports).then(async m => {
            let msg = m as Discord.Message
            await msg.react('🗑')
            let filter = (reaction: Discord.MessageReaction, user: Discord.User) => reaction.emoji.name === '🗑' && user.id === message.author.id

            let result = msg.createReactionCollector(filter, {max: 1})

            result.on('collect', (res) => {
                msg.delete()
            })
        })

        
    }
}