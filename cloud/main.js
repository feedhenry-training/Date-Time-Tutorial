var util = require('util');
var request = require('request');
var jsdom = require("jsdom");

/*
  Our getCurrentTime function now simply checks to see if the cache
  contains a date & time - if so, it returns the value from cache
  if not, it calls out to the web to retrieve & saves in cache
 */
exports.getCurrentTime = function(params, cb) {
  $fh.cache({
    act: "load",
    key: 'datetime'
  }, function(err, res) {
    if (err || !res) {
      return getDateTimeFromWeb(params, cb);
    }

    return cb(null, res);

  });
};

/*
 Our new function that calls out to the web to get the date & time. Only happens if
 cache isn't 'hot'
 */
function getDateTimeFromWeb(params, cb){
  request({uri : 'http://www.timeanddate.com/worldclock/city.html?n=78'}, function(err, res, body){
    // Run some jQuery on a html fragment
    jsdom.env(
    body,
    ["http://code.jquery.com/jquery.js"],
    function(errors, window) {
      var ct = window.$('#ct').text();
      console.log("contents of the current time div:", ct);

      $fh.cache({
        act: "save",
        key: 'datetime',
        value: ct,
        expire: 10 // expires in 10 seconds
      }, function(err, res) {
        // Success or failure not so important here - do nothing.
      });

      return cb(errors, { response : ct });
    }
    );
  });
}