import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Dùng 1 Shard duy nhất + User mới tạo
        const uri = process.env.MONGODB_CONNECTIONSTRING;
        
        console.log('--- ĐANG THỬ KẾT NỐI CUỐI CÙNG (SHARD 00-00) ---');

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log('--- KẾT NỐI THÀNH CÔNG RỰC RỠ! ---');
    } catch (error) {
        console.error('Vẫn lỗi:', error.message);
    }
};

export default connectDB;