import * as Discord from 'discord.js'
import * as ConfigFile from "../config"
const Guild = require('../GuildModel/guildSchema')
const mongoose = require('mongoose')

/***
**
* Create, Read, Update and Delete functions to be used for the guildSchema 
**
***/

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

//delete guild
export const deleteGuild = async (guild: Discord.Guild) => {
    await Guild.deleteOne({ guildID: guild.id}).then(console.log(`Guild '${guild.name} settings deleted.`))
}

//delete badWord if it is currently censored
export const deleteBadword = async (badWord: string, guild: Discord.Guild, settings: any) => {
    let badWordsArray = settings.badWords as string[]
    for(let i = 0; i < badWordsArray.length; i++){
        if(badWordsArray[i] === badWord){
            badWordsArray.splice(i, 1)
        }
    }
    
    try {
        const guildUpdate = {
            guildID: guild.id,
            guildName: guild.name,
            prefix: settings.prefix,
            badWords: badWordsArray
        };

        await Guild.findOneAndReplace(
            {guildID: guild.id},
            guildUpdate
        )
    }catch(err){
        console.log(err)
    }
}

export const reportCounterIncrement = async (guild: Discord.Guild) => {
    let data = await getGuild(guild)

    mongoose.set('useFindAndModify', false)
    let counterUpdate = {
        reports: [...data.reports, 'X']
    }
    await Guild.findOneAndUpdate(
        {guildID: guild.id},
        counterUpdate
    )
}

