function removeEmpty(obj) {
    Object.keys(obj).forEach(k =>
        (obj[k] && typeof obj[k] === 'object') && removeEmpty(obj[k]) ||
        (!obj[k] && obj[k] !== undefined) && delete obj[k]
    );
    return obj;
};

function JSONstringify(obj, indentation = '  '){
    const cache = [];
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.includes(value)) return;

            cache.push(value);
        }
        return value;
    }, indentation);
}

module.exports = { removeEmpty, JSONstringify };