import React, { Component } from 'react';
import { connect } from "react-redux";
import { createOrder } from "./../../../actions";
import { Field, reduxForm } from 'redux-form';
import { FormOnlyHeader, FormOnlyContent } from "./../../layout";
import OrderFormTable from "./OrderFormTable";
import OrderShippingOptions from "./OrderShippingOptions";
import OrderNbProducts from "./OrderNbProducts";
import OrderFormErrors from "./OrderFormErrors";
import validate from './OrderForm.validate'
import { CompanyAutoComplete, CompanyTypeInput } from "./../companies";
import { ContactUs, FormGroupInput, FormSectionPanel , FormContact, FormContactDisable, 
          FormAddress, FormAddressDisable } from "./../../widgets";

const toMoney = (num) => ( num.toFixed(2).replace('.',',') + "€" );
const upper = value => value && value.toUpperCase();

export class OrderForm extends Component {

  constructor () {
    super();
    this.state = {};
  }

  onChangeHub(hub) {
    this.setState({ hub });
  }

  onChangeShippingPrice(home_shipping_price) {
    this.setState({ home_shipping_price });
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

  onChangeCompany(e, str, old_str) {
    // First sync other company_name fields
    if (this.props.order.values.shipping && this.props.order.values.shipping.company_name === old_str) {
      this.props.change("shipping.company_name", str);
    }
    if (this.props.order.values.invoice && this.props.order.values.invoice.company_name === old_str) {
      this.props.change("invoice.company_name", str);
    }
  }

  onSelectCompany(company) {
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

    this.props.initialize({ 
      company: company_name, 
      is_ngo:  (company['Type'].toLowerCase() === "association"),
      is_ccas:  (company['Type'].toLowerCase() === "ccas"),
      has_hub: false,
      order_signed: false,
      hub: "BEEOTOP",
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
    const { handleSubmit, valid, order } = this.props;
    const values = (order && order.values) || {};
    const { is_ngo, is_ccas, hub, nb_products, shipping, invoice } = values;
    const { use_shipping_address, use_contact_for_invoice } = invoice || {};
    const { use_contact_for_shipping } = shipping || {};
    const shipping_option = parseInt(values.shipping_option,10);

    const is_ngo_ccas = is_ngo || is_ccas;
    const price = is_ngo_ccas ? 0.5 : 1.5;

    const hub_shipping = (shipping_option === 2);

    const shipping_home_price = this.state.home_shipping_price || 0;
    const shipping_price = (hub_shipping) ? 0 : shipping_home_price;

    let total = nb_products * price + shipping_price;
    if (!total || isNaN(total) || (total < 0)) total = 0;

    return (

      <div className="widget">

        <FormOnlyHeader>
          <h2>BON DE COMMANDE</h2>
          <h3><strong>debout n°12</strong><br /> <span className="small">juin - juillet - août 2017</span> </h3>
        </FormOnlyHeader>

        <FormOnlyContent>

          <p>
            Bon de commande à remplir <strong>&rArr; AVANT le 1 juin 2017</strong><br />
            Pour toute information, contactez-nous <ContactUs />.<br/>
          </p>

          <form onSubmit={ handleSubmit(this.props.createOrder) } autoComplete="off">

            <CompanyAutoComplete onSelectCompany={ this.onSelectCompany.bind(this) } onChangeCompany={ this.onChangeCompany.bind(this) }/>

            <CompanyTypeInput onChangeHub={ this.onChangeHub.bind(this) } onChange={ this.checkDeliveryOptions.bind(this) }/>

            <div className="gray-row">

              <OrderNbProducts price={price} onChangeShippingPrice={ this.onChangeShippingPrice.bind(this) }/>

              { is_ngo_ccas && 
                <OrderShippingOptions
                  hub={ this.state.hub }
                  shipping_price={ shipping_home_price } />
              }

              <OrderFormTable 
                price={price} 
                nb_products={nb_products || 0} 
                shipping_price={ shipping_price } 
                total={total} />

            </div>

            { total>0 &&

              <div>

                <FormSectionPanel name="order" title="Responsable de la commande">
                  <FormContact needPhone onChange={(e)=>{
                    const { name, value } = e.target;
                    this.props.change(name.replace('order','invoice').replace('contact','contact_disabled'), value);
                    this.props.change(name.replace('order','shipping').replace('contact','contact_disabled'), value);
                  }}/>
                </FormSectionPanel>

                { !hub_shipping &&
                  <FormSectionPanel name="shipping" title="Détail de la livraison">

                  <Field name="company_name" label="Raison sociale" component={FormGroupInput} normalize={upper} type="text" className="form-control" />

                   <FormAddress title="Adresse de livraison" onChange={(e)=>{
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

                    <FormContactDisable needPhone disabled={ use_contact_for_shipping } />
 
                  </FormSectionPanel>
                }

                <FormSectionPanel name="invoice" title="Informations de facturation">

                  <Field name="company_name" label="Raison sociale" component={FormGroupInput} normalize={upper} type="text" className="form-control" />

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
                    <FormAddressDisable disabled={ use_shipping_address } />
                  </div>
                  }

                  { hub_shipping &&
                    <FormAddressDisable title="Adresse de facturation"/>
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

                  <FormContactDisable disabled={ use_contact_for_invoice } />

                </FormSectionPanel>

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
                      { (shipping_option === 1) &&
                        <span>
                          &nbsp;à régler la totalité de ma commande ({toMoney(total)}) à réception de la facture.
                        </span>
                      }
                      { (shipping_option === 2) &&
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
                        <OrderFormErrors />
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

        </FormOnlyContent>
      </div>
    )
  }
}

OrderForm = reduxForm({
  form: 'order',
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
  createOrder: React.PropTypes.func.isRequired,
  order: React.PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    order: (state && state.form && state.form.order) || {},
  }
}

export default connect(mapStateToProps, { createOrder })(OrderForm);
