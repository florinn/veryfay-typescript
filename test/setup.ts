/// <reference path='../.tmp/src/output.d.ts' />

/// <reference path='../typings/globals/node/index.d.ts' /> 
/// <reference path='../typings/globals/mocha/index.d.ts' /> 
/// <reference path='../typings/globals/chai/index.d.ts' /> 


function isNodeJS(): boolean {
    let found = false;
    if (typeof module !== 'undefined' && module.exports)
        found = true;
    return found;
}

if (isNodeJS()) {
    chai = require('chai');
    veryfay = require('../../dist/veryfay.js');
}

let assert = chai.assert;
let expect = chai.expect;