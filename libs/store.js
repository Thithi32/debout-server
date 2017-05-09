import moment from "moment"
import tz from "moment-timezone";

import Invoice from "./invoice";

import config from './../config';
const { GOOGLE_ORDER_DOC_KEY, GOOGLE_SUBSCRIPTION_DOC_KEY, GOOGLE_CREDS_CLIENT_EMAIL, GOOGLE_CREDS_PRIVATE_KEY } = config;

if (!GOOGLE_ORDER_DOC_KEY) {
  console.log('!!!! Missing GOOGLE_ORDER_DOC_KEY configuration !!!!!');
}

if (!GOOGLE_SUBSCRIPTION_DOC_KEY) {
  console.log('!!!! Missing GOOGLE_SUBSCRIPTION_DOC_KEY configuration !!!!!');
}

if (!GOOGLE_CREDS_CLIENT_EMAIL) {
  console.log('!!!! Missing GOOGLE_CREDS_CLIENT_EMAIL configuration !!!!!');
}

if (!GOOGLE_CREDS_PRIVATE_KEY) {
  console.log('!!!! Missing GOOGLE_CREDS_PRIVATE_KEY configuration !!!!!');
}


class Store {

  getFirstEmptyRow(sheet) {
    return new Promise(function(resolve, reject) {
      let offset = 0;
      for (i = 0; i < 20; i++) {
        offset = i * 100 + 1;
        sheet.getRows({
          offset: offset,
          limit: 100
        }, function( err, rows ){
          for (var idx in rows) {
            var row = rows[idx];
            console.log(idx,row);
            console.log(idx + offset,row.raisonsociale);
            if ((row.raisonsociale === "") && (idx + offset)) resolve(row);
          }
        });
      }

      reject(false);
    });
  }

  getOrderSheets(callback) {
    var GoogleSpreadsheet = require('google-spreadsheet');
    var doc = new GoogleSpreadsheet(GOOGLE_ORDER_DOC_KEY);

    var creds_json = {
      client_email: GOOGLE_CREDS_CLIENT_EMAIL,
      private_key: GOOGLE_CREDS_PRIVATE_KEY
    }

    doc.useServiceAccountAuth(creds_json, function(err) {
      if (err) {
        console.log("Google Service: authentication failed",err);
        callback( {} );
      } else {
        doc.getInfo(function(err, info) {
          if (err) {
            console.log("Google Service: unable to get doc info",err);
            callback( {} );
          } else {
            console.log('Loaded doc: '+info.title+' by '+info.author.email);
            const ordersSheet = info.worksheets.find((sheet) => { return sheet.title.toLowerCase() === "commandes" });
            const companiesSheet = info.worksheets.find((sheet) => { return sheet.title.toLowerCase() === "fournisseurs" });

            callback( {ordersSheet, companiesSheet});
          }
        });
      }
    });
  }

  getSubscriptionSheets(callback) {
    var GoogleSpreadsheet = require('google-spreadsheet');
    var doc = new GoogleSpreadsheet(GOOGLE_SUBSCRIPTION_DOC_KEY);

    var creds_json = {
      client_email: GOOGLE_CREDS_CLIENT_EMAIL,
      private_key: GOOGLE_CREDS_PRIVATE_KEY
    }

    doc.useServiceAccountAuth(creds_json, function(err) {
      if (err) {
        console.log("Google Service: authentication failed",err);
        callback( {} );
      } else {
        doc.getInfo(function(err, info) {
          if (err) {
            console.log("Google Service: unable to get doc info",err);
            callback( {} );
          } else {
            console.log('Loaded doc: '+info.title+' by '+info.author.email);
            const subscriptionsSheet = info.worksheets.find((sheet) => { return sheet.title.toLowerCase() === "abonnements" });

            callback( { subscriptionsSheet });
          }
        });
      }
    });
  }

  order_confirm(order_id) {
    const self = this;
    return new Promise(function(resolve, reject) {
      if (!order_id) {
        reject("La confirmation de la commande n'est pas possible sans le numéro de commande");
      }

      self.getOrderSheets(function( { ordersSheet }) {
        if (!ordersSheet) {
          reject("No 'Commandes' sheet in spreadsheet");
        } else {
          ordersSheet.getRows({
            query: "commande=" + order_id
          }, function( err, rows ){
            if (rows.length == 1) {
              let row = rows[0];

              row.confirm = moment().tz('Europe/Paris').format('DD/MM/YY, HH:mm:ss');
              row.save();

              resolve(rows[0]);
            } else {
              reject("Le numéro de la commande est incorrect")
            }
          });
        }
      });
    });
  }

