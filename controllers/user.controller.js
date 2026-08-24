import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";

// Admin-only: list all users, never expose password hashes.
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        })
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        // A normal user can only fetch their own account. Admins can fetch anyone's.
        if (req.user.role !== 'admin' && req.params.id !== req.user._id.toString()) {
            const error = new Error('You are not authorized to view this user');
            error.statusCode = 403;
            throw error;
        }

        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.params.id !== req.user._id.toString()) {
            const error = new Error('You are not authorized to update this user');
            error.statusCode = 403;
            throw error;
        }

        const updates = { ...req.body };

        // Never let role be changed through this route — self-promotion risk.
        // (Even an admin editing someone here shouldn't accidentally demote/promote via a stray field.)
        delete updates.role;

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.params.id !== req.user._id.toString()) {
            const error = new Error('You are not authorized to delete this user');
            error.statusCode = 403;
            throw error;
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        next(error);
    }
}