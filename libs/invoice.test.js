import Invoice from './invoice';
const assert = require('assert');

describe('Invoice', function() {
  it('should return OK', function() {
  	const invoice = new Invoice();
  	invoice.subscription_new()
  	.then((message) => (assert.equal(message,'OK')))
  	.catch((error) => (assert(false)));
  });
});