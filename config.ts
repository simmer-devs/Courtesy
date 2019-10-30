require('dotenv').config({path: '../.env'})

export let config = {
    "token": process.env.TOKEN,
    "commands": [
      "test",
      "settings",
      "kick",
      "ban"
    ],
    "defaultSettings": {
      prefix: '!',
      spamFilter: '10',
      welcomeChannel: 'welcome',
      welcomeMsg: 'Welcome {{user}} to {{guild}}!',
      modRole: 'Moderator',
      adminRole: 'Administrator'
    },
    "memberDefaultSettings": {
      spamming: []
    },
    "badWords": [
      'nigger'
    ] 
}