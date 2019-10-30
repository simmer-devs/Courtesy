import * as Discord from 'discord.js'
const { client } = require("../index")

export const handleText = (message: Discord.Message, settings: any) => {
    let modChannel = message.guild.channels.find(ch => ch.name === 'courtesy-log') as Discord.TextChannel
    
    for(const key in settings.badWords){
        //console.log(`${key}: ${settings.badWords[key]}`)
        if(message.content.toLowerCase().includes(settings.badWords[key])){
            message.delete()
            let modEmbed = new Discord.RichEmbed()
                    .setColor([206, 145, 190])
                    .setTitle("__Courtesy: Message Moderator Report__")
                    .setAuthor('Courtesy', client.user.avatarURL)
                    .setDescription(`**Violation by <@${message.author.id}>**\nOriginating Channel: ${message.channel}\nModerated Message: ${message.content}`)
                    .setTimestamp()
                modChannel.send(modEmbed)
                message.author.send(modEmbed)
        }
    }
}