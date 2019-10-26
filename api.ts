import * as Discord from "discord.js";

export interface IBotCommand {
    help(): string;
    isThisCommand(command: string): boolean;
    runCommand(args: string[], message: Discord.Message, client: Discord.Client, settings: any): Promise<void>;
}