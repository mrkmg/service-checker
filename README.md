# ServiceChecker 

[![ServiceChecker on Travis CI](https://img.shields.io/travis/mrkmg/service-checker.svg?style=flat-square)](https://travis-ci.org/mrkmg/service-checker/branches)
[![Coverage Status](https://img.shields.io/coveralls/mrkmg/service-checker/master.svg?style=flat-square)](https://coveralls.io/github/mrkmg/service-checker?branch=master)
[![ServiceChecker on DavidDM](https://img.shields.io/david/mrkmg/service-checker.svg?style=flat-square)](https://david-dm.org/mrkmg/service-checker#badge-embed)
[![ServiceChecker on NPM](https://img.shields.io/npm/v/service-checker.svg?style=flat-square)](https://www.npmjs.com/package/service-checker)
[![ServiceChecker uses the MIT](https://img.shields.io/npm/l/service-checker.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Current Version: **0.9.3**

A node library to check if various services are up and behaving.

- [Install](#install)
- [Quick Example](#quick-example)
- [Usage](#usage)
- [Included Plugins](#included-plugins)
- [CLI Utility](#cli-utility)
- [Including a Plugin](#including-a-plugin)
- [Writing a Plugin](#writing-a-plugin)
- [Contributing](#contributing)
- [License](#license)

Install
-------

    npm install --save service-checker

Quick Example
-----------------------

    var ServiceChecker = require("service-checker")();
    
    /* Promise Style */
    ServiceChecker
        .https({host: 'github.com'})
        .then(function (result) {
            if (result.success) {
                console.log('GitHub.com is up');
            }
            else {
                console.log('GitHub.com is down');
            }                
        })
        .catch(function () {
            console.log('Other Error, check not attempted');
        });
        
    /* Callback Style */
    ServiceChecker.https({host: 'github.com'}, function (err, result) {
        if (err) {
            console.log('Other Error, check not attempted');
            return;
        }
        
        if (result.success) {
            console.log('GitHub.com is up');
        }
        else {
            console.log('GitHub.com is down');
        } 
    });

Usage
-----

service-checker methods take an options argument and optionally a nodeback style callback. The current options are:

- **timeout** *Sets the default timeout in ms for all checks. Default: 5000*
- **retries** *Sets the default number of retries for all checks. Default: 0*
- **ca** *Sets the ca for all future checks, useful for https and smtpTls plugins. Default: null*

*Note, the timeout is for each individual check. If you set retries to 1 and timeout to 1000ms and the check fails both 
    attempts, then the total amount of time for the entire call will be 2000ms*

Call one of the plugins *(below)* as a method of service checker. All plugins will return an CheckResult object which
contains the following properties:

- **type [string]** *Name of the check performed*
- **success [bool]** *Whether or not the check was successful*
- **time [int]** *How long in milliseconds the check took*
- **start_time [int]** *Millisecond timestamp (Date.now()) when the check started*
- **end_time [int]** *Millisecond timestamp (Date.now()) when the check finished*
- **error [object|undefined]** *If the test was not successful, the error object from the check*


Included Plugins
----------------

- [Ping](#ping)
- [HTTP](#http)
- [HTTPS](#https)
- [SMTP](#smtp)
- [SMTP-TLS](#smtp-tls)
- [Ping](#ping)
- [DNS](#dns)

#### Ping 
_Check a given host for an ICMP response. Uses the system ping utility. If your system does not have a ping utility in path, this plugin will fail_

`.ping(options)`

Where options are:

- host (string) The hostname to ping. Can be either a domain or IP address.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

#### HTTP 
_Check a given host for a valid HTTP response_

`.http(options)`

Where options are:

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to. Must be a number. Defaults to 80.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

#### HTTPS 
_Check a given host for a valid HTTP response and for a valid SSL Certificate_

`.https(options)`

Where options are:

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to. Must be a number. Defaults to 443.
- ca (string) A certificate to pass to https.request. Adds the cert to be "trusted" so it will not fail.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

#### SMTP 
_Check a given host for a valid SMTP response. Does not use TLS_

`.smtp(options)`

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to. Must be a number. Defaults to 25.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

#### SMTP-TLS 
_Check a given host for a valid SMTP response and that STARTSSL is enabled with a valid TLS Certificate_

`.smtpTls(options)`

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to. Must be a number. Defaults to 25.
- ca (string) A certificate to pass to https.request. Adds the cert to be "trusted" so it will not fail.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

#### Raw-TCP 
_Check that a TCP connection can be made to a given host on a given port_

`.rawTcp(options)`

- host (string) The hostname to connect to. Can be either a domain or IP address.
- port (number) The port to connect to.
- timeout (number) How long to wait until the check is considered timed out.

--------------------------------------------------------------------------------

#### DNS 
_Check that a dns server is resolving_

`.dns(options)`

- host (string) The IP address of the local sever. Defaults to '127.0.0.1'.
- port (number) The port to make the dns request to. Default to 53.
- name (string) The hostname to lookup. Defaults to 'google.com'.
- type (string) The record type to lookup. Defaults to 'A'.
- timeout (number) How long to wait until the request is considered timed out.

CLI Utility
-------------

service-checker also comes with a simple CLI utility called scheck. If service-checker is
installed globally, you should have the `scheck` utility installed and ready to use.

To use the `scheck` CLI utility, make sure to install service-checker globally.

    sudo npm install -g service-checker
     
Then call the `scheck` utility.

    #See how to use scheck
    scheck -h

    #Check 8.8.8.8 via ping
    scheck 8.8.8.8 
    
    #Check google.com via https with a 500ms timeout
    scheck https google.com --timeout 500
    
    #Check if gmails mail server is up and properly configured for TLS
    scheck smtpTls gmail-smtp-in.l.google.com
    
The program can be used in a script multiple ways.

**Exit Codes**

The program will exit with the following codes.

Exit Code | Meaning 
--------- | ------- 
0         | All parameters are sane and the check was successful. 
1         | There was an error with the parameters. Check your input. 
2         | All parameters are sane, but the check failed. 
255       | An unknown error occurred. Please report this as a bug. 

**Simple Mode**

The program can also be invoked with the `-s` parameter to enable "simple" mode. In simple mode, the output will always
be in the following format.

    (Up/Down)<tab>(Time)
    
For example, with cut you could run the following command to get how long it takes for a host to respond to a ping.

    scheck 127.0.0.1 -s | cut -f2 -d$'\t'


Including a Plugin
------------------

Including plugins is very easy. Let's say you installed a plugin from npm named `exchange-checker`. All you
would have to do is call the `use` function of service-checker

    var ServiceChecker = require("service-checker")();
    ServiceChecker.use(require("exchange-checker"));
    
Check the plugins documentation to see which methods are added by the plugin. If the plugins adds the method `exchange`, 
then all you would have to do is:

    ServiceChecker.exchange(args..)
        .then(resultHandler)
        .catch(errorHandler)

Writing a Plugin
----------------

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
    var ServiceChecker = require("service-checker")();
    var fileCheck = require("./file-check");
    
    ServiceChecker.use(fileCheck);
    
    ServiceChecker.fileCheck({path: "path/to/file"})
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
