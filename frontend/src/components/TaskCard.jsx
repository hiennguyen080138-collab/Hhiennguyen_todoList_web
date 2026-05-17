import React, { useState } from 'react' // <-- Thêm { useState } vào đây
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/axios'; // Thêm dòng này để định nghĩa 'api'

const TaskCard = ({task,index,handleTaskChanged}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");

  const deleteTask = async (taskId) => {
    // Logic để xóa task
    try
    {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Nhiệm vụ đã được xóa thành công!");
      // Gọi hàm callback để thông báo cho HomePage cập nhật danh sách tasks sau khi xóa
      handleTaskChanged();

    }
    catch (error) {
      console.error("Lỗi khi xóa nhiệm vụ:", error);
      toast.error("Không thể xóa nhiệm vụ. Vui lòng thử lại sau.");
    };
  }

  const updateTask = async () => {
    try {
      setIsEditing(false); // Tắt trạng thái chỉnh sửa sau khi lưu
      await api.put(`/tasks/${task._id}`, { title: updateTaskTitle });
      toast.success("Nhiệm vụ đã được cập nhật thành công!");
      // Gọi hàm callback để thông báo cho HomePage cập nhật danh sách tasks sau khi cập nhật
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi khi cập nhật nhiệm vụ:", error);
      toast.error("Không thể cập nhật nhiệm vụ. Vui lòng thử lại sau.");
    }
  };

  const toggleTaskStatus = async () => {
    try {
      const newStatus = task.status === "active" ? "complete" : "active";
      const completedAt = newStatus === "complete" ? new Date() : null;
      await api.put(`/tasks/${task._id}`, { status: newStatus, completed: completedAt });
      toast.success(`Nhiệm vụ đã được đánh dấu là ${newStatus === "complete" ? "hoàn thành" : "đang hoạt động"}!`);
      // Gọi hàm callback để thông báo cho HomePage cập nhật danh sách tasks sau khi thay đổi trạng thái
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái nhiệm vụ:", error);
      toast.error("Không thể thay đổi trạng thái nhiệm vụ. Vui lòng thử lại sau.");
    }
  };

  return (
    <Card className={cn(
      "p-4  bg-gradient-card border-0 shadow-custom-lg transition-all duration-200 animate-fade-in group",
      task.status === "complete" && "opacity-75",
      
    )}
    style={{
      animationDelay: `${index * 50}ms`
    }}
    >
      <div className="flex items-center gap-4">
        {/* nút tròn */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === 'complete' ? 'text-success hover:text-success/80'
            :"text-muted-foreground hover:text-primary"
            
          )}
          onClick={toggleTaskStatus} // Gọi hàm toggleTaskStatus khi nhấn nút
        >
          {task.status === 'complete' ? (
            <CheckCircle2 className="size-5" />
          ):(
            <Circle className="size-5"/>
          )}

        </Button>
        {/* hiển thị và chỉnh sửa tiêu đề  */}
        <div className="flex-1 min-w-0">
         {isEditing ? (
          <input
            placeholder="Cần phải làm gì?"
            className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
            type="text"
            value={updateTaskTitle}
            onChange={(e) => setUpdateTaskTitle(e.target.value)}
            autoFocus // Tự động nhảy con trỏ chuột vào ô input khi bấm sửa
            
            // 1. Nhấn Enter để lưu dữ liệu lên server
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!updateTaskTitle.trim()) {
                  toast.error("Tiêu đề nhiệm vụ không được để trống!");
                  return;
                }
                updateTask(); // Gọi hàm updateTask bạn đã viết ở dòng 29 để lưu
              }
            }}
            onBlur={() => {
              setIsEditing(false); // 1. Tắt trạng thái chỉnh sửa
              setupdateTaskTitle(task.title || ""); // 2. Khôi phục lại tiêu đề gốc nếu không nhấn Enter để lưu
            }}
          
          />
         ) : (
          <p className={cn(
            "text-base transition-all duration-200",
            task.status === 'complete' ? "line-through text-muted-foreground": "text-foreground"
          )}>
            {task.title}
          </p>
         )}
                  {/* Ngày tạo và ngày hoàn thành */}
        <div className="hidden group-hover:flex flex items-center gap-2 mt-1 animate-fade-in">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {new Date(task.createdAt).toLocaleString()}
          </span>
          {task.status === 'complete' && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <Calendar className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {new Date(task.completedAt).toLocaleString()}
              </span>
            </>
          )}
        </div>  
              

        </div>

        {/* Nút chỉnh sửa và xóa */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* Nút chỉnh sửa */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
           onClick={() => {
              setIsEditing(true);
              setUpdateTaskTitle(task.title || ""); 
              // Đặt giá trị input bằng tiêu đề hiện tại của task khi bắt đầu chỉnh sửa
              // Bật trạng thái chỉnh sửa khi nhấn nút
            }} // Đóng ngoặc nhọn và ngoặc tròn của onClick phải nằm ở đây!
          >
            <SquarePen className="size-4"/>       
          </Button>
          {/* Nút xóa */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)} // Gọi hàm deleteTask khi nhấn nút xóa
          >
            <Trash2 className="size-4" />
          </Button>

        </div>
      </div>
    </Card>
  );
}

export default TaskCard