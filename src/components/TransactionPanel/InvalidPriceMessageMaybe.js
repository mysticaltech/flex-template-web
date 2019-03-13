import React from 'react';
import Decimal from 'decimal.js';
import { LINE_ITEM_NIGHT, LINE_ITEM_CLEANING_FEE } from '../../util/types';
import { nightsBetween, daysBetween } from '../../util/dates';
import { convertMoneyToNumber } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';

import css from './TransactionPanel.css';

const { Money } = sdkTypes;

const InvalidPriceMessageMaybe = props => {
  const { transaction, listing, transactionRole, intl } = props;
  const unitType = config.bookingUnitType;

  const isProvider = transactionRole === 'provider';
  const isNightly = unitType === LINE_ITEM_NIGHT;
  const { start, end } = transaction.booking.attributes;
  const quantity = isNightly ? nightsBetween(start, end) : daysBetween(start, end);

  // validate booking line item total
  const listingUnitPrice = listing.attributes.price;
  const listingNumericUnitPrice = convertMoneyToNumber(listingUnitPrice);
  const listingUnitTotal = new Decimal(listingNumericUnitPrice).times(quantity).toNumber();
  const txUnitLineItem = transaction.attributes.lineItems.find(
    item => item.code === unitType && !item.reversal
  );
  const txUnitTotal = convertMoneyToNumber(txUnitLineItem.lineTotal);
  const unitTotalInvalid = listingUnitTotal !== txUnitTotal;

  // validate cleaning fee line item total
  const listingCleaningFeeData = listing.attributes.publicData.cleaningFee;
  const { amount: cleaningAmount, currency: cleaningCurrency } = listingCleaningFeeData || {};
  const listingCleaningFeePrice =
    cleaningAmount && cleaningCurrency ? new Money(cleaningAmount, cleaningCurrency) : null;
  const listingCleaningFeeTotal = listingCleaningFeePrice
    ? convertMoneyToNumber(listingCleaningFeePrice)
    : null;
  const txCleaningFeeLineItem = transaction.attributes.lineItems.find(
    item => item.code === LINE_ITEM_CLEANING_FEE && !item.reversal
  );
  const txCleaningFeeTotal = txCleaningFeeLineItem
    ? convertMoneyToNumber(txCleaningFeeLineItem.lineTotal)
    : null;
  const cleaningFeeTotalInvalid =
    listingCleaningFeeTotal && txCleaningFeeTotal && listingCleaningFeeTotal !== txCleaningFeeTotal;

  const message = intl.formatMessage({ id: 'BookingBreakdown.invalidPrice' });
  const showMessage = isProvider && (unitTotalInvalid || cleaningFeeTotalInvalid);
  return showMessage ? <p className={css.invalidPriceMessage}>{message}</p> : null;
};

export default InvalidPriceMessageMaybe;
