import { generateEmailTemplate } from './email-template.js';

export const emailTemplates = [
    {
        label: "7 days before reminder",
        generateSubject: (data) =>
            `${data.subscriptionName} Renews in 7 Days`,
        generateBody: (data) => generateEmailTemplate({
            userName: data.userName,
            subscriptionName: data.subscriptionName,
            renewalDate: data.renewalDate,
            planName: data.planName,
            price: data.price,
            paymentMethod: data.paymentMethod,
            accountSettingsLink: data.accountSettingsLink,
            supportLink: data.supportLink,
            daysLeft: 7,
        }),
    },
    {
        label: "5 days before reminder",
        generateSubject: (data) =>
            `${data.subscriptionName} Renews in 5 Days`,
        generateBody: (data) => generateEmailTemplate({
            userName: data.userName,
            subscriptionName: data.subscriptionName,
            renewalDate: data.renewalDate,
            planName: data.planName,
            price: data.price,
            paymentMethod: data.paymentMethod,
            accountSettingsLink: data.accountSettingsLink,
            supportLink: data.supportLink,
            daysLeft: 5,
        }),
    },
    {
        label: "2 days before reminder",
        generateSubject: (data) =>
            `2 Days Left: ${data.subscriptionName} Subscription Renewal`,
        generateBody: (data) => generateEmailTemplate({
            userName: data.userName,
            subscriptionName: data.subscriptionName,
            renewalDate: data.renewalDate,
            planName: data.planName,
            price: data.price,
            paymentMethod: data.paymentMethod,
            accountSettingsLink: data.accountSettingsLink,
            supportLink: data.supportLink,
            daysLeft: 2,
        }),
    },
    {
        label: "1 day before reminder",
        generateSubject: (data) =>
            `Final Reminder: ${data.subscriptionName} Renews Tomorrow`,
        generateBody: (data) => generateEmailTemplate({
            userName: data.userName,
            subscriptionName: data.subscriptionName,
            renewalDate: data.renewalDate,
            planName: data.planName,
            price: data.price,
            paymentMethod: data.paymentMethod,
            accountSettingsLink: data.accountSettingsLink,
            supportLink: data.supportLink,
            daysLeft: 1,
        }),
    },
    {
        label: "Final day reminder",
        generateSubject: (data) =>
            `${data.subscriptionName} Renews Today`,
        generateBody: (data) => generateEmailTemplate({
            userName: data.userName,
            subscriptionName: data.subscriptionName,
            renewalDate: data.renewalDate,
            planName: data.planName,
            price: data.price,
            paymentMethod: data.paymentMethod,
            accountSettingsLink: data.accountSettingsLink,
            supportLink: data.supportLink,
            daysLeft: 0,
        }),
    },
];