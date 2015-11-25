<p align="center">
    <a href="https://travis-ci.org/mrkmg/service-checker" title="service-checker on Travis CI">
        <img src="https://travis-ci.org/mrkmg/service-checker.svg?branch=master" />
    </a>
</p>

Service Checker 
===============

Current Version: **0.0.7**

A node library to check if various web services are up and behaving. This project is in alpha.

Install
-------

    npm install --save service-checker

Quick Example
-------------

    var serviceChecker = require("service-checker")({
        timeout: 5000
    });
    
    //Check if server is responing to pings
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

service-checker takes an options argument. The options are:

- timeout *How long in milliseconds before the check times out*

Methods
-------

- ping(host)
- http(host[, port=80])
- https(host[, port=443])

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
