// services/urlService.js
const https = require('https');
const http = require('http');

exports.checkUrlStatus = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', (err) => {
      console.log(err);
      resolve('ERROR');
    });
  });
};
