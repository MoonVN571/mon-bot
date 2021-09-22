const client = require('../index');

module.exports.getFormat = (data) => {
    data = data.toString().replace(/<PREFIX>/ig, client.prefix).replace(/<EXAMPLE_ID>/ig, "000000000000000000");
    data = data.toString().replace(/<BOT_MENTIONS>/ig, client.user ? client.user.toString() : "Unknown");
    // data = data.toString().replace()

    return data;
}