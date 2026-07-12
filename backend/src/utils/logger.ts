import pino from 'pino';
import { loggerConfig } from '../config/logger.config';

const pinoLogger = pino({
  level: loggerConfig.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export const logger = {
  info: (msg: string, ...args: any[]) => pinoLogger.info(msg, ...args),
  warn: (msg: string, ...args: any[]) => pinoLogger.warn(msg, ...args),
  debug: (msg: string, ...args: any[]) => pinoLogger.debug(msg, ...args),
  trace: (msg: string, ...args: any[]) => pinoLogger.trace(msg, ...args),
  error: (msg: string, error?: any, ...args: any[]) => {
    if (error) {
      pinoLogger.error(error, msg, ...args);
    } else {
      pinoLogger.error(msg, ...args);
    }
  },
  fatal: (msg: string, error?: any, ...args: any[]) => {
    if (error) {
      pinoLogger.fatal(error, msg, ...args);
    } else {
      pinoLogger.fatal(msg, ...args);
    }
  }
};
