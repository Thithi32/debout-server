import Zoho from './zoho';
import config from './../config';

class Invoice {

	constructor() {
		const { ZOHO_AUTH_TOKEN, ZOHO_ORGANIZATION_ID } = config;
		if (!ZOHO_AUTH_TOKEN) {
		  console.log('!!!! Missing ZOHO_AUTH_TOKEN configuration !!!!!');
		}
		if (!ZOHO_ORGANIZATION_ID) {
		  console.log('!!!! Missing ZOHO_ORGANIZATION_ID configuration !!!!!');
		}

		if (ZOHO_AUTH_TOKEN && ZOHO_ORGANIZATION_ID) this.service = new Zoho(ZOHO_AUTH_TOKEN,ZOHO_ORGANIZATION_ID);
	}

  subscription_new(subscription) {
    const self = this;
    return new Promise(function(resolve, reject) {
    	resolve('OK');
    });
  }

}

export default Invoice;