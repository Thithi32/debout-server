/* https://ashokfernandez.wordpress.com/2016/05/27/using-sendgrid-templates-with-node-js/ */

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