import api from "./api";


/* =========================================
   GET ALL DEPARTMENTS
========================================= */

const getAllDepartments = async () => {

    const response =
        await api.get(
            "/admin/departments"
        );

    return response.data;
};


/* =========================================
   GET DEPARTMENT BY ID
========================================= */

const getDepartmentById = async (id) => {

    const response =
        await api.get(
            `/admin/departments/${id}`
        );

    return response.data;
};


/* =========================================
   ADD DEPARTMENT
========================================= */

const addDepartment = async (
    departmentData
) => {

    const response =
        await api.post(
            "/admin/departments",
            departmentData
        );

    return response.data;
};


/* =========================================
   UPDATE DEPARTMENT
========================================= */

const updateDepartment = async (
    id,
    departmentData
) => {

    const response =
        await api.put(
            `/admin/departments/${id}`,
            departmentData
        );

    return response.data;
};


/* =========================================
   DELETE DEPARTMENT
========================================= */

const deleteDepartment = async (id) => {

    const response =
        await api.delete(
            `/admin/departments/${id}`
        );

    return response.data;
};


/* =========================================
   DEFAULT EXPORT
========================================= */

const DepartmentService = {

    getAllDepartments,
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment

};


export default DepartmentService;