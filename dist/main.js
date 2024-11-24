"use strict";

var _web = require("./application/web.js");
var _logging = require("./application/logging.js");
_web.web.listen(3001, function () {
  _logging.logger.info("Server running on port 3002");
});