import { act } from "react";

export const FilterType = {
    all: 'Tất cả',
    active: 'Đang hoạt động',
    completed: 'Đã hoàn thành'
}

export const options = [
    {
        value: "today",
        label: "Hôm nay",
    },
    {
        value: "week",
        label: "Tuần này",
    },
    {
        value: "month",
        label: "Tháng này",
    },
    {
        value: "all",
        label: "Tất cả",
    },
]

export const visibleTaskLimit = 5; // Số lượng tasks hiển thị trên một trang