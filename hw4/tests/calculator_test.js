const assert = require('assert');
const { test } = require('node:test');

const Calculator = require('../src/calculator');

test('normal', () => {
    assert.strictEqual(Calculator.main(1, 1, 2, 1, 2024), 31);
    assert.strictEqual(Calculator.main(12, 30, 12, 31, 2024), 1);
    //assert.strictEqual(Calculator.main(2, 28, 3, 1, 2024), 2);

    assert.strictEqual(Calculator.main(1, 1, 1, 1, 1900), 0);
    assert.strictEqual(Calculator.main(1, 31, 2, 1, 1900), 1);
    //assert.strictEqual(Calculator.main(2, 28, 3, 1, 1900), 1);

    assert.strictEqual(Calculator.main(1, 1, 1, 1, 10000), 0);
    assert.strictEqual(Calculator.main(1, 1, 1, 1, 1), 0);
    assert.strictEqual(Calculator.main(1, 1, 3, 1, 2024), 60);
    assert.strictEqual(Calculator.main(1, 1, 3, 1, 2023), 59);
    assert.strictEqual(Calculator.main(1, 1, 3, 1, 400), 60);
    assert.strictEqual(Calculator.main(1, 1, 3, 1, 100), 59);
});

test('throw error', () => {
    let err = Error('invalid month1');
    assert.throws(() => Calculator.main(0, 1, 1, 1, 2024), err);
    assert.throws(() => Calculator.main(13, 1, 1, 1, 2024), err);
    err = Error('invalid month2');
    assert.throws(() => Calculator.main(1, 1, 0, 1, 2024), err);
    assert.throws(() => Calculator.main(1, 1, 13, 1, 2024), err);
    err = Error('invalid day1');
    assert.throws(() => Calculator.main(1, 0, 1, 1, 2024), err);
    assert.throws(() => Calculator.main(1, 32, 1, 1, 2024), err);
    err = Error('invalid day2');
    assert.throws(() => Calculator.main(1, 1, 1, 0, 2024), err);
    assert.throws(() => Calculator.main(1, 1, 1, 32, 2024), err);
    err = Error('invalid year');
    assert.throws(() => Calculator.main(1, 1, 1, 1, 0), err);
    assert.throws(() => Calculator.main(1, 1, 1, 1, 10001), err);
    err = Error('day1 must be less than day2 if month1 is equal to month2');
    assert.throws(() => Calculator.main(1, 2, 1, 1, 2024), err);
    err = Error('month1 must be less than month2');
    assert.throws(() => Calculator.main(2, 1, 1, 1, 2024), err);
    assert.throws(() => Calculator.main(2, 1, 1, 2, 2024), err);
});