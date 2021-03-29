const querystring = require("querystring");
//@ts-ignore
module.exports = function(req, res, next) {
  let body = "";
  //@ts-ignore
  req.on("data", data => {
    body += data;
  });

  req.on("end", () => {
    req.body = querystring.parse(body) || {};
    next();
  });
};
