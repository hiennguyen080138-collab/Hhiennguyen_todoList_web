import React from 'react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-950">
     <img
        src="404.png"
        alt="Not Found" 
        className="max-w-full mb-6 w-96" 
      />
      <p className="text-lg text-gray-600">
        Bạn đang cố gắng truy cập một trang không tồn tại
      </p>
      <a href="/" className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/80">
        Quay lại trang chủ
      </a>
    </div>
  );
}

export default NotFound