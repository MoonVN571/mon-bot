function removeEmpty(obj) {
    Object.keys(obj).forEach(k =>
        (obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k]) ||
        (!obj[k] && obj[k] !== undefined) && delete obj[k]
    );
    return obj;
};

module.exports = { removeEmpty };