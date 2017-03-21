import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchCompanies, fetchHubs, createOrder } from "./../../../actions";
import { Field, reduxForm, formValueSelector, FormSection, change as changeFieldValue } from 'redux-form';
import OrderFormTable from "./OrderFormTable";
import removeDiacritics from "./../../../helpers";

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

const FormGroupInput = ({ input, label, ...props}) => (
  <div className="form-group">
    <label htmlFor={input.name}>{label}</label>
    <FormInput input={input} {...props} />
  </div>
)

const FormInput = ({ input, type, meta: { touched, error }, ...props}) => (
  <div className={ touched && error && ' error' }>
    <input type={type} {...input} {...props} />  
    { touched && error && <div className="form-message"><small>{error}</small></div> }        
  </div>
)

const FormHonorific = ({ input, label, meta, ...props}) => (
  <div className="form-group">
    <label htmlFor={input.name}>{label}</label>
    <select {...input} {...props} >
      <option value="M">M</option>
      <option value="Mme">Mme</option>
    </select>
  </div>
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
        <option key={ i } value={ pack.nb }>{ pack.nb } exemplaires = { pack.nb * price }€</option>  
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
          <label htmlFor="address1">{ this.props.title }</label>
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange(e); }} className="form-control" type="text" name="address1" placeholder="Ligne 1 *" disabled={this.props.disabled} />
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange(e); }} className="form-control" type="text" name="address2" placeholder="Ligne 2" disabled={this.props.disabled} />
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange(e); }} className="form-control" type="text" name="zip" placeholder="Code postal *" disabled={this.props.disabled} />
          <Field component={FormInput} onChange={(e)=>{ this.props.onChange(e); }} className="form-control" type="text" name="city" placeholder="Commune *" disabled={this.props.disabled} />
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
    const title = this.props.title;
    return (
      <FormSection name={name}>
        { title &&
          <p className="title">{title}</p>
        }
        <Field name="honorific" onChange={(e)=>{ this.props.onChange(e); }} label="Civilité" component={FormHonorific} disabled={this.props.disabled} className="form-control"/>
        <Field name="name" onChange={(e)=>{ this.props.onChange(e); }} label="Nom *" disabled={this.props.disabled} component={FormGroupInput} type="text" className="form-control"/>  
        <Field name="firstname" onChange={(e)=>{ this.props.onChange(e); }} label="Prénom" disabled={this.props.disabled} component={FormGroupInput} type="text" className="form-control"/>  
        <Field name="email" onChange={(e)=>{ this.props.onChange(e); }} label="Email *" disabled={this.props.disabled} component={FormGroupInput} type="text" className="form-control"/>  
        <Field name="mobile" onChange={(e)=>{ this.props.onChange(e); }} label="Téléphone mobile" disabled={this.props.disabled} component={FormGroupInput} type="text" className="form-control"/>  
        <Field name="phone" onChange={(e)=>{ this.props.onChange(e); }} label="Téléphone fixe" disabled={this.props.disabled} component={FormGroupInput} type="text" className="form-control"/>  
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
    fields: [
      {
        name: 'address',
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
        fields: [
          { 
            name: 'name',
            isRequired: "Le nom du responsable de la réception de la livraison est obligatoire" 
          },
          { 
            name: 'email',
            isRequired: "L'email du responsable de la réception de la livraison est obligatoire" 
          }
        ]
      }
    ]
  }
];

const validate = (values) => {

  const checkIsRequired = (fields,values) => {
    let errors = {};
    fields.map((field) => {
      if (field.fields) {
          errors[field.name] = checkIsRequired(field.fields,values[field.name] || {});
      } else {
        if (field.greater_than) {
          if (values[field.name] <= field.greater_than.value) {
            errors[field.name] = field.greater_than.message;
          }
        }
        if (field.isRequired && (!values[field.name] || !values[field.name].trim().length)) {
          errors[field.name] = field.isRequired;
        }
      } 
    });
    return errors;
  }

  const errors = checkIsRequired(fields_validation,values);

  return errors;
}

class OrderForm extends Component {

  constructor () {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchCompanies();
    this.props.fetchHubs();
  }

  getHubOptions() {
    return this.props.hubs.map((hub, idx) => { 
      let name = hub['NOM 1'] + " " + hub['NOM 2']; 
      return { key: idx, value: name, text: name}; //hub['BA']
    });
  }

  FieldHub(fieldProps) {
    let { options, ...other } = fieldProps;
    return (
      <Field {...other} component="select">
          <option key={ 0 } value={ 0 }>Choisir votre hub</option>  
        { options.map((option) =>
          <option key={ option.key } value={ option.value }>{ option.text }</option>  
        )}
      </Field>
    )
  }

