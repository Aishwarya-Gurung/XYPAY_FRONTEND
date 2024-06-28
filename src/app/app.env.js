const ENV = {
  UAT: 'uat',
  PROD: 'prod',
  LOCAL: 'local',
};

const isUATEnvironment = () => {
  return process.env.REACT_APP_ENV === ENV.UAT;
};

export const isLocalEnvironment = () => {
  return process.env.REACT_APP_ENV === ENV.LOCAL;
};

export default isUATEnvironment;
