function oddOrPos(x) {
    if (!Array.isArray(x)) {
        throw new TypeError('Not an array');
    }
    let count = 0;
    for (let i = 0; i < x.length; i++) {
        if (x[i] % 2 === 1 || x[i] % 2 === -1 || x[i] > 0) {
            count++;
        }
        console.log(`${i}, ${x[i] % 2}, ${x[i] % 2 === 1}`);
    }
    console.log(count);
    return count;
}

(() => {
    const x = [-99, -2, 0, 1, 4];
    oddOrPos(x);
})();