const fs = require("fs")

export const handleEvent = () => {
    fs.readdir("./Events/", (err: Error, files: string[]) => {
    
        if(err) { return console.log(err) }
    
        let jsFiles = files.filter((f: any) => f.split(".").pop() === "js")
        if (jsFiles.length <= 0) { return console.log("No events to load.") }
    
        console.log(`Loading ${jsFiles.length} events...`)
    
        jsFiles.forEach((f: string, i: number) => {
            require(`../Events/${f}`)
            console.log(`${i + 1}: ${f} loaded!`)
        })  
    })
}