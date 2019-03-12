import React from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { injectIntl, intlShape } from 'react-intl';

import PayoutDetailsAddress from './PayoutDetailsAddress';
import PayoutDetailsCompany from './PayoutDetailsCompany';
import PayoutDetailsBankDetails from './PayoutDetailsBankDetails';
import PayoutDetailsAccountOpener from './PayoutDetailsAccountOpener';
import PayoutDetailsAdditionalPersons from './PayoutDetailsAdditionalPersons';
import { stripeCountryConfigs } from './PayoutDetailsForm';

const CompanyAccountComponent = ({ fieldRenderProps }) => {
  const { disabled, form, intl, values } = fieldRenderProps;
  const { country } = values;
  const { push } = form && form.mutators ? form.mutators : {};

  const companyConfig =
    country && stripeCountryConfigs(country).companyConfig
      ? stripeCountryConfigs(country).companyConfig
      : {};

  const showBusinessURLField = !!companyConfig.businessURL;
  const showCompanyPhoneNumberField = !!companyConfig.companyPhone;
  const showMCCForUSField = !!companyConfig.mccForUS;
  const showEmailField = !!companyConfig.personEmail;
  const showPersonalAddressField = !!companyConfig.personalAddress;
  const showPersonalIdNumberField = !!companyConfig.personalIdNumberRequired || !!companyConfig.ssnLast4Required;
  const showPersonPhoneNumberField = !!companyConfig.personPhone;
  const showOwnerFields = !!companyConfig.owners;

  return (
    <React.Fragment>
      {country ? (
        <React.Fragment>
          <PayoutDetailsCompany
            country={country}
            disabled={disabled}
            fieldId="company"
            intl={intl}
            showPhoneNumberField={showCompanyPhoneNumberField}
            showMCCForUSField={showMCCForUSField}
            showBusinessURLField={showBusinessURLField}
          />
          <PayoutDetailsAddress
            country={country}
            intl={intl}
            disabled={disabled}
            form={form}
            fieldId="company.address"
          />
          <PayoutDetailsBankDetails country={country} disabled={disabled} fieldId="company" />

          <PayoutDetailsAccountOpener
            country={country}
            disabled={disabled}
            fieldId="accountOpener"
            form={form}
            intl={intl}
            showEmailField={showEmailField}
            showOrganizationTitleField
            showOwnerField={showOwnerFields}
            showPersonalAddressField={showPersonalAddressField}
            showPersonalIdNumberField={showPersonalIdNumberField}
            showPhoneNumberField={showPersonPhoneNumberField}
            values={values}
          />

          {showOwnerFields ? (
            <PayoutDetailsAdditionalPersons
              country={country}
              disabled={disabled}
              fieldId="persons"
              form={form}
              intl={intl}
              push={push}
              showEmailField={showEmailField}
              showOrganizationTitleField
              showOwnerField={showOwnerFields}
              showPersonalAddressField={showPersonalAddressField}
              showPersonalIdNumberField={showPersonalIdNumberField}
              showPhoneNumberField={showPersonPhoneNumberField}
              values={values}
            />
          ) : null}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

CompanyAccountComponent.defaultProps = {
  id: null,
  disabled: false,
};

CompanyAccountComponent.propTypes = {
  id: string,
  disabled: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const PayoutDetailsCompanyAccount = compose(injectIntl)(CompanyAccountComponent);

export default PayoutDetailsCompanyAccount;
