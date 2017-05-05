import React from 'react'
import { Field } from 'redux-form'
import { FieldInputError } from '../../widgets'

const SubscribeFormErrors = () => (
  <div>
    <Field name="type" component={FieldInputError} />
    <Field name="address.address1" component={FieldInputError} />
    <Field name="address.zip" component={FieldInputError} />
    <Field name="address.city" component={FieldInputError} />
    <Field name="contact.name" component={FieldInputError} />
    <Field name="contact.email" component={FieldInputError} />
    <Field name="contact.mobile" component={FieldInputError} />
    <Field name="subscription_signed" component={FieldInputError} />
  </div>
)

export default SubscribeFormErrors
