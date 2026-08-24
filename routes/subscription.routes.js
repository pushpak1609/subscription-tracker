import { Router } from 'express';
import {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getUserSubscriptions,
    cancelSubscription,
    getUpcomingRenewals
} from '../controllers/subscription.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

// path: /api/v1/subscriptions

// Specific/static routes go before dynamic ':id' routes,
// otherwise Express would match "upcoming-renewals" as an :id.
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.get('/', authorize, getSubscriptions);
subscriptionRouter.get('/:id', authorize, getSubscription);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

export default subscriptionRouter;