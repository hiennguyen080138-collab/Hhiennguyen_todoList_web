import React from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { Card } from './ui/card' // Hoặc đường dẫn chính xác đến file card của bạn
import { toast } from 'sonner'

import api from '@/lib/axios'

const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const addTask  = async () => {
    if (newTaskTitle.trim()) 
    {
      try {
        await api.post("/tasks", {
          title: newTaskTitle
          
        });
        toast.success("Nhiệm vụ " + newTaskTitle + " đã được thêm thành công!");
        handleNewTaskAdded(); // Gọi hàm callback để thông báo cho HomePage cập nhật danh sách tasks
       
      
      } catch (error) {
        console.error("Lỗi khi thêm nhiệm vụ:", error);
        // Hiển thị thông báo lỗi nếu có lỗi xảy ra
        toast.error("Không thể thêm nhiệm vụ. Vui lòng thử lại sau.");
      }
      setNewTaskTitle("");
    }
    else {
      toast.error("Tiêu đề nhiệm vụ không được để trống!");
    }

    
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    
      <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Cần phải làm gì?"
            className="h-12 text-base bg-slate-100 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-frimary/20"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
           onKeyDown={(e) => e.key === "Enter" && handleNewTaskAdded()}
          />
         <Button
            variant="gradient"
            size="xl"
            className="px-6"
            onClick={addTask}
            disabled={!newTaskTitle.trim()} // Vô hiệu hóa nút nếu tiêu đề trống
          >
            <Plus className="size-5"/>
            Thêm 

         </Button>

        </div>
      </Card>
    
  );
}

export default AddTask