import * as Discord from "discord.js"
import { handleImageAttachment, handleImageLink } from "../Handlers/imageModerator"
import { handleText } from "../Handlers/textModerator"
const { client } = require("../index")
const { handleCommand, loadCommands } = require('../Handlers/commandHandler')
const { getGuild } = require('../Handlers/dbFunctions')
const { handleSpam } = require('../Handlers/spamHandler')
const { getMember } = require('../Handlers/memberFunctions')


loadCommands(`../Commands`)

client.on('message', async (message: Discord.Message) => {
    
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let guildSettings;
    try{
        guildSettings = await getGuild(message.guild)
    }catch(err){
        console.log(err)
    }

    let memberSettings;
    try{
        memberSettings = await getMember(message.guild, message.member)
    } catch(err){
        console.log(err)
    }

    //run anti spam
    handleSpam(message, message.guild, memberSettings, guildSettings)

    //handling command
    if(message.content.startsWith(guildSettings.prefix)) { 
        handleText(message, guildSettings)
        handleCommand(message, guildSettings) 
    }
    //normal messages
    handleText(message, guildSettings)
    
    //image moderation from direct attachments
    let attachmentArray = message.attachments.array()
    if(!attachmentArray) return;
    handleImageAttachment(attachmentArray, guildSettings, message.guild)
    
    //image moderation from links in message content
    let msgArray = message.content.split(" ")
    let urlsArray = [] as string[]
    msgArray.forEach(msg => {
        if(msg.startsWith('https://') || msg.startsWith('http://')){
            urlsArray.push(msg)
        }
    })
    if(urlsArray[0] !== undefined) { handleImageLink(urlsArray, message.guild, guildSettings, message) }
})