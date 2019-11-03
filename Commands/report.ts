import * as Discord from "discord.js";
import {IBotCommand} from "../api";
import { createReport, buildReport, getReport } from "../Handlers/reportFunctions";
import { reportCounterIncrement, getGuild } from "../Handlers/guildFunctions";

export default class report implements IBotCommand{
    
    private readonly _command = "report"
    
    help(): string {
        return "This command does absolutely nothing! :-)"
    }    
    
    isThisCommand(command: string): boolean {
        return command === this._command;
    }
    
    async runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void> {
        message.delete()
        let guildData = await getGuild(message.guild)
        const reportNumber = guildData.reports.length + 1
        
        let reportSettings = {
            userTag: message.author.tag,
            userID: message.author.id,
            guildName: message.guild.name,
            guildID: message.guild.id,
            reportNumber: reportNumber
        }
        await createReport(reportSettings)
        await reportCounterIncrement(message.guild)
        await buildReport(message, reportNumber)

        
        
    }
}