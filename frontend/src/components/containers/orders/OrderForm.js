import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchHubs, createOrder } from "./../../../actions";
import { Field, reduxForm, formValueSelector, FormSection, change as changeFieldValue } from 'redux-form';
import OrderFormTable from "./OrderFormTable";
import OrderShippingOptions from "./OrderShippingOptions";
import CompanyAutoComplete from "./../companies/CompanyAutoComplete";
import { ContactUs, FormGroupInput, FormInput } from "./../../widgets";

const toMoney = (num) => ( num.toFixed(2).replace('.',',') + "€" );

const packs = [
  { nb: 10, shipping: 10 },
  { nb: 25, shipping: 22 },
  { nb: 50, shipping: 30 },
  { nb: 100, shipping: 38 },
  { nb: 150, shipping: 42 },
  { nb: 200, shipping: 50 },
  { nb: 250, shipping: 53 },
  { nb: 300, shipping: 58 },
  { nb: 350, shipping: 65 },
  { nb: 400, shipping: 70 },
  { nb: 450, shipping: 80 },
  { nb: 500, shipping: 90 },
  { nb: 600, shipping: 102 },
  { nb: 700, shipping: 120 },
  { nb: 800, shipping: 135 },
  { nb: 900, shipping: 150 },
  { nb: 1000, shipping: 170 }
];


const renderInputError = ({input, meta, ...props}) => (
  <div>
  { meta.error &&
    <div {...props} className="error">
      <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
      <span className="sr-only">Erreur:</span>
      &nbsp;{meta.error}
    </div>
  }
  </div>
)

const FormHonorific = ({ input, label, meta, ...props}) => (
  <select {...input} {...props}>
    <option value="M">M</option>
    <option value="Mme">Mme</option>
  </select>
)

const Section = (props) => (
  <FormSection name={props.name}>
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title title">{ props.title }</h3>
      </div>
      <div className="panel-body">
        {props.children}
      </div>
    </div>
  </FormSection>
)

const FieldNbProducts = ({ input, price, meta: { touched, error }, ...props}) => (
  <div className={ touched && error && ' error' }>
    <select {...input} {...props}>
        <option key={ 0 } value="0">Choisir le nombre d&#39;exemplaires</option>
      { packs.map((pack,i) =>
        <option key={ i } value={ pack.nb }>{ pack.nb } exemplaires = { toMoney(pack.nb * price) }</option>
      )}
    </select>
    { touched && error && <div className="form-message"><small>{error}</small></div> }
  </div>
)

class Address extends Component {
  render() {
    const name = this.props.name || 'address';
    return (
      <FormSection name={name}>
        <div className="form-group">
          { this.props.title &&
            <label htmlFor="address1">{ this.props.title }</label>
          }
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} className="form-control" type="text" name="address1" placeholder="Ligne 1 *" disabled={this.props.disabled} />
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} className="form-control" type="text" name="address2" placeholder="Ligne 2" disabled={this.props.disabled} />
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} className="form-control" type="text" name="zip" placeholder="Code postal *" disabled={this.props.disabled} />
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} className="form-control" type="text" name="city" placeholder="Commune *" disabled={this.props.disabled} />
        </div>
      </FormSection>
    )
  }
}

class AddressDisable extends Component {
  render() {
    const { disabled, ...props } = this.props;
    return (
      <div>
        { !disabled &&
          <div>
            <Address { ...props } />
            <div className="hide">
              <Address name="address_disabled" disabled { ...props } />
            </div>
          </div>
        }
        { disabled &&
          <div>
            <div className="hide">
              <Address { ...props } />
            </div>
            <Address name="address_disabled" disabled { ...props } />
          </div>
        }
      </div>
    )
  }
}

