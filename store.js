import config from './config'
import moment from "moment"
import tz from "moment-timezone";

const GOOGLE_DOC_KEY = process.env.GOOGLE_DOC_KEY || config.GOOGLE_DOC_KEY;
const GOOGLE_CREDS_CLIENT_EMAIL = process.env.GOOGLE_CREDS_CLIENT_EMAIL || config.GOOGLE_CREDS_CLIENT_EMAIL;
const GOOGLE_CREDS_PRIVATE_KEY = process.env.GOOGLE_CREDS_PRIVATE_KEY || config.GOOGLE_CREDS_PRIVATE_KEY;

if (!GOOGLE_DOC_KEY) {
  console.log('!!!! Missing GOOGLE_DOC_KEY configuration !!!!!');
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

  getSheets(callback) {
    var GoogleSpreadsheet = require('google-spreadsheet');
    var doc = new GoogleSpreadsheet(GOOGLE_DOC_KEY);

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

  order_confirm(order_id) {
    const self = this;
    return new Promise(function(resolve, reject) {
      if (!order_id) {
        reject("La confirmation de la commande n'est pas possible sans le numéro de commande");
      }

      self.getSheets(function( { ordersSheet }) {
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

      self.getSheets(function( { ordersSheet, companiesSheet }) {
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
          }); // End orderSheet addRow
        }

      }); // End getSheets

    }); // End Promise
  }

} // End Store

export default Store;