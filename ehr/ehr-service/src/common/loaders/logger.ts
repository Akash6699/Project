import winston from 'winston';
import config from '../config';
import sendLoggerEmail from '../services/sendLogEmail';

const transports = [];
if (process.env.NODE_ENV == 'production') {
	transports.push(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp(),
				winston.format.printf(
					info => `${info.timestamp} ${info.level}: ${info.message}`
				)
			)
		}),
		new winston.transports.File({
			filename: config.logs.path + 'combined.log',
			maxsize: 2048,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(
					info => `${info.timestamp} ${info.level}: ${info.message}`
				)
			)
		}),
		new winston.transports.File({
			filename: config.logs.path + 'error.log',
			maxsize: 2048,
			level: 'error',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(
					info => `${info.timestamp}: ${info.message}`
				)
			)
		})
	);
} else {
	transports.push(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.cli(),
				winston.format.splat()
			)
		})
	);
}

const LoggerInstance = <any>winston.createLogger({
	level: config.logs.level,
	levels: winston.config.npm.levels,
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json()
	),
	transports
});

LoggerInstance.errorAndMail = async e => {
	LoggerInstance.error(e);

	// Will send this to email
	const error = e;

	const emails = config.dev_emails;
	if (!emails || (emails && emails.length == 0)) {
		LoggerInstance.error('No email found in env to send to developers');
		throw new Error('No email found in env to send to developers');
	} else {
		return Promise.resolve(sendLoggerEmail(error, emails)).catch((e) => {
			LoggerInstance.error('Error sending job emails. Error: %o', e);
		});
	}
};

export default LoggerInstance;
