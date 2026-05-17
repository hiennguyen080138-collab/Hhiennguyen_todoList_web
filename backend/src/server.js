import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import tasksRouter from './routes/tasksrouters.js';
import connectDB from './config/db.js';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Thay đổi nếu frontend chạy trên cổng khác
   
}));
app.use(express.json());

app.use('/api/tasks', tasksRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    });

});
