import React from 'react'

const Footer = ({completedTasksCount = 0, activeTasksCount = 0}) => {
  return (
    <>
    {activeTasksCount + completedTasksCount > 0 &&(
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {
          completedTasksCount > 0 && (
            <>
            🎉 Tuyệt vời! Bạn đã hoàn thành {completedTasksCount} nhiệm vụ.
            {
              activeTasksCount > 0 && ', còn ' + activeTasksCount + ' nhiệm vụ đang chờ bạn hoàn thành. Cố lên!'
            }
            </>
          )
          } 
          {
            completedTasksCount === 0 && activeTasksCount > 0 && (
              <>
              Bạn có {activeTasksCount} nhiệm vụ đang chờ bạn hoàn thành. Hãy bắt đầu ngay bây giờ!
              </>
            )
          }
        </p>

      </div>
    )}

    </>
  );
}

export default Footer