const passwordValidator = require("password-validator");
const bcrypt = require("bcryptjs");
// const mongoose = require("mongoose");

function validatePassword(password) {
  const schema = new passwordValidator();
  schema
    .is()
    .min(6) // Minimum length 6
    .is()
    .max(32) // Maximum length 32
    .has()
    .letters() // Must have letters
    .has()
    .digits() // Must have digits
    .has()
    .symbols(); // Must have symbols

  return schema.validate(password);
}

async function comparePassword(password, expected) {
  return bcrypt.compare(password, expected);
}

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

const looseUuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
const obnjectIdRegex = /^[a-f0-9]{24}$/;
const cryptoHexRegex = /^[A-Fa-f0-9]{16,128}$/;
const positiveIntegerRegex = /^\d+$/;

module.exports = {
  validatePassword,
  comparePassword,
  hashPassword,
  looseUuidRegex,
  obnjectIdRegex,
  positiveIntegerRegex,
  cryptoHexRegex,
};