  order_new(order) {
    const self = this;

    return new Promise(function(resolve, reject) {
      if (!order.company || !order.nb_products) {
        reject("Commande invalide pour manque d'informations");
      }

      self.getOrderSheets(function( { ordersSheet, companiesSheet }) {
        if (!ordersSheet || !companiesSheet) {
          reject("No 'Commandes' and 'Fournisseurs' sheets in spreadsheet");
        } else {
          ordersSheet.addRow({
            commande: order.id,
            raisonsociale: order.company,
            date:order.date,
            nbreex: order.nb_products,
            lieudelivraison: order.shipping_place || '',
            transport: order.transport || '',
            prixmagazine: order.price.toString().replace('.',',') || '',
            totalprixmagazines: order.subtotal.toString().replace('.',',') || 0,
            totaltransport: order.shipping_price.toString().replace('.',',') || 0,
            contactcivilite: order.contact.honorific || 'Mr',
            contactnom: order.contact.name || '',
            contactprenom: order.contact.firstname || '',
            contactemail: order.contact.email || '',
            contactportable: order.contact.mobile || '',
            contactfixe: order.contact.phone || '',
            commentairesclient: (order.bdd && order.bdd['Commentaires']) || '',
            commentairescommande: order.order_comment || ''
          }, (err) => {

            if (err) {
              reject("Unable to write new row in OrdersSheet");
            } else {
              let companyRow = {
                commande: order.id,
                raisonsociale: order.company,
                type: (order.is_ngo ? "Association" : (order.is_ccas ? "Mairie / CCAS" : 'Entreprise')),
                assoba: order.hasOwnProperty('hub') && (order.hub !== "BEEOTOP") ? "oui" : "non",
                hublivraison: order.hub || '',
                num: 12,
                exemplaires: order.nb_products,
                commentaires: (order.order_comment || '') + "\n" + ((order.bdd && order.bdd['Commentaires']) || '')
              }

              const parts = {"shipping": "livraison", "invoice": "facture"};
              for (var i in parts) {
                let name = parts[i];
                if (order[i]) {
                  let obj = order[i];

                  companyRow[`${name}raisonsociale`] = obj.company_name;
                  if (obj.contact) {
                    let contact = obj.contact;
                    companyRow[`${name}civilite`] = contact.honorific || 'Mr';
                    companyRow[`${name}nom`] = contact.name || '';
                    companyRow[`${name}prenom`] = contact.firstname || '';
                    companyRow[`${name}email`] = contact.email || '';
                    companyRow[`${name}portable`] = contact.mobile || '';
                    companyRow[`${name}fixe`] = contact.phone || '';
                  }
                  if (obj.address) {
                    let address = obj.address;
                    companyRow[`${name}adresse1`] = address.address1 || '';
                    companyRow[`${name}adresse2`] = address.address2 || '';
                    companyRow[`${name}cp`] = address.zip || '';
                    companyRow[`${name}ville`] = address.city || '';
                  }
                }
              }

              companiesSheet.addRow(companyRow, (err) => {

                if (err) {
                  reject("Unable to write new row in companiesSheet");
                } else {
                  resolve("OK");
                }

              }); // End companiesSheet addRow
            }
          }); // End getOrderSheets addRow
        }

      }); // End getSheets

    }); // End Promise
  }

  subscription_new(subscription) {
    const self = this;

    return new Promise(function(resolve, reject) {
      if (!subscription.type) {
        reject("Abonnement invalide pour manque d'informations");
      }

      self.getSubscriptionSheets(function( { subscriptionsSheet }) {
        if (!subscriptionsSheet) {
          reject("No 'Abonnements' sheet in spreadsheet");
        } else {
          let row = {
            abonnement: subscription.id || '',
            date: subscription.date || '',
            type: subscription.type || '',
            montant: '10,00',
            civilite: subscription.contact.honorific || 'Mr',
            nom: subscription.contact.name || '',
            prenom: subscription.contact.firstname || '',
            email: subscription.contact.email || '',
            portable: subscription.contact.mobile || '',
            fixe: subscription.contact.phone || '',
            raisonsociale: subscription.company_name || '',
            adresse1: subscription.address.address1 || '',
            adresse2: subscription.address.address2 || '',
            cp: subscription.address.zip || '',
            ville: subscription.address.city || '',
          };

          if (subscription.type === "solidaire") {
            row.montant = subscription.solidarity_price.toString().replace('.',',') || '';
            row.nbexp = subscription.solidarity_nb || 0;
            row["reçu"] = subscription.recept || '';
          }

          subscriptionsSheet.addRow(row, (err) => {
            if (err) {
              reject("Unable to write new row in subscriptionsSheet");
            } else {
              const invoice = new Invoice();
              invoice.subscription_new(subscription).then((message) => {
                resolve("OK");
              })
              .catch((error) => {
                reject(error);
              }) // End invoice.subscription_new
            }
          }); // End subscriptionSheet addRow
        }

      }); // End getSubscriptionSheets

    }); // End Promise
  }

} // End Store

export default Store;