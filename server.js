import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import moment from "moment";
import tz from "moment-timezone";
import uid from "uid";

import SendMail from "./libs/sendmail";
import Store from "./libs/store";

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const packs = [
  { nb: 10, shipping: 10 },
  { nb: 25, shipping: 22 },
  { nb: 50, shipping: 30 },
  { nb: 100, shipping: 38 },
  { nb: 150, shipping: 42 },
  { nb: 200, shipping: 50 },
  { nb: 250, shipping: 53 },
  { nb: 300, shipping: 58 },
  { nb: 350, shipping: 65 },
  { nb: 400, shipping: 70 },
  { nb: 450, shipping: 80 },
  { nb: 500, shipping: 90 },
  { nb: 600, shipping: 102 },
  { nb: 700, shipping: 120 },
  { nb: 800, shipping: 135 },
  { nb: 900, shipping: 150 },
  { nb: 1000, shipping: 170 }
];

const validOrder = (order) => {

  order['mag_num'] = 13;

  let fullname = [];
  fullname.push(order.contact.firstname);
  fullname.push(order.contact.name);
  order.contact.fullname = fullname.join(' ');

  order['price'] = (order.is_ccas || order.is_ngo) ? 0.5 : 1.5;
  order['subtotal'] = order['price'] * order['nb_products'];
  order['shipping_price'] = 0;

  if (order['shipping_option'] === 1) {
    for (var i = 0; i < packs.length; i++) {
      if (packs[i].nb === parseInt(order['nb_products'], 10)) {
        order['shipping_price'] = packs[i].shipping;
      }
    }
    order['shipping_place'] = (order.shipping && order.shipping.company_name) || order['company'];
  } else {
    order['shipping_place'] = order['hub'];
  }

  order['total'] = order['subtotal'] + order['shipping_price'];

  const toMoney = (num) => ( num.toFixed(2).replace('.',',') + "€" );
  ['price','subtotal','shipping_price','total'].map((f) => ( order[f] = toMoney(order[f])));

  order['date'] = moment().tz('Europe/Paris').format('DD/MM/YY, HH:mm:ss');
  const id = uid().toUpperCase();
  order['id'] = `${order.mag_num}_${id}`;

  let bdd = findCompany(order['company']);
  if (bdd) order['bdd'] = bdd;

  order['transport'] = (order.nb_products > 450) || (order.shipping_option === 2) ? "OPTITRANS" : "EUROPE ROUTAGE";

  const getContactFullname = (contact) => {
    let contact_fullname = [
      (contact.honorific && contact.honorific.length!==0) ? contact.honorific : "M",
      (contact.name)
    ];
    if (contact.firstname) contact_fullname.push(contact.firstname);
    return contact_fullname.join(' ');
  }

  const getAddressFull = (address) => {
    let address_full = [
      address.address1
    ];
    if (address.address2 && address.address2.trim().length) address_full.push(address.address2);
    address_full.push(address.zip + ' ' + address.city);
    return address_full.join("<br />");
  }

  if (order.invoice) {
    let full = [
      order.invoice.company_name || order.company,
      getContactFullname(order.invoice.contact),
      getAddressFull(order.invoice.address)
    ];
    order.invoice.full = full.join("<br />");
  }

  if (order['shipping_option'] === 2) {
    let hub = findHub(order['hub']);
    if (hub) {
      let full = [ hub["NOM 1"] + " " + hub["NOM 2"] ];
      if (hub["ADRESSE 1"].length) full.push(hub["ADRESSE 1"]);
      if (hub["ADRESSE 2"].length) full.push(hub["ADRESSE 2"]);
      full.push(hub["CP"] + " " + hub["VILLE"]);
      full.push("Tel: " + hub["TELEPHONE"]);
      order.shipping = {
        full: full.join('<br/>'),
      }
      if (hub["OUVERTURE"].length) {
        order.shipping.opendays = "<p>Retrait possible: <strong>" + hub["OUVERTURE"] + "</strong></p>";
      }
    } else {
      order.shipping = {
        full: "BEEOTOP de Paris<br/>14 boulevard de Douaumont</br>75017 Paris"
      }
    }

  } else {
    if (order.shipping) {
      let full = [
        order.shipping.company_name || order.company,
        getContactFullname(order.shipping.contact),
        getAddressFull(order.shipping.address)
      ];
      order.shipping.full = full.join("<br />");
    } else {
      console.log("Error: shipping should be option 2 or having shipping details");
    }
  }

  console.log("Order received and filtered",order);

  return order;
}

