const { GetIdentityMailFromDomainAttributesCommand } = require("@aws-sdk/client-ses");
const db = require("../models/index");
const { sendNewsletterEmail } = require("../utils/emails/sendEmail");

// Function to extract HTML content preserving the original structure
function extractHtmlContent(node) {
    if (node.nodeType === node.TEXT_NODE) {
        return node.textContent;
    } else if (node.nodeType === node.ELEMENT_NODE) {
        let content = `<${node.tagName.toLowerCase()}`;
        for (let attr of node.attributes) {
            content += ` ${attr.name}="${attr.value}"`;
        }
        content += '>';
        for (let childNode of node.childNodes) {
            content += extractHtmlContent(childNode);
        }
        content += `</${node.tagName.toLowerCase()}>`;
        return content;
    }
}


exports.SendNewsletter = async (req, res, next) => {
    try {
      console.log(req.body)
      const {subject, content, blogPosts} = req.body

      const today = new Date();
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-US', options);
      const recipients =  await db.NewsletterRecipients.findAll({
        attributes: ["email"]
      });
      const events = req.files.events? req.files.events[0].location :  req.body.events
      const emailAddresses = recipients.map(recipient => recipient.email);
      emailAddresses.map(email=>
        sendNewsletterEmail( email, subject, content, JSON.parse(blogPosts), formattedDate, events)
      )
     await db.Newsletter.create({
        subject: req.body.subject,
        content: req.body.content,
        blogposts: JSON.parse(req.body.blogPosts),
        events:  req.files.events? req.files.events[0].location :  req.body.events 
      });

      res.status(200).json({
        status: true,
        message: `newsletter sent sucessfully`,
        data: null,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: false,
        data: null,
        message: err.message,
      });
    }
  };

exports.SendSampleNewsletter = async (req, res, next) => {
    try {
      console.log(req.body)
      const {subject, content, blogPosts, emails, } = req.body
      console.log(req.files)
      const events = req.files.events? req.files.events[0].location :  req.body.events
      const today = new Date();
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-US', options);
      console.log(emails)
      emails.map(email=>
        sendNewsletterEmail( email, subject, content, JSON.parse(blogPosts), formattedDate, events)
      )
      await db.Newsletter.create({
        subject: req.body.subject,
        content: req.body.content,
        blogposts: JSON.parse(req.body.blogPosts),
        events: req.files.events? req.files.events[0].location :  req.body.events 
      });

      res.status(200).json({
        status: true,
        message: `newsletter sent successfully`,
        data: null,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: false,
        data: null,
        message: err.message,
      });
    }
  };

exports.getAllNewsletter = async (req, res, next) => {
    try {
     
      const AllNewsletter = await db.Newsletter.findAll();
   
      res.status(200).json({
        success: true,
        message: "Newsletters fetched successfully",
        AllNewsletter,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error : err, 
        message: "An error occured",
      });
    }
  };
  exports.removeNewsletter = async (req, res, next) => {
    try {
      const id = req.params.id;

      await db.Newsletter.destroy( {
        where: {
          id: id
        },
      });
      res.status(200).json({
        status: true,
        message: `Newsletter has been removed`,
        data: null,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  };

// subrscribe to newsletter
exports.addRecipient = async (req, res, next) => {
  try {
    const emailString = req.body.email;

    if (!emailString || typeof emailString !== "string" || emailString.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Emails must be provided as a non-empty string",
        data: null,
      });
    }

    const emails = emailString.split(",").map((email) => email.trim());

    let createdRecipients = [];
    let existingRecipients = [];

    for (const email of emails) {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
          data: null,
        });
      }

      const existingRecipient = await db.NewsletterRecipients.findOne({
        where: {
          email: email,
        },
      });

      if (existingRecipient) {
        existingRecipients.push(existingRecipient.email);
      } else {
        await db.NewsletterRecipients.create({
          email,
        });
        createdRecipients.push(email);
      }
    }

    if (createdRecipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Recipient email already exist",
        data: null,
      });
    }

    let message = "";
    if (createdRecipients.length > 0) {
      message += `Recipients added successfully: ${createdRecipients.join(", ")}. `;
    }
    if (existingRecipients.length > 0) {
      message += `Recipients already exist: ${existingRecipients.join(", ")}.`;
    }

    res.status(200).json({
      success: true,
      message: message,
      data: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      data: null,
    });
  }
};


exports.removeRecipient = async (req, res, next) => {
    try {
      const email = req.params.email;

      await db.NewsletterRecipients.destroy( {
        where: {
          email: email
        },
      });
      res.status(200).json({
        status: true,
        message: `Recipient has been removed`,
        data: null,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  };

exports.getAllRecipients = async (req, res, next) => {
    try {
      const recipients =  await db.NewsletterRecipients.findAll();
      res.status(200).json({
        status: true,
        message: `Recipients found successfully`,
        recipients
        
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  };