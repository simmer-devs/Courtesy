require('dotenv').config({path: '../.env'})

export let config = {
    "token": process.env.TOKEN,
    "commands": [
      "test",
      "settings",
      "kick",
      "ban",
      "hackban",
      "tempban",
      "purge",
      "report",
      "pullreport",
      "closereport",
      "totalreports",
      "help",
    ],
    "defaultSettings": {
      prefix: '!',
      spamFilter: '10',
      welcomeChannel: 'welcome',
      welcomeMsg: 'Welcome {{user}} to {{guild}}!',
      modRole: 'Moderator',
      adminRole: 'Administrator',
      reports: []
    },
    "memberDefaultSettings": {
      spamming: []
    },
    "reportDefaultSettings": {
      Title:'',
      Description: ''
    },
    "badWords": [
      'nigger',
      'faggot'
    ] 
}