const {describe, it, beforeEach, before} = require('node:test');
const assert = require('node:assert');
const {BoundedQueue} = require('./BoundedQueue');

describe('Test constructor', () => {
    beforeEach(() => {
        queue = new BoundedQueue(3);
        queue.enqueue(1);
    });

    it('give valid capacity', () => {
        queue = new BoundedQueue(2);
        assert.strictEqual(queue.toString(), "[] is_empty(): true, is_full(): false");
        assert.strictEqual(queue.capacity, 2);
    });
    
    it('give invalid capacity', () => {
        const err = new RangeError("capacity is less than 0");
        assert.throws(() => queue = new BoundedQueue(-1), err);
    });

    it('has originally full queue', () => {
        queue.enqueue(456);
        queue.enqueue(789);
        queue = new BoundedQueue(2);
        assert.strictEqual(queue.toString(), "[] is_empty(): true, is_full(): false");
        assert.strictEqual(queue.capacity, 2);
    });

    it('has originally empty queue', () => {
        queue.dequeue();
        queue = new BoundedQueue(2);
        assert.strictEqual(queue.toString(), "[] is_empty(): true, is_full(): false");
        assert.strictEqual(queue.capacity, 2);
    });

});

describe('Test enqueue', () =>{
    beforeEach(() => {
        queue = new BoundedQueue(3);
        queue.enqueue(1);
    });

    it('give valid number', () => {
        queue.enqueue(2);
        assert.strictEqual(queue.toString(), "[1, 2] is_empty(): false, is_full(): false");
    });

    it('give element not type of number', () => {
        const err = new RangeError("element is invalid");
        assert.throws(() => queue.enqueue("adc"), err);
    });

    it('give NaN', () => {
        const err = new RangeError("element is invalid");
        assert.throws(() => queue.enqueue(Number.NaN), err);
    });

    it('has originally full queue', () => {
        queue.enqueue(2);
        queue.enqueue(3);
        const err = Error("queue is full");
        assert.throws(() => queue.enqueue(4), err);
    });

    it('has originally empty queue', () => {
        queue.dequeue();
        queue.enqueue(2);
        assert.strictEqual(queue.toString(), "[2] is_empty(): false, is_full(): false");
    });
});

describe('Test dequeue', () => {
    beforeEach(() => {
        queue = new BoundedQueue(3);
        queue.enqueue(1);
    });

    it('is happy path', () => {
        assert.strictEqual(queue.dequeue(), 1);
        assert.strictEqual(queue.toString(), "[] is_empty(): true, is_full(): false");
    });

    it('has originally full queue', () => {
        queue.enqueue(2);
        queue.enqueue(3);
        assert.strictEqual(queue.dequeue(), 1);
        assert.strictEqual(queue.toString(), "[2, 3] is_empty(): false, is_full(): false");
    });

    it('has originally empty queue', () => {
        assert.strictEqual(queue.dequeue(), 1);
        const err = new Error("queue is empty");
        assert.throws(() => queue.dequeue(), err);
    });
});

describe('Test is_empty', () => {
    beforeEach(() => {
        queue = new BoundedQueue(3);
        queue.enqueue(1);
    });

    it('is happy path', () => {
        assert.strictEqual(queue.is_empty(), false);
    });

    it('has originally full queue', () => {
        queue.enqueue(2);
        queue.enqueue(3);
        assert.strictEqual(queue.is_empty(), false);
    });

    it('has originally empty queue', () => {
        assert.strictEqual(queue.dequeue(), 1);
        assert.strictEqual(queue.is_empty(), true);
    });
});


describe('Test is_full', () => {
    beforeEach(() => {
        queue = new BoundedQueue(3);
        queue.enqueue(1);
    });

    it('is happy path', () => {
        assert.strictEqual(queue.is_full(), false);
    });

    it('has originally full queue', () => {
        queue.enqueue(2);
        queue.enqueue(3);
        assert.strictEqual(queue.is_full(), true);
    });

    it('has originally empty queue', () => {
        assert.strictEqual(queue.dequeue(), 1);
        assert.strictEqual(queue.is_full(), false);
    });
});


/*
 *  queue being empty and full at the same time is not tested, 
 +  need to choose additional boundary value of queue to test this situation.
 */