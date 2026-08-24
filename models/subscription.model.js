import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Subscription name is required'],
            trim: true,
            minLength: [3, 'Subscription name must be at least 3 characters long'],
            maxLength: [50, 'Subscription name cannot exceed 50 characters'],
        },

        price: {
            type: Number,
            required: [true, 'Subscription price is required'],
            min: [0, 'Subscription price must be a positive number'],
        },

        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP'],
            default: 'USD',
        },

        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            required: [true, 'Subscription frequency is required'],
        },

        category: {
            type: String,
            enum: ['entertainment', 'productivity', 'education', 'health', 'other'],
            required: [true, 'Subscription category is required'],
        },

        paymentMethod: {
            type: String,
            required: [true, 'Subscription payment method is required'],
            trim: true,
        },

        status: {
            type: String,
            enum: ['active', 'inactive', 'cancelled'],
            default: 'active',
        },

        startDate: {
            type: Date,
            required: [true, 'Subscription start date is required'],
            validate: {
                validator: (value) => value <= new Date(),
                message: 'Subscription start date must be in the past',
            },
        },

        renewalDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return value > this.startDate;
                },
                message: 'Subscription renewal date must be after start date',
            },
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Subscription user is required'],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

subscriptionSchema.pre('save', function () {
    if (!this.renewalDate) {
        const renewalDate = new Date(this.startDate);

        switch (this.frequency) {
            case 'daily':
                renewalDate.setDate(renewalDate.getDate() + 1);
                break;

            case 'weekly':
                renewalDate.setDate(renewalDate.getDate() + 7);
                break;

            case 'monthly':
                renewalDate.setMonth(renewalDate.getMonth() + 1);
                break;

            case 'yearly':
                renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                break;}

        this.renewalDate = renewalDate;
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;