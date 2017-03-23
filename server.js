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

  order['shipping_place'] = (order['shipping_option'] === 2) ? order['hub'] : order['company'];

  order['total'] = order['subtotal'] + order['shipping_price'];

  return order;
}

const findCompany = (companies, name) => {
  return companies.find(function(company) { return tolower(company['Raison sociale']) === tolower(name) })
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
          let mail = new sendMail();
          const order = validOrder(req.body.order);
          mail.order_new(order)
            .then((message) => {
              mail.order_confirmation(order)
                .then((message2)=> res.json({ status: "OK", response: {'order_new': message, 'order_confirmation': message2 }}))
                .catch((error) => res.json({ status: "ERROR", error }));
            })
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
