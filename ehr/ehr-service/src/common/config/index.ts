import dotenv from 'dotenv';

if (!dotenv) {
	throw new Error('Unable to use dot env lib');
}
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (!envFound) {
	// This error should crash whole process
	throw new Error("⚠️ Couldn't find .env file ⚠️");
}

export default {
	/**
	 * Prod or development server
	 */
	ENV: process.env.NODE_ENV,

	/**
	 * Your favorite port
	 */
	PORT: parseInt(process.env.PORT, 10),

	/* Ecryption Secret Keys */
	encKey: '',
	encIv: '',

	/* Network configuration */
	NETWORK_CONFIG: process.env.NETWORK_CONFIG,

    /* SMTP Credentials */
	SMTP_HOST: process.env.SMTP_HOST,
	SMTP_PORT: process.env.SMTP_PORT,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,

    /* Channel name */
    CHANNEL_NAME: process.env.CHANNEL_NAME,
    CHAINCODE_NAME: process.env.CHAINCODE_NAME,

	/* Developer Emails */
	dev_emails: ['test@test.com'],

	/**
	 * Used by winston logger
	 */
	logs: {
		level: process.env.LOG_LEVEL || 'silly',
		path: process.env.LOG_PATH || './'
	},

	/**
	 * API configs
	 */
	api: {
		prefix: '/'
	},

};
