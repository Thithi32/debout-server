import express from 'express';

const app = express();

// PARSING COMPANIES FILE
let companies = [];
const csv=require('csvtojson');
csv()
.fromFile('./companies.csv')
.on('json',(jsonObj)=>{
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 

    companies.push(jsonObj);
})
.on('done',(error)=>{
  if (error) {
    console.log("Error while parsing companies");
  } else {
    console.log('Companies parsed successfully!');


    // ROUTES
    app.get('/api/companies', (req,res) => {
      res.json({ companies });
    });

    // START SERVER
    let port = process.env.port || 8080;
    app.listen(port, () => ('Server is running on port ' + port));    
  }
})
