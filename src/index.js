import { config } from 'dotenv';
config({ path: './.env' });
import express from 'express';
import connectDB from './db/index.js';
const app = express();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    
    })
})
.catch((error) => console.log('Error connecting to MongoDB: ', error));