const Axios = require('axios');
const Canvas = require('canvas');
const Fs = require('fs');
const ms = require('ms');

require("dotenv").config();

/**
 * 
 * @param {*} arr Array
 * @param {*} maxLen length to trimp
 * @param {String} Out out with {COUNT}
 * @returns 
 */       
function trimText(arr, maxLen, text) {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen;
        arr = arr.slice(0, maxLen);
        arr.push(text.replace("{COUNT}", len));
    }
    return arr;
}

function checkDupe(arr) {
    return arr.some( function(item) {
        if(!isNaN(item)) return;
        return arr.indexOf(item) !== arr.lastIndexOf(item);
    });
}

function getTick(time){
    var hms = '';

    let checkValid = checkDupe(time.split(""));
    if(checkValid) return false;

    if(ms(time)) hms = ms(time, { long: true}) / 1000;

    if(!ms(time)) {
        let checkHM = time.includes("h") && time.includes("m");
        let checkMS = time.includes("s") && time.includes("s");
        let checkHS = time.includes("h") && time.includes("s");
        let checkHMS = time.includes("h") &&time.includes("m") && time.includes("s");

        if(!checkHS && !checkHM && !checkHMS) return false;
        // check valid time

        if(checkHM) {
            // valid format tiime
            if(checkArr(time.split(""))) {
                console.log("1",time);
                hms = `${time.split("h")[0]}:${time.split("m")[0].split("h")[1]}:00`;
            }
        } else if(checkHS) {
            // valid format tiime
            if(checkArr(time.split(""))) {
                console.log("2",time);
                hms = `${time.split("h")[0]}:00:${time.split("h")[1].split("s")[0]}`;
            }
        } else if(checkMS) {
            if(checkArr(time.split(""))) {
                console.log("2",time);
                hms = `00:${time.split("m")[0]}:${time.split("m")[1].split("s")[0]}`;
            }
        } else if(checkHMS) {
            // valid format tiime
            if(checkArr(time.split(""))) {
                console.log(time);
                hms = `${time.split("h")[0]}:${time.split("m")[0].split("h")[1]}:${time.split("m")[1].split("s")[0]}`
            }
        }

        async function checkArr(data) {
            let stt = true; 
            data.forEach(v => {
                if(isNaN(v) && !(v == "h" || v == "m" || v == "s"))  stt = false;
            });
            return stt;
        }

    }

    var a;
    if(isNaN(hms)) a = hms.split(':');
    if(a) var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    
    if(!isNaN(hms)) var seconds = hms;

    if(!seconds) return false;
    return seconds * 1000;
}

/**
 * 
 * @param {*} min Min number
 * @param {*} max Max number
 * @returns random in min max
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function sodep(num) {
    const pattern = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(pattern, '.');
}

/**
 * 
 * @param {Number} Mili Second to sleep 
 * @returns 
 */
function sleep(time) {
    return new Promise((res) => setTimeout(res, time));
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
        // if (err) console.log(dir + "\n" + err);
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

/**
 * 
 * @param {*} time 
 * @returns better string ignore zero
 */
function calculate(time, ga) {
    var temp = time / 1000;
    var days = 0, hours = 0, minutes = 0, seconds = 0;
    days = parseInt(temp / 86400);
    hours = parseInt(((temp - days * 86400) / 3600));
    minutes = parseInt(((temp - days * 86400 - hours * 3600)) / 60);
    
    if(minutes == 0 || hours == 0 || !minutes || !hours) {
        seconds = (temp % 60).toFixed(1);
    } else {
        seconds = parseInt(temp % 60);
    }

    if(ga) seconds = parseInt(temp %60);

    var string = "";
    if(seconds > 0) string = seconds + " giây";
    if(minutes > 0) string = minutes + " phút " + string;
    if(hours > 0)   string = hours   + " giờ " + string;
    if(days > 0)    string = days    + " ngày " + string;
    
    return string.trim();
}

/**
 * 
 * @param {*} time 
 * @returns btter datetime
 */
function getAge(time, debug) {
    var up = new Date(new Date().getTime() - new Date(time).getTime());

    // 20/03/2018 17:21:25

    let years = up.getUTCFullYear() - 1970;
    let months = up.getUTCMonth();
    let days = up.getUTCDate() - 1;
    let hours = up.getUTCHours();
    let minutes = up.getUTCMinutes();

    if(debug) console.log(years, months, days, hours, minutes);

    var string = "vài giây";
    if(minutes > 0) string = minutes + " phút " + string;
    if(hours > 0)   string = hours   + " giờ " + string;
    if(days > 0)    string = days    + " ngày " + string;
    if(months > 0)  string = months  + " tháng " + string;
    if(years > 0)   string = years    + " năm " + string;
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
    validImageUrl,
    sodep,
    sleep,
    trimText,
    getTick
};