import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import SendMail from "./sendmail";
import Store from "./store";
import moment from "moment";

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

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

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

  order['shipping_place'] = (order['shipping_option'] === 2) ? order['hub'] : order['company'];

  order['total'] = order['subtotal'] + order['shipping_price'];

  order['date'] = moment().format('DD/MM/YY, HH:mm:ss');
  order['id'] = (moment().format('YYMMDDHHmmss') + order.company).hashCode();

  let bdd = findCompany(order['company']);
  if (bdd) order['bdd'] = bdd;

  order['transport'] = (order.nb_products > 450) || (order.shipping_option === 2) ? "OPTITRANS" : "EUROPE ROUTAGE";

  return order;
}

const findCompany = (name) => {
  return companies.find(function(company) { return company['Raison sociale'].toLowerCase() === name.toLowerCase() })
}

// PARSING COMPANIES FILE
let companies = [];
let hubs = [];
let line = 2
const csv=require('csvtojson');
csv()
.fromFile('./companies.csv')
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
    .fromFile('./hubs.csv')
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

        app.post('/api/order', (req,res) => {
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
        });

        app.get('/test', (req,res) => {
          const store = new Store();

          store.order_new()
            .then((message) => {
              res.json({ status: "OK", message });
            })
            .catch((error) => res.json({ status: "ERROR", error }));
        })

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
