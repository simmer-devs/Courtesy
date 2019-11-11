import * as Discord from 'discord.js'
import { createMember } from '../Handlers/memberFunctions'
const { client } = require("../index")
const { createGuild } = require('../Handlers/dbFunctions')

client.on('guildCreate', async (guild: Discord.Guild) => {
    let everyoneRole = guild.roles.get(guild.id) as Discord.Role
    
    guild.members.forEach(member => {
        let newMember = {
            userTag: member.user.tag,
            userName: member.user.username,
            userID: member.user.id,
            guildName: guild.name,
            guildID: guild.id,
            spamming: []
        }

        createMember(newMember)
    })
    
    let newGuildEmbed = new Discord.RichEmbed()
        .setColor([206, 145, 190])
        .setThumbnail(client.user.avatarURL)
        .setTitle('__Thanks for the invite!__')
        .setDescription(`I am Courtesy, a complete Discord community moderator. My features include:\n<:bullet:640379888607428632> Text moderation with customizable profanity filter.\n<:bullet:640379888607428632> Basic image moderation based on profanity filter words.\n<:bullet:640379888607428632> Ticket system for reporting to server Administration.\n\nThis moderation package includes various useful commands such as kick, ban, tempban and more. If you want to be able to use these commands on server members you must adjust the position of the 'Courtesy' role in your server settings to be above the roles which you want the bot to be able to ban.\n\nThe default prefix for Courtesy is \`!\`, and can be changed by using \`!settings prefix <prefix>\`. Use \`!help\` in any channel that Courtesy can access for an interactive help menu.\n\nFor more detailed documentation regarding command usage and permission requirements please visit:\n- https://github.com/simmer-devs/Courtesy\n\nWant to submit bugs or suggestions? Have questions? Join our support server:\n- https://discord.gg/cMCDsDF`)
        /*.setDescription(`I am Courtesy, a complete Discord community moderator. My features include:
                            <:bullet:640379888607428632> Text moderation with customizable profanity filter.
                            <:bullet:640379888607428632> Basic image moderation based on profanity filter words.
                            <:bullet:640379888607428632> Ticket system for reporting to server Administration.
                            
                        This moderation package includes various useful commands such as kick, ban, tempban and more. If you want to be able to use these commands on server members you must adjust the position of the 'Courtesy' role in your server settings to be above the roles which you want the bot to be able to ban.
                        
                        The default prefix for Courtesy is \`!\`, and can be changed by using '!settings prefix <prefix>'. Use '!help' in any channel that Courtesy can access for an interactive help menu.

                        For more detailed documentation regarding command usage and permission requirements please visit: 
                        - https://github.com/simmer-devs/Courtesy
                        
                        Want to submit bugs or suggestions? Have questions? Join our support server:
                        - https://discord.gg/cMCDsDF`)*/
    guild.owner.send(newGuildEmbed)
                
    try {
        const newGuild = {
            guildID: guild.id,
            guildName: guild.name
        };

        await createGuild(newGuild)
    }catch(err){
        console.log(err)
    }

    await guild.createChannel('Courtesy Log', {type: 'text'}).then(channel => {
        channel.overwritePermissions(everyoneRole, {
            'VIEW_CHANNEL': false
        })
        channel.overwritePermissions(client.user, {
            'VIEW_CHANNEL': true,
            'SEND_MESSAGES': true
        })
    })
    
    await guild.createChannel('Report Log', {type: 'text'}).then(channel => {
        channel.overwritePermissions(everyoneRole, {
            'VIEW_CHANNEL': false
        })
        channel.overwritePermissions(client.user, {
            'VIEW_CHANNEL': true,
            'SEND_MESSAGES': true
        })
    })
})