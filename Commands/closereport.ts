import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { getReport, deleteReport, getGuildReportByID, deleteGuildReportByID } from "../Handlers/reportFunctions";
const { client } = require('../index')

export default class closereport implements IBotCommand{
    
    private readonly _command = "closereport"
    
    help(): string[] {
        return [this._command,"Closes the indicated report by number."]
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, lient: Discord.Client, settings: any): Promise<void> {
        message.delete()

        let data = await getGuildReportByID(message, Number(args[0]))

        if(data === 'No report found.'){
            message.channel.send(`Good News ${message.author}! That report has already been closed or does not exist yet.`).then(m => (m as Discord.Message).delete(5000))
            return
        }

        let deleteEmbed = new Discord.RichEmbed()
            .setColor([206, 145, 190])
            .setDescription(`**Report#${data.reportNumber} Submitted By: <@${data.userID}>**\n**Title:** ${data.Title}\n\nAre you sure you wish to close this report? The data will be permanently deleted and this change will be reflected in the total number of open reports shown by using the \`${settings.prefix}totalreports\` command.\n\nPlease react with ✅ to close this report or ❎ to cancel.`)
            .setThumbnail(client.user.avatarURL)
        
        message.channel.send(deleteEmbed).then(async m => {
            let msg = m as Discord.Message

            await msg.react('✅')
            await msg.react('❎')

            let filter = (reaction: Discord.MessageReaction, user: Discord.User) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❎') && user.id === message.author.id
            let results = msg.createReactionCollector(filter, {max: 1})

            results.on('collect', async (res) => {
                switch(res.emoji.name){
                    case '✅': {
                        msg.delete()
                        message.channel.send('Ticket closed.').then(m => (m as Discord.Message).delete(5000))
                        await deleteGuildReportByID(message, Number(args[0]))
                        break;
                    }
                    case '❎': {
                        msg.delete()
                        message.channel.send('Ticket closing process cancelled.').then(m => (m as Discord.Message).delete(5000))
                        break;
                    }
                }
            })
        })
    } 
}