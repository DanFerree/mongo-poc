// External Dependencies
import pino, { LoggerOptions } from "pino";
import pinoCaller from "pino-caller";

const { APP_NAME, LOG_LEVEL } = process.env;

const origLevel = LOG_LEVEL || 'info';

const pad2 = (n: number) => n.toString().padStart(2, '0');
const pad3 = (n: number) => n.toString().padStart(3, '0');
const toISOLocal = (d: Date) => {
    const year = d.getFullYear();
    const month = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    const hour = pad2(d.getHours());
    const min = pad2(d.getMinutes());
    const ms = pad3(d.getMilliseconds());
    return `${year}-${month}-${day} ${hour}}:${min}.${ms}`;
}

const opts: LoggerOptions = {
    name: APP_NAME,
    level: origLevel,
    timestamp: () => `,"time":"${toISOLocal(new Date())}"`,
    base: undefined, //ignores pid and hostname
    formatters: {
        level: (label: string) => { return { level: label } }
    },
    transport: {
        target: 'pino-pretty',
        options: { colorize: true }
    }
}

const log: pino.Logger = pinoCaller(pino(opts), { relativeTo: __dirname });

export default log;
