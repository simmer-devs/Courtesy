import * as Discord from 'discord.js'
const { client } = require("../index")
const { createGuild } = require('../Handlers/dbFunctions')

client.on('guildCreate', async (guild: Discord.Guild) => {
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


})