const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'online-examination-app',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

