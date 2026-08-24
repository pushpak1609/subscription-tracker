import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'User name is required'],
        trim: true,
        minLength: [3,'User name must be at least 3 characters long'],
        maxLength:50,
    },
    email:{
        type: String,
        required: [true,'User email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/,'User email is invalid'],
    },
    password:{
        type: String,
        required: [true,'User password is required'],
        minLength: [6,'User password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;