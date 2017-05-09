const fs = require('fs');
const configKeys = [
	'GOOGLE_CREDS_CLIENT_EMAIL',
	'GOOGLE_CREDS_PRIVATE_KEY',
	'GOOGLE_DOC_KEY',
	'GOOGLE_ORDER_DOC_KEY',
	'GOOGLE_SUBSCRIPTION_DOC_KEY',
	'SENDGRID_API_KEY',
	'MAIL_APP',
];

/********* HOW TO CONFIGURE APP *******
2 options:
  - use a config.json file to store config
  - use env variables	(this option will be used first)
***************************************/

let config = require('./config.json');
if (!config) config = {};

let result = {};
configKeys.map((key) => ( result[key] = process.env[key] || config[key]));

export default result;