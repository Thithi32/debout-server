import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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

        app.post('/api/order', (req,res) => {
          console.log(req.body.order);
          if (req.body.order)
            res.json({ status: "OK", order: req.body.order });
          else
            res.json({ status: "ERROR" });
        });

        // START SERVER
        let port = process.env.port || 8080;
        console.log('Server is running on port ' + port);
        app.listen(port, () => ('Server is running on port ' + port));
      }
    })
  }
})
