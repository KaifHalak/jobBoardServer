import chalk from "chalk";
import fs from "fs"
import path from "path";

import config from "../../config/loggerSettings";

type TLogger = keyof typeof config
type TPayload = {[key: string]: any}

class Logger {


    private Main(level:TLogger, message: string | Error = "No message", payload: TPayload = {}){ 

        if ( !(level && level in config) ){
            throw Error(`Incorrect value for level: ${level}`)
        }

        if (message instanceof Error){
            message = message.stack!
        }

        this.OutputToConsole(level, message, payload)
        this.WriteToFile(level, message, payload)

    }   

    private OutputToConsole(level: TLogger, message: string | Error, payload: TPayload = {}){

        let color = config[level].color as typeof chalk.Color
        let chalkInstance = chalk[color]

        let timeStamp = this.FormatTimestamp()

        let formattedPayload

        if (payload){
            formattedPayload = this.FormatPayload(payload, chalkInstance)
        }

        console.log(`[${chalkInstance(level.toUpperCase())}][${chalkInstance(timeStamp)}]${formattedPayload}: ${chalkInstance(message)}`)

    }

    private WriteToFile(level: TLogger, message: string | Error, payload: TPayload = {}){
        
        try {
            if (!config[level].saveToFile){
                return
            }
    
            let timeStamp = this.FormatTimestamp()
            const filePath = path.join(__dirname, "allLogs.log")
    
            let data = {level: level.toUpperCase(), timeStamp, data: payload!, message}
    
            fs.appendFileSync(filePath, JSON.stringify(data) + "\n")
        } catch (error: any) {
            if (error instanceof Error){
                error.message = "Error writing log to file."
                this.OutputToConsole("error", error.stack!)
            }
            
        }

    }

    private FormatTimestamp(){
        return new Date().toLocaleString()
    }

    private FormatPayload(payload: {[key: string]: any}, chalkInstance: chalk.Chalk){
        let output = ""
        Object.keys(payload).forEach((key) => {
            let value = payload[key]
            output += `[${chalkInstance(`${key}: ${value}`)}]`
    })
        return output
    }



    public Events(message: string | Error = "No message", payload: TPayload = {}){
        this.Main("events", message, payload)
    }

    public Error(message: string | Error = "No message", payload: TPayload = {}){
        this.Main("error", message, payload)
    }

    public Fatal(message: string | Error = "No message", payload: TPayload = {}){
        this.Main("fatal", message, payload)
    }

    public Debug(message: string | Error = "No message", payload: TPayload = {}){
        this.Main("debug", message, payload)
    }
    
    
    public Warn(message: string | Error = "No message", payload: TPayload = {}){
        this.Main("warn", message, payload)
    }

    
    public Database(message: string | Error = "No message", payload: TPayload = {}){
        this.Main("database", message, payload)
    }

}


const logger = new Logger()
export default logger
