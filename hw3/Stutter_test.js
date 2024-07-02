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

describe('Test DU-pairs of #lastdelimit in constructor, stut, #checkDupes', () => {
    // (main, #lastdelimit, 21) - (#checkDupes(line 46), #lastdelimt, 64)
    it('has #lastdelimit = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (main, #lastdelimit, 21) - (#checkDupes(line 53), #lastdelimt, 64)
    it('has #lastdelimit = true at main & callsite: 2nd #checkDupes', () => {
        exec('echo "" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (stut, #lastdelimit, 49) - (#checkDupes(line 46), #lastdelimt, 64)
    it('has #lastdelimit = false at stut & callsite: 1st #checkDupes', () => {
        exec('echo "a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (stut, #lastdelimit, 49) - (#checkDupes(line 53), #lastdelimt, 64)
    it('has #lastdelimit = false at stut & callsite: 2nd #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 46), #lastdelimit, 67) - (#checkDupes(line 46), #lastdelimt, 64)
    it('has #lastdelimit = true at 1st #checkDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a!!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 46), #lastdelimit, 67) - (#checkDupes(line 53), #lastdelimt, 64)
    it('has #lastdelimit = true at lst #checkDupes & callsite: 2nd #checkDupes', () => {
        exec('echo "a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 53), #lastdelimit, 67) - (#checkDupes(line 46), #lastdelimt, 64)
    it('has #lastdelimit = true at 2nd #checkDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a\n!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 53), #lastdelimit, 67) - (#checkDupes(line 53), #lastdelimt, 64)
    it('has #lastdelimit = true at 2nd #checkDupes & callsite: 2nd #checkDupes', () => {
        exec('echo "a\n" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
});


describe('Test DU-pairs of #curWord in constructor, stut, #checkDupes', () =>{
    // (main, #curWord, 22) - (#checkDupes(line 46), #curWord, 68) *infeasiblen *1* reaching specified use require #lastdelimit = false, which basic block has another define #curWord += c, making this path not def-clear.
    /*
    it('has #curWold = "" at main & callsite: 1st #checkDupes', () => {
        exec('echo "a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (main, #curWord, 22) - (#checkDupes(line 46), #curWord, 70) *infeasiblen *1*
    /*
    it('has #curWold = "" at main & callsite: 1st #checkDupes', () => {
        exec('echo "a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (main, #curWord, 22) - (#checkDupes(line 46), #curWord, 73) *infeasible *1*
    /*
    it('has #curWord = "" at main & callsite: 1st #checkDupes', () => {
        exec('echo "a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (main, #curWord, 22) - (#checkDupes(line 53), #curWord, 68) *infeasible *1*
    /*
    it('has #curWord = "" at main & callsite: 2nd #checkDupes', () => {
        exec('echo "\n" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (main, #curWord, 22) - (#checkDupes(line 53), #curWord, 70) *infeasible *1*
    /*
    it('has #curWord = "" at main & callsite: 2nd #checkDupes', () => {
        exec('echo "\n" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (main, #curWord, 22) - (#checkDupes(line 53), #curWord, 73) *infeasible *1*
    /*
    it('has #curWord = "" at main & callsite: 2nd #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (stut, #curWord, 50) - (#checkDupes(line 46), #curWord, 68)
    it('has #curWord += c at stut & callsite: 1st #checkDupes', () => {
        exec('echo "a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (stut, #curWord, 50) - (#checkDupes(line 46), #curWord, 70)
    it('has #curWord += c at stut & callsite: 1st #checkDupes', () => {
        exec('echo "a!a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: a a");
        });
    });

    // (stut, #curWord, 50) - (#checkDupes(line 46), #curWord, 73)
    it('has #curWord += c at stut & callsite: 1st #checkDupes', () => {
        exec('echo "a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (stut, #curWord, 50) - (#checkDupes(line 53), #curWord, 68)
    it('has #curWord += c at stut & callsite: 2nd #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (stut, #curWord, 50) - (#checkDupes(line 53), #curWord, 70)
    it('has #curWord += c at stut & callsite: 2nd #checkDupes', () => {
        exec('echo "a!a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: a a");
        });
    });

    // (stut, #curWord, 50) - (#checkDupes(line 53), #curWord, 73)
    it('has #curWord += c at stut & callsite: 2nd #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 46), #curWord, 75 - (#checkDupes(line 46), #curWord, 68) *infeasible *2* in basic block of defining #curWord, #lastdelimit = true, making latter entering of this basic block impossible without the basic block containing #lastdelimit = false and #curWord += c. Therefore the path is not def-clear. 
    /*
    it('has #curWord = "" at 1st #chekDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 46), #curWord, 75 - (#checkDupes(line 46), #curWord, 70) *infeasible *2*
    /*
    it('has #curWord = "" at 1st #chekDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 46), #curWord, 75 - (#checkDupes(line 46), #curWord, 73) *infeasible *2*
    /*
    it('has #curWord = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 46), #curWord, 75 - (#checkDupes(line 53), #curWord, 68) *infeasible *2*
    /*
    it('has #curWord = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 46), #curWord, 75 - (#checkDupes(line 53), #curWord, 70) *infeasible *2*
    /*
    it('has #curWord = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 46), #curWord, 75 - (#checkDupes(line 53), #curWord, 73) *infeasible *2*
    /*
    it('has #curWord = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 53), #curWord, 75 - (#checkDupes(line 46), #curWord, 68) *infeasible *2* 
    /*
    it('has #curWord = "" at 1st #chekDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 53), #curWord, 75 - (#checkDupes(line 46), #curWord, 70) *infeasible *2* 
    /*
    it('has #curWord = "" at 1st #chekDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 53), #curWord, 75 - (#checkDupes(line 46), #curWord, 73) *infeasible *2*
    /*
    it('has #curWord = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 53), #curWord, 75 - (#checkDupes(line 53), #curWord, 68) *infeasible *2*
    /*
    it('has #curWord = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 53), #curWord, 75 - (#checkDupes(line 53), #curWord, 70) *infeasible *2*
    /*
    it('has #curWord = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 53), #curWord, 75 - (#checkDupes(line 53), #curWord, 73) *infeasible *2*
    /*
    it('has #curWord = true at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

});

describe('Test DU-pairs of #prevWord in constructor, #checkDupes', () => {
    // (main, #prevWord, 23) - (#checkDupes(line 46), #prevWord, 68)
    it('has #prevWord = "" at main & callsite: 1st #checkDupes', () => {
        exec('echo "a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (main, #prevWord, 23) - (#checkDupes(line 46), #prevWord, 70) *infeasible *3* executing console.log implies that #curWord === #prevWord, but this require #prevWord = #curWord in advanced so that #prevWord won't be "" (which cannot be compared), which make the path not def-clear
    /*
    it('has #prevWord = "" at main & callsite: 1st #checkDupes', () => {
        exec('echo "" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: a a");
        });
    });
    */

    // (main, #prevWord, 23) - (#checkDupes(line 53), #prevWord, 68)
    it('has #prevWord = "" at main & callsite: 2nd #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (main, #prevWord, 23) - (#checkDupes(line 53), #prevWord, 70) *infeasible *3*
    /*
    it.only('has #prevWord = "" at main & callsite: 1st #checkDupes', () => {
        exec('echo "a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });
    */

    // (#checkDupes(line 46), #prevWord, 73) - (#checkDupes(line 46), #prevWord, 68)
    it('has #prevWord = "" at 1st #checkDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a!b!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 46), #prevWord, 73) - (#checkDupes(line 46), #prevWord, 70)
    it('has #prevWord = "" at 1st #checkDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a!a!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: a a");
        });
    });

    // (#checkDupes(line 46), #prevWord, 73) - (#checkDupes(line 53), #prevWord, 68)
    it('has #prevWord = "" at 1st #checkDupes & callsite: 2nd #checkDupes', () => {
        exec('echo "a!b" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 46), #prevWord, 73) - (#checkDupes(line 53), #prevWord, 70)
    it('has #prevWord = "" at 1st #checkDupes & callsite: 2nd #checkDupes', () => {
        exec('echo "a!a" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 1: a a");
        });
    });

    // (#checkDupes(line 53), #prevWord, 73) - (#checkDupes(line 46), #prevWord, 68)
    it('has #prevWord = "" at 2nd #checkDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a\nb!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 53), #prevWord, 73) - (#checkDupes(line 46), #prevWord, 70)
    it('has #prevWord = "" at 2nd #checkDupes & callsite: 1st #checkDupes', () => {
        exec('echo "a\na!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 2: a a");
        });
    });

    // (#checkDupes(line 53), #prevWord, 73) - (#checkDupes(line 53), #prevWord, 68)
    it('has #prevWord = "" at 2nd #checkDupes & callsite: 2nd #checkDupes', () => {
        exec('echo "a\nb\n" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

    // (#checkDupes(line 53), #prevWord, 73) - (#checkDupes(line 53), #prevWord, 70)
    it('has #prevWord = "" at 2nd #checkDupes & callsite: 2nd #checkDupes', () => {
        exec('echo "a\na\n" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "Repeated word on line 2: a a");
        });
    });
});

describe('Test DU-pairs of #delimits in #isDelimit', () => {
    // (main, #delimits, 24) - (#isDelimit, #delimits, 83)
    it('has #prevWord = "" at main & callsite: 1st #checkDupes', () => {
        exec('echo "!" | node Stutter.js ""', (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                return;
            }
            assert.strictEqual(stdout.trim(), "");
        });
    });

});