import { updateSpam } from "../Handlers/memberFunctions"
const mongoose = require('mongoose')
const { client } = require("../index")


client.on("ready", async () => {
    console.log(":courtesy:")
    client.user.setActivity(`${client.users.size} Users`, {type: 'WATCHING'})
    setInterval(() => {
        client.user.setActivity(`${client.users.size} Users`, {type: 'WATCHING'})
    },3.6e+6)
    mongoose.set('useFindAndModify', false)
    setInterval(async () => {
        await updateSpam(client)
    }, 10000)
    
})