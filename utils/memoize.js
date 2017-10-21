function memoize(func) {
    let cache = new Map();

    let cachedfun = function (...args) {
        const key = args[0];
        if (cache.has(key)) {
            return cache.get(key);
        } else {
            const result = func.apply(this, args);
            cache.set(key, result);
            return result;
        }

    };
    return cachedfun;
};

module.exports = memoize;