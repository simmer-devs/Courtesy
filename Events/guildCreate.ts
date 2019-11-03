import * as Discord from 'discord.js'
const { client } = require("../index")
const { createGuild } = require('../Handlers/dbFunctions')

client.on('guildCreate', async (guild: Discord.Guild) => {
    let everyoneRole = guild.roles.get(`${guild.id}`) as Discord.Role
    
    //update newGuildEmbed to look better
    let newGuildEmbed = new Discord.RichEmbed()
        .setColor([206, 145, 190])
        .setTitle('Thanks for the invite!')
        .setDescription(`I am Courtesy Bot, a complete Discord community moderator. My features include:
                            >Text moderation with customizable profanity filter.
                            >Basic image moderation based on profanity filter words.
                            >Ticket system for reporting community members to administraters as necessary.`)
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