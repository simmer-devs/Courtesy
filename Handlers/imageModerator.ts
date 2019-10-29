import * as Discord from 'discord.js'
import { createWorker } from 'tesseract.js'
const { client } = require("../index")
const request = require('request')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

export const handleImageAttachment = (attachment: Discord.MessageAttachment[]/* image url to be analyzed */, settings: any/* Guild settings from getGuild in msg event */, guild: Discord.Guild) => {
    let modChannel = guild.channels.find(ch => ch.name === 'courtesy-log') as Discord.TextChannel
    
    const worker = createWorker()
    attachment.forEach(async (a: Discord.MessageAttachment) => {
        request.get(a.url)
            .on('error', console.error)
            .pipe(fs.createWriteStream(`../images/${a.id}.png`))
        
        const image = path.resolve(`../images/${a.id}.png`)

        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        
        let {data: {text}} = await worker.recognize(image)

        for(const key in settings.badWords){
            if(text.includes(settings.badWords[key])){
                a.message.delete()
                let modEmbed = new Discord.RichEmbed()
                    .setColor([206, 145, 190])
                    .setTitle("**__Courtesy: Image Moderator Report__**")
                    .setAuthor('Courtesy', client.user.avatarURL)
                    .setDescription(`**Violation by <@${a.message.author.id}>**\nOriginating Channel: ${a.message.channel}\nModerated Image: `)
                    .attachFiles([`../images/${a.id}.png`])
                    .setImage(`attachment://${a.id}.png`)
                    .setTimestamp()
                modChannel.send(modEmbed)
                a.message.author.send(modEmbed)
            }
        }
        
    })
    setTimeout(() => {
        worker.terminate()
        //console.log('worker terminated')
    }, 25000)
}

const validateUrl = (url: string) => {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null)
}

export const handleImageLink = async (urls: string[], guild: Discord.Guild, settings: any, message: Discord.Message) => {
    let modChannel = guild.channels.find(ch => ch.name === 'courtesy-log') as Discord.TextChannel

    const worker = createWorker()
    urls.forEach(async url => {
        let randNum = Math.floor(Math.random()*1000000)
    
        //validate the url for .jpeg .jpg .png or .gif at the end of the string else return
        let validate = validateUrl(url)
        if(validate === false) return
    
        request.get(url)
            .on('error', console.error)
            .pipe(fs.createWriteStream(`../images/${randNum}.png`))
        
        const image = path.resolve(`../images/${randNum}.png`)

        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')

        let {data: {text}} = await worker.recognize(image)
    
        for(const key in settings.badWords){
            if(text.includes(settings.badWords[key])){
                message.delete()
                let modEmbed = new Discord.RichEmbed()
                    .setColor([206, 145, 190])
                    .setTitle("**__Courtesy: Image Moderator Report__**")
                    .setAuthor('Courtesy', client.user.avatarURL)
                    .setDescription(`**Violation by <@${message.author.id}>**\nOriginating Channel: ${message.channel}\nModerated Image: `)
                    .attachFiles([`../images/${randNum}.png`])
                    .setImage(`attachment://${randNum}.png`)
                    .setTimestamp()
                modChannel.send(modEmbed)
                message.author.send(modEmbed)
            }
        }
    })
    setTimeout(() => {
        worker.terminate()
        //console.log('worker terminated')
    }, 25000)
}
