import expressLoader from './express';
import Logger from './logger';

export default async ({ expressApp }) => {
	// Load dependencies
	Logger.info('✌️ Express loaded');
	await expressLoader({ app: expressApp });
};
