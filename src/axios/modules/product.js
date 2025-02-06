import axiosInstance from "../../axios";
 
export const getAllCategory = () => {
    axiosInstance.get("/cate")
}

