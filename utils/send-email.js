import dayjs from "dayjs";
import { emailTemplates } from "./email-template.data.js";
import transporter, { accountMail } from "../config/nodemailer.js";
import { SERVER_URL } from "../config/env.js";

export const sendRemainderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    const template = emailTemplates.find((t) => t.label === type);

    if (!template) throw new Error('invalid email type');

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.frequency,
        price: `${subscription.currency} ${subscription.price} / ${subscription.frequency}`,
        paymentMethod: subscription.paymentMethod,
        accountSettingsLink: `${SERVER_URL}/account`,
        supportLink: `${SERVER_URL}/support`,
    };

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountMail,
        to: to,
        subject: subject,
        html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error, 'Error sending mail');
        }

        console.log('Email sent : ' + info.response);
    });
};