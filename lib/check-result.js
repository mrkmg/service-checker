"use strict";

/**
 * server-checker : lib/check-result
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var _ = require("underscore");

module.exports = checkResult;

function checkResult(type)
{
    this.type = type;
    this.start_time = Date.now();
    this._hr_start_time = process.hrtime();

    this.time = -1;
    this.end_time = null;
    this.success = false;
}

checkResult.prototype.finished = function (err)
{
    this._hr_end_time = process.hrtime(this._hr_start_time);
    this.time = Math.round((this._hr_end_time[0] * 1000) + (this._hr_end_time[1] / 1000000));
    this.end_time = Date.now();

    if (err)
        this.error = err;
    else
        this.success = true;
};