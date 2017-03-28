import config from './config'
import moment from "moment"

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

              row.confirm = moment().format('DD/MM/YY, HH:mm:ss');
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
            prixmagazine: order.price || '',
            totalprixmagazines: order.subtotal || '',
            totaltransport: order.shipping_price || '',
            contactcivilite: order.contact.honorific || 'M',
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

              companiesSheet.addRow({ 
                commande: order.id,
                raisonsociale: order.company,
                type: (order.is_ngo ? "Association" : (order.is_ccas ? "Mairie / CCAS" : '')),
                assoba: order.hasOwnProperty('hub') ? "oui" : "non",
                hublivraison: order.hub || '',
                num: 12,
                exemplaires: order.nb_products,
                livraisoncivilite: (order.shipping && order.shipping.contact && order.shipping.contact.honorific) || '',
                livraisonnom: (order.shipping && order.shipping.contact && order.shipping.contact.name) || '',
                livraisonprenom: (order.shipping && order.shipping.contact && order.shipping.contact.firstname) || '',
                livraisonemail: (order.shipping && order.shipping.contact && order.shipping.contact.email) || '',
                livraisonportable: (order.shipping && order.shipping.contact && order.shipping.contact.mobile) || '',
                livraisonfixe: (order.shipping && order.shipping.contact && order.shipping.contact.phone) || '',
                livraisonadresse1: (order.shipping && order.shipping.address && order.shipping.address.address1) || '',
                livraisonadresse2: (order.shipping && order.shipping.address && order.shipping.address.address2) || '',
                livraisoncp: (order.shipping && order.shipping.address && order.shipping.address.zip) || '',
                livraisonville: (order.shipping && order.shipping.address && order.shipping.address.city) || '',
                facturecivilite: (order.invoice && order.invoice.contact && order.invoice.contact.honorific) || '',
                facturenom: (order.invoice && order.invoice.contact && order.invoice.contact.name) || '',
                factureprenom: (order.invoice && order.invoice.contact && order.invoice.contact.firstname) || '',
                factureemail: (order.invoice && order.invoice.contact && order.invoice.contact.email) || '',
                factureportable: (order.invoice && order.invoice.contact && order.invoice.contact.mobile) || '',
                facturefixe: (order.invoice && order.invoice.contact && order.invoice.contact.phone) || '',
                factureadresse1: (order.invoice && order.invoice.address && order.invoice.address.address1) || '',
                factureadresse2: (order.invoice && order.invoice.address && order.invoice.address.address2) || '',
                facturecp: (order.invoice && order.invoice.address && order.invoice.address.zip) || '',
                factureville: (order.invoice && order.invoice.address && order.invoice.address.city) || '',
                commentaires: (order.order_comment || '') + "\n" + ((order.bdd && order.bdd['Commentaires']) || '')
              }, (err) => {

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