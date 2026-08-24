import mongoose from 'mongoose';
import { DB_URI } from '../config/env.js'; 

if(!DB_URI){
    throw new Error('DB_URI is not defined in the environment variable inside .env.development.local file');
}

const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI);
        console.log('Connected to the database successfully.');

    }catch(error){
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with an error code
    }
}

export default connectToDatabase;