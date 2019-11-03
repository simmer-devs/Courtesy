import * as Discord from 'discord.js'
import * as ConfigFile from "../config"
const Member = require('../MemberModel/memberSchema')
const mongoose = require('mongoose')


/***
**
* Create, Read, Update and Delete functions to be used for the guildSchema 
**
***/

//create member used in guldMemberAdd event
export const createMember = async (settings: any) => {
    let defaults = Object.assign({_id: mongoose.Types.ObjectId()}, ConfigFile.config.memberDefaultSettings)
    let merged = Object.assign(defaults, settings)

    const newMember = await new Member(merged)
    return newMember.save().then(console.log(`Default settings saved for member '${merged.userTag}' (${merged.userID})`))
}

export const getMember = async (guild: Discord.Guild, member: Discord.GuildMember) => {
    let data = await Member.findOne({ userID: member.user.id, guildID: guild.id})
    if(data) { return data }
    else return ConfigFile.config.memberDefaultSettings
}

export const deleteMember = async (member: Discord.GuildMember) => {
    await Member.deleteOne({userID: member.user.id, guildID: member.guild.id}).then(console.log(`Member '${member.user.tag}' settings deleted.`))
}

//this works for now but needs to be improved, O(n^2) time complexity will not scale into large amounts of users well
export const updateSpam = async (client: Discord.Client) => {
    client.guilds.forEach(guild => {
        guild.members.forEach(async (member: Discord.GuildMember) => {
            const memberUpdate = {
                spamming: []
            }
    
            await Member.findOneAndUpdate(
                {userID: member.user.id, guildID: guild.id},
                memberUpdate
            )
        })
    })
}

