import { formValidateFields } from './../../../helpers';

const fieldsValidation = [
  {
    name: 'type',
    isRequired: 'Veuillez choisir le type de votre abonnement',
  },
  {
    name: 'contact',
    fields: [
      {
        name: 'name',
        isRequired: 'Le nom du destinaire de l\'abonnement est obligatoire',
      },
      {
        name: 'email',
        isRequired: 'L\'email du destinaire de l\'abonnement est obligatoire',
        isEmail: 'L\'email du destinaire de l\'abonnement ne semble pas correct',
      },
    ],
  },
  {
    name: 'address',
    fields: [
      {
        name: 'address1',
        isRequired: 'L\'adresse du destinaire de l\'abonnement doit contenir au moins une ligne',
      },
      {
        name: 'zip',
        isRequired: 'Le code postal de l\'adresse du destinaire de l\'abonnement est obligatoire',
      },
      {
        name: 'city',
        isRequired: 'La ville de l\'adresse du destinaire de l\'abonnement est obligatoire',
      },
    ],
  },
];

const validate = (values) => {
  const conditions = {
  };

  const errors = formValidateFields(fieldsValidation, values, conditions);

  if (!values.subscription_signed) {
    errors.subscription_signed = "Vous devez accepter les termes d'engagement de la commande";
  }

  if (!values.contact || (!values.contact.mobile && !values.contact.phone)) {
    if (!errors.contact) errors.contact = {};
    errors.contact.mobile = 'Veuillez renseigner au moins un numéro de téléphone';
  }

  if (values.type === 'solidaire' && values.solidarity_price <= 10) {
    console.log(values.type, values.solidarity_price);
    errors.solidarity_price = "Le prix minimum de l'abonnement ne peut être inférieur à 10€.";
  }

  return errors;
};

export default validate;
