class Zoho {

	constructor(auth_token, organization_id) {
		if (!auth_token || !organization_id) {
			console.log('!!!! Missing auth_token or organization_id from Zoho configuration !!!!!')
		} else {
	    this.auth_token = auth_token;
	    this.organization_id = organization_id;
		}
  }



}

export default Zoho;