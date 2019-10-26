import * as Discord from "discord.js"
import * as ConfigFile from "../config" //need this for badwords[] defaults eventually
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

    if(message.content.startsWith(settings.prefix)) { handleCommand(message, settings) };

    
})