import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => { // 1. Thêm async ở đây

    const { filter = "today" } = req.query; // Lấy giá trị filter từ query parameters
    const now = new Date();
    let startDate;

    switch (filter) {
        case "today":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case "week":
            const dayOfWeek = now.getDay(); // 0 (Chủ nhật) đến 6 (Thứ bảy)
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
            break;
        case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case "all":
                startDate = null; // Không áp dụng filter nếu không hợp lệ
        default:
            startDate = null; // Không áp dụng filter nếu không hợp lệ
    }

    const query = startDate ? { createdAt: { $gte: startDate } } : {}; // Nếu startDate tồn tại, thêm điều kiện vào query


    try {
 
        const result = await Task.aggregate([
            {$match: query}, // Áp dụng filter nếu có
            {
                $facet: {
                    tasks: [{ $sort: { createdAt: -1 } }], // Lấy tất cả tasks
                    activeCount: [{ $match: { status: "active" } },{ $count: "count" }], // Đếm số lượng tasks đang hoạt động
                    completeCount: [{ $match: { status: "complete" } },{ $count: "count" }],
                }
            }
        ]);

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0] ?.count || 0;
        const completeCount = result[0].completeCount[0] ?.count || 0;
        res.status(200).json({ tasks, activeCount, completeCount });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả tasks:', error.message);
        res.status(500).json({ message: 'Lỗi hệ thống x' });  
    }
}


export const createtask = async (req, res) => {
    try {
        const {title} = req.body;
        const task = new Task({ title });
        const newtask = await task.save();
        res.status(201).json(newtask);
    } catch (error) {
        console.error('Lỗi khi tạo task:', error);
        res.status(500).json({ message: 'Lỗi hệ thống x' });
    }
};
export const updatetask = async (req, res) => {
    try {
       const {title, status, completed} = req.body;
       const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, 
        { 
            title, 
            status, 
            completed 
        }, 
        { 
            new: true 
        }
       );
       if (!updatedTask) {
           return res.status(404).json({ message: 'Task không tồn tại' });
       }
         res.status(200).json(updatedTask);
      
    } catch (error) {
        console.error('Lỗi khi cập nhật task:', error);
        res.status(500).json({ message: 'Lỗi hệ thống x' });
    }
}
export const deletetask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(
            req.params.id
        );
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task không tồn tại' });
        }
        res.status(200).json({ message: 'Task đã được xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa task:', error);
        res.status(500).json({ message: 'Lỗi hệ thống x' });
    }
}
