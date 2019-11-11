import * as Discord from "discord.js"
import * as ConfigFile from "./config"
import { commands } from './Handlers/commandHandler'
const mongoose = require('mongoose')
const { handleEvent } = require('./Handlers/eventHandler')
require('dotenv').config({path: '../.env'})

//client setup
const client: Discord.Client = new Discord.Client();
client.login(ConfigFile.config.token)

//handle events lol
handleEvent()

let helpObject = [] as string[][]

//database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
 }).then(() => {
    console.log('db connected')
    for(const commandsClass of commands){
        let helpArray = commandsClass.help()
        helpObject.push(helpArray)
    }
}) 

module.exports = {
    //import name: variable name in file
    client: client,
    helpArray: helpObject
}




