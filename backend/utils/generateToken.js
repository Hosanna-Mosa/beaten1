const jwt = require("jsonwebtoken");

const generateToken = (id, type = "user") => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = generateToken;
