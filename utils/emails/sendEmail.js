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


const sendNewsletterEmail = async (maillist, subject, content, blogposts, date, events, coverImage) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SES_HOST,
      port: 465,
      auth: {
        user: process.env.SES_USERNAME,
        pass: process.env.SES_PASSWORD,
      },
    });

    const source = fs.readFileSync(path.join(__dirname,  "./templates/newsletter.handlebars"), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const payload = { content, blogposts, date , events, coverImage };
    const options = () => {
      return { 
        from: {
          name: 'Imperial Homes Mortgage Bank',
          address:  process.env.SES_FROM,
      },
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
  sendNewsletterEmail
};
