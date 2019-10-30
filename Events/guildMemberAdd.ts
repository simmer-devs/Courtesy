import * as Discord from 'discord.js'
import { createMember } from '../Handlers/memberFunctions';
const { client } = require("../index")

client.on('guildMemberAdd', async (member: Discord.GuildMember) => {
    try {
        const newMember = {
        
            userTag: member.user.tag,
            userName: member.user.username,
            userID: member.user.id,
            guildName: member.guild.name,
            guildID: member.guild.id,
            spamming: []
        };

        await createMember(newMember)
    }catch(err){
        console.log(err)
    }
})