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

