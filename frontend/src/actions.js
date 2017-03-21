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
    console.log(JSON.stringify(order));
    fetch("/api/order", { 
      method: "POST", 
      body: JSON.stringify( { order }),
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