import { ForegroundColor } from "chalk";

type TAllLevels = "master" | "events" | "error" | "fatal" | "debug" | "warn" | "database"

interface IEachLevel {
    color?: typeof ForegroundColor,
    saveToFile: boolean,
    console: boolean
}

type IConfig = {
    [key in TAllLevels]: IEachLevel;
};



let config: IConfig = {
    master: {
        saveToFile: true,
        console: true
    },

    events: {
        color: "green",
        saveToFile: false,
        console: false
    },

    error: {
        color: "red",
        saveToFile: true,
        console: true
    },

    fatal: {
        color: "redBright",
        saveToFile: true,
        console: true
    },

    debug: {
        color: "white",
        saveToFile: false,
        console: true
    },

    warn: {
        color: "yellow",
        saveToFile: true,
        console: true
    },

    database: {
        color: "cyan",
        saveToFile: true,
        console: true
    }
}

export default config