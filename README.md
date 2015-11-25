<p align="center">
    <a href="https://travis-ci.org/mrkmg/service-checker" title="service-checker on Travis CI">
        <img src="https://travis-ci.org/mrkmg/service-checker.svg?branch=master" />
    </a>
</p>

Service Checker 
===============

Current Version: **0.1.2**

A node library to check if various web services are up and behaving. This project is in alpha.

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
        .then(function ()
        {
            console.log("Did respond to ping");
        })
        .catch(function (err)
        {
            console.log("Did not respond to ping");
            console.log(err);
        });

Usage
-----

service-checker takes an options argument. The current options are:

- timeout *How long in milliseconds before the check times out*

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
        .then(successHandler)
        .catch(failureHandler)
        
        
*If you know a reliable way to check if an exchange server is up and running, please get in contact with me!*

Writing your own plugins
------------------------

*see the current included plugins for now*

Important Notes:

- The function passed to "use" **must** be named. This name will be the method name used by service-checker
- The function passed to "use" **must** return a promise. service-checker uses 
    [BlueBird](http://bluebirdjs.com/docs/getting-started.html) but any Promises/A+ implementation should work.
- The function passed to "use" **should** interpret and adhere to any applicable options. Current options are:
    - timeout

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
