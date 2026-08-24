import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

// GET /subscriptions
// Normal user: only their own subscriptions.
// Admin: everyone's.
export const getSubscriptions = async (req, res, next) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

        const subscriptions = await Subscription.find(filter);

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        })
    } catch (error) {
        next(error);
    }
}

// GET /subscriptions/:id
// Normal user: only if it belongs to them. Admin: any subscription.
export const getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (req.user.role !== 'admin' && subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to view this subscription');
            error.statusCode = 403;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error);
    }
}

// POST /subscriptions
// Creates a subscription owned by the logged-in user.
// The "user" field is always taken from the token, never trusted from req.body.
export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id.toString()
            },
            headers: {
                'content-type': 'application/json'
            },
            retries: 0
        });

        res.status(201).json({
            success: true,
            data: { subscription, workflowRunId }
        })
    } catch (error) {
        next(error);
    }
}

// PUT /subscriptions/:id
// Normal user: only if it belongs to them. Admin: any subscription.
export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (req.user.role !== 'admin' && subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to update this subscription');
            error.statusCode = 403;
            throw error;
        }

        // Never allow the owner to be changed through this route.
        const updates = { ...req.body };
        delete updates.user;

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedSubscription
        })
    } catch (error) {
        next(error);
    }
}

// DELETE /subscriptions/:id
// Normal user: only if it belongs to them. Admin: any subscription.
export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (req.user.role !== 'admin' && subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to delete this subscription');
            error.statusCode = 403;
            throw error;
        }

        await subscription.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        next(error);
    }
}

// GET /subscriptions/user/:id
// Normal user: only their own id. Admin: any user's id.
export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.params.id !== req.user._id.toString()) {
            const error = new Error('You are not authorized to view this user\'s subscriptions');
            error.statusCode = 403;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions
        })
    } catch (error) {
        next(error);
    }
}

// PUT /subscriptions/:id/cancel
// Normal user: only if it belongs to them. Admin: any subscription.
export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (req.user.role !== 'admin' && subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to cancel this subscription');
            error.statusCode = 403;
            throw error;
        }

        subscription.status = 'cancelled';
        await subscription.save();

        res.status(200).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error);
    }
}

// GET /subscriptions/upcoming-renewals
// Returns the logged-in user's own subscriptions renewing in the next 7 days.
// (Kept user-only even for admins — this is a personal "my renewals" view, not a system-wide report.)
export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);

        const subscriptions = await Subscription.find({
            user: req.user._id,
            status: 'active',
            renewalDate: { $gte: today, $lte: sevenDaysFromNow }
        }).sort({ renewalDate: 1 });

        res.status(200).json({
            success: true,
            data: subscriptions
        })
    } catch (error) {
        next(error);
    }
}