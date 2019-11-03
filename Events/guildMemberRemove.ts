import * as Discord from 'discord.js'
import { deleteMember } from '../Handlers/memberFunctions';
const { client } = require("../index")

client.on('guildMemberRemove', async (member: Discord.GuildMember) => {

        await deleteMember(member)
    
})