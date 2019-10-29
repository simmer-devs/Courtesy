import * as Discord from 'discord.js'
const { client } = require("../index")
const { deleteGuild } = require('../Handlers/dbFunctions')

client.on('guildDelete', (guild: Discord.Guild) => {
    deleteGuild(guild)// :)
})