const Axios = require('axios');
const Canvas = require('canvas');
const Fs = require('fs');

require("dotenv").config();

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * 
 * Cre: stackoverflow
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 
 * @param {*} time 
 * @returns better string ignore zero
 */
function calculate(time) {
    var temp = time / 1000;
    var days = 0, hours = 0, minutes = 0, seconds = 0;
    days = parseInt(temp / 86400);
    hours = parseInt(((temp - days * 86400) / 3600));
    minutes = parseInt(((temp - days * 86400 - hours * 3600)) / 60);
    seconds = parseInt(temp % 60);

    // console.log(days, hours, minutes, seconds)

    var string = "1 giây";
    if (hours == 0 && minutes == 0 && seconds > 0) string = seconds + " giây";
    if (hours == 0 && minutes > 0 && seconds == 0) string = minutes + " phút";
    if (hours == 0 && minutes > 0 && seconds > 0) string = minutes + " phút " + seconds + " giây";

    if (hours > 0 && minutes > 0 && seconds == 0) string = hours + " giờ " + minutes + " phút";
    if (hours > 0 && minutes == 0 && seconds > 0) string = hours + " giờ " + seconds + " giây";
    if (hours > 0 && minutes > 0 && seconds > 0) string = hours + " giờ " + minutes + " phút " + seconds + " giây";

    if (days > 0) string = days + " ngày " + string;

    return string;
}


/**
 * 
 * @param {*} time 
 * @returns btter datetime
 */
function getAge(time) {
    var up = new Date(new Date().getTime() - new Date(time).getTime());

    // 20/03/2018 17:21:25

    let years = up.getUTCFullYear() - 1970;
    let months = up.getUTCMonth();
    let days = up.getUTCDate() - 1;
    let hours = up.getUTCHours();
    let minutes = up.getUTCMinutes();

    var string = "vài giây";
    if (hours == 0 && minutes > 0) string = minutes + " phút";
    if (hours > 0 && minutes == 0) string = hours + " giờ";

    if (hours > 0 && minutes > 0) string = hours + " giờ " + minutes + " phút";
    if (hours > 0 && minutes == 0) string = hours + " giờ";

    if (days > 0 && months > 0) string = months + " tháng " + days + " ngày ";
    if (days > 0 && months == 0) string = days + " ngày " + string;
    if (days == 0 && months > 0) string = months + " tháng";

    if (years > 0) string = years + " năm " + string;

    return string;
}

/**
 * 
 * @param {*} datetime 
 * @returns DD/MM/YY
 */
function getDate(datetime) {
    return soKhong(new Date(datetime).getDate(), 2) +
        "/" + soKhong(new Date(datetime).getMonth() + 1, 2) +
        "/" + new Date(datetime).getFullYear();
}

/**
 * 
 * @param {*} time 
 * @returns HH:MM:SS
 */
function getTime(time) {
    return soKhong(new Date(time).getHours(), 2) +
        ":" + soKhong(new Date(time).getMinutes(), 2) +
        ":" + soKhong(new Date(time).getSeconds(), 2);
}

/**
 * 
 * @param {*} datetime 
 * @returns DD/MM/YY HH:MM:SS 
 */
function getTimestamp(datetime) {
    return soKhong(new Date(datetime).getDate(), 2) +
        "/" + soKhong(new Date(datetime).getMonth() + 1, 2) +
        "/" + new Date(datetime).getFullYear() +
        " " +
        soKhong(new Date(datetime).getHours(), 2) +
        ":" + soKhong(new Date(datetime).getMinutes(), 2) +
        ":" + soKhong(new Date(datetime).getSeconds(), 2);
}

/**
 * 
 * @param {*} value 
 * @param {*} length 
 * @returns 01
 */
function soKhong(value, length) {
    return `${value}`.padStart(length, 0);
}

/**
 * 
 * @param {*} data_array 
 * @returns data
 */
function layNgauNhien(data_array) {
    return data_array[Math.floor(Math.random() * data_array.length)];
}

/**
 * @param {*} dir Save to file
 * @param {*} url Url load to stream
 * @param {*} fileName File name write to file
 * @returns 
 */
async function download(dir, url) {
    const key = Buffer.from(process.env.USERNAME + ':' + process.env.PASSWORD).toString("base64");
    const response = await Axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: { 'Authorization': 'Basic ' + key }
    });
    response.data.pipe(Fs.createWriteStream(dir))
    return new Promise((resolve, reject) => {
        response.data.on('end', () => {
            resolve();
        });
        response.data.on('error', () => {
            reject(err);
        });
    });
}

/**
 * 
 * @param {*} dir 
 */
async function remove(dir) {
    Fs.unlink(dir, (err) => {
        if (err) console.log(dir + "\n" + err);
    });
}

async function validImageUrl(url, guildID) {
    try {
        await download('./assets/welcome/process/' + guildID + ".png", url);

        await Canvas.loadImage(url);
        delete ('./assets/welcome/process/' + guildID + '.png');
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    random,
    calculate,
    soKhong,
    layNgauNhien,
    getTime,
    getDate,
    getTimestamp,
    getAge,
    download,
    remove,
    validImageUrl
};