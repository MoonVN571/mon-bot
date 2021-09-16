const Database = require('simplest.db');
const log = require('./logger');

/**
 * 
 * @param {*} user_id ID người cần kiểm tra tiền
 * @returns 
 */
function getMoney(user_id) {
    const userData = new Database({path: "./data/eco/" + user_id + ".json"});

    return userData.get("money") ? userData.get("money") : 0;
}

/**
 * 
 * @param {*} author Tên Người thêm tiền
 * @param {*} user_id ID người thêm tiền
 * @param {*} moneyAdd Số tiền cần thêm
 */
function addMoney(author, user_id, moneyAdd) {    
    if(isNaN(moneyAdd)) throw new Error("Tiền phải là một con số");

    const userData = new Database({path: "./data/eco/" + user_id + ".json"});
    userData.number.add('money', parseInt(moneyAdd));

    log("economy/add", author + " added to " + user_id + " with " + moneyAdd);
}

/**
 * 
 * @param {*} author Tên người trừ tiền
 * @param {*} user_id ID để trừ tiền
 * @param {*} moneyRemove Số tiền cần trừ
 */
function apartMoney(author, user_id, moneyRemove) {    
    if(isNaN(moneyRemove)) throw new Error("Tiền phải là một con số");

    const userData = new Database({path: "./data/eco/" + user_id + ".json"});
    userData.number.subtract('money', parseInt(moneyRemove));

    log("economy/remove", author + " remove money of " + user_id + " with " + moneyRemove);
}

/**
 * 
 * @param {*} author Tên Người thêm tiền
 * @param {*} user_id ID người thêm tiền
 * @param {*} moneySet Số tiền cần thêm
 */
function setMoney(author, user_id, moneySet) {    
    if(isNaN(moneySet)) throw new Error("Tiền phải là một con số");

    const userData = new Database({path: "./data/eco/" + user_id + ".json"});
    userData.set('money', parseInt(moneySet));

    log("economy/add", author + " set " + user_id + " balance to  " + moneySet);
}


module.exports = {
    getMoney,
    addMoney,
    apartMoney,
    setMoney
}