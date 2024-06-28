import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';

import { PAYMENT_METHOD } from 'app';

import sl from 'components/selector/selector';

const Khalti = (props) => {
  const { isCurrentPaymentMethod, updatePaymentMethod } =
    staticSelector.select(props);

  const initiatePayment = async () => {
    try {
      const apiUrl = 'https://a.khalti.com/api/v2/epayment/initiate/';
      const publicKey = '0f524c1a8afb469f91719a84db0dd3d6';

      const headers = {
        Authorization: `Key ${publicKey}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        return_url: 'http://localhost:3000/payment/review',
        website_url: 'http://localhost:3000',
        amount: 1300,
        purchase_order_id: 'test12',
        purchase_order_name: 'test',
        customer_info: {
          name: 'Khalti Bahadur',
          email: 'example@gmail.com',
          phone: '9800000123',
        },
      };

      const response = await axios.post(apiUrl, payload, { headers });

      window.location.href = response.data.payment_url;
    } catch (error) {
      console.error('Error initiating payment:', error);

      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="card mb-3 ">
        <label className={'card-top media p-3 active '}>
          <i className="icon ion-md-wallet h3 mr-3 text-muted" />
          <div className="media-body">
            <h4 className="m-0">Use Khalti</h4>
            <small className="text-muted mr-2">
              Your Khalti account will be charged
            </small>
          </div>
          <div className="media-right">
            <div className="checkbox-wrapper">
              <input
                type="radio"
                name="paymentMethod"
                checked={isCurrentPaymentMethod}
                value={PAYMENT_METHOD.KHALTI}
                onChange={(e) => updatePaymentMethod(e.target.value)}
                onClick={initiatePayment}
              />
              <span />
            </div>
          </div>
        </label>
      </div>
    </React.Fragment>
  );
};

Khalti.propTypes = {
  isCurrentPaymentMethod: PropTypes.bool,
  updatePaymentMethod: PropTypes.func,
};

const staticSelector = sl.object({
  isCurrentPaymentMethod: sl.boolean(false),
  updatePaymentMethod: sl.func(),
});

export default Khalti;
