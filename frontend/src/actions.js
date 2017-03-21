export const SET_COMPANIES = "SET_COMPANIES";
export const SET_HUBS = "SET_HUBS";
export const CREATE_ORDER = "CREATE_ORDER";

export function setCompanies(companies) {
  return {
    type: SET_COMPANIES,
    companies
  }
}

export function setHubs(hubs) {
  return {
    type: SET_HUBS,
    hubs
  }
}

export function fetchCompanies() {
  return dispatch => {
    fetch("/api/companies")
      .then(res => res.json())
      .then(data => dispatch(setCompanies(data.companies)));
  }
}

export function fetchHubs() {
  return dispatch => {
    fetch("/api/hubs")
      .then(res => res.json())
      .then(data => dispatch(setHubs(data.hubs)));
  }
}

export function createOrder( order ) {
  return dispatch => {

    let { company, is_ngo, is_ccas, has_hub, hub, nb_products, invoice, shipping, shipping_option, order : { contact } } = order;
    let forder = { company, is_ngo, is_ccas, has_hub, hub, nb_products, contact };
    const hub_shipping_available = has_hub && (is_ngo || is_ccas) && hub && hub !== "0";

    if (!hub_shipping_available || shipping_option === "1") {
      if (shipping.contact_disabled) delete shipping.contact_disabled;
      if (shipping.address_disabled) delete shipping.address_disabled;
      if (shipping.use_contact_for_shipping) shipping.contact = contact;
      forder.shipping = shipping;
    }

    if (invoice.contact_disabled) delete invoice.contact_disabled;
    if (invoice.address_disabled) delete invoice.address_disabled;
    if(invoice.use_shipping_address) invoice.address = shipping.address;
    if(invoice.use_contact_for_invoice) invoice.contact = contact;
    forder.invoice = invoice;

    fetch("/api/order", { 
      method: "POST", 
      body: JSON.stringify( { order: forder }),
      headers: { 'Content-Type': 'application/json' } 
    })
      .then(res => res.json())
      .then(data => {
        alert("Commande envoyée avec succès");
        console.log(data);
        dispatch({
          type: CREATE_ORDER,
          response: data
        });
      });
  }
}