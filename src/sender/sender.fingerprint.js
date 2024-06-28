import * as UAParser from 'ua-parser-js';
import Fingerprint2 from 'fingerprintjs2';

export const getDeviceFingerPrint = () => {
  return new Promise((resolve, reject) => {
    async function getHash() {
      const options = {
        excludes: {
          language: true,
          enumerateDevices: true,
          colorDepth: true,
          screenResolution: true,
          availableScreenResolution: true,
          timezoneOffset: true,
          timezone: true,
          sessionStorage: true,
          localStorage: true,
          indexedDb: true,
          addBehavior: true,
          openDatabase: true,
          plugins: true,
          webgl: true,
          webglVendorAndRenderer: true,
          adBlock: true,
          hasLiedLanguages: true,
          hasLiedResolution: true,
          touchSupport: true,
          fonts: true,
          audio: true,
        },
        preprocessor: (key, value) => {
          if (key === 'userAgent') {
            const parser = new UAParser(value);
            // return customized user agent (without browser version)

            return `${parser.getOS().name} :: ${parser.getBrowser().name} :: ${
              parser.getEngine().name
            }`;
          }

          return value;
        },
      };

      try {
        const components = await Fingerprint2.getPromise(options);
        const values = components.map((component) => component.value);

        return String(Fingerprint2.x64hash128(values.join(''), 31));
      } catch (e) {
        reject(e);
      }
    }

    if (window.requestIdleCallback) {
      requestIdleCallback(async () => resolve(await getHash()));
    } else {
      setTimeout(async () => resolve(await getHash()), 500);
    }
  });
};
