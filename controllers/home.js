/**
 * GET /
 * Home page.
 */
var http = require("http");
exports.index = function(req, res) {

  res.render('index');
};