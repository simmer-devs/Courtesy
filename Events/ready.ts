const { client } = require("../index")

client.on("ready", () => {
    console.log(":courtesy:")
    client.user.setActivity("for GAMERS", {type: "WATCHING"});
})