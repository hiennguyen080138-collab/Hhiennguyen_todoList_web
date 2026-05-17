import React, { use, useEffect, useState } from 'react'
import Header from '../components/Header'        // Sửa lại đường dẫn này
import AddTask from '../components/AddTask'      // Sửa lại đường dẫn và viết hoa chữ A
import StatsAndFilter from '../components/StatsAndFilter'
import TaskList from '../components/TaskList'
import TaskListPagination from '../components/TaskListPagination'
import DateTimeFilter from '../components/DateTimeFilter'
import Footer from '../components/Footer'
import { toast } from 'sonner'
import axios from 'axios';
import api from '@/lib/axios'
import { visibleTaskLimit } from '@/lib/data'

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTasksCount, setActiveTasksCount] = useState(0);
  const [completeTasksCount, setCompleteTasksCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);
  


  useEffect(() => {
    fetchTasks();
  },[dateQuery]);

  useEffect(() => {
    setPage(1); // Reset về trang đầu tiên mỗi khi filter thay đổi
  }, [filter,dateQuery]);

  // LOGIC: Hàm fetchTasks để lấy danh sách tasks từ backend và cập nhật state
  const fetchTasks = async () => {
  try { 
    const res = await api.get(`/tasks?filter=${dateQuery}`);
    
    setTaskBuffer(res.data.tasks||[]);
    setActiveTasksCount(res.data.activeCount);
    setCompleteTasksCount(res.data.completeCount);
   
  
  } catch (error) {
    console.error('Lỗi truy vấn tasks:', error);
    toast.error('Không thể tải danh sách nhiệm vụ. Vui lòng thử lại sau.');
    }
  };

  // LOGIC: Hàm handleTaskChanged để thông báo cho HomePage cập nhật danh sách tasks sau khi có sự thay đổi (thêm, sửa, xóa)
  const handleTaskChanged = () => {
    fetchTasks(); // Gọi lại hàm fetchTasks để cập nhật danh sách tasks mới nhất
  };

  const handleNext=() => {
    if (page < totalPages ) {
      setPage(prev => prev + 1);
    }
  }
  const handlePrev=() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }
  const handlePageChange=(newPage) => {
    setPage(newPage);
  }

  // Lọc tasks dựa trên filter
 const filteredTasks = taskBuffer.filter(task => {
  switch (filter) {
    case "active":
      return task.status === "active";
    case "completed":
      return task.status === "complete";
    default:
      return true;
  }
 
})

const visibleTasks = filteredTasks.slice((page - 1) * visibleTaskLimit, page * visibleTaskLimit); // Lấy visibleTaskLimit tasks cho trang hiện tại

if (visibleTasks.length === 0 ) {
  handlePrev(); // Nếu không còn tasks nào để hiển thị ở trang hiện tại, reset về trang đầu tiên
}

const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  return (  

    <div className="min-h-screen w-full relative">
    {/* Radial Gradient Background from Bottom */}
    <div
      className="absolute inset-0 z-0"
      style={{
        background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
      }}
    />
    {/* Your Content/Components */}
      <div className="container pt-8 mx-auto relative z-10">
      <div className="w-full max-w-2xl p-6 mx-auto space-y-6"> {/* Đã xóa ký tự thừa "-6" ở đây luôn cho bạn */}
        <Header/>

        <AddTask handleNewTaskAdded={handleTaskChanged}/>

        <StatsAndFilter
          filter={filter}
          setFilter = {setFilter}
          activeTaskCount={activeTasksCount} 
          completedTaskCount={completeTasksCount}
        
        />

        <TaskList filteredTasks={visibleTasks} 
        filter={filter}
        handleTaskChanged={handleTaskChanged}
        />

       <div className="flex items-center justify-between w-full py-2">
          <TaskListPagination 
          handleNext={handleNext}
          handlePrev={handlePrev}
          handlePageChange={handlePageChange}
          page={page}
          totalPages={totalPages}

          
          /> 
          <DateTimeFilter  dateQuery={dateQuery} setDateQuery={setDateQuery}/>
        </div>

        <Footer
        activeTasksCount={activeTasksCount}
        completeTasksCount={completeTasksCount}
        
        />
      </div>
    </div>
    </div>
  
  );
}

export default HomePage;