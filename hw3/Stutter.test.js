/* integration test */
/* stdout */
// NodeJS test doesn't support mocking function console.log for now
// Using Jest disable the functionallity of process.argv and process.stdin
// override console.log with custom function and pretend it to be mocking
/* stdin */
// using process.stdin.push(null) in every it() produce error: Error [ERR_STREAM_PUSH_AFTER_EOF]: stream.push() after EOF
// using exec with echo to pipe the input in CLI

const {describe, it, beforeEach} = require('node:test');
//const {describe, it, beforeEach, afterEach, expect, mockImplementation} = require('@jest/globals');
const assert = require('node:assert');
const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');
const {Stutter, main} = require('./Stutter');


describe('Test DU-pair of inFile', (t) => {
    beforeEach(() => {
        consoleOutput = [];
        console.log = (output) => consoleOutput.push(output);

    });

    it('receive input from stdin', () => {   // (main, inFile, 98) - (stut, inFile, 37)
        exec('echo "hello world world" | node Stutter.js', (error, stdout, stderr) =>{
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: world world");
        });
    });

    it('receive input from file without name', () => {   // (main, inFile, 104) - (stut, inFile, 37)
        exec('echo "hello hello world" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: hello hello");
        });
    });

    it('receive input from file', () => {

        const tempFileName = path.join(__dirname, 'tmp.txt');
        fs.writeFileSync(tempFileName, 'hello peko peko');

        exec(`node Stutter.js < ${tempFileName}`, (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }


            assert.strictEqual(stdout.trim(), "Repeated word on line 1: peko peko");
            fs.unlinkSync(tempFileName);
        });
    });

    /*
    it('receive input from file', async () => {
        let consoleOutput = [];
        console.log = jest.fn((output) => consoleOutput.push(output));
        process.argv = ['node', 'Stutter.js', '"tmp.txt"'];
        

        //const mockReadlineEmitter = new EventEmitter();
        readline.createInterface.mockImplementation(() => ({
            [Symbol.asyncIterator]: async function*() {
                yield 'hello World Wolr'
            },
        }));
        //mockReadlineEmitter.emit('line', 'hello World World');
        //mockReadlineEmitter.emit('close');

        await main();
        expect(consoleOutput[0]).toHaveBeenCalledWith("Repeated word on line 1: World World");

    });
    */

    /*
    it('receive input from file', async () => {
        let consoleOutput = [];
        console.log = jest.fn((output) => consoleOutput.push(output));
        process.argv = ['node', 'Stutter.js', '"tmp.txt"'];
        //fs.createReadStream = jest.fn(() => {
            const Readable = require('stream').Readable;
            const ReadStream = new Readable({
                read() {}
            });
            ReadStream.push("1 2 2\n");
            ReadStream.push(null);
            //return ReadStream;
        //});
        await fs.createReadStream.mockReturnValue(ReadStream);

        // main() is defined with async
        await main();
        expect(consoleOutput[0]).toHaveBeenCalledWith("Repeated word on line 1: 2 2");
        //assert.strictEqual(consoleOutput[0], "Repeated word on line 1: 2 2");
    });
    */
});