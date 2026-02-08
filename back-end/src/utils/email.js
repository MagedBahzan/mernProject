import nodemailer from "nodemailer";

//create transporter
// Looking to send emails in production? Check out our Email API/SMTP product!
const sendEmail = async (options) => {
    //1) create a transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    //2) define the email options

    const mailOptions = {
        from: "admin <admin@mail.io>",
        // to : options.email,   // user's email
        to: process.env.EMAIL_USERNAME, //change it to user's email ==> only for test
        subject: options.subject,
        text: options.message,
    };

    //3) send the email
    await transport.sendMail(mailOptions);
};

export default sendEmail;
