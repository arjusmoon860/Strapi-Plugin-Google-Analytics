module.exports = [
  {
    method: 'GET',
    path: '/init',
    handler: 'google.initLogin',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/access-token',
    handler: 'google.getUserProfile',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/credentials',
    handler: 'google.getCredentials',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/credentials/add',
    handler: 'google.createCredentials',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/google/redirect',
    handler: 'google.handleGoogleRedirect',
    config: {
      auth: false,
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/fetch-data',
    handler: 'google.fetchAnalyticsData',
    config: {
      auth: false,
      policies: [],
    },
  }
];
