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


describe('Test DU-pairs of inFile in main', () => {
    beforeEach(() => {
        consoleOutput = [];
        console.log = (output) => consoleOutput.push(output);

    });

    // (main, inFile, 98) - (stut, inFile, 37)
    it('receive input from stdin', () => {                  
        exec('echo "" | node Stutter.js', (error, stdout, stderr) =>{
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (main, inFile, 104) - (stut, inFile, 37)
    it('receive input from file without name', () => {      
        exec('echo "" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    //(main, inFile, 109) - (stut, inFile, 37)
    it.only('receive input from file', () => {              

        const tempFileName = path.join(__dirname, 'tmp.txt');
        fs.writeFileSync(tempFileName, '');

        exec(`node Stutter.js ${tempFileName}`, (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }


            assert.strictEqual(stdout.trim(), "");
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

describe('Test DU-pair of c in stut', () => {
    // (stut, c, 42) - (#isDelimit, C, 84)
    it('has one character as input', () => {      
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
});

describe('Test DU-pairs of linecnt in stut', () => {
    // (stut, linecnt, 35) - (#checkDupes(line 46), line, 70)
    it('has linecnt = 1 & callsite: 1st #checkDupes', () => {      
        exec('echo "a a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: a a");
        });
    });

    // (stut, linecnt, 54) - (#checkDupes(line 46), line, 70)
    it('has linecnt++ & callsite: 1nd #checkDupes', () => {      
        exec('echo "\na a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 2: a a");
        });
    });

    // (stut, linecnt, 35) - (#checkDupes(line 53), line, 70)
    it.only('has linecnt = 1 & callsite: 2nd #checkDupes', () => {      
        exec('echo "a a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: a a");
        });
    });


    // (stut, linecnt, 54) - (#checkDupes(line 53), line, 70)
    it('has linecnt++ & callsite: 2nd #checkDupes', () => {      
        exec('echo "\na a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 2: a a");
        });
    });
});

describe.only('Test DU-pairs of #lastdelimit in constructor, stut, #checkDupes', () => {
    // (main, #lastdelimit, 21) - (#checkDupes(line 46), #lastdelimt, 64)
    it.only('has #lastdelimit = true & callsite: #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
});