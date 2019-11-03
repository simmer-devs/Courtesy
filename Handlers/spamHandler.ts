import * as Discord from 'discord.js'
const Member = require('../MemberModel/memberSchema')
const mongoose = require('mongoose')

export const handleSpam = async (message: Discord.Message, guild: Discord.Guild, memberSettings: any, guildSettings: any) => {
    mongoose.set('useFindAndModify', false) 
    if(memberSettings.spamming.length >= guildSettings.spamFilter){
        //log spamming/ban instance to moderation channel
        message.delete()
        message.member.ban({days: 7, reason: 'Spamming.'}).catch(err => console.log(err))
        return
    }

    try {
        const memberNewUpdate = {
            spamming: [...memberSettings.spamming, 'yes']
        };

        mongoose.set('useFindAndModify', false)
        await Member.findOneAndUpdate(
            {userID: message.member.user.id, guildID: guild.id},
            memberNewUpdate
        )
    }catch(err){
        console.log(err)
    }
}