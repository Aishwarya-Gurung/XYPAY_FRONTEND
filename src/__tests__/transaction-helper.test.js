import { DELIVERY_STATUS, TRANSACTION_STATUS } from 'dashboard';
import { showCancelButton } from 'dashboard/components/transaction-row';

describe('Transaction Helper', () => {
  it('should not display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.CANCELED,
      deliveryStatus: DELIVERY_STATUS.PENDING,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(false);
  });

  it('should not display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.REFUNDED,
      deliveryStatus: DELIVERY_STATUS.PENDING,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(false);
  });

  it('should not display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.RETURNED,
      deliveryStatus: DELIVERY_STATUS.PENDING,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(false);
  });

  it('should not display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.PENDING,
      deliveryStatus: DELIVERY_STATUS.DELIVERED,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(false);
  });

  it('should not display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.CANCELED,
      deliveryStatus: DELIVERY_STATUS.DELIVERED,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(false);
  });

  it('should not display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.REFUNDED,
      deliveryStatus: DELIVERY_STATUS.DELIVERED,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(false);
  });

  it('should not display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.RETURNED,
      deliveryStatus: DELIVERY_STATUS.DELIVERED,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(false);
  });

  it('should display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.PENDING,
      deliveryStatus: DELIVERY_STATUS.PENDING,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(true);
  });

  it('should display txn cancel button', () => {
    const transaction = {
      status: TRANSACTION_STATUS.HOLD,
      deliveryStatus: DELIVERY_STATUS.HOLD,
    };

    const isEqual = showCancelButton(transaction);

    expect(isEqual).toBe(true);
  });
});