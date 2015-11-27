<p align="center">
    <a href="https://travis-ci.org/mrkmg/service-checker" title="service-checker on Travis CI">
        <img src="https://travis-ci.org/mrkmg/service-checker.svg?branch=master" />
    </a>  
    <a href='https://coveralls.io/github/mrkmg/service-checker?branch=master'>
        <img src='https://coveralls.io/repos/mrkmg/service-checker/badge.svg?branch=master&service=github' alt='Coverage Status' />
    </a>
</p>

Service Checker 
===============

Current Version: **0.4.0**

A node library to check if various web services are up and behaving. This project is in beta. Until version 1, the api 
may break at ANY point. After version 1.0.0, standard [SemVer](http://semver.org/) will be followed.

Install
-------

    npm install --save service-checker

Quick Example
-------------

    var serviceChecker = require("service-checker")({
        timeout: 5000
    });
    
    //Check if server is responding to pings
    serviceChecker.ping("8.8.8.8")
        .then(function (result)
        {
            if (result.success)
                console.log("Did respond to ping");
                console.log("It took " + result.time + "ms");
            }
            else
            {
                console.log("Did not respond to ping");
                console.log(result.error);
            }
        })
        .catch(function (error)
        {
            console.log("Other Error");
            console.log(error);
        });

Usage
-----

service-checker takes an options argument. The current options are:

- timeout *How long in milliseconds before the check times out*

Call one of the plugins *see below* as a method of service checker. A promise will be returned which will resolve with
the following public properties:

- success [bool] *Whether or not the check was successful*
- time [int] *How long in milliseconds the check took*
- start_time [int] *Millisecond timestamp (Date.now()) when the check started*
- end_time [int] *Millisecond timestamp (Date.now()) when the check finished*
- error [object|undefined] *If the test was not successful, the error object from the check*


Built in plugins
----------------

- ping(host) - Uses the system ping utility to check for an ICMP response
- http(host[, port=80]) - Ensures the host replies with a valid HTTP code
- https(host[, port=443]) - Ensures the host replies with a valid HTTP code and has a valid SSL Cert
- smtp(host[, port=25]) - Ensures the host replies with 220
- rawTcp(host, port) - Ensures the host can be connected to. No further checking is performed.

Including a third party plugin
------------------------------

Including plugins is very easy. Let's say you installed a plugin from npm named `exchange-checker`. All you
would have to do is call the `use` function of service-checker

    var serviceChecker = require("service-checker");
    serviceChecker.use(require("exchange-checker"));
    
Check the plugins documentation to see how to call use the plugin. If the plugins adds the method `exchange`, then
all you would have to do is:

    serviceChecker().exchange(args..)
        .then(resultHandler)
        .catch(errorHandler)
        
        
*If you know a reliable way to check if an exchange server is up and running, please get in contact with me!*

Writing your own plugins
------------------------

Building a plugin in very easy. So easy, an example should be all that's needed:

    //file-check.js
    var Promise = require("bluebird");
    var fs = require("fs");
    var _ = require("underscore");
    
    module.exports = function fileCheck(file_path, options)
    {
        if (!_.isString(file_path)) throw new Error("file_path must be a string");
    
        return new Promise(function (resolve, reject)
        {
            var did_timeout = false;
            var timeout_id = setTimeout(function ()
            {
                did_timeout = true;
                var error = new Error("Operation Timed Out");
                error.code = "TIMEOUT";
                resolve(error);
            }, options.timeout);
        
            fs.access(file_path, fs.F_OK, function (error)
            {
                if (!did_timeout)
                {
                    resolve(error);     
                    clearTimeout(timeout_id);
                }
            });
        });
    }

Rules for building a plugin that works correctly with service checker:

- The plugin **must** be named. This name will be the method name used by service-checker.
- The plugin **must** resolve if all passed parameters are valid.
- The plugin **must** throw/reject if any passed parameters are invalid.
- The plugin **must** return a promise. service-checker uses.
- The plugin **must** resolve with a falsy object (null, undefined) if the check succeeds.
- The plugin **must** resolve with an error object if the check fails.
    [BlueBird](http://bluebirdjs.com/docs/getting-started.html) but any Promises/A+ implementation should work.
- The plugin **should** interpret and adhere to any applicable options. Current options are:
    - timeout
    
You should notice that the plugin above demonstrates all of these rules.

License
-------

Copyright (c) 2015 Kevin Gravier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
