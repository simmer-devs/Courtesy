require('dotenv').config({path: '../.env'})

export let config = {
    "token": process.env.TOKEN,
    "commands": [
      "test",
      "emit",
      "settings"
    ],
    "defaultSettings": {
      prefix: '!',
      welcomeChannel: 'welcome',
      welcomeMsg: 'Welcome {{user}} to {{guild}}!',
      modRole: 'Moderator',
      adminRole: 'Administrator'
    },
    "badWords": [
      'nigger'
    ] 
}