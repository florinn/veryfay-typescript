/// <reference path='../typings/globals/node/index.d.ts' /> 

if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
        exports = module.exports = veryfay;
    }
    exports.veryfay = veryfay;
} else {
    this.veryfay = veryfay;
}