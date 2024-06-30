// Authors: Paul Ammann & Jeff Offutt
// Chapter 7; page ??
// Can be run from command line
// See Stutter.num for a numbered version.
// No JUnit tests at this time.

/** *****************************************************
// Stutter checks for repeat words in a text file.
// It prints a list of repeat words, by line number.
// Stutter will accept standard input or a list
// of file names.
 *  Jeff Offutt, June 1989 (in C), Java version March 2003 
********************************************************* */

const fs = require('node:fs');
const { stdin, argv } = require('node:process');
const readline = require('node:readline');

class Stutter {
    // Class variables used in multiple methods.
    static #lastdelimit = true;
    static #curWord = "";
    static #prevWord = "";
    static #delimits = "\t ,.!-+=;:?&{}\\";

    //************************************************
    // Stut() reads all lines in the input stream, and
    // finds words. Words are defined as being surrounded
    // by delimiters as defined in the delimits string.
    // Every time an end of word is found, checkDupes()
    // is called to see if it is the same as the
    // previous word.
    //************************************************
    static async stut(inFile) {
        let linecnt = 1;
        const rl = readline.createInterface({
            input: inFile,
            crlfDelay: Infinity,
        });
        for await (const inLine of rl) {
            // For each line
            for (const c of inLine) {
                // for each character
                if (this.#isDelimit(c)) {
                    // Found an end of a word.
                    this.#checkDupes(linecnt);
                }
                else {
                    this.#lastdelimit = false;
                    this.#curWord += c;
                }
            }
            this.#checkDupes(linecnt);
            linecnt++;
        }
    }

    //************************************************
    // checkDupes() checks to see if the globally defined
    // curWord is the same as prevWord and prints a message
    // if they are the same.
    //************************************************
    static #checkDupes(line) {
        if (this.#lastdelimit)
            // already checked, keep skipping
            return;
        this.#lastdelimit = true;
        if (this.#curWord === this.#prevWord) {
            console.log(
                `Repeated word on line ${line}: ${this.#prevWord} ${this.#curWord}`);
        }
        else {
            this.#prevWord = this.#curWord;
        }
        this.#curWord = "";
    }

    //************************************************
    // Checks to see if a character is a delimiter.
    //************************************************
    static #isDelimit(C) {
        // return this.#delimits.indexOf(C) !== -1;
        for (const d of this.#delimits)
            if (C === d)
                return true;
        return false;
    }
}

//************************************************
// main parses the arguments, decides if stdin
// or a file name, and calls Stut().
//************************************************
async function main() {
    let inFile;
    if (argv.length <= 2) {
        // no file, use stdin
        inFile = stdin;
    }
    else {
        const fileName = argv[2];
        if (fileName === "") {
            // no file name, use stdin
            inFile = stdin;
        }
        else {
            // file name, open the file.
            const myFile = fs.createReadStream(fileName);
            inFile = myFile;
        }
    }
    await Stutter.stut(inFile);
}

/* * *
 * usage:
 *      node Stutter.js [input-file]
 */

if (require.main === module) {
    main();
}

module.exports = {Stutter, main};