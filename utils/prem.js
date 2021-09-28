const Database = require("simplest.db");

function getServer(serverId) {
    let db = new Database({path: './data/premiumServer/data.json'});
    
    let regAt = db.get(serverId + ".registeredTime");
    let expired = db.get(serverId + ".expiredIn");

    // nga2y het han
    let end = expired + Date.now();

    if(Date.now() < regAt + expired) return end - Date.now();
    else return false;
}

function getUser(userId) {
    let db = new Database({path: './data/premiumUser/data.json'});
    
    let regAt = db.get(userId + ".registeredTime");
    let expired = db.get(userId + ".expiredIn");

    let end = expired + Date.now();

    if(Date.now() < regAt + expired) return end - Date.now();
    else return false;
}

module.exports = {
    getUser, getServer
}