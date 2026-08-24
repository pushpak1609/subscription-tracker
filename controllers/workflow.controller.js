import dayjs from "dayjs";
import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
import { sendRemainderEmail } from "../utils/send-email.js";

const REMINDERS = [7, 5, 2, 1];
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status != 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal Date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        // Must match the labels in email-template.data.js EXACTLY.
        const label = daysBefore === 1
            ? '1 day before reminder'
            : `${daysBefore} days before reminder`;

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, label, reminderDate);
        }

        await triggerReminder(context, label, subscription);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    const result = await context.run('get subscription', async () => {
        const subscription = await Subscription.findById(subscriptionId)
            .populate('user', 'name email')
            .lean();

        return subscription;
    });

    return result;
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`triggering ${label} reminder`);
        await sendRemainderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}