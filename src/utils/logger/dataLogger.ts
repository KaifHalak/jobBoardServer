import chalk from "chalk";
import fs from "fs"
import path from "path";

import config from "../../config/loggerSettings";



class Logger {

    private LOGGER_WRITE_TO_FILE_PATH: string

    constructor(){
        this.LOGGER_WRITE_TO_FILE_PATH = path.join(__dirname, "allLogs.log")
    }

    private Main(level:TLoggerEvents, message: string | Error = "No message", payload: Record<string, any> = {}){ 

        if (message instanceof Error){
            message = message.stack!.replace("Error: ", "\n")
        }

        // Output to console only if the master setting is set to TRUE
        if (config["master"].console){
            this.OutputToConsole(level, message, payload)
        }

        // Save to file only if the master setting is set to TRUE
        if (config["master"].saveToFile){
            this.WriteToFile(level, message, payload)
        }


    }   

    private OutputToConsole(level: TLoggerEvents, message: string | Error, payload: Record<string, any> = {}){

        // Output to console only if that LEVEL setting (ex. EVENT, FATAL etc) is set to TRUE
        if (!config[level].console){
            return
        }

        let color = config[level].color as typeof chalk.Color
        let chalkInstance = chalk[color]

        //Ex: 12/12/2023, 5:26:23 PM
        let timeStamp = this.FormatTimestamp()

        let formattedPayload = {}
        
        // If a payload has been passed (extra info about the situation such as the userId), then format it.
        // Ex: 
        // payload = {userId: 5, userIp: 159.89.173.104}
        // formattedPayload = [userId: 5][userIp: 159.89.173.104]

        if (payload){
            formattedPayload = this.FormatPayload(payload, chalkInstance)
        }

        console.log(`[${chalkInstance(level.toUpperCase())}][${chalkInstance(timeStamp)}]${formattedPayload}: ${chalkInstance(message)}`)

    }

    private WriteToFile(level: TLoggerEvents, message: string | Error, payload: Record<string, any> = {}){
        
        try {

            // Save to file only if that LEVEL setting (ex. EVENT, FATAL etc) is set to TRUE
            if (!config[level].saveToFile){
                return
            }
            
            //Ex: 12/12/2023, 5:26:23 PM
            let timeStamp = this.FormatTimestamp()
            const filePath = this.LOGGER_WRITE_TO_FILE_PATH
            
            if (!fs.existsSync(this.LOGGER_WRITE_TO_FILE_PATH)){
                fs.writeFileSync(this.LOGGER_WRITE_TO_FILE_PATH, "\n")
            }

            let data = {level: level.toUpperCase(), timeStamp, data: payload, message}
            fs.appendFileSync(filePath, JSON.stringify(data) + "\n")

        } catch (error: any) {
            if (error instanceof Error){
                error.message = "Error writing log to file."
                this.OutputToConsole("error", error.stack!)
            }
            
        }

    }



    private FormatTimestamp(){
        //Ex: 12/12/2023, 5:26:23 PM
        return new Date().toLocaleString()
    }

    private FormatPayload(payload: Record<string, any>, chalkInstance: chalk.Chalk){
        // Ex: 
        // payload = {userId: 5, userIp: 159.89.173.104}
        // formattedPayload = [userId: 5][userIp: 159.89.173.104]

        let output = ""
        Object.keys(payload).forEach((key) => {
            let value = payload[key]
            output += `[${chalkInstance(`${key}: ${value}`)}]`
    })
        return output
    }



    public events(message: string | Error = "No message", payload: Record<string, any> = {}){
        this.Main("events", message, payload)
    }

    public error(message: string | Error = "No message", payload: Record<string, any> = {}){
        this.Main("error", message, payload)
    }

    public fatal(message: string | Error = "No message", payload: Record<string, any> = {}){
        this.Main("fatal", message, payload)
    }

    public debug(message: string | Error = "No message", payload: Record<string, any> = {}){
        this.Main("debug", message, payload)
    }
    
    public warn(message: string | Error = "No message", payload: Record<string, any> = {}){
        this.Main("warn", message, payload)
    }

    public database(message: string | Error = "No message", payload: Record<string, any> = {}){
        this.Main("database", message, payload)
    }

}


type TLoggerEvents = Exclude<keyof typeof config, "master">

const logger = new Logger()
export { logger, TLoggerEvents }
