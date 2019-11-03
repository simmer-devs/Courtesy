import * as Discord from 'discord.js'
import * as ConfigFile from "../config"
import { getGuild } from './guildFunctions'
const mongoose = require('mongoose')
const Report = require('../ReportModel/reportSchema')
const Guild = require('../GuildModel/guildSchema')
const { client } = require("../index")



export const createReport = async (settings: any) => {
    let defaults = Object.assign({_id: mongoose.Types.ObjectId()}, ConfigFile.config.reportDefaultSettings)
    let merged = Object.assign(defaults, settings)

    const newMember = await new Report(merged)
    return newMember.save().then(console.log(`Default settings saved for report from member '${merged.userTag}' in guild '${merged.guildName}'`))
}

export const getReport = async (message: Discord.Message, reportNumber: Number) => {
    let data = await Report.findOne({ reportNumber: reportNumber, guildID: message.guild.id, userID: message.author.id })
    if(data) { return data }
    else return ConfigFile.config.reportDefaultSettings
}

export const updateReportTitle = async (message: Discord.Message, reportNumber: Number, update: any) => {
    mongoose.set('useFindAndModify', false)

    let data = getGuild(message.guild)

    let reportUpdate = {
        Title: update
    }
    
    await Report.findOneAndUpdate(
        {reportNumber: reportNumber, guildID: message.guild.id, userID: message.author.id},
        reportUpdate
    )
}

export const updateReportDescription = async (message: Discord.Message, reportNumber: Number, update: any) => {
    mongoose.set('useFindAndModify', false)

    let reportUpdate = {
        Description: update
    }
    
    await Report.findOneAndUpdate(
        {reportNumber: reportNumber, guildID: message.guild.id, userID: message.author.id},
        reportUpdate
    )
}

export const deleteReport = async (message: Discord.Message, reportNumber: Number) => {
    await Report.deleteOne(
        {reportNumber: reportNumber, guildID: message.guild.id, userID: message.author.id}
    )
}

export const buildReport = async (message: Discord.Message, reportNumber: Number) => {
    let embed = new Discord.RichEmbed()
            .setColor([206, 145, 190])
            .setTitle("Report to Server Moderators")
            .setAuthor('Courtesy', client.user.avatarURL)
            .setDescription(`Please enter a descriptive title for your report now.`)

    message.author.send(embed).then(async m=> {
        let msg = m as Discord.Message
        const filter = (f: Discord.Message) => f.author.id === message.author.id
        const collector = msg.channel.createMessageCollector(filter, {maxMatches: 1})

        collector.on('collect', async (res: Discord.Message) => {
            updateReportTitle(message, reportNumber, res.content)
            
            let embedNew = new Discord.RichEmbed()
                .setColor([206, 145, 190])
                .setTitle(`Report to Server: '${message.guild.name}' Moderators`)
                .setAuthor('Courtesy', client.user.avatarURL)
                .setDescription(`Please enter the full description of your report now.`)
            
            message.author.send(embedNew).then(async mess => {
                let bodyMess = mess as Discord.Message
                const bodyFilter = (bf: Discord.Message) => bf.author.id === message.author.id
                const bodyCollector = bodyMess.channel.createMessageCollector(bodyFilter, {maxMatches: 1})

                bodyCollector.on('collect', async (result: Discord.Message) => {
                    await updateReportDescription(message, reportNumber, result.content)
                    let confirm = new Discord.RichEmbed()
                        .setColor([206, 145, 190])
                        .setTitle(`Confirmation of Report to Server: '${message.guild.name}'`)
                        .setAuthor('Courtesy', client.user.avatarURL)
                        .setDescription(`You have provided the following information for your report: 
                                        Title: ${res.content}
                                        Body: ${result.content}
                                        
                                        Do you wish to confirm this information and send it to server administrators? To confirm react with ✅. If you wish to adjust this information please react with ❎, this will cancel the process and you will need to use the Report Command again.`)

                    message.author.send(confirm).then(async m => {
                        let confirmation = m as Discord.Message
                        let reportChannel = message.guild.channels.find(ch => ch.name === 'report-log') as Discord.TextChannel

                        await confirmation.react('✅')
                        await confirmation.react('❎')

                        const filter = (reaction:Discord.MessageReaction, user:Discord.User) => (reaction.emoji.name == "✅" || reaction.emoji.name === "❎" && user.id === message.author.id)
                        let reactFilter = confirmation.createReactionCollector(filter, {max: 1})

                        reactFilter.on('collect', async (reactRes) => {
                            switch(reactRes.emoji.name){
                                case '✅': {
                                    let adminNotification = new Discord.RichEmbed()
                                        .setColor([206, 145, 190])
                                        .setTitle(`Report Submitted by Server Member: ${message.member.user.tag}`)
                                        .setAuthor('Courtesy', client.user.avatarURL)
                                        .setDescription(`Title: ${res.content}
                                                        Body: ${result.content}`)
                                    reportChannel.send(adminNotification)
                                    break;
                                }
                                case '❎': {
                                    //also potentially allow for message attachments to be included in the report?
                                    let guildSettings = await getGuild(message.guild)
                                    console.log(guildSettings.reports)
                                    let abcdefg = guildSettings.reports.shift()
                                    console.log(guildSettings.reports)

                                    let reportArrayUpdate = {
                                        reports: guildSettings.reports
                                    }
                                    
                                    await Guild.findOneAndUpdate(
                                        {guildID: message.guild.id},
                                        reportArrayUpdate
                                    )
                                    await deleteReport(message, reportNumber)
                                    return;
                                }
                            }
                        })
                    })
                })
            })
        })   
    })
}