  changeCompany(e, str) {
    let choices = [];
    let tolower = (str) => { return removeDiacritics(str.toLowerCase()); }
    if (str.length >= 3) 
      choices = this.props.companies.filter( (company) => ( tolower(company['Raison sociale']).indexOf(tolower(str)) > -1 ) ? company['Raison sociale'] : false );

    this.setState( { 'company_autocomplete': choices} );
  }

  selectCompany(company) {
console.log(company);
    let invoice_address = {
        address1: company["(facture)\nAdresse"],
        address2: '  ',
        zip: company["(facture)\nCP"],
        city: company["(facture)\nVille"]
    }
    const has_invoice_address = invoice_address.address1 && invoice_address.zip && invoice_address.city;

    let shipping_address = {
      address1: company["(livraison)\nAdresse 1"],
      address2: company["(livraison)\nAdresse 2"] || "  ",
      zip: company["(livraison)\nCP"],
      city: company["(livraison)\nVille"]
    }
    const has_shipping_address = shipping_address.address1 && shipping_address.zip && shipping_address.city;

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

    const hub = (this.props.hubs.find((hub) => { return (hub['NOM 1'] + ' ' + hub['NOM 2']) === company['Livraison via hub']})) ? company['Livraison via hub'] : '';

    this.props.initialize({ 
      company: company['Raison sociale'], 
      is_ngo:  (company['Type'] === "Association"),
      has_hub: (company["Asso d'une BA ?"] !== "non"),
      hub,
      nb_products: this.props.nb_products,
      shipping_option: "2",
      shipping: {
        address: shipping_address,
        contact: shipping_contact,
        use_contact_for_shipping: !has_shipping_contact  
      },
      invoice: {
        address: invoice_address,
        address_disabled: shipping_address,
        use_shipping_address: has_shipping_address && !has_invoice_address,
        contact: invoice_contact,
        use_contact_for_invoice: !has_invoice_contact
      }
    },false)

    this.setState({company_autocomplete: {}});
  }

