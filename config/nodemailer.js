// import nodemailer from 'nodemailer'
// import { EMAIL_PASSWORD } from './env.js'

// export const accountMail = 'hingepushpak4@gmail.com'

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // true for port 465
//     auth: {
//         user: accountMail,
//         pass: EMAIL_PASSWORD
//     },
//     family: 4 // <-- forces IPv4, avoids ENETUNREACH on Render
// })

// export default transporter;


import { BREVO_API_KEY } from './env.js'  // remove EMAIL_PASSWORD if unused elsewhere

export const accountMail = 'hingepushpak4@gmail.com'

export const sendMail = async ({ to, subject, html }) => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: { email: accountMail, name: 'SubDub' },
            to: [{ email: to }],
            subject,
            htmlContent: html
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Brevo send failed: ${response.status} ${errorBody}`);
    }

    return response.json();
};
