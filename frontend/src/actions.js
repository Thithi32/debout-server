export const SET_COMPANIES = 'SET_COMPANIES';
export const SET_HUBS = 'SET_HUBS';
export const CREATE_ORDER = 'ORDER_CREATED';
export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const ORDER_CONFIRMED = 'ORDER_CONFIRMED';
export const ORDER_NOT_CONFIRMED = 'ORDER_NOT_CONFIRMED';

export function setCompanies(companies) {
  return {
    type: SET_COMPANIES,
    companies,
  };
}

export function setHubs(hubs) {
  return {
    type: SET_HUBS,
    hubs,
  };
}

export function fetchCompanies() {
  return dispatch => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => dispatch(setCompanies(data.companies)))
      .catch(() => false);
  };
}

export function fetchHubs() {
  return dispatch => {
    fetch('/api/hubs')
      .then(res => res.json())
      .then(data => dispatch(setHubs(data.hubs)))
      .catch(() => false);
  };
}

export function startLoading() {
  return dispatch => {
    dispatch({
      type: START_LOADING,
    });
  };
}

export function stopLoading() {
  return dispatch => {
    dispatch({
      type: STOP_LOADING,
    });
  };
}

export function createOrder(order) {
  return dispatch => {
    dispatch({
      type: START_LOADING,
    });

    const { company, is_ngo, is_ccas, has_hub, hub, nb_products, invoice, order_comment, shipping, shipping_option, order: { contact } } = order;
    const forder = { company, is_ngo, is_ccas, has_hub, hub, nb_products, contact, order_comment };
    if (shipping_option === '1') {
      if (shipping.contact_disabled) delete shipping.contact_disabled;
      if (shipping.address_disabled) delete shipping.address_disabled;
      if (shipping.use_contact_for_shipping) shipping.contact = contact;
      if (invoice.use_shipping_address) invoice.address = shipping.address;
      forder.shipping_option = 1;
      forder.shipping = shipping;
    } else {
      const ba_shipping_available = has_hub && (is_ngo || is_ccas) && hub && hub !== 'BEEOTOP';
      if (!ba_shipping_available) forder.hub = 'BEEOTOP';
      forder.shipping_option = 2;
    }

    if (invoice.contact_disabled) delete invoice.contact_disabled;
    if (invoice.address_disabled) delete invoice.address_disabled;
    if (invoice.use_contact_for_invoice) invoice.contact = contact;
    forder.invoice = invoice;

    forder.confirmation_url = `${document.location.origin}/order/confirm`;

//    console.log('Order sent', forder);

    fetch('/api/order/new', {
      method: 'POST',
      body: JSON.stringify({ order: forder }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK') {
          alert(`Merci pour votre commande. Vous allez recevoir dans quelques minutes une confirmation de votre commande à ${forder.contact.email}. Merci de valider formellement votre commande en cliquant dans le lien de cet email`);
          window.location = 'http://debout.fr/donner';
        } else {
          dispatch({
            type: STOP_LOADING,
          });
          alert('Nous avons rencontré un problème. Si le problème persiste veuillez nous contacter à l\'email diffusion@debout.fr');
        }
      })
      .catch(() => {
        dispatch({
          type: STOP_LOADING,
        });
        alert('Nous avons rencontré un problème. Si le problème persiste veuillez nous contacter à l\'email diffusion@debout.fr');
      });
  };
}

export function confirmOrder(id) {
  return dispatch => {
    fetch('/api/order/confirm', {
      method: 'POST',
      body: JSON.stringify({ order_id: id }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'OK') {
        dispatch({
          type: ORDER_CONFIRMED,
          order: data.order,
        });
      } else {
        dispatch({
          type: ORDER_NOT_CONFIRMED,
          error: data.error,
        });
      }
      dispatch({
        type: STOP_LOADING,
      });
    })
    .catch(error => {
      dispatch({
        type: ORDER_NOT_CONFIRMED,
        error,
      });
      dispatch({
        type: STOP_LOADING,
      });
    });
  };
}

export function createSubscription(subscription) {
  return dispatch => {
    dispatch({
      type: START_LOADING,
    });

//    console.log('Subscription sent', subscription);

    fetch('/api/subscription/new', {
      method: 'POST',
      body: JSON.stringify({ subscription }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'OK') {
        window.location = (data.response && data.response.invoice_url) || 'http://debout.fr/donner';
      } else {
        dispatch({
          type: STOP_LOADING,
        });
        alert('Nous avons rencontré un problème. Si le problème persiste veuillez nous contacter à l\'email abonnement@debout.fr');
      }
    })
    .catch(() => {
      dispatch({
        type: STOP_LOADING,
      });
      alert('Nous avons rencontré un problème. Si le problème persiste veuillez nous contacter à l\'email abonnement@debout.fr');
    });
  };
}
