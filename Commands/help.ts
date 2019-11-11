import * as Discord from "discord.js";
import {IBotCommand} from "../api";
const { helpArray, client } = require('../index')

export default class help implements IBotCommand{
    
    private readonly _command = "help"
    
    help(): string[] {
        return [this._command,"This command does absolutely nothing! :-)"]
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, lient: Discord.Client, settings: any): Promise<void> {
        message.delete()
        
        let settingsHelp = helpArray[1][1]
        let kickHelp = helpArray[2][1]
        let banHelp = helpArray[3][1]
        let hackbanHelp = helpArray[4][1]
        let tempbanHelp = helpArray[5][1]
        let purgeHelp = helpArray[6][1]
        let reportHelp = helpArray[7][1]
        let pullreportHelp = helpArray[8][1]
        let closereportHelp = helpArray[9][1]
        let totalreportsHelp = helpArray[10][1]

        const helpEmbedState1 = new Discord.RichEmbed()
            .setTitle('__**Courtesy Help Menu**__')
            .setDescription(`This menu gives a brief description of the commands available with this bot. Please use: \n\n◀ & ▶ Reactions to navigate the menu's pages. \n\n🗑 Reaction when you are finished! \n\nFor more detailed documenation on command usage and permission requirements please visit: \n- https://github.com/simmer-devs/Courtesy \nWant to submit bugs or suggestions? Have questions? Join our support server: \n- https://discord.gg/cMCDsDF`)
            .setColor([206, 145, 190])
            .setThumbnail(client.user.avatarURL)
            .setFooter(`${settings.guildName} Prefix: ${settings.prefix}`)
            
        const helpEmbedState2 = new Discord.RichEmbed()
            .setTitle('__Moderation Commands__')
            .setThumbnail(client.user.avatarURL)
            .setDescription(`<:bullet:640379888607428632> __**${settings.prefix}kick**__ \n${kickHelp} \n<:bullet:640379888607428632> __**${settings.prefix}ban**__ \n${banHelp} \n<:bullet:640379888607428632> __**${settings.prefix}tempban**__ \n${tempbanHelp} \n<:bullet:640379888607428632> __**${settings.prefix}hackban**__ \n${hackbanHelp} \n<:bullet:640379888607428632> __**${settings.prefix}purge**__ \n${purgeHelp}`)
            .setColor([206, 145, 190])
            .setFooter(`${settings.guildName} Prefix: ${settings.prefix}`)

        const helpEmbedState3 = new Discord.RichEmbed()
            .setTitle('__Report Commands__') 
            .setThumbnail(client.user.avatarURL) 
            .setDescription(`<:bullet:640379888607428632> __**${settings.prefix}report**__ \n${reportHelp} \n<:bullet:640379888607428632> __**${settings.prefix}pullreport**__ \n${pullreportHelp} \n<:bullet:640379888607428632> __**${settings.prefix}closereport**__ \n${closereportHelp} \n<:bullet:640379888607428632> __**${settings.prefix}totalreports**__ \n${totalreportsHelp}`)
            .setColor([206, 145, 190])
            .setFooter(`${settings.guildName} Prefix: ${settings.prefix}`)
        
        const helpEmbedState4 = new Discord.RichEmbed()
            .setTitle('__Settings Commands__')
            .setThumbnail(client.user.avatarURL)
            .setDescription(`<:bullet:640379888607428632> __**${settings.prefix}settings**__ \n${settingsHelp}`)
            .setColor([206, 145, 190])
            .setFooter(`${settings.guildName} Prefix: ${settings.prefix}`)

        let helpStates = {
            stateOne: helpEmbedState1,
            stateTwo: helpEmbedState2,
            stateThree: helpEmbedState3,
            stateFour: helpEmbedState4
        }
        
        message.channel.send(helpStates.stateOne).then(async m => {
            let msg = m as Discord.Message
            await msg.react("◀")
            await msg.react("▶")
            await msg.react("🗑")
            let state = 1
            const filter = (reaction:Discord.MessageReaction, user:Discord.User) => (reaction.emoji.name === "◀" || reaction.emoji.name === "▶") && user.id === message.author.id
            let results = msg.createReactionCollector(filter, { time: 600000 })
            const deleteFilter = (reaction: Discord.MessageReaction, user: Discord.User) => (reaction.emoji.name === '🗑') && user.id === message.author.id
            let deleteResults = msg.createReactionCollector(deleteFilter, { time: 600000 })

            results.on("collect", (res) => {
                res.remove(res.users.get(message.author.id))
                if(res.emoji.name === "▶"){
                    switch(state){
                        case 1: {
                            msg.edit(helpStates.stateTwo)
                            state++
                            break;
                        }
                        case 2: {
                            msg.edit(helpStates.stateThree)
                            state++
                            break;
                        }
                        case 3: {
                            msg.edit(helpStates.stateFour)
                            state++
                            break;
                        }
                    }
                }
                if(res.emoji.name === "◀"){
                    switch(state){
                        case 1: {
                            return
                        }
                        case 2: {
                            msg.edit(helpStates.stateOne)
                            state--
                            break;
                        }
                        case 3: {
                            msg.edit(helpStates.stateTwo)
                            state--
                            break; 
                        }
                        case 4: {
                            msg.edit(helpStates.stateThree)
                            state--
                            break;
                        }
                    }
                }
                
            })
            
            deleteResults.on('collect', (newRes) => {
                if(newRes.emoji.name === '🗑'){
                    if(msg.deletable){
                        msg.delete().then().catch(err => console.log(err))
                    }
                }
            })
        }) 
    }
}