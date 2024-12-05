const dotenv = require("dotenv");
dotenv.config();

var middleware = {
  checkForPoolConnection: function (req, res, next) {
    next();
  },

  checkServerIpAddressInSession: (req, res, next) => {
    try {
      if (req?.session?.serverUrl) {
        next();
        return;
      }
      res.redirect("/");
      
    } catch (err) {
      console.log("Error while checking the server ip  address : ", err);
    }
  },
};

module.exports = middleware;
