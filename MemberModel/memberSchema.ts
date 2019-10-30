export {}
const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userTag: String,
    userName: String,
    userID: String,
    guildName: String,
    guildID: String,
    spamming: []
    
})

module.exports = mongoose.model('Member', memberSchema)