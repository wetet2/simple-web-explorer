const winston = require('winston');
require('winston-daily-rotate-file');
const { format, transports } = winston

const prettyJson = format.printf(info => {
   if(!info.message){
      return `undefined`;
   }
   if (info.message.constructor === Object) {
      info.message = JSON.stringify(info.message, null, 4);
   }
   else if (info.message.constructor === Array) {
      info.message = JSON.stringify(info.message, null, 4);
   }
   return `${info.timestamp} [${info.level}] ${info.message}`
})

const level = process.env.LITTLE_FOREST === 'production' ? 'debug' : 'debug';

const loggerList = {}

const getLogger = (loggerKey) => {
   if(!loggerKey || loggerKey.trim() === '') loggerKey = 'littleforest'
   if(loggerList[loggerKey]) return loggerList[loggerKey];
   
   let logger = winston.createLogger({
      level: level,
      transports: [
         new (winston.transports.DailyRotateFile)({
            format: format.combine(
               format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
               format.splat(),
               format.simple(),
               format.prettyPrint(),
               prettyJson,
            ),
            name: `${loggerKey}-info-logger`,
            filename: `${loggerKey}_%DATE%.txt`,
            dirname: './log',
            datePattern: 'YYYY-MM-DD',
            maxsize: '50m',
            maxFiles: 100,
         }),
         new (transports.Console)({
            format: format.combine(
               format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
               format.splat(),
               format.simple(),
               format.prettyPrint(),
               format.colorize(),
               prettyJson,
            ),
            name: `${loggerKey}-debug-logger`,
         })
      ],
      
   });
   logger.d = (...msgs) => {
      logger.debug(msgs.join(' '));
   }
   logger.i = (...msgs) => {
      logger.debug(msgs.join(' '));
   }
   logger.error = err => {
      if (err instanceof Error) {
         logger.log({ level: 'error', message: `${err.stack || err}` });
      } else {
         logger.log({ level: 'error', message: err });
      }
   };
   logger.json = (...msgs) => {
      logger.debug(msgs.map(e => JSON.stringify(e, null, 4)).join(' '));
   }

   loggerList[loggerKey] = logger;
   return logger;
};

module.exports = getLogger;

