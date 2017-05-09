const fields_validation = [
  {
    name: "company",
    isRequired: "Le nom de votre structure est obligatoire"
  },
  {
    name: "nb_products",
    greater_than: {
      value: "0",
      message: "Veuillez sélectionnez le nombre d'exemplaires désirés"
    }
  },
  {
    name: 'order',
    fields:  [
      {
        name: 'contact',
        fields: [
          {
            name: 'name',
            isRequired: "Le nom du responsable de la commande est obligatoire"
          },
          {
            name: 'email',
            isRequired: "L'email du responsable de la commande est obligatoire",
            isEmail: "L'email du responsable de la commande ne semble pas correct"
          }
        ]
      }
    ]
  },
  {
    name: 'invoice',
    fields: [
      {
        name: 'address',
        condition: ['invoice_address'],
        fields: [
          {
            name: 'address1',
            isRequired: "L'adresse de facturation doit contenir au moins une ligne"
          },
          {
            name: 'zip',
            isRequired: "Le code postal de l'adresse de facturation est obligatoire"
          },
          {
            name: 'city',
            isRequired: "La ville de l'adresse de facturation est obligatoire"
          }
        ]
      },
      {
        name: 'contact',
        condition: ['invoice_contact'],
        fields: [
          {
            name: 'name',
            isRequired: "Le nom du responsable de la facturation est obligatoire"
          },
          {
            name: 'email',
            isRequired: "L'email du responsable de la facturation est obligatoire",
            isEmail: "L'email du responsable de la facturation ne semble pas correct"
          }
        ]
      }
    ]
  },
  {
    name: 'shipping',
    condition: ['shipping'],
    fields: [
      {
        name: 'address',
        condition: ['shipping'],
        fields: [
          {
            name: 'address1',
            isRequired: "L'adresse de livraison doit contenir au moins une ligne"
          },
          {
            name: 'zip',
            isRequired: "Le code postal de l'adresse de livraison est obligatoire"
          },
          {
            name: 'city',
            isRequired: "La ville de l'adresse de livraison est obligatoire"
          }
        ]
      },
      {
        name: 'contact',
        condition: ['shipping','shipping_contact'],
        fields: [
          {
            name: 'name',
            isRequired: "Le nom du contact pour la livraison est obligatoire"
          },
          {
            name: 'email',
            isRequired: "L'email du contact pour la livraison est obligatoire",
            isEmail: "L'email du contact pour la livraison ne semble pas correct"
          }
        ]
      }
    ]
  }
];

const validate = (values) => {
  const need_shipping = parseInt(values.shipping_option,10) !== 2;
  const conditions = {
    shipping: need_shipping,
    shipping_contact: !(values.shipping && values.shipping.use_contact_for_shipping),
    invoice_address: !need_shipping || !(values.invoice && values.invoice.use_shipping_address),
    invoice_contact: !(values.invoice && values.invoice.use_contact_for_invoice)
  }

  const re_email = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/; //'

  const checkIsRequired = (fields,values) => {
    let errors = {};
    fields.map((field) => {
      if (field.fields) {

        let checkError = true;
        if (field.condition) {
          for (var i in field.condition) {
            checkError = checkError && conditions[field.condition[i]];
          }
        }

        if (checkError) {
          errors[field.name] = checkIsRequired(field.fields,values[field.name] || {});
        }
      } else {
        if (field.greater_than ) {
          if (values[field.name] <= field.greater_than.value) {
            errors[field.name] = field.greater_than.message;
          }
        }
        if (field.isRequired && (!values[field.name] || !values[field.name].trim().length)) {
          errors[field.name] = field.isRequired;
        }
        if (field.isEmail && !re_email.test(values[field.name])) {
          errors[field.name] = field.isEmail;
        }

      }
      return true;
    });
    return errors;
  }

  let errors = checkIsRequired(fields_validation,values);

  if (!values.order_signed) {
    errors.order_signed = "Vous devez accepter les termes d'engagement de la commande";
  }

  if (!values.order || !values.order.contact || (!values.order.contact.mobile && !values.order.contact.phone)) {
    if (!errors.order) errors.order = {};
    if (!errors.order.contact) errors.order.contact = {};
    errors.order.contact.mobile = "Veuillez renseigner au moins un numéro de téléphone au responsable de la commande";
  }

  if (need_shipping && !values.shipping.use_contact_for_shipping && (!values.shipping.contact || (!values.shipping.contact.mobile && !values.shipping.contact.phone))) {
    if (!errors.shipping) errors.shipping = {};
    if (!errors.shipping.contact) errors.shipping.contact = {};
    errors.shipping.contact.mobile = "Pour la livraison, veuillez renseigner au moins un numéro de téléphone au contact de livraison";
  }

  return errors;
}

export default validate;