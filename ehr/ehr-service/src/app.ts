import express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import LoggerInstance from './common/loaders/logger';
import config from './common/config';
import * as l10n from 'jm-ez-l10n';

async function startServer() {
	const app = express();

	await require('./common/loaders').default({ expressApp: app });
	app.use(express.static(path.join(__dirname, 'public')));
	
	l10n.setTranslationsFile('en', __dirname+'/common/language/translation.en.json');
	app.use(l10n.enableL10NExpress);
	
    app.use(helmet());

	let server = app.listen(config.PORT, (err?: any) => {
		if (err) {
			LoggerInstance.info(err);
			process.exit(1);
			return;
		}
		LoggerInstance.info(`
      ################################################
      🛡️  Server listening on port: ${config.PORT}   🛡️
      ################################################
    `);
	});

}

startServer();

