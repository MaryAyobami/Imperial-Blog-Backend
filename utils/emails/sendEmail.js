const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const appName = process.env.APPNAME;
var date = new Date().toLocaleString();
var inlineBase64 = require('nodemailer-plugin-inline-base64');
const Handlebars = require('handlebars');
const { SafeString } = Handlebars;

const sendEmail = async (email, subject, name, data, password, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SES_HOST,
      port: 465,
      secureConnection: true,
      auth: {
        user: process.env.SES_USERNAME,
        pass: process.env.SES_PASSWORD,
      },
      tls: {
        ciphers:'SSLv3'
    },
     debug: true
    });
  
    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const payload = { name, data, appName, password };
    const options = () => {
      return {
        from: process.env.SES_FROM,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log("email error",error)
        return error;
      } else {
        console.log("email success", info)
        return res.status(200).json({
          success: true,
          message: "Email sent successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).send({ message: error, status: false });
  }
};


const sendReminderEmail = async (data) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SES_HOST,
      port: 587,
      auth: {
        user: process.env.SES_USERNAME,
        pass: process.env.SES_PASSWORD,
      },
    });

    const source = fs.readFileSync(path.join(__dirname,  "./templates/reminder.handlebars"), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const { email, otp } = data
    const payload = { email, otp };
    const options = () => {
      return { 
        from: process.env.SES_FROM,
        to: email,
        subject: "Reminder: Tomorrow is Your Savings Due Date",
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error.message)
        return error;
      } else {
        console.log("success")
        return {
          success: true,
          message: "Email sent successfully",
        }
      }
    });
  } catch (error) {
    console.log(error.message)
    return { message: error, status: false }
  }
};


const sendLoginMail = (email, name) => {
  sendEmail(
    email,
    "Login Notification",
    name,
    date,
    "",
    "./templates/login.handlebars"
  );
};

const sendSignupMail = (email, name, code) => {
  
  sendEmail(
    email,
    "Welcome to Property Saving Scheme!",
    name,
    date,
    code,
    "./templates/welcome.handlebars"
  );
};
const sendResetMail = (email, name, password) => {
  sendEmail(
    email,
    "Password Reset Notification",
    name,
    date,
    password,
    "./templates/passwordreset.handlebars"
  );
};

const sendEmailOTP = (email, name, otp) => {
  sendEmail(
    email,
    "Action Required!, Verify your Email",
    name,
    date,
    otp,
    "./templates/emailotp.handlebars"
  );
};

const sendOfferLetter = (email, name, otp) => {
  sendEmail(
    email,
    "Action Required!, Verify your Email",
    name,
    date,
    otp,
    "./templates/emailotp.handlebars",
 
  );
};




const sendNewsletterEmail = async (maillist, subject, content, blogposts, date, events) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SES_HOST,
      port: 587,
      auth: {
        user: process.env.SES_USERNAME,
        pass: process.env.SES_PASSWORD,
      },
    });

    const source = fs.readFileSync(path.join(__dirname,  "./templates/newsletter.handlebars"), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const payload = { content, blogposts, date , events };
    const options = () => {
      return { 
        from: process.env.SES_FROM,
        subject: subject,
        html: compiledTemplate(payload),
        bcc: maillist,
      };
    };

    transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));
    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error.message)
        return error;
      } else {
        console.log("success")
        return {
          success: true,
          message: "Emails sent successfully",
        }
      }
    });
  } catch (error) {
    console.log(error.message)
    return { message: error, status: false }
  }
};



module.exports = {
  sendLoginMail,
  sendSignupMail,
  sendEmail,
  sendResetMail,
  sendReminderEmail,
  sendEmailOTP,
  sendNewsletterEmail
};
