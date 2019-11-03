import * as Discord from 'discord.js'
const { client } = require("../index")

export const handleText = (message: Discord.Message, guildSettings: any) => {
    let modChannel = message.guild.channels.find(ch => ch.name === 'courtesy-log') as Discord.TextChannel
    
    //if(message.author.id === message.guild.owner.id){ return }

    for(const key in guildSettings.badWords){
        if(message.content.toLowerCase().includes(guildSettings.badWords[key])){
            message.delete().catch(err => console.log(err))
            let modEmbed = new Discord.RichEmbed()
                    .setColor([206, 145, 190])
                    .setTitle("__Courtesy: Message Moderator Report__")
                    .setAuthor('Courtesy', client.user.avatarURL)
                    .setDescription(`**Violation by <@${message.author.id}>**\n<:bullet:640379888607428632> Originating Channel: ${message.channel}\n<:bullet:640379888607428632> Moderated Message: ${message.content}`)
                    .setTimestamp()
                modChannel.send(modEmbed)
                message.author.send(modEmbed)
        }
    }
}