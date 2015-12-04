# Service Checker 

<p align="center">
    <a href="https://travis-ci.org/mrkmg/service-checker/branches" title="service-checker on Travis CI">
        <img src="https://travis-ci.org/mrkmg/service-checker.svg?branch=master" alt="Build Status" />
    </a>  
    <a href="https://coveralls.io/github/mrkmg/service-checker?branch=master">
        <img src="https://coveralls.io/repos/mrkmg/service-checker/badge.svg?branch=master&service=github" alt="Coverage Status" />
    </a>
    <a href="https://david-dm.org/mrkmg/service-checker#badge-embed">
        <img src="https://david-dm.org/mrkmg/service-checker.svg" alt="Dependencies Status" />
    </a>
    <br />
    <a href="https://nodei.co/npm/service-checker/"><img src="https://nodei.co/npm/service-checker.png?compact=true"></a>
</p>

Current Version: **0.6.3**

A node library to check if various services are up and behaving. This project is in beta. Expect everything to change
frequently. Until version 1, the api may break at ANY point. After version 1.0.0, standard [SemVer](http://semver.org/) 
will be followed.

Install
-------

    npm install --save service-checker

Quick Example
-------------

    //Initialize serviceChecker with default timeout value
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

- timeout *Sets the default time out for all checks*

Call one of the plugins *(below)* as a method of service checker. A promise will be returned which will resolve with
the following public properties:

- type [string] *Name of the check performed*
- success [bool] *Whether or not the check was successful*
- time [int] *How long in milliseconds the check took*
- start_time [int] *Millisecond timestamp (Date.now()) when the check started*
- end_time [int] *Millisecond timestamp (Date.now()) when the check finished*
- error [object|undefined] *If the test was not successful, the error object from the check*


Built in plugins
----------------

**Ping** _Check a given host for an ICMP response. Uses the system ping utility. If your system does not have a ping utility in path, this plugin will fail_

`.ping(options)`

Where options are:

- host (string) The hostname to ping. Can be either a domain or IP address.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

**HTTP** _Check a given host for a valid HTTP response_

`.http(options)`

Where options are:

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to. Must be a number. Defaults to 80.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

**HTTPS** _Check a given host for a valid HTTP response and for a valid SSL Certificate_

`.https(options)`

Where options are:

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to. Must be a number. Defaults to 443.
- ca (string) A certificate to pass to https.request. Adds the cert to be "trusted" so it will not fail.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

**SMTP** _Check a given host for a valid SMTP response. Does not use TLS_

`.smtp(options)`

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to. Must be a number. Defaults to 25.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

**SMTP-TLS** _Check a given host for a valid SMTP response_

`.smtpTls(options)`

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to. Must be a number. Defaults to 25.
- ca (string) A certificate to pass to https.request. Adds the cert to be "trusted" so it will not fail.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

**Raw-TCP** _Check that a TCP connection can be made to a given host on a given port_

`.rawTcp(options)`

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

**DNS** _Check that a dns server is resolving_

`.dns(options)`

- host (string) The IP address of the local sever. Defaults to '127.0.0.1'.
- port (number) The port to make the dns request to. Default to 53.
- name (string) The hostname to lookup. Defaults to 'google.com'.
- type (string) The record type to lookup. Defaults to 'A'.
- timeout (number) How long to wait until the request is considered timed out.


Including a third party plugin
------------------------------

Including plugins is very easy. Let's say you installed a plugin from npm named `exchange-checker`. All you
would have to do is call the `use` function of service-checker

    var serviceChecker = require("service-checker")();
    serviceChecker.use(require("exchange-checker"));
    
Check the plugins documentation to see which methods are added by the plugin. If the plugins adds the method `exchange`, 
then all you would have to do is:

    serviceChecker.exchange(args..)
        .then(resultHandler)
        .catch(errorHandler)
        

Writing your own plugins
------------------------

Rules for building a plugin that works correctly with service checker:

- The plugin **must** be a an object following {method1: handler1, method2: handler2}.
- The handlers **must** take only one parameter. It will be passed an options object. All options passed by the user
    will be passed in the options parameter.
- The handlers **must** return a promise. service-checker uses [BlueBird](http://bluebirdjs.com/docs/getting-started.html)
    but any Promises/A+ implementation should work.
- The promise **must** reject if any passed parameters are invalid.
- The promise **must** resolve with a falsy object (null, undefined) if the check succeeds.
- The promise **must** resolve with an error object if the check fails.
- The handlers **should** interpret and adhere to any applicable default options. Current default options are:
    - timeout
    
The following example plugin demonstrates all these rules.

    //file-check.js
    var Promise = require("bluebird");
    var fs = require("fs");
    var _ = require("underscore");
    
    function doFileCheck(options)
    {
        return new Promise(function (resolve, reject)
        {
            var did_timeout = false;
            var timeout_id = setTimeout(function ()
            {
                did_timeout = true;
                var error = new Error("Operation Timed Out");
                error.code = "TIMEOUT";
                reject(error);
            }, options.timeout);
    
            fs.access(options.path, fs.F_OK, function (error)
            {
                if (!did_timeout)
                {
                    clearTimeout(timeout_id);
    
                    if (error) reject(error);
                    else resolve()
                }
            });
        });
    }
    
    function fileCheck(options)
    {
            return Promise
                .try(function ()
                {
                    if (!_.isString(options.path)) throw new Error("path must be a string");
        
                    return options;
                }).then(function (options){
                    return doFileCheck(options)
                        .catch(function (error)
                        {
                            return error;
                        });
                });
        };
    
    
    module.exports = { fileCheck: fileCheck };
    
    
To use the plugin you just wrote is simple as well:

    //checker.js
    var serviceChecker = require("service-checker")();
    var fileCheck = require("./file-check");
    
    serviceChecker.use(fileCheck);
    
    serviceChecker.fileCheck({path: "path/to/file"})
        .then(function (result)
        {
            if (result.success)
            {
                console.log("File exists");
            }
            else
            {
                console.log("File does not exist");
            }
        });

Contributing
------------

The project uses [CoffeeScript](http://coffeescript.org/). Please **DO NOT** edit the js files directly. All js files
should be compiled in the following way:

    npm run compile
    
If you would prefer that the coffeescript files be continually compiled as you save use:
 
    npm run compile-watch
    
A linter is included for the CoffeeScript. To lint any changes you have made run:

    npm run lint

Testing and code format is important to make sure the project stays consistent. Please test the code **before** making
a pull request with:

    npm test
    
If your update breaks a test, please update the test. If you add new functionality, please write a test. You can see
the current test coverage by running:

    npm cover-local

That being said, if you are unsure how to write tests or uncomfortable writing tests, I would be more than happy 
helping out. Make the pull request and put a comment on it that you need help with the tests.


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
