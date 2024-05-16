const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const whitelist = ["52.31.139.75", "52.49.173.169", "52.214.14.220"]; //paystack IP address

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
      status: false,
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({
        message: "Your session has expired, please login again!",
        status: false,
      });
    }
    req.userId = decoded.id;
    req.user = decoded
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};

checkIp = (req, res, next) => {
  const clientIp = req.ip;
  if (whitelist.includes(clientIp)) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const authJWT = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isPaystack: checkIp,
};
module.exports = authJWT;
