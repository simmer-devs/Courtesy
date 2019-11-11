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

export const getGuildReportByID = async (message: Discord.Message, reportNumber: Number) => {
    let data = await Report.findOne({reportNumber: reportNumber, guildID: message.guild.id})
    if(data) { return data }
    else return 'No report found.'
}

export const pullReports = async (message: Discord.Message) => {
    let data = await Report.find({guildID: message.guild.id})
    if(data){ return data }
}

export const updateReportTitle = async (message: Discord.Message, reportNumber: Number, update: any) => {
    mongoose.set('useFindAndModify', false)

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

export const deleteGuildReportByID = async (message: Discord.Message, reportNumber: Number) => {
    await Report.deleteOne({reportNumber: reportNumber, guildID: message.guild.id})
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
                        .setDescription(`You have provided the following information for your report:\n\n**__Title:__** ${res.content}\n\n**__Body:__** ${result.content}\n\n\nDo you wish to confirm this information and send it to server administrators? To confirm react with ✅. If you wish to adjust this information please react with ❎, this will cancel the process and you will need to use the report command again.`) 

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
                                        .setAuthor('Courtesy', client.user.avatarURL)
                                        .setDescription(`**Report#${reportNumber} Submitted by: ${message.member.user}**\n\n__**Title:**__ ${res.content}\n\n__**Body:**__ ${result.content}`)
                                    reportChannel.send(adminNotification)
                                    
                                    let sentNotification = new Discord.RichEmbed()
                                        .setColor([206, 145, 190])
                                        .setTitle("Report Sent")
                                        .setAuthor('Courtesy', client.user.avatarURL)
                                        .setDescription(`Your report has successfully been sent to '${message.guild.name}' Discord Server Administration.`)
                                        .setFooter('Thank you!')
                                    reactRes.message.edit(sentNotification)
                                        
                                    break;
                                }
                                case '❎': {
                                    //also potentially allow for message attachments to be included in the report?
                                    let guildSettings = await getGuild(message.guild)

                                    //decerement the size of the reports array for guild report counter
                                    guildSettings.reports.shift()

                                    let reportArrayUpdate = {
                                        reports: guildSettings.reports
                                    }
                                    
                                    await Guild.findOneAndUpdate(
                                        {guildID: message.guild.id},
                                        reportArrayUpdate
                                    )
                                    await deleteReport(message, reportNumber)
                                    
                                    let cancelEmbed = new Discord.RichEmbed()
                                        .setColor([206, 145, 190])
                                        .setTitle(`Report Cancelled`)
                                        .setAuthor('Courtesy', client.user.avatarURL)
                                        .setDescription(`Please use the report command in the '${message.guild.name}' Discord Server if you wish to initiate a new report.`)
                                    reactRes.message.edit(cancelEmbed)
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