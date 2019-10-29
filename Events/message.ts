import * as Discord from "discord.js"
import { handleImageAttachment, handleImageLink } from "../Handlers/imageModerator"
const { client } = require("../index")
const { handleCommand, loadCommands } = require('../Handlers/commandHandler')
const { getGuild } = require('../Handlers/dbFunctions')

loadCommands(`../Commands`)

client.on('message', async (message: Discord.Message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let settings;
    try{
        settings = await getGuild(message.guild)
    }catch(err){
        console.log(err)
    }

    //handling command
    if(message.content.startsWith(settings.prefix)) { handleCommand(message, settings) };
    
    //image moderation from direct attachments
    let attachmentArray = message.attachments.array()
    if(!attachmentArray) return;
    handleImageAttachment(attachmentArray, settings, message.guild)
    
    //image moderation from links in message content
    let msgArray = message.content.split(" ")
    let urlsArray = [] as string[]
    msgArray.forEach(msg => {
        if(msg.startsWith('https://') || msg.startsWith('http://')){
            urlsArray.push(msg)
        }
    })
    if(urlsArray[0] !== undefined) { handleImageLink(urlsArray, message.guild, settings, message) }
})