import React from 'react';
import { ReactComponent as WhiteSpinner } from 'assets/img/white-spinner.svg';
import { ReactComponent as BlueSpinner } from 'assets/img/blue-spinner.svg';

export const WhiteLoadingSpinner = () => (
  <div className="container-loader">
    <WhiteSpinner />
  </div>
);

export const BlueLoadingSpinner = () => (
  <div className="container-loader">
    <BlueSpinner />
  </div>
);

export const DashboardLoadingSpinner = () => (
  <div className="dashboard-loader">
    <BlueSpinner />
  </div>
);