const validSubscription = (subscription) => {

  let fullname = [];
  fullname.push(subscription.contact.firstname);
  fullname.push(subscription.contact.name);
  subscription.contact.fullname = fullname.join(' ');

  subscription.price = (subscription.type === 'solidaire') ? subscription.solidarity_price : 10;
  const toMoney = (num) => ( parseInt(num,10).toFixed(2).replace('.',',') + "€" );
  ['price'].map((f) => ( subscription[f] = toMoney(subscription[f])));

  subscription.recept = (subscription.type === 'solidaire') ? ((subscription.donation_recept === true) ? "oui" : "non") : '';

  subscription['date'] = moment().tz('Europe/Paris').format('DD/MM/YY, HH:mm:ss');
  subscription['id'] = uid().toUpperCase();

  console.log("subscription received and filtered",subscription);

  return subscription;
}

const findCompany = (name) => {
  return companies.find(function(company) { return company['Raison sociale'].toLowerCase() === name.toLowerCase() })
}

const findHub = (name) => {
  return hubs.find(function(hub) { return hub['NOM 1'].toLowerCase() + " " + hub['NOM 2'].toLowerCase() === name.toLowerCase() })
}


// PARSING COMPANIES FILE
let companies = [];
let hubs = [];
let line = 2
const csv=require('csvtojson');
csv()
.fromFile('./bases/companies.csv')
.on('json',(jsonObj)=>{
  jsonObj.line = line++;
  companies.push(jsonObj);
})
.on('done',(error)=>{
  if (error) {
    console.log("Error while parsing companies");
  } else {
    console.log('Companies parsed successfully!');

    line = 2;
    csv()
    .fromFile('./bases/hubs.csv')
    .on('json',(jsonObj)=>{
      jsonObj.line = line++;
      hubs.push(jsonObj);
    })
    .on('done',(error)=>{
      if (error) {
        console.log("Error while parsing hubs");
      } else {
        console.log('Hubs parsed successfully!');

        // ROUTES
        app.get('/api/companies', (req,res) => {
          res.json({ companies });
        });

        app.get('/api/hubs', (req,res) => {
          res.json({ hubs });
        });

        app.post('/api/order/confirm', (req,res) => {
          const order_id = req.body.order_id;
          if (!order_id) {
            res.json({ status: "ERROR", error: "Le numéro de commande n'est pas renseigné" });
          } else {
            const store = new Store();
            store.order_confirm(order_id)
              .then((order) => res.json({
                status: "OK",
                order: order
              }))
              .catch((error) => {
                console.log("- ERROR -- " + error,order_id);
                res.json({ status: "ERROR", error: error });
              });
          }
        });

        app.post('/api/order/new', (req,res) => {
          let mail = new SendMail();
          const order = validOrder(req.body.order);
          mail.order_new(order)
          .then((message) => {
            const store = new Store();
            store.order_new(order)
              .then((message2) => {
                mail.order_confirmation(order)
                  .then((message3) => res.json({
                    status: "OK",
                    response: {
                      'order_new': message,
                      'store_order': message2,
                      'order_confirmation': message3
                    }
                  }))
                  .catch((error) => {
                    console.log("- ERROR -- " + error,order);
                    res.json({ status: "ERROR", error });
                  })
              })
              .catch((error) => {
                console.log("- ERROR -- " + error,order);
                res.json({ status: "ERROR", error });
              })
          })
          .catch((error) => {
            console.log("- ERROR -- " + error,order);
            res.json({ status: "ERROR", error });
          })
        })

        app.post('/api/subscription/new', (req,res) => {
          let mail = new SendMail();
          const subscription = validSubscription(req.body.subscription);
          mail.subscription_new(subscription)
          .then((message) => {
            const store = new Store();
            store.subscription_new(subscription)
              .then(({ message2, invoice_url }) => res.json({
                status: "OK",
                response: {
                  'mail_subscription_new': message,
                  'store_subscription_new': message2,
                  invoice_url,
                }
              }))
              .catch((error) => {
                console.log("- SUBSCRIPTION ERROR -- " + error,subscription);
                res.json({ status: "ERROR", error });
              })
          })
          .catch((error) => {
            console.log("- SUBSCRIPTION ERROR -- " + error,subscription);
            res.json({ status: "ERROR", error });
          })
        })

        // Serve static assets
        app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));

        // Always return the main index.html, so react-router render the route in the client
        app.get('*', (req, res) => {
          res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
        });

        // START SERVER
        let port = process.env.PORT || 8081;
        console.log('Server is running on port ' + port);
        app.listen(port, () => ('Server is running on port ' + port));
      }
    })
  }
})
