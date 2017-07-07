import request from 'request-promise';
import querystring from 'querystring';
import utf8 from 'utf8';

class Zoho {
	constructor(authtoken, organization_id) {
		if (!authtoken || !organization_id) {
			console.log('!!!! Missing auth_token or organization_id from Zoho configuration !!!!!')
		} else {
	    this.authtoken = authtoken;
	    this.organization_id = organization_id;
		}
  }

  fetch(path,method,jsonString,queryString) {
  	const self = this;
  	method = (method || 'GET').toUpperCase();
  	return new Promise(function(resolve,reject) {
      if (!queryString) queryString = {};
      queryString.authtoken = self.authtoken;
      queryString.organization_id = self.organization_id;
  		const uri = `https://invoice.zoho.com/api/v3${path}?${querystring.stringify(queryString)}${(jsonString)?'&JSONString='+JSON.stringify(jsonString):''}`;

  		console.log(method,uri);
			request({
		    method: method,
		    uri: utf8.encode(uri),
			})
      .then((res) => JSON.parse(res))
      .then((res) => resolve(res))
      .catch((error) => reject(error));
  	})
  }

/******* CONTACTS **********/

  getContacts(filter) {
    const self = this;
    return new Promise(function(resolve, reject) {
			self.fetch("/contacts", "GET", undefined, filter)
      .then((response) => {
      	resolve(response.contacts);
      })
      .catch((error) => {
      	reject(error);
      });
    });
  }

  createContact(contact) {
    const self = this;
    return new Promise(function(resolve, reject) {
	  	if (!contact.contact_name) reject(`Le nom du contact Zoho invoice est obligatoire`);

			self.fetch("/contacts", "POST", contact)
      .then((response) => {
      	resolve(response.contact);
      })
      .catch((error) => {
      	reject(error);
      });
    });
  }

  updateContactById(contact_id,new_contact) {
    const self = this;
    return new Promise(function(resolve, reject) {
			self.fetch(`/contacts/${contact_id}`,"PUT",new_contact)
      .then((response) => {
      	resolve(response.contact);
      })
      .catch((error) => {
      	reject(error);
      });
    });
  }

  updateContact(contact_id,new_contact) {
    const self = this;
    return new Promise(function(resolve, reject) {

    	self.fetch(`/contacts/${contact_id}/contactpersons`)
    	.then((response) => {
    		const new_persons = new_contact.contact_persons || [];

    		// Set contact_persons id in new_contact
    		response.contact_persons.forEach((person) => {
    			new_persons.forEach((new_person, idx) => {
    				if (person.email === new_person.email) {
    					new_contact.contact_persons[idx].contact_person_id = person.contact_person_id;
    				}
    			})
    		});

				self.fetch(`/contacts/${contact_id}`,"PUT",new_contact)
	      .then((response) => {
	      	resolve(response.contact);
	      })
	      .catch((error) => {
	      	reject(error);
	      });
    	})
    	.catch((error) => {
    		reject(error);
    	})

    });
  }

  getOrCreateContact(contact) {
    const self = this;
    return new Promise(function(resolve, reject) {
	  	if (!contact.contact_persons || !contact.contact_persons[0].email)
	  		reject(`L'email du contact Zoho invoice est obligatoire`);

	  	let main_contact_persons_idx = -1;
	  	contact.contact_persons.map((person,idx) => {
	  		if (person.is_primary_contact) main_contact_persons_idx = idx;
	  	});

	  	const contact_email = contact.contact_persons[main_contact_persons_idx].email;
    	self.getContacts({ email: contact_email })
    	.then((contacts) => {
    		if (contacts.length > 0) {
    			self.updateContact(contacts[0].contact_id, contact)
    			.then((contact) => {
    				resolve(contact);
    			})
		      .catch((error) => {
		      	reject(error);
		      });
    		} else {
    			self.createContact(contact)
    			.then((contact) => {
    				resolve(contact);
    			})
		      .catch((error) => {
		      	reject(error);
		      });
    		}

    	})
      .catch((error) => {
      	reject(error);
      });
    });
  }

/******* end CONTACTS **********/

/******* INVOICES **********/

	createInvoice(invoice) {
    const self = this;
    return new Promise(function(resolve, reject) {
			self.fetch("/invoices","POST",invoice)
      .then((response) => {
      	resolve(response.invoice);
      })
      .catch((error) => {
      	reject(error);
      });
    });
	}

	sendInvoice(invoice_id, to_mail_ids, email_template_id) {
    const self = this;
    return new Promise(function(resolve, reject) {
			self.fetch(`/invoices/${invoice_id}/email`,'POST', undefined, { email_template_id })
      .then((response) => {
      	resolve(response.message);
      })
      .catch((error) => {
      	reject(error);
      });
    });
	}

/******* end INVOICES **********/

}

export default Zoho;