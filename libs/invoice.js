import Zoho from './zoho';
import config from './../config';

class Invoice {

	constructor() {
		const { ZOHO_AUTH_TOKEN, ZOHO_ORGANIZATION_ID, ZOHO_SUBSCRIPTION_ITEM_ID, ZOHO_DONATION_ITEM_ID,
			ZOHO_SUBSCRIPTION_TEMPLATE, ZOHO_SUBSCRIPTION_EMAIL_TEMPLATE, ZOHO_GATEWAY_NAME } = config;
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
		this.ZOHO_SUBSCRIPTION_TEMPLATE = ZOHO_SUBSCRIPTION_TEMPLATE;
		this.ZOHO_SUBSCRIPTION_EMAIL_TEMPLATE = ZOHO_SUBSCRIPTION_EMAIL_TEMPLATE;
		this.ZOHO_GATEWAY_NAME = ZOHO_GATEWAY_NAME;

		this.subscription_price = 10;
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

	  	const honorific = contact.honorific || "M";
	  	const zohoContact = {
	  		contact_name: [honorific, contact.firstname, contact.name].join(' '),
		    contact_persons: [
		    	{
		    		salutation: honorific,
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

	  	let zoho_contact, zoho_invoice;
	    self.service.getOrCreateContact(zohoContact)
    	.then((contact) => {
    		zoho_contact = contact;
//    		console.log(zoho_contact);

    		let line_items = [ { item_id: self.ZOHO_SUBSCRIPTION_ITEM_ID } ];
    		if (subscription.type === 'solidaire') {
    			line_items.push( {
    				item_id: self.ZOHO_DONATION_ITEM_ID,
    				rate: subscription.solidarity_price - self.subscription_price,
    			})

    		}
    		let zohoInvoice = {
    			customer_id: zoho_contact.contact_id,
    			line_items
    		}
    		console.log(self.ZOHO_SUBSCRIPTION_TEMPLATE);
    		if (self.ZOHO_SUBSCRIPTION_TEMPLATE) zohoInvoice.template_id = self.ZOHO_SUBSCRIPTION_TEMPLATE;
    		if (self.ZOHO_GATEWAY_NAME) {
    			zohoInvoice.payment_options = {
        		payment_gateways: [
            	{
                configured: true,
                gateway_name: self.ZOHO_GATEWAY_NAME,
            	},
	        	],
    			};
    		}

    		return self.service.createInvoice(zohoInvoice);
    	})
  		.then((invoice) => {
  			zoho_invoice = invoice;
//  			console.log(zoho_invoice);

  			return self.service.sendInvoice(zoho_invoice.invoice_id, zoho_invoice.contact_persons_details.map((person) => (person.email)), self.ZOHO_SUBSCRIPTION_EMAIL_TEMPLATE);
  		})
  		.then((message) => {
//  			console.log(message)
	    	resolve({ message: 'OK', contact: zoho_contact, invoice: zoho_invoice });
  		})
    	.catch((error) => {
    		reject(error);
    	});
    });
  }

}

export default Invoice;