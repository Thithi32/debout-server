import Zoho from './zoho';
import config from './../config';

class Invoice {

	constructor() {
		const { ZOHO_AUTH_TOKEN, ZOHO_ORGANIZATION_ID, ZOHO_SUBSCRIPTION_ITEM_ID, ZOHO_DONATION_ITEM_ID } = config;
		if (!ZOHO_AUTH_TOKEN) {
		  console.log('!!!! Missing ZOHO_AUTH_TOKEN configuration !!!!!');
		}
		if (!ZOHO_ORGANIZATION_ID) {
		  console.log('!!!! Missing ZOHO_ORGANIZATION_ID configuration !!!!!');
		}
		if (!ZOHO_SUBSCRIPTION_ITEM_ID) {
		  console.log('!!!! Missing ZOHO_SUBSCRIPTION_ITEM_ID configuration !!!!!');
		}
		if (!ZOHO_DONATION_ITEM_ID) {
		  console.log('!!!! Missing ZOHO_DONATION_ITEM_ID configuration !!!!!');
		}

		if (ZOHO_AUTH_TOKEN && ZOHO_ORGANIZATION_ID) this.service = new Zoho(ZOHO_AUTH_TOKEN,ZOHO_ORGANIZATION_ID);
		this.ZOHO_SUBSCRIPTION_ITEM_ID = ZOHO_SUBSCRIPTION_ITEM_ID;
		this.ZOHO_DONATION_ITEM_ID = ZOHO_DONATION_ITEM_ID;
	}

  subscription_new(subscription) {
    const self = this;
    return new Promise(function(resolve, reject) {

    	let contact = subscription.contact;
    	let address = subscription.address;

	  	if (!contact) reject(`Les informations sur l'abonné sont obligatoires`);
	  	if (!contact.name) reject(`Le nom de l'abonné est obligatoire`);
	  	if (!contact.email) reject(`L'email de l'abonné est obligatoire`);
	  	if (!(contact.phone || contact.mobile)) reject(`Un téléphone pour l'abonné est obligatoire`);
	  	if (!address) reject(`L'adresse de l'abonné est obligatoire`);

	  	let zohoContact = {
	  		contact_name: [contact.honorific, contact.name, contact.firstname].join(' '),
		    contact_persons: [
		    	{
		    		salutation: contact.honorific || "M",
		    		first_name: contact.firstname,
		    		last_name: contact.name,
		    		email: contact.email,
		    		phone: contact.phone,
		    		mobile: contact.mobile,
		    		is_primary_contact: true,
		    	}
		    ],

	  	}

	  	zohoContact.billing_address = {
	  		address: address.address1,
	  		street2: address.address2,
        city: address.city,
        zip: address.zip,
        country: "France",
	  	}
	  	zohoContact.shipping_address = zohoContact.billing_address;

	  	if (subscription.company_name) zohoContact.company_name = subscription.company_name;

	    self.service.getOrCreateContact(zohoContact)
    	.then((contact) => {
    		console.log(contact);
    		let zohoInvoice = {
    			customer_id: contact.contact_id,
    			line_items: [
        		{
        			item_id: self.ZOHO_SUBSCRIPTION_ITEM_ID,
        		}
        	],
    		}

    		return self.service.createInvoice(zohoInvoice);
    	})
  		.then((invoice) => {
  			console.log(invoice);
  			return self.service.sendInvoice(invoice.invoice_id, invoice.contact_persons_details.map((person) => (person.email)));
  		})
  		.then((message) => {
  			console.log(message)
	    	resolve('OK');
  		})
    	.catch((error) => {
    		reject(error);
    	});
    });
  }

}

export default Invoice;