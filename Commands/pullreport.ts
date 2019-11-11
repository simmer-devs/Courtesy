import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { getGuildReportByID } from "../Handlers/reportFunctions";

const { client } = require('../index')

export default class pullreport implements IBotCommand{
    
    private readonly _command = "pullreport"
    
    help(): string[] {
        return [this._command,"Pulls the indicated report by number."]
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, lient: Discord.Client, settings: any): Promise<void> {
        message.delete()

        let reportData = await getGuildReportByID(message, Number(args[0]))
        if(reportData === 'No report found.'){
            message.channel.send(`Good News ${message.author}! That report has already been closed or does not exist yet.`).then(m => (m as Discord.Message).delete(5000))
            return
        }
        
        let pulledReport = new Discord.RichEmbed()
            .setColor([206, 145, 190])
            .setAuthor('Courtesy', client.user.avatarURL)
            .setDescription(`**Report#${reportData.reportNumber} Submitted By: <@${reportData.userID}>**\nReport Pulled By: ${message.author}\n\n__**Title:**__ ${reportData.Title}\n\n__**Body:**__ ${reportData.Description}`)
        message.channel.send(pulledReport).then(async m => {
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