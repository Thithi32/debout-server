import React from 'react';
import { Field } from 'redux-form';
import { FieldInputError } from '../../widgets';

const OrderFormErrors = () => (
  <div>
    <Field name="company" component={FieldInputError} />
    <Field name="nb_products" component={FieldInputError} />
    <Field name="order.contact.name" component={FieldInputError} />
    <Field name="order.contact.email" component={FieldInputError} />
    <Field name="order.contact.mobile" component={FieldInputError} />
    <Field name="invoice.address.address1" component={FieldInputError} />
    <Field name="invoice.address.zip" component={FieldInputError} />
    <Field name="invoice.address.city" component={FieldInputError} />
    <Field name="invoice.contact.name" component={FieldInputError} />
    <Field name="invoice.contact.email" component={FieldInputError} />
    <Field name="shipping.address.address1" component={FieldInputError} />
    <Field name="shipping.address.zip" component={FieldInputError} />
    <Field name="shipping.address.city" component={FieldInputError} />
    <Field name="shipping.contact.name" component={FieldInputError} />
    <Field name="shipping.contact.email" component={FieldInputError} />
    <Field name="shipping.contact.mobile" component={FieldInputError} />
    <Field name="order_signed" component={FieldInputError} />
  </div>
)

export default OrderFormErrors;