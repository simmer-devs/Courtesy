import * as Discord from "discord.js"
import * as ConfigFile from "./config"
const mongoose = require('mongoose')
const { handleEvent } = require('./Handlers/eventHandler')
require('dotenv').config({path: '../.env'})

var servers = {};

//client setup
const client: Discord.Client = new Discord.Client();
client.login(ConfigFile.config.token)
module.exports = {
    client: client,
    object: servers
}

//handle events lol
handleEvent()

//database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
 }).then(() => {
    console.log('db connected')
}) 






