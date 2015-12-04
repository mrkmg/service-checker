"use strict";

/**
 * server-checker : test/fixtures/dns/valid
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

var dns = require('native-dns');

module.exports = function ()
{
  var server = dns.createServer();

  server.on('request', function (request, response)
  {
    response.answer.push(dns.A({
      name: request.question[0].name,
      address: '127.0.0.1',
      ttl: 600
    }));

    response.send();
  });

  return {
    start: function (port, callback)
    {
      server.on('listening', callback);
      server.serve(port);
    },
    stop: function (callback)
    {
      server.on('close', callback);
      server.close();
    }
  };
};