  render() {
    const { 
      handleSubmit, company, is_ngo, has_hub, hub, nb_products, shipping_option, use_shipping_address, 
      use_contact_for_shipping, use_contact_for_invoice, pristine, submitting } = this.props;

    const price = (is_ngo) ? 0.5 : 1.5;

    const company_autocomplete = this.state.company_autocomplete;

    const hub_shipping_available = has_hub && is_ngo && hub !== undefined && hub !== "0";

    const home_delivery = !hub_shipping_available || (parseInt(shipping_option) === 1);

    let shipping_price = 0;
    let shipping_home_price = 0;
    if (parseInt(nb_products, 10) > 0) {
      for (var i = 0; i < packs.length; i++) {
        if (packs[i].nb === parseInt(nb_products, 10)) {
          shipping_home_price = packs[i].shipping;
        }
      }
    }
    if (home_delivery) {
      shipping_price = shipping_home_price;
    }

    let total = nb_products * price + shipping_price;
    if (!total || isNaN(total) || (total < 0)) total = 0;

    return (

      <div className="widget">

        <div className="widget-header">
          <img className="pull-left" src="img/logo_mini.jpg" alt="Logo Debout" />

          <h2>BON DE COMMANDE</h2>
          <h3><strong>debout n°12</strong> // <span className="small">juin - juillet - août 2017</span> </h3>
        </div>

        <div className="widget-body">

          <p>
            Bon de commande à remplir <strong>&rArr; AVANT le 10 juin 2017</strong><br />
            Pour toute information, contactez-nous par mail à&nbsp;
            <a href="mailto:diffusion@debout.fr">diffusion@debout.fr</a><br/>
          </p>


          <form onSubmit={ handleSubmit(this.props.createOrder) } autoComplete="off">

            <div className="dropdown open">
              <Field name="company" label="Nom de la structure" 
                component={FormGroupInput} type="text" className="form-control"

                onChange={this.changeCompany.bind(this)}/>  

              { this.state.company_autocomplete && this.state.company_autocomplete.length > 0 &&
                <ul className="dropdown-menu">
                  { this.state.company_autocomplete.map((company, key) => 
                      <li key={key}><a href="#" onClick={() => this.selectCompany(company)}>{ company['Raison sociale'] }</a></li>
                  )}
                </ul>
              }
            </div>

            <div className="form-group">
              <div className="checkbox">
                <label>
                  <Field name="is_ngo" component="input" type="checkbox"/> 
                  Association à but non lucratif
                </label>
              </div>
            </div>

            { is_ngo && 
              <div className="form-group">
                <div className="checkbox">
                  <label>
                    <Field name="has_hub" component="input" type="checkbox"/> 
                    Vous êtes associé à une Banque Alimentaire
                  </label>
                </div>
              </div>
            }

            { has_hub && 
              <div className="form-group">
                <label htmlFor="hub">Quelle est votre Banque Alimentaire?</label>
                <this.FieldHub name="hub" className="form-control" options={ this.getHubOptions() }/>
              </div>
            }

            <div className="gray-row">

              <div className="form-group">
                <label htmlFor="nb_products">Nombre d&#39;exemplaires</label>
                <Field name="nb_products" price={price} component={FieldNbProducts} className="form-control"/>  
                <small>À noter : Un paquet de 25 exemplaires du magazine pèse environ 3,5 kg.</small>
              </div>

              { hub_shipping_available &&
                <div className="form-group">
                  <label htmlFor="nb_products">Choisir votre mode de livraison</label>
                  <div className="radio">
                    <label>
                      <Field component="input" type="radio" name="shipping_option" value="1"/>
                       Option 1: Livraison chez vous = { shipping_home_price }€
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <Field component="input" type="radio" name="shipping_option" value="2"/>
                      Option 2: Livraison chez votre Banque Alimentaire = 0€ !!!!
                    </label>
                  </div>
                </div>
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
                  <Contact onChange={(e)=>{
                    const { name, value } = e.target;
                    this.props.change(name.replace('order','invoice').replace('contact','contact_disabled'), value);
                    this.props.change(name.replace('order','shipping').replace('contact','contact_disabled'), value);
                  }}/>
                </Section>

                { home_delivery &&
                  <Section name="shipping" title="Détail de la livraison">

                   <Address title="Adresse de livraison" onChange={(e)=>{
                      const { name, value } = e.target;
                      this.props.change(name.replace('shipping','invoice').replace('address','address_disabled'), value);
                    }} />

                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <Field name="use_contact_for_shipping" component="input" type="checkbox" /> 
                          Utiliser le nom du responsable de la commande pour la livraison
                        </label>
                      </div>
                    </div>

                    <ContactDisable disabled={use_contact_for_shipping} title="Responsable de la réception"/>
 
                  </Section>
                }

                <Section name="invoice" title="Informations de facturation">

                  { home_delivery &&
                    <div className="form-group">
                      <div className="checkbox">
                        <label>
                          <Field name="use_shipping_address" component="input" type="checkbox" /> 
                          Utiliser l&#39;adresse de livraison pour la facturation
                        </label>
                      </div>
                    </div>
                  }

                  <AddressDisable title="Adresse de facturation" disabled={use_shipping_address && home_delivery} />

                  <div className="form-group">
                    <div className="checkbox">
                      <label>
                        <Field name="use_contact_for_invoice" component="input" type="checkbox" /> 
                        Utiliser le nom du responsable de la commande pour la facturation
                      </label>
                    </div>
                  </div>

                  <ContactDisable disabled={use_contact_for_invoice} title="Responsable de la facture"/>

                </Section>

                <div>
                  <p>
                    <small>
                    * : information obligatoire
                    </small>
                  </p>
                  <p>
                    <small>
                      En envoyant ce bon de commande, je m’engage
                      { (!hub_shipping_available || parseInt(shipping_option,10) !== 2) &&
                        <span>
                          &nbsp;à régler les frais de livraison et de traitement de ma commande à réception de la facture.
                        </span>
                      }
                      { hub_shipping_available && parseInt(shipping_option,10) === 2 &&
                        <span>
                          &nbsp;à respecter les dates de récupération de ma commande sur la plateforme relais de distribution que j’ai choisie. 
                        </span>
                      }
                      <br />
                      <strong>Ce bon de commande vaut commande définitive.</strong>
                    </small>
                  </p>
                </div>
                <div className="form-group">
                  <button type="submit" disabled={pristine || submitting}>
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
  initialValues: {
    shipping_option: "2",
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
  companies: React.PropTypes.array.isRequired,
  fetchCompanies: React.PropTypes.func.isRequired,
  hubs: React.PropTypes.array.isRequired,
  fetchHubs: React.PropTypes.func.isRequired,
  createOrder: React.PropTypes.func.isRequired
}

const selector = formValueSelector('order');
function mapStateToProps(state) {
  return {
    companies: state.companies,
    hubs: state.hubs,
    company: selector(state, 'company'),
    is_ngo: selector(state, 'is_ngo'),
    has_hub: selector(state, 'has_hub'),
    hub: selector(state, 'hub'),
    nb_products: selector(state, 'nb_products'),
    shipping_option: selector(state, 'shipping_option'),
    use_contact_for_shipping: selector(state, 'shipping.use_contact_for_shipping'),
    use_shipping_address: selector(state, 'invoice.use_shipping_address'),
    use_contact_for_invoice: selector(state, 'invoice.use_contact_for_invoice')
  }
}

export default connect(mapStateToProps, { fetchCompanies, fetchHubs, createOrder, changeFieldValue })(OrderForm);
