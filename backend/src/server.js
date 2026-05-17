import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import tasksRouter from './routes/tasksrouters.js';
import connectDB from './config/db.js';
import cors from 'cors';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const app = express();

// CORS middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(cors({
    origin: 'http://localhost:5173', // Thay đổi nếu frontend chạy trên cổng khác
   
    }));
}
app.use(express.json());

app.use('/api/tasks', tasksRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './frontend/dist')));
    app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/dist/index.html'));
});
}
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    });

});
