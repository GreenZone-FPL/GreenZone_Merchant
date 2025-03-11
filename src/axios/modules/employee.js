import axiosInstance from "../axiosInstance";

export const getEmployeesAllAvailable = async () => {
    try {
        const response = await axiosInstance.get('/v1/employee/available/all');
        return response.data;
    } catch {
        console.log("Lỗi gọi API Employees", error);
        throw error;
    }
    }