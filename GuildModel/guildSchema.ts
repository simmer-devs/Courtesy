const mongoose = require('mongoose')
const ConfigFile = require('../config')

const guildSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    prefix: {
        type: String,
        default: '!'
    },
    badWords: {
        type: [],
        default: ConfigFile.config.badWords
    },
    spamFilter: Number,
    reports: []
})



module.exports = mongoose.model('Guild', guildSchema)


