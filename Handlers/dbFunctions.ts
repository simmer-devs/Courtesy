import * as Discord from 'discord.js'
import * as ConfigFile from "../config"
const Guild = require('../Models/dbSchema')
const mongoose = require('mongoose')

/*
*
* Create, Read, Update and Delete functions to be used for the guildSchema 
*
*/

//search for guild
export const getGuild = async (guild: Discord.Guild) => {
    let data = await Guild.findOne({ guildID: guild.id})
    if(data) { return data }
    else return ConfigFile.config.defaultSettings
}

//update guild settings 
export const updateGuild = async (guild: Discord.Guild, settings: any) => {
    let data = await getGuild(guild)

    if(typeof data !== 'object') { data = {} }

    for(const key in settings){
        if(data[key] !== settings[key]) { data[key] = settings[key]}
        else { return }
    }

    console.log(`Guild '${data.guildName}' settings updated: ${Object.keys(settings)}`)
    return await data.updateOne(settings)
}

//create new guild, used in /Events/guildCreate.ts 
export const createGuild = async (settings: any) => {
    let defaults = Object.assign({_id: mongoose.Types.ObjectId()}, ConfigFile.config.defaultSettings)
    let merged = Object.assign(defaults, settings)

    const newGuild = await new Guild(merged)
    return newGuild.save().then(console.log(`Default settings saved for guild '${merged.guildName}' (${merged.guildID})`))
}