import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import sl from 'components/selector/selector';

import { fetchDevices, removeDevice } from 'api';
import BlinkTextLoader from 'components/form/blink-loader-text';

const getDevices = async () => {
  const { data, error } = await fetchDevices();
  const { result } = staticSelector.select(data);

  if (error) {
    return [];
  }

  return result;
};

const deleteDevice = async (
  deviceId,
  setDevices,
  setLogOutKey,
  toggleFetchingDevices
) => {
  await removeDevice(deviceId);

  getDevicesWithAddress(setDevices, setLogOutKey, toggleFetchingDevices);
};

const DevicesTable = () => {
  const [devices, setDevices] = useState([]);
  const [isFetchingDevices, toggleFetchingDevices] = useState(false);
  const [logOutKey, setLogOutKey] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    toggleFetchingDevices(true);
    getDevicesWithAddress(setDevices, setLogOutKey, toggleFetchingDevices);
  }, []);

  return (
    <ul className="device-list p-0">
      <li>
        <span>{t('settings.Where you are logged in')}</span>
      </li>
      {isFetchingDevices ? (
        <BlinkTextLoader margin={5} message={t('settings.Fetching devices')} />
      ) : (
        <React.Fragment>
          {devices &&
            devices.map((device, key) => (
              <li key={key} className="p-2">
                <div className="row">
                  <div className="col-md-1 text-center">
                    <i
                      className={`icon ${getDeviceIcon(device.deviceType)} h1`}
                    />
                  </div>
                  <div className="col-md-9">
                    <span className="d-block">
                      <span>
                        {device.os} {device.deviceType}
                      </span>
                      <span>{getFormattedAddress(device.address)}</span>
                    </span>
                    <span className="d-block">
                      <span>
                        <img
                          alt="Browser Logo"
                          className="browser-logo"
                          src={getBrowserIcon(device.browser)}
                        />
                      </span>
                      <span>
                        {device.browser} {device.lastLoginDate && '|'}{' '}
                      </span>
                      <span
                        className={
                          device.currentDevice ? 'text-success bold' : ''
                        }
                      >
                        {!device.currentDevice
                          ? getFormattedLoggedInTime(device.lastLoginDate)
                          : 'Active now'}
                      </span>
                    </span>
                  </div>
                  <div className="col-md-2">
                    {!device.currentDevice && (
                      <button
                        className="shake btn btn-link device-logout"
                        disabled={logOutKey.includes(key)}
                        title={t(
                          'button.Log out from this device and remove this device'
                        )}
                        onClick={() => {
                          setLogOutKey([...logOutKey, key]);
                          deleteDevice(
                            device.id,
                            setDevices,
                            setLogOutKey,
                            toggleFetchingDevices
                          );
                        }}
                      >
                        {!logOutKey.includes(key) && (
                          <i className="icon ion-md-power pl-2 pr-2 d-inline-block" />
                        )}
                        <span>
                          {logOutKey.includes(key)
                            ? t('button.Removing')
                            : t('button.Remove')}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </React.Fragment>
      )}
    </ul>
  );
};

const getBrowserIcon = (browser) => {
  const browserName = browser.replace(/ .*/, ''); //  get only first word of the browser name as mobile browser comes with name 'Chrome mobile'
  const browserIcon = {
    Chrome: require('assets/img/chrome.svg')?.default,
    Firefox: require('assets/img/firefox.svg')?.default,
    Opera: require('assets/img/opera-mini.svg')?.default,
    Safari: require('assets/img/safari.svg')?.default,
    InternetExplorer: require('assets/img/i-explorer.svg')?.default,
    Edge: require('assets/img/edge.svg')?.default,
  };

  return browserIcon[browserName] || require('assets/img/globe.svg')?.default;
};

const getDeviceIcon = (deviceType) => {
  switch (deviceType) {
    case 'Personal computer':
      return 'ion-md-desktop';

    case 'Smartphone':
      return 'ion-md-phone-portrait';

    default:
      return;
  }
};

const getFormattedLoggedInTime = (date) => {
  if (!date) {
    return date;
  }

  const formattedDate = getFormattedDateTime(date);
  const loggedIn = new Date(formattedDate);
  const currentDate = new Date();

  const diffInSec = Math.floor(
    (currentDate.getTime() - loggedIn.getTime()) / 1000
  );

  if (diffInSec < 60) {
    return 'just now';
  }
  const diffInMin = Math.floor(diffInSec / 60);

  if (diffInMin < 60) {
    return `${diffInMin} ${diffInMin === 1 ? 'minute ago' : 'minutes ago'}`;
  }
  const diffInHour = Math.floor(diffInMin / 60);

  if (diffInHour < 24) {
    return `${diffInHour} ${diffInHour === 1 ? 'hour ago' : 'hours ago'}`;
  }
  const diffInDay = Math.floor(diffInHour / 24);

  if (diffInDay < 30) {
    return `${diffInDay} ${diffInDay === 1 ? 'day ago' : 'days ago'}`;
  }
  const diffInMonth = Math.floor(diffInDay / 30);

  if (diffInMonth < 12) {
    return `${diffInMonth} ${diffInMonth === 1 ? 'month ago' : 'months ago'}`;
  }

  return formattedDate;
};

const getFormattedDateTime = (date) => {
  const formattedDate = date.replace(/-/g, '/');

  return `${formattedDate.replace('T', ' ')} UTC`;
};

const getAddress = async (ip) => {
  const URL = `${process.env.REACT_APP_GEO_LOCATION_URL}/${process.env.REACT_APP_API_KEY}/${ip}`;

  const address = await fetch(URL)
    .then(async (res) => {
      const data = await res.json();

      return {
        city: data.city !== 'Not found' && data.city,
        country: data.country_name !== 'Not found' && data.country_name,
      };
    })
    .catch(() => ({ city: '', country: '' }));

  return address;
};

const getFormattedAddress = ({ city, country }) => {
  return city
    ? country
      ? ` | ${city}, ${country}`
      : ` | ${city}`
    : country && ` | ${country}`;
};

const getDevicesWithAddress = async (
  setDevices,
  setLogOutKey,
  toggleFetchingDevices
) => {
  const deviceList = await getDevices();

  await Promise.all(deviceList.map((device) => getAddress(device.ip))).then(
    (addresses) => {
      for (let i = 0; i < deviceList.length; i++) {
        deviceList[i].address = addresses[i];
      }
    }
  );
  setDevices(deviceList);
  toggleFetchingDevices(false);

  return setLogOutKey([]);
};

const staticSelector = sl.object({
  result: sl.list(
    sl.object({
      os: sl.string(''),
      ip: sl.string(''),
      id: sl.string(''),
      browser: sl.string(''),
      deviceType: sl.string(''),
      lastLoginDate: sl.string(''),
      browserVersion: sl.string(''),
      currentDevice: sl.boolean(false),
    })
  ),
});

export default DevicesTable;
