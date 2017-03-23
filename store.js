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

  order_new(order) {
    const self = this;
    return new Promise(function(resolve, reject) {
      if (!order.company || !order.nb_products) {
        reject("Commande invalide pour manque d'informations");
      }

      var GoogleSpreadsheet = require('google-spreadsheet');
      var doc = new GoogleSpreadsheet('1LvsJd9EZa6Ta3AXC-xx-4OBnNHGtlnh7qL7JMqve5FY');

      var creds_json = {
        client_email: '577471873115-compute@developer.gserviceaccount.com',
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCqxEyJ36zb9sV1\nv7Ied2FOQKRKMwN6TB7Dad35FKlsS9dxwJP5tan/KFdVW4jmRRrvmFVYZ7gVyScd\nP9K9dRP/mnmYnZZDDPus02b6BdmP1E6xspoQIe+l4HbahmDEwyEKt1kQHpOju/6x\nGeK3nLY1Knyqu2zksE+XMsOPXirJ7UZ9GvlbnR9W0ISAYpF0KyCsDrKrYpArSgEh\nHvjAT5A9FQPeJnf2XE3axMFKrAeEMsoVjYdOgYQS6dvswxHhWqjqHCsR3Y6ocaFr\ns16EYbxJLwwLAAMSLMklLlmXybmAKUgCWP9Exc1a+AMiFXB4heHArgyJn59U4WSN\nXIf4luXdAgMBAAECggEAebkhAapBsi1txSgWlCbuYnQrZ4SDdxppV0vQYOr8dWh+\nMuRd1kJK4clkr0BnDhS2RZElTLXp/wV6bxv+YPPihHEdOc8iu7q2bxPltFSVJzPj\nwECaFuPJykh9D/l3YungVJ4qyxWwkabAvobAF7eKHc2iPaUJ0t1mblVOFpS+FV50\nvOavZ5r8Xoa/blr3JSTIJ6jH+8Fa+VZaO0cwOEU/+CaYTeAObur9ag+esk5wwGYj\nV8PNFwR+xENcfBVm+zO0RdEiBOJD2Tx32+2WhD+ZtgjyMo36lPh7oYko7bTr7V6K\nPE05X9jRnOUetnhDvz/m0KUvNVaIlv2EKnYkENDewQKBgQDiSwiBSUfKGxKM7/1H\nhnCuWnurFzwAhZV7cDrj3fSdDb4uISykBzF007FGEhcaZ88biMJ5qhrl05hL4G+E\nLeVdAT7J8Yencuh/SHcY527MKkv9vYU3p0AGh0ohqdKCJn3EY5CS2OlJ6mOyOOQ8\nGZ5IDzPHz1Mj16Cyo48Z4m+EbQKBgQDBLzWRJvPcESDuaWzIYUJF7YwrqW2B1tqV\nXaycIm+vYjlHUJyT7XMmSllPLw/qFjguxb8V7zpCKBfvnLLYdjym+VuCRP1vVJ3h\nWFAJNobDIaw0c7JNGPtB0b6n3vvs8jno3WUyv7+uMOy44WTsioF8JyJQjQCOjSvw\n80aYpQ6hMQKBgQCOLii82qchhBsGtG8F9qFr2uwi1mlbxpLiSOSncTiVSSI555wd\nv2tChRO3+/vKGnlVSnsuaEOYLXdeDTjj6tZWtkaWKYxbGGaeOpCh9B94Zgby+ZXv\nHsWqlGxudD4QilCxCQG4UlNZnsxfGUHFxS7fBbY6D7ikJ4IPW5a4472/jQKBgQC9\nbFIFCwHQhkcZHuyYqq02Lg/kfBQxXQAlt51Z13ZVrWVmpQdzEUB4iix6NTZQnQrn\n6eRNWK5yUifuPmMrVvxv6U+uM4GhmYHZhSOtdPa8/RaCs/NgH5+20Tg2GLJDitv3\nlqb1FQmZfsWPHws72S/QEftWqnuiS5CLia9uW2I18QKBgHQYoZG+5sccg9NG7sBB\njEby7GIjXWizyQZcKwZZzQqoIYCK9pdXIoCwZFwjyC0ZWhXVsIKdQBc2S471voQD\n4X7JcT3O3lNosecIzOOwwHA2FikUB8sPHacvajpTLger5EddYWF5RB0WGPH3r61A\nucxp2+Tf3Ue2+koOZTIcVr4M\n-----END PRIVATE KEY-----\n"
      }

      doc.useServiceAccountAuth(creds_json, function(err) {
        doc.getInfo(function(err, info) {
          if (!err) {
            console.log('Loaded doc: '+info.title+' by '+info.author.email);
            const ordersSheet = info.worksheets.find((sheet) => { return sheet.title.toLowerCase() === "commandes" });
            const companiesSheet = info.worksheets.find((sheet) => { return sheet.title.toLowerCase() === "fournisseurs" });

            if (!ordersSheet || !companiesSheet) {
              reject("No 'Commandes' and 'Fournisseurs' sheets in spreadsheet");
            } else {

              ordersSheet.addRow({ 
                commande: order.id,
                raisonsociale: order.company,
                date:order.date,
                lignebdd:(order.bdd && order.bdd.line) || '',
                nbreex: order.nb_products,
                lieudelivraison: order.shipping_place || '',
                transport: order.transport || '',
                prixmagazine: order.price || '',
                totalprixmagazines: order.subtotal || '',
                totaltransport: order.shipping_price || '',
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
                  totalprixmagazines: order.subtotal || '',
                  totaltransport: order.shipping_price || '',
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

                })
                }

              })

  /*
              self.getFirstEmptyRow(ordersSheet)
                .then((orderRow) => {

                  orderRow.raisonsociale = "Secours Catho";
                  orderRow.save();

                  resolve("OK");

                })
                .catch(() => {
                  reject("'Commandes' sheet has no free rows");
                })*/

            }
          } else {
            console.log(err);
            reject(err);
          }

        });
      });
      });


  }
}

export default Store;