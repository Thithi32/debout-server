import Invoice from './invoice';
const assert = require('assert');

const defaultSubscription = {
  "type": "solidaire",
  "solidarity_price": "40",
  "donation_recept": true,
  "contact": {
  	"honorific": "M",
    "name": "DELBART",
    "firstname": "Thierry",
    "email": "tdelbart@gmail.com",
    "mobile": "09 98 00 76 51",
    "phone": "00 30 76 32 25"
  },
  "company_name": "THDE",
  "address": {
    "address1": "15, rue des écrevisses",
    "address2": "ZA Nadir Bosch",
    "zip": "30330",
    "city": "SAINT LAURENT"
  },
  "subscription_signed": true
}

describe('Invoice', function() {
  it('should return OK', function() {
  	this.timeout(10000);
  	const invoice = new Invoice();
  	return invoice.subscription_new(defaultSubscription)
  	.then((result) => (assert.equal(result.message,'OK')))
  	.catch((error) => (assert(false,error)));
  });
});