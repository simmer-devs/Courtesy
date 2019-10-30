import * as Discord from 'discord.js'
const Member = require('../MemberModel/memberSchema')
const mongoose = require('mongoose')

export const handleSpam = async (message: Discord.Message, guild: Discord.Guild, memberSettings: any, guildSettings: any) => {
    //if memberSettings.spamming.length === guildSettings.spamFilter delete msg else update 
    if(memberSettings.spamming.length === guildSettings.spamFilter){
        message.delete()
        //update the database to empty spam filter after xx seconds with set timeout
        setTimeout(async () => {
            const memberUpdate = {
                spamming: []
            }

            await Member.findOneAndUpdate(
                {userID: message.member.user.id, guildID: guild.id},
                memberUpdate
            )
        }, 10)
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