class Contact extends Component {
  render() {
    const name = this.props.name || 'contact';
    const section = this.props.section || '';
    const mobile_label = "Téléphone mobile" + ((this.props.needPhone) ? " ¹" : "");
    const phone_label = "Téléphone fixe" + ((this.props.needPhone) ? " ¹" : "");
    return (
      <FormSection name={name}>
        <div className="form-group contact-form">
          { this.props.title &&
            <label>{ this.props.title }</label>
          }
          <Field name="honorific" onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} label="Civilité" component={FormHonorific} disabled={this.props.disabled} className="honorific form-control"/>
          <div className="name-group">
            <Field name="name" onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} placeholder="Nom *" disabled={this.props.disabled} component="input" type="text" className="form-control"/>
            <Field name="firstname" onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }} placeholder="Prénom" disabled={this.props.disabled} component="input" type="text" className="form-control"/>
          </div>
          <Field name={`${section}.${name}.name`} component={renderInputError} />
          <div className="input-group email-group">
            <span className="input-group-addon" id="email_label"><i className="glyphicon glyphicon-envelope"></i></span>
            <Field name="email" placeholder="Email *" disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="email_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }}/>
          </div>
          <Field name={`${section}.${name}.email`} component={renderInputError} />
          <div className="input-group mobile-group">
            <span className="input-group-addon" id="mobile_label"><i className="glyphicon glyphicon-phone"></i></span>
            <Field name="mobile" placeholder={mobile_label} disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="mobile_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }}/>
          </div>
          <div className="input-group phone-group">
            <span className="input-group-addon" id="phone_label"><i className="glyphicon glyphicon-phone-alt"></i></span>
            <Field name="phone" placeholder={phone_label} disabled={this.props.disabled} component="input" type="text" className="form-control" aria-describedby="phone_label"
               onChange={(e)=>{ this.props.onChange && this.props.onChange(e); }}/>
          </div>
          <Field name={`${section}.${name}.mobile`} component={renderInputError} />
        </div>
      </FormSection>
    )
  }
}

class ContactDisable extends Component {
  render() {
    const { disabled, ...props } = this.props;
    return (
      <div>
        { !disabled &&
          <div>
            <Contact { ...props } />
            <div className="hide">
              <Contact name="contact_disabled" disabled { ...props } />
            </div>
          </div>
        }
        { disabled &&
          <div>
            <div className="hide">
              <Contact { ...props } />
            </div>
            <Contact name="contact_disabled" disabled { ...props } />
          </div>
        }
      </div>
    )
  }
}

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
            isRequired: "L'email du responsable de la commande est obligatoire"
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
            isRequired: "L'email du responsable de la facturation est obligatoire"
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
            isRequired: "L'email du contact pour la livraison est obligatoire"
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
      }
      return true;
    });
    return errors;
  }

  let errors = checkIsRequired(fields_validation,values);

  if (!values.order_signed) {
    errors.order_signed = "Vous devez accepter les termes d'engagement de la commande";
  }

  if (values.shipping.use_contact_for_shipping && (!values.order || !values.order.contact || (!values.order.contact.mobile && !values.order.contact.phone))) {
    if (!errors.order) errors.order = {};
    if (!errors.order.contact) errors.order.contact = {};
    errors.order.contact.mobile = "Pour la livraison, veuillez renseigner au moins un numéro de téléphone";
    errors.order.contact.phone = errors.order.contact.mobile;
  }

  if (!values.shipping.use_contact_for_shipping && (!values.shipping.contact || (!values.shipping.contact.mobile && !values.shipping.contact.phone))) {
    if (!errors.shipping) errors.shipping = {};
    if (!errors.shipping.contact) errors.shipping.contact = {};
    errors.shipping.contact.mobile = "Pour la livraison, veuillez renseigner au moins un numéro de téléphone au contact de livraison";
    errors.shipping.contact.phone = errors.shipping.contact.mobile;
  }

  return errors;
}

class OrderForm extends Component {

  constructor () {
    super();
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.hubs.length && !this.state.hubsFetched) {
      this.props.fetchHubs();
      this.setState({ hubsFetched: true});
    }
  }

  getHubOptions() {
    return this.props.hubs.map((hub, idx) => {
      let name = hub['NOM 1'] + " " + hub['NOM 2'];
      return { key: idx, value: name, text: name}; //hub['BA']
    });
  }

  getHubOption(name) {
    if (!name || name === "BEEOTOP") {
      return { name: "BEEOTOP" }
    } else {
      let hub = this.props.hubs.find((hub) => {
        let hub_name = hub['NOM 1'] + " " + hub['NOM 2'];
        return hub_name.toLowerCase() === name.toLowerCase();
      });

      hub.name = hub['NOM 1'] + " " + hub['NOM 2'];
      hub.address_inline = hub['ADRESSE 1'] + ' ' + hub['CP'] + ' ' + hub['VILLE'];
      return hub;
    }
  }

  FieldHub(fieldProps) {
    let { options, ...other } = fieldProps;
    return (
      <Field {...other} component="select">
          <option key={ "BEEOTOP" } value={ "BEEOTOP" }>Choisir votre Banque Alimentaire</option>
        { options.map((option) =>
          <option key={ option.key } value={ option.value }>{ option.text }</option>
        )}
      </Field>
    )
  }

  checkDeliveryOptions(e, value) {
    const form = this.props.order;
    const target = e.target.name;
    const is_ngo = (target === "is_ngo") ? value : form.values.is_ngo;
    const is_ccas = (target === "is_ccas") ? value : form.values.is_ccas;
    if (!is_ngo && !is_ccas) {
      this.props.change('shipping_option','1');
    }
  }

  onCompanyChange(company) {

    const company_name = company['Raison sociale'];

    let invoice_address = {
        address1: company["(facture)\nAdresse"],
        zip: company["(facture)\nCP"],
        city: company["(facture)\nVille"]
    }
    const has_invoice_address = invoice_address.address1 && invoice_address.zip && invoice_address.city;

    let shipping_address = {
      address1: company["(livraison)\nAdresse 1"],
      address2: company["(livraison)\nAdresse 2"],
      zip: company["(livraison)\nCP"],
      city: company["(livraison)\nVille"]
    }
    const has_shipping_address = shipping_address.address1 && shipping_address.zip && shipping_address.city;

    const invoice_company_name = company["(facture)\nRaison Sociale"];

    let invoice_contact = {
        honorific: company["(facture)\nCivilité"],
        name: company["(facture)\nNom"],
        email: company["(facture)\nMail"],
        mobile: company["(facture)\nportable"],
        phone: company["(facture)\nfixe"] || company["(facture)\nfixe "]
    }
    const has_invoice_contact = invoice_contact.name && invoice_contact.email;

    let shipping_contact = {
        honorific: company["(livraison)\nCivilité"],
        name: company["(livraison)\nNom"],
        firstname: company["(livraison)\nPrénom"],
        email: company["(livraison)\nMail"],
        mobile: company["(livraison)\nportable"],
        phone: company["(livraison)\nfixe"] || company["(livraison)\nfixe "]
    }
    const has_shipping_contact = shipping_contact.name && shipping_contact.email;

    const hub = (this.props.hubs.find((hub) => { return (hub['NOM 1'].trim() + ' ' + hub['NOM 2'].trim()).toLowerCase() === company['Livraison via hub'].toLowerCase()})) ? company['Livraison via hub'] : 'BEEOTOP';

    this.props.initialize({
      company: company_name,
      is_ngo:  (company['Type'].toLowerCase() === "association"),
      is_ccas:  (company['Type'].toLowerCase() === "ccas"),
      has_hub: false,
      order_signed: false,
      hub,
      nb_products: this.props.nb_products,
      shipping_option: "1",
      shipping: {
        company_name: company_name,
        address: shipping_address,
        contact: shipping_contact,
        use_contact_for_shipping: !has_shipping_contact
      },
      invoice: {
        company_name: invoice_company_name || company_name,
        address: invoice_address,
        address_disabled: shipping_address,
        use_shipping_address: has_shipping_address && !has_invoice_address,
        contact: invoice_contact,
        use_contact_for_invoice: !has_invoice_contact
      }
    },false)
  }

  render() {
    const {
      handleSubmit, is_ngo, is_ccas, has_hub, hub, nb_products, shipping_option, use_shipping_address,
      use_contact_for_shipping, use_contact_for_invoice, valid } = this.props;

    const is_ngo_ccas = is_ngo || is_ccas;

    const price = is_ngo_ccas ? 0.5 : 1.5;

    const hub_shipping = (parseInt(shipping_option,10) === 2);

    let shipping_home_price = 0;
    if (parseInt(nb_products, 10) > 0) {
      for (var i = 0; i < packs.length; i++) {
        if (packs[i].nb === parseInt(nb_products, 10)) {
          shipping_home_price = packs[i].shipping;
        }
      }
    }

    let shipping_price = (hub_shipping) ? 0 : shipping_home_price;

    let total = nb_products * price + shipping_price;
    if (!total || isNaN(total) || (total < 0)) total = 0;

    return (

      <div className="widget">

        <div className="widget-header">
          <div className="logo">
            <img className="pull-left" src="img/logo_mini.jpg" alt="Logo Debout" />
          </div>

          <div className="row">
            <h2>BON DE COMMANDE</h2>
            <h3><strong>debout n°12</strong><br /> <span className="small">juin - juillet - août 2017</span> </h3>
          </div>
        </div>

        <div className="widget-body">

          <p>
            Bon de commande à remplir <strong>&rArr; AVANT le 1 juin 2017</strong><br />
            Pour toute information, contactez-nous <ContactUs />.<br/>
          </p>

          <form onSubmit={ handleSubmit(this.props.createOrder) } autoComplete="off">

            <CompanyAutoComplete onCompanyChange={ this.onCompanyChange.bind(this) }/>

            <div className="form-group">
              <label>Vous êtes?</label>
              <div className="checkbox">
                <label>
                  <Field name="is_ccas" component="input" type="checkbox" onChange={this.checkDeliveryOptions.bind(this)}/>
                  une mairie ou un CCAS
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox">
                <label>
                  <Field name="is_ngo" component="input" type="checkbox" onChange={this.checkDeliveryOptions.bind(this)}/>
                  une association à but non lucratif
                </label>
              </div>
            </div>

            { is_ngo_ccas &&
              <div>
                <div className="form-group">
                  <div className="checkbox">
                    <label>
                      <Field name="has_hub" component="input" type="checkbox"/>
                      partenaire d&#39;une Banque Alimentaire (livraison gratuite)
                    </label>
                  </div>
                </div>

                { has_hub &&
                  <div className="form-group">
                    <label htmlFor="hub">Quelle est votre Banque Alimentaire?</label>
                    <this.FieldHub name="hub" className="form-control" options={ this.getHubOptions() } />
                  </div>
                }
              </div>
            }

            <div className="gray-row">

              <div className="form-group">
                <label htmlFor="nb_products">Nombre d&#39;exemplaires du magazine</label>
                <Field name="nb_products" price={price} component={FieldNbProducts} className="form-control"/>
                <small>À noter : Un paquet de 25 exemplaires du magazine pèse environ 3,5 kg.</small>
              </div>

              { is_ngo_ccas &&
                <OrderShippingOptions
                  hub={ this.getHubOption(hub) }
                  shipping_price={shipping_home_price} />
              }

              <OrderFormTable
                price={price}
                nb_products={nb_products || 0}
                shipping_price={shipping_price}
                total={total} />

            </div>

            { total>0 &&

              <div>

                <Section name="order" title="Responsable de la commande">
                  <Contact needPhone section="order" onChange={(e)=>{
                    const { name, value } = e.target;
                    this.props.change(name.replace('order','invoice').replace('contact','contact_disabled'), value);
                    this.props.change(name.replace('order','shipping').replace('contact','contact_disabled'), value);
                  }}/>
                </Section>

                { !hub_shipping &&
                  <Section name="shipping" title="Détail de la livraison">

                  <Field name="company_name" label="Raison sociale" component={FormGroupInput} type="text" className="form-control" />

                   <Address title="Adresse de livraison" onChange={(e)=>{
                      const { name, value } = e.target;
                      this.props.change(name.replace('shipping','invoice').replace('address','address_disabled'), value);
                    }} />

                    <div className="form-group">
                      <label>Contact pour la livraison</label>
                      <div className="checkbox">
                        <label>
                          <Field name="use_contact_for_shipping" component="input" type="checkbox" />
                          Utiliser le nom du responsable de la commande pour la livraison
                        </label>
                      </div>
                    </div>

                    <ContactDisable needPhone section="shipping" disabled={use_contact_for_shipping} />

                  </Section>
                }

                <Section name="invoice" title="Informations de facturation">

                  <Field name="company_name" label="Raison sociale" component={FormGroupInput} type="text" className="form-control" />

                  { !hub_shipping &&
                    <div>
                      <div className="form-group">
                        <label>Adresse de facturation</label>
                        <div className="checkbox">
                          <label>
                            <Field name="use_shipping_address" component="input" type="checkbox" />
                            Utiliser l&#39;adresse de livraison pour la facturation
                          </label>
                        </div>
                      </div>
                      <AddressDisable disabled={ use_shipping_address && !hub_shipping } />
                    </div>
                  }

                  { !hub_shipping &&
                    <Address title="Adresse de facturation" />
                  }

                  <div className="form-group">
                    <label>Responsable de la facture</label>
                    <div className="checkbox">
                      <label>
                        <Field name="use_contact_for_invoice" component="input" type="checkbox" />
                        Utiliser le nom du responsable de la commande pour la facturation
                      </label>
                    </div>
                  </div>

                  <ContactDisable section="invoice" disabled={use_contact_for_invoice} />

                </Section>

                <div className="form-group">
                  <label htmlFor="order_comment" className="title">Laissez ici un commentaire à joindre à votre commande</label>
                  <Field name="order_comment" component="textarea" className="form-control" rows="3"/>
                </div>

                <div>
                  <p>
                    <small>
                    * : information obligatoire
                    </small><br />
                    <small>
                    &sup1; : pour la livraison, veuillez renseigner au moins un numéro de téléphone
                    </small>
                  </p>
                  <p>

                    <Field name="order_signed" component="input" type="checkbox" />

                    <small>
                      &nbsp;&nbsp;<strong>Ce bon de commande vaut commande définitive.</strong>
                      &nbsp;Je m’engage
                      { (parseInt(shipping_option,10) === 1) &&
                        <span>
                          &nbsp;à régler la totalité de ma commande ({toMoney(total)}) à réception de la facture.
                        </span>
                      }
                      { (parseInt(shipping_option,10) === 2) &&
                        <span>
                          &nbsp;à régler les frais de traitement de ma commande ({toMoney(total)}) à réception de la facture et à respecter les dates de récupération de ma commande sur la plateforme relais de distribution&nbsp;
                          <em>{ hub === 'BEEOTOP' ? "BEEOTOP Paris" : hub }</em>.
                        </span>
                      }
                      <br />
                    </small>
                  </p>
                </div>

                { !valid &&
                  <div className="gray-row">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h3 className="panel-title title">Il manque des informations pour valider votre commande</h3>
                      </div>
                      <div className="panel-body">
                        <Field name="company" component={renderInputError} />
                        <Field name="nb_products" component={renderInputError} />
                        <Field name="order.contact.name" component={renderInputError} />
                        <Field name="order.contact.email" component={renderInputError} />
                        <Field name="order.contact.mobile" component={renderInputError} />
                        <Field name="invoice.address.address1" component={renderInputError} />
                        <Field name="invoice.address.zip" component={renderInputError} />
                        <Field name="invoice.address.city" component={renderInputError} />
                        <Field name="invoice.contact.name" component={renderInputError} />
                        <Field name="invoice.contact.email" component={renderInputError} />
                        <Field name="shipping.address.address1" component={renderInputError} />
                        <Field name="shipping.address.zip" component={renderInputError} />
                        <Field name="shipping.address.city" component={renderInputError} />
                        <Field name="shipping.contact.name" component={renderInputError} />
                        <Field name="shipping.contact.email" component={renderInputError} />
                        <Field name="shipping.contact.mobile" component={renderInputError} />
                        <Field name="order_signed" component={renderInputError} />
                      </div>
                    </div>
                  </div>
                }

                <div className="form-group">
                  <button type="submit" disabled={!valid}>
                    Commander
                  </button>
                </div>
              </div>
            }
          </form>

        </div>
      </div>
    )
  }
}

OrderForm = reduxForm({
  form: 'order',
  fields: [ 'company', 'order_comment' ],
  initialValues: {
    shipping_option: "1",
    order_signed: false,
    hub: "BEEOTOP",
    shipping: {
      use_contact_for_shipping: true
    },
    invoice: {
      use_shipping_address: true,
      use_contact_for_invoice: true
    }
  },
  validate
}, null, { createOrder })(OrderForm);

OrderForm.propTypes = {
  hubs: React.PropTypes.array.isRequired,
  fetchHubs: React.PropTypes.func.isRequired,
  createOrder: React.PropTypes.func.isRequired
}

const selector = formValueSelector('order');
function mapStateToProps(state) {
  return {
    companies: state.companies || [],
    hubs: state.hubs || [],
    company: selector(state, 'company'),
    is_ngo: selector(state, 'is_ngo'),
    is_ccas: selector(state, 'is_ccas'),
    has_hub: selector(state, 'has_hub'),
    hub: selector(state, 'hub'),
    nb_products: selector(state, 'nb_products'),
    shipping_option: selector(state, 'shipping_option'),
    use_contact_for_shipping: selector(state, 'shipping.use_contact_for_shipping'),
    use_shipping_address: selector(state, 'invoice.use_shipping_address'),
    use_contact_for_invoice: selector(state, 'invoice.use_contact_for_invoice'),
    order: state.form.order || {}
  }
}

export default connect(mapStateToProps, { fetchHubs, createOrder, changeFieldValue })(OrderForm);
