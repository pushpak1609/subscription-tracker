import nodemailer from 'nodemailer'
import { EMAIL_PASSWORD } from './env.js'

export const accountMail = 'hingepushpak4@gmail.com'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465
    auth: {
        user: accountMail,
        pass: EMAIL_PASSWORD
    },
    family: 4 // <-- forces IPv4, avoids ENETUNREACH on Render
})

export default transporter;
