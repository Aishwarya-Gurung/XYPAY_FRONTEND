import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import KycForm from 'sender/components/kyc-form';
import { toggleWidgetModal } from 'sender/sender.action';

import { getSenderInfo } from 'auth';
import { getReduxState } from 'utils';

const SetupAccount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const kycStatus = useSelector((state) =>
    getReduxState(['auth', 'kycStatus'], state)
  );
  const widgetToken = useSelector((state) =>
    getReduxState(['sender', 'widgetToken'], state)
  );
  const referenceId = useSelector((state) =>
    getReduxState(['sender', 'referenceId'], state)
  );
  const isWidgetModalOpen = useSelector((state) =>
    getReduxState(['sender', 'isWidgetModalOpen'], state)
  );

  const [isBasicKYCSubmitted, setIsBasicKYCSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getSenderInfo());
    };

    fetchData();
  }, []);

  // const toggleKYCWidget = () => {
  //   dispatch(toggleWidgetModal(true));
  // };

  const handleCloseModal = () => {
    dispatch(toggleWidgetModal(false));
  };

  return (
    <div className="container setup-account">
      <div className="d-flex align-items-center justify-content-center">
        <div className="col-lg-8">
          <h2 className="bold text-center mt-4">
            {t('sender.Complete Account Setup')}
          </h2>
          <div className="my-4 px-4 pt-4 pb-3">
            <KycForm
              setIsBasicKYCSubmitted={() => {
                setIsBasicKYCSubmitted(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SetupAccountView = withTranslation()(SetupAccount);
