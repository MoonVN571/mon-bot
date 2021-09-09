const client = require('../index');

client.on('warn', err => {
    client.sendWarn(err);
});