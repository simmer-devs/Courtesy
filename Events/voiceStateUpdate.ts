import * as Discord from "discord.js"
const { client } = require("../index")

client.on('voiceStateUpdate', (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel

    if(oldUserChannel === undefined && newUserChannel !== undefined){
        console.log('joined voice channel')
        if(newUserChannel.id === '610861778460606468'){
        newMember.guild.createChannel(`${newMember.user.username}`, {type: 'voice', parent: '610861778460606467'}).then(channel => {
            newMember.setVoiceChannel(channel)
            })
        }
    } 
    else if(newUserChannel === undefined){
        console.log('left voice channel')
        if(oldUserChannel.name === `${oldMember.user.username}`){
            oldUserChannel.delete()
        }
    } 
    else if(newUserChannel !== undefined && oldUserChannel !== undefined){
        console.log('moved voice channels')
        if(newUserChannel.id === '610861778460606468'){
            newMember.guild.createChannel(`${newMember.user.username}`, {type: 'voice', parent: '610861778460606467'}).then(channel => {
                newMember.setVoiceChannel(channel)
                })
            }
        if(oldUserChannel.name === `${oldMember.user.username}`){
            oldUserChannel.delete()
        }
    }
})