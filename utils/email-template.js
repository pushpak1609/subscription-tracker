export const generateEmailTemplate = ({
    userName,
    subscriptionName,
    renewalDate,
    planName,
    price,
    paymentMethod,
    accountSettingsLink,
    supportLink,
    daysLeft,
}) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f0f0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f0f3; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="background-color:#ffffff; border-radius:20px; overflow:hidden; box-shadow: 0 4px 24px rgba(99,58,255,0.08);">

                            <!-- Gradient header -->
                            <tr></tr>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background-color:#6d28d9; background-image: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%); padding: 36px 32px 30px;">

                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <span style="font-size:20px; font-weight:800; color:#ffffff; letter-spacing:-0.3px;">SubDub</span>
                                                </td>
                                                <td align="right">
                                                    <table cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="background-color:rgba(255,255,255,0.22); border-radius:20px; padding: 6px 14px;">
                                                                <span style="font-size:12px; font-weight:700; color:#ffffff; letter-spacing:0.3px;">
                                                                    ${daysLeft} DAY${daysLeft === 1 ? '' : 'S'} LEFT
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="margin: 24px 0 0; font-size:25px; font-weight:800; color:#ffffff; line-height:1.3; letter-spacing:-0.4px;">
                                            ${subscriptionName}
                                        </p>
                                        <p style="margin: 6px 0 0; font-size:14px; color:rgba(255,255,255,0.85);">
                                            renews on ${renewalDate}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Body -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 28px 32px 4px;">
                                        <p style="margin:0; font-size:15px; color:#3f3f46; line-height:1.6;">
                                            Hi ${userName}, this is a quick reminder that your subscription is about to renew. Here's a summary:
                                        </p>
                                    </td>
                                </tr>

                                <!-- Details -->
                                <tr>
                                    <td style="padding: 20px 32px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf9fc; border-radius:14px;">
                                            <tr>
                                                <td style="padding: 16px 20px; border-bottom:1px solid #ece9f3;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="font-size:13px; color:#8b8698;">Plan</td>
                                                            <td align="right" style="font-size:14px; font-weight:700; color:#18181b;">${planName}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 20px; border-bottom:1px solid #ece9f3;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="font-size:13px; color:#8b8698;">Amount</td>
                                                            <td align="right" style="font-size:14px; font-weight:700; color:#18181b;">${price}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 20px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="font-size:13px; color:#8b8698;">Payment method</td>
                                                            <td align="right" style="font-size:14px; font-weight:700; color:#18181b;">${paymentMethod}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- CTA -->
                                <tr>
                                    <td style="padding: 8px 32px 32px;" align="center">
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="background-color:#7c3aed; background-image: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%); border-radius:12px;" align="center">
                                                    <a href="${accountSettingsLink}" style="display:block; padding: 15px 24px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; letter-spacing:0.2px;">
                                                        Manage Subscription
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td style="padding: 0 32px;">
                                        <div style="border-top:1px solid #f0eef5;"></div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 22px 32px 28px;" align="center">
                                        <p style="margin:0; font-size:12px; color:#a3a0ad; line-height:1.7;">
                                            Need help? <a href="${supportLink}" style="color:#7c3aed; font-weight:700; text-decoration:none;">Contact support</a><br/>
                                            You're receiving this because you have an active subscription tracked with SubDub.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                </table>

                <p style="margin: 20px 0 0; font-size:12px; color:#b0aebb;">
                    © ${new Date().getFullYear()} SubDub. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`;