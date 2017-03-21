import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import sendMail from "./sendmail";

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

  let fullname = [];
  fullname.push(order.contact.firstname);
  fullname.push(order.contact.name);
  order.contact.fullname = fullname.join(' ');

  order['price'] = (order.is_ccas || order.is_ngo) ? .5 : 1.5;
  order['subtotal'] = order['price'] * order['nb_products'];
  order['shipping_price'] = 0;

  for (var i = 0; i < packs.length; i++) {
    if (packs[i].nb === parseInt(order['nb_products'], 10)) {
      order['shipping_price'] = packs[i].shipping;
    }
  }

  if (order['shipping_option'] === 2) order['shipping'] = { hub:  order['hub'] };

  order['total'] = order['subtotal'] + order['shipping_price'];

  return order;
}

// PARSING COMPANIES FILE
let companies = [];
let hubs = [];
const csv=require('csvtojson');
csv()
.fromFile('./companies.csv')
.on('json',(jsonObj)=>{
    companies.push(jsonObj);
})
.on('done',(error)=>{
  if (error) {
    console.log("Error while parsing companies");
  } else {
    console.log('Companies parsed successfully!');

    csv()
    .fromFile('./hubs.csv')
    .on('json',(jsonObj)=>{
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

        app.get('/mail/test', (req,res) => {

          let order = {
            "company": "Epicerie Solidaire -Cœur de Nacre Entraide",
            "is_ngo": true,
            "is_ccas": false,
            "has_hub": true,
            "hub": "BANQUE ALIMENTAIRE DU CALVADOS",
            "nb_products": "100",
            "shipping_option": 2,
            "contact": {
              "name": "Delbart",
              "firstname": "Thierry",
              "email": "tdelbart@yahoo.fr",
              "mobile": "998007651",
              "phone": "30763225"
            },
            "invoice": {
              "address": {
                "address1": "204 rue de Crimée",
                "address2": "  ",
                "zip": "75019",
                "city": "PARIS"
              },
              "use_shipping_address": false,
              "contact": {
                "honorific": "Mme",
                "name": "CHARLES",
                "email": "berengere.charles@voisin-malin.fr",
                "mobile": "06 61 23 73 43",
                "phone": "01 42 09 59 39"
              },
              "use_contact_for_invoice": false
            }
          };

          let mail = new sendMail();
          mail.new_order(validOrder(order))
            .then((message)=> res.json({ status: "OK", message }))
            .catch((error) => res.json({ status: "ERROR", error }));
        })

        app.post('/api/order', (req,res) => {
          let mail = new sendMail();
          mail.new_order(validOrder(req.body.order))
            .then((message)=> res.json({ status: "OK", message }))
            .catch((error) => res.json({ status: "ERROR", error }));

        });

        app.get('/', (req,res) => {
          res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
        })

        app.get('/*', (req,res) => {
          res.sendFile(path.join(__dirname + '/frontend/build' + req.originalUrl));
        })

        // START SERVER
        let port = process.env.PORT || 8081;
        console.log('Server is running on port ' + port);
        app.listen(port, () => ('Server is running on port ' + port));
      }
    })
  }
})
