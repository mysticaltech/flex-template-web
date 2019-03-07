import React from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { formatMoney } from '../../util/currency';
import { LINE_ITEM_CLEANING_FEE, propTypes } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemCleaningFeeMaybe = props => {
  const { transaction, intl } = props;

  const cleaningFee = transaction.attributes.lineItems.find(
    item => item.code === LINE_ITEM_CLEANING_FEE
  );

  return cleaningFee ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        <FormattedMessage id="BookingBreakdown.cleaningFee" />
      </span>
      <span className={css.itemValue}>{formatMoney(intl, cleaningFee.lineTotal)}</span>
    </div>
  ) : null;
};

LineItemCleaningFeeMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemCleaningFeeMaybe;
