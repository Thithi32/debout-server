/* https://ashokfernandez.wordpress.com/2016/05/27/using-sendgrid-templates-with-node-js/ */

// Dev keys, use enviromnent variables instead
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "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";
const SENDGRID_API_ID = process.env.SENDGRID_API_ID || "oAO-B7_nTtGXLLDhf4G7yA";
const MAIL_APP = process.env.MAIL_APP || "tdelbart@gmail.com";

const fs = require('fs');

const replace = (text,object,base) => {
  base = base || "";
  for (var key in object) {
    let newbase = (base.length) ? base + "." + key : key;
    if (typeof(object[key]) === 'object') {
      text = replace(text,object[key],newbase);
    } else {
      text = text.replace("%" + newbase + "%",object[key]);
    }
  }
  if (base === "") text = text.replace(/%.+%/g,'');
  return text;
}

class sendMail {

  new_order(order) {
    return new Promise(function(resolve, reject) {
      const sg = require('sendgrid')(SENDGRID_API_KEY);
      const helper = require('sendgrid').mail;

      fs.readFile('./templates/new_order.html', 'utf8', function (err,template) {

console.log("Starting sending mail");
        if (err) {
          console.log(err)
          reject();
        }

        var to_email = new helper.Email(order.contact.email);
        var mail = new helper.Mail(
          new helper.Email(MAIL_APP), 
          "Votre commande Debout a bien été enregistrée", 
          to_email, 
          new helper.Content('text/html', replace(template,order)));

        let request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });
     
        return sg.API(request).then(response => {
          console.log('Email sent OK');
          resolve();
         })
        .catch(error => {
          //error is an instance of SendGridError 
          //The full response is attached to error.response 
          console.log(error.response.statusCode);
          reject();
        });

      });
    });
  }

}


export default sendMail;