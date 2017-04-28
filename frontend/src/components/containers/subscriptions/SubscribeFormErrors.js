import React from 'react';
import { Field } from 'redux-form';
import { FieldInputError } from '../../widgets';

const SubscribeFormErrors = () => (
  <div>
    <Field name="type" component={FieldInputError} />
    <Field name="subscriber.address.address1" component={FieldInputError} />
    <Field name="subscriber.address.zip" component={FieldInputError} />
    <Field name="subscriber.address.city" component={FieldInputError} />
    <Field name="subscriber.contact.name" component={FieldInputError} />
    <Field name="subscriber.contact.email" component={FieldInputError} />
    <Field name="subscriber.contact.mobile" component={FieldInputError} />
    <Field name="subscription_signed" component={FieldInputError} />
  </div>
)

export default SubscribeFormErrors;