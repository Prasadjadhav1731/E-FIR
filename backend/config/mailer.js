const nodemailer = require("nodemailer");
require("dotenv").config();

exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || "sstar0wifi@gmail.com",
    pass: process.env.MAIL_PASS || "wwrkqwnkuknrjpaf",
  },
}); 