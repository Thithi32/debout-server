/* https://ashokfernandez.wordpress.com/2016/05/27/using-sendgrid-templates-with-node-js/ */
import config from './config'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY;
const MAIL_APP = process.env.MAIL_APP || config.MAIL_APP;

if (!SENDGRID_API_KEY) {
  console.log('!!!! Missing SENDGRID_API_KEY configuration !!!!!');
}

if (!MAIL_APP) {
  console.log('!!!! Missing MAIL_APP configuration !!!!!');
}

const fs = require('fs');

const template_replace = (text,object,base) => {
  base = base || "";
  for (var key in object) {
    let newbase = (base.length) ? base + "." + key : key;
    if (typeof(object[key]) === 'object') {
      text = template_replace(text,object[key],newbase);
    } else {
      text = text.replace(new RegExp("%" + newbase + "%","g"),object[key]);
    }
  }
  if (base === "") text = text.replace(/%.+%/g,'');
  return text;
}

class SendMail {

  order_new(order) {
    const self = this;
    console.log("Sending order_new");
    return new Promise(function(resolve, reject) {
      self.readFile('templates/order_new.html', reject, function (template) {
        const helper = require('sendgrid').mail;
        var mail = new helper.Mail(
          new helper.Email(MAIL_APP), 
          "Commande en ligne: " + order.company,
          new helper.Email(MAIL_APP), 
          new helper.Content('text/html', template_replace(template,order)));

        self.sendMail(mail.toJSON(),resolve,reject);
      });
    });
  }

  order_confirmation(order) {
    const self = this;
    console.log("Sending order_confirmation");
    return new Promise(function(resolve, reject) {
      self.readFile('./templates/order_confirmation.html', reject, function(template) {
        const helper = require('sendgrid').mail;
        var to_email = new helper.Email(order.contact.email);
        var mail = new helper.Mail(
          new helper.Email(MAIL_APP), 
          "Votre commande Debout a bien été enregistrée", 
          to_email, 
          new helper.Content('text/html', template_replace(template,order)));
     
        self.sendMail(mail.toJSON(),resolve,reject);
      });
    });
  }

  subscription_new(subscription) {
    const self = this;
    console.log("Sending subscription_new");
    return new Promise(function(resolve, reject) {
      self.readFile('templates/subscription_new.html', reject, function (template) {
        const helper = require('sendgrid').mail;
        var mail = new helper.Mail(
          new helper.Email(MAIL_APP), 
          "Abonnement en ligne: " + subscription.contact.fullname,
          new helper.Email(MAIL_APP), 
          new helper.Content('text/html', template_replace(template,subscription)));

        self.sendMail(mail.toJSON(),resolve,reject);
      });
    });
  }

  subscription_confirmation(subscription) {
    const self = this;
    console.log("Sending subscription_confirmation");
    return new Promise(function(resolve, reject) {
      self.readFile('./templates/subscription_confirmation.html', reject, function(template) {
        const helper = require('sendgrid').mail;
        var to_email = new helper.Email(subscription.contact.email);
        var mail = new helper.Mail(
          new helper.Email(MAIL_APP), 
          "Votre abonnement Debout a bien été enregistré", 
          to_email, 
          new helper.Content('text/html', template_replace(template,subscription)));
     
        self.sendMail(mail.toJSON(),resolve,reject);
      });
    });
  }

  readFile(file,reject,callback) {
    fs.readFile(file, 'utf8', function (err,template) {
      if (err) {
        console.log("Enable to read file " + file,err);
        reject("Enable to read file " + file);
      } else {
        callback(template);
      }
    });
  }

  sendMail(body,resolve,reject) {
    const sg = require('sendgrid')(SENDGRID_API_KEY);

    let request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: body 
    });

    sg.API(request).then(response => {
      console.log('Email sent OK');
      resolve(true);
     })
    .catch(error => {
      //error is an instance of SendGridError 
      //The full response is attached to error.response 
      console.log("Sendgrid API was unable to send email",error.response.statusCode);
      reject("Sendgrid API was unable to send email");
    });
  }

}

export default SendMail;