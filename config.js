const fs = require('fs');
const configKeys = [
	'GOOGLE_CREDS_CLIENT_EMAIL',
	'GOOGLE_CREDS_PRIVATE_KEY',
	'GOOGLE_DOC_KEY',
	'GOOGLE_ORDER_DOC_KEY',
	'GOOGLE_SUBSCRIPTION_DOC_KEY',
	'ZOHO_AUTH_TOKEN',
	'ZOHO_ORGANIZATION_ID',
	'ZOHO_SUBSCRIPTION_ITEM_ID',
	'ZOHO_DONATION_ITEM_ID',
	'ZOHO_SUBSCRIPTION_TEMPLATE',
	'ZOHO_SUBSCRIPTION_EMAIL_TEMPLATE',
	'ZOHO_GATEWAY_NAME',
	'SENDGRID_API_KEY',
	'MAIL_APP',
];

/********* HOW TO CONFIGURE APP *******
2 options:
  - use a config.json file to store config
  - use env variables	(this option will be used first)
***************************************/

let config;
try {
  config = require('./config.json');
} catch (ex) {
	config = {};
}

console.log(config);

let result = {};
configKeys.map((key) => ( result[key] = process.env[key] || config[key]));

export default result;