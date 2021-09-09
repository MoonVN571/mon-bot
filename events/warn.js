const client = require('../index');

const { Admin } = require('../config.json');

client.on('error', err => {
    console.log(err);
    if(!err.message) return;
    client.users.cache.get(Admin).send(err.message);
});