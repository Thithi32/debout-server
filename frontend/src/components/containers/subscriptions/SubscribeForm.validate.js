import { formValidateFields } from "./../../../helpers";

const fields_validation = [
  { 
    name: "type",
    isRequired: "Veuillez choisir le type de votre abonnement" 
  },
  {
    name: 'subscriber',
    fields: [
      {
        name: 'contact',
        fields: [
          { 
            name: 'name',
            isRequired: "Le nom du destinaire de l'abonnement est obligatoire" 
          },
          { 
            name: 'email',
            isRequired: "L'email du destinaire de l'abonnement est obligatoire",
            isEmail: "L'email du destinaire de l'abonnement ne semble pas correct"  
          }
        ]
      },
      {
        name: 'address',
        fields: [
          { 
            name: 'address1',
            isRequired: "L'adresse du destinaire de l'abonnement doit contenir au moins une ligne" 
          },
          { 
            name: 'zip',
            isRequired: "Le code postal de l'adresse du destinaire de l'abonnement est obligatoire" 
          },
          { 
            name: 'city',
            isRequired: "La ville de l'adresse du destinaire de l'abonnement est obligatoire" 
          }
        ]
      },
    ]
  },
];

const validate = (values) => {
  const conditions = {
  }

  let errors = formValidateFields(fields_validation,values,conditions);

  if (!values.subscription_signed) {
    errors.subscription_signed = "Vous devez accepter les termes d'engagement de la commande";
  }

  if (!values.subscriber || !values.subscriber.contact || (!values.subscriber.contact.mobile && !values.subscriber.contact.phone)) {
    if (!errors.subscriber) errors.order = {};
    if (!errors.subscriber.contact) errors.order.contact = {};
    errors.subscriber.contact.mobile = "Veuillez renseigner au moins un numéro de téléphone";
  }

  return errors;
}

export default validate;