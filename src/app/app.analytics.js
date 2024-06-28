import ReactGA from 'react-ga';

import { history, ROUTES } from 'app';
import { getObjectKeyByValue } from 'utils';

export const initializeGA = () => {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID);

  ReactGA.set({
    userId: `User-${Math.ceil(Math.random() * 100000)}`,
  });

  history.listen((location) => {
    const { pathname, search } = location;

    ReactGA.set({ page: pathname });
    ReactGA.pageview(
      `${pathname}${search} , ${getObjectKeyByValue(ROUTES, pathname)}`
    );
  });
};
