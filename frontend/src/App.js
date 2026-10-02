import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import "./App.css";


/* =====================================================
   AUTH CONTEXT
===================================================== */

import {
    AuthProvider
} from "./context/AuthContext";


/* =====================================================
   COMMON COMPONENTS
===================================================== */

import ProtectedRoute
    from "./components/common/ProtectedRoute";


/* =====================================================
   EMERGENCY SERVICES
===================================================== */

import EmergencyServices
    from "./pages/emergency/EmergencyServices";


/* =====================================================
   AUTH PAGES
===================================================== */

import Login
    from "./pages/auth/Login";

import Register
    from "./pages/auth/Register";

import ForgotPassword
    from "./pages/auth/ForgotPassword";

import ResetPassword
    from "./pages/auth/ResetPassword";


/* =====================================================
   UNAUTHORIZED
===================================================== */

import Unauthorized
    from "./pages/Unauthorized";


/* =====================================================
   ADMIN LAYOUT
===================================================== */

import AdminLayout
    from "./pages/admin/AdminLayout";


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

import AdminDashboard
    from "./pages/admin/AdminDashboard";


/* =====================================================
   ADMIN - DOCTORS
===================================================== */

import ManageDoctors
    from "./pages/admin/doctors/ManageDoctors";

import AddDoctor
    from "./pages/admin/doctors/AddDoctor";

import EditDoctor
    from "./pages/admin/doctors/EditDoctor";

import AdminDoctorDetails
    from "./pages/admin/doctors/DoctorDetails";


/* =====================================================
   ADMIN - PATIENTS
===================================================== */

import AdminPatients
    from "./pages/admin/patients/Patients";

import AdminPatientDetails
    from "./pages/admin/patients/PatientDetails";


/* =====================================================
   ADMIN - DEPARTMENTS
===================================================== */

import Department
    from "./pages/admin/departments/Department";

import AddDepartment
    from "./pages/admin/departments/AddDepartment";


/* =====================================================
   ADMIN - APPOINTMENTS
===================================================== */

import AdminAppointments
    from "./pages/admin/appointments/AdminAppointments";

import AdminAppointmentDetails
    from "./pages/admin/appointments/AppointmentDetails";


/* =====================================================
   ADMIN - MEDICINES
===================================================== */

import Medicine
    from "./pages/admin/medicines/Medicine";

import AddMedicine
    from "./pages/admin/medicines/AddMedicine";


/* =====================================================
   ADMIN - BILLING
===================================================== */

import Bill
    from "./pages/admin/billing/Bill";

import AddBill
    from "./pages/admin/billing/AddBill";


/* =====================================================
   ADMIN - REPORTS
===================================================== */

import ReportsAnalytics
    from "./pages/admin/reports/ReportsAnalytics";


/* =====================================================
   ADMIN - PROFILE
===================================================== */

import AdminProfile
    from "./pages/admin/profile/AdminProfile";


/* =====================================================
   DOCTOR LAYOUT
===================================================== */

import DoctorLayout
    from "./pages/doctor/DoctorLayout";


/* =====================================================
   DOCTOR DASHBOARD
===================================================== */

import DoctorDashboard
    from "./pages/doctor/DoctorDashboard";


/* =====================================================
   DOCTOR - PATIENTS
===================================================== */

import MyPatients
    from "./pages/doctor/patients/MyPatients";

import DoctorPatientDetails
    from "./pages/doctor/patients/PatientDetails";


/* =====================================================
   DOCTOR - APPOINTMENTS
===================================================== */

import MyAppointments
    from "./pages/doctor/appointments/MyAppointments";

import DoctorAppointmentDetails
    from "./pages/doctor/appointments/AppointmentDetails";


/* =====================================================
   DOCTOR - PRESCRIPTIONS
===================================================== */

import Prescriptions
    from "./pages/doctor/prescriptions/Prescriptions";

import AddPrescription
    from "./pages/doctor/prescriptions/AddPrescription";

import PrescriptionDetails
    from "./pages/doctor/prescriptions/PrescriptionDetails";
    
import PrescriptionEdit
    from "./pages/doctor/prescriptions/PrescriptionEdit";    


/* =====================================================
   DOCTOR - REPORTS
===================================================== */

import DoctorReports
    from "./pages/doctor/reports/DoctorReports";


/* =====================================================
   DOCTOR - PROFILE
===================================================== */

import DoctorProfile
    from "./pages/doctor/profile/DoctorProfile";


/* =====================================================
   PATIENT LAYOUT
===================================================== */

import PatientLayout
    from "./pages/patient/PatientLayout";


/* =====================================================
   PATIENT DASHBOARD
===================================================== */

import PatientDashboard
    from "./pages/patient/PatientDashboard";


/* =====================================================
   PATIENT - DOCTORS
===================================================== */

import PatientDoctors
    from "./pages/patient/doctors/Doctors";

import PatientDoctorDetails
    from "./pages/patient/doctors/DoctorDetails";


/* =====================================================
   PATIENT - APPOINTMENTS
===================================================== */

import BookAppointment
    from "./pages/patient/appointments/BookAppointment";

import PatientAppointments
    from "./pages/patient/appointments/MyAppointments";

import PatientAppointmentDetails
    from "./pages/patient/appointments/AppointmentDetails";


/* =====================================================
   PATIENT - PRESCRIPTIONS
===================================================== */

import MyPrescriptions
    from "./pages/patient/prescriptions/MyPrescriptions";


/* =====================================================
   PATIENT - BILLING
===================================================== */

import MyBills
    from "./pages/patient/billing/MyBills";


/* =====================================================
   PATIENT - PROFILE
===================================================== */

import PatientProfile
    from "./pages/patient/profile/PatientProfile";


/* =====================================================
   APP
===================================================== */

function App() {

    return (

        <div className="app">

            <BrowserRouter>

                <AuthProvider>

                    <Routes>


                        {/* =================================================
                            PUBLIC AUTH ROUTES
                        ================================================= */}

                        <Route
                            path="/"
                            element={
                                <Login />
                            }
                        />


                        <Route
                            path="/register"
                            element={
                                <Register />
                            }
                        />


                        <Route
                            path="/forgot-password"
                            element={
                                <ForgotPassword />
                            }
                        />


                        <Route
                            path="/reset-password"
                            element={
                                <ResetPassword />
                            }
                        />


                        {/* =================================================
                            UNAUTHORIZED
                        ================================================= */}

                        <Route
                            path="/unauthorized"
                            element={
                                <Unauthorized />
                            }
                        />


                        {/* =================================================
                            ADMIN ROUTES
                        ================================================= */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={[
                                        "ADMIN"
                                    ]}
                                />
                            }
                        >

                            <Route
                                element={
                                    <AdminLayout />
                                }
                            >

                                {/* ADMIN DASHBOARD */}

                                <Route
                                    path="/admin/dashboard"
                                    element={
                                        <AdminDashboard />
                                    }
                                />


                                {/* ADMIN DOCTORS */}

                                <Route
                                    path="/admin/doctors"
                                    element={
                                        <ManageDoctors />
                                    }
                                />


                                <Route
                                    path="/admin/doctors/add"
                                    element={
                                        <AddDoctor />
                                    }
                                />


                                <Route
                                    path="/admin/doctors/edit/:id"
                                    element={
                                        <EditDoctor />
                                    }
                                />


                                <Route
                                    path="/admin/doctors/:id"
                                    element={
                                        <AdminDoctorDetails />
                                    }
                                />


                                {/* ADMIN PATIENTS */}

                                <Route
                                    path="/admin/patients"
                                    element={
                                        <AdminPatients />
                                    }
                                />


                                <Route
                                    path="/admin/patients/:id"
                                    element={
                                        <AdminPatientDetails />
                                    }
                                />


                                {/* ADMIN DEPARTMENTS */}

                                <Route
                                    path="/admin/departments"
                                    element={
                                        <Department />
                                    }
                                />


                                <Route
                                    path="/admin/departments/add"
                                    element={
                                        <AddDepartment />
                                    }
                                />


                                <Route
                                    path="/admin/departments/edit/:id"
                                    element={
                                        <AddDepartment />
                                    }
                                />


                                {/* ADMIN APPOINTMENTS */}

                                <Route
                                    path="/admin/appointments"
                                    element={
                                        <AdminAppointments />
                                    }
                                />


                                <Route
                                    path="/admin/appointments/:id"
                                    element={
                                        <AdminAppointmentDetails />
                                    }
                                />


                                {/* ADMIN MEDICINES */}

                                <Route
                                    path="/admin/medicines"
                                    element={
                                        <Medicine />
                                    }
                                />


                                <Route
                                    path="/admin/medicines/add"
                                    element={
                                        <AddMedicine />
                                    }
                                />


                                <Route
                                    path="/admin/medicines/edit/:id"
                                    element={
                                        <AddMedicine />
                                    }
                                />


                                {/* ADMIN BILLING */}

                                <Route
                                    path="/admin/billing"
                                    element={
                                        <Bill />
                                    }
                                />


                                <Route
                                    path="/admin/billing/add"
                                    element={
                                        <AddBill />
                                    }
                                />


                                <Route
                                    path="/admin/billing/edit/:id"
                                    element={
                                        <AddBill />
                                    }
                                />


                                {/* ADMIN REPORTS */}

                                <Route
                                    path="/admin/reports"
                                    element={
                                        <ReportsAnalytics />
                                    }
                                />


                                {/* ADMIN PROFILE */}

                                <Route
                                    path="/admin/profile"
                                    element={
                                        <AdminProfile />
                                    }
                                />


                                {/* ADMIN EMERGENCY */}

                                <Route
                                    path="/admin/emergency"
                                    element={
                                        <EmergencyServices />
                                    }
                                />

                            </Route>

                        </Route>


                        {/* =================================================
                            DOCTOR ROUTES
                        ================================================= */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={[
                                        "DOCTOR"
                                    ]}
                                />
                            }
                        >

                            <Route
                                element={
                                    <DoctorLayout />
                                }
                            >


                                {/* =========================================
                                    DOCTOR DASHBOARD
                                ========================================= */}

                                <Route
                                    path="/doctor/dashboard"
                                    element={
                                        <DoctorDashboard />
                                    }
                                />


                                {/* =========================================
                                    DOCTOR PATIENTS
                                ========================================= */}

                                <Route
                                    path="/doctor/patients"
                                    element={
                                        <MyPatients />
                                    }
                                />


                                <Route
                                    path="/doctor/patients/:id"
                                    element={
                                        <DoctorPatientDetails />
                                    }
                                />


                                {/* =========================================
                                    DOCTOR APPOINTMENTS
                                ========================================= */}

                                <Route
                                    path="/doctor/appointments"
                                    element={
                                        <MyAppointments />
                                    }
                                />


                                <Route
                                    path="/doctor/appointments/:id"
                                    element={
                                        <DoctorAppointmentDetails />
                                    }
                                />


                                {/* =========================================
                                    DOCTOR PRESCRIPTIONS
                                ========================================= */}

                                <Route
                                    path="/doctor/prescriptions"
                                    element={
                                        <Prescriptions />
                                    }
                                />


                                <Route
                                    path="/doctor/prescriptions/add"
                                    element={
                                        <AddPrescription />
                                    }
                                />


                                <Route
                                    path="/doctor/prescriptions/:id"
                                    element={
                                        <PrescriptionDetails />
                                    }
                                />

                                 <Route
                                    path="/doctor/prescriptions/:id/edit"
                                    element={
                                        <PrescriptionEdit />
                                    }
                                />


                                {/* =========================================
                                    DOCTOR REPORTS
                                ========================================= */}

                                <Route
                                    path="/doctor/reports"
                                    element={
                                        <DoctorReports />
                                    }
                                />


                                {/* =========================================
                                    DOCTOR PROFILE
                                ========================================= */}

                                <Route
                                    path="/doctor/profile"
                                    element={
                                        <DoctorProfile />
                                    }
                                />


                                {/* =========================================
                                    DOCTOR EMERGENCY
                                ========================================= */}

                                <Route
                                    path="/doctor/emergency"
                                    element={
                                        <EmergencyServices />
                                    }
                                />

                            </Route>

                        </Route>


                        {/* =================================================
                            PATIENT ROUTES
                        ================================================= */}

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={[
                                        "PATIENT"
                                    ]}
                                />
                            }
                        >

                            <Route
                                element={
                                    <PatientLayout />
                                }
                            >


                                {/* PATIENT DASHBOARD */}

                                <Route
                                    path="/patient/dashboard"
                                    element={
                                        <PatientDashboard />
                                    }
                                />


                                {/* PATIENT DOCTORS */}

                                <Route
                                    path="/patient/doctors"
                                    element={
                                        <PatientDoctors />
                                    }
                                />


                                <Route
                                    path="/patient/doctors/:id"
                                    element={
                                        <PatientDoctorDetails />
                                    }
                                />


                                {/* BOOK APPOINTMENT */}

                                <Route
                                    path="/patient/appointments/book"
                                    element={
                                        <BookAppointment />
                                    }
                                />


                                {/* PATIENT APPOINTMENTS */}

                                <Route
                                    path="/patient/appointments"
                                    element={
                                        <PatientAppointments />
                                    }
                                />


                                <Route
                                    path="/patient/appointments/:id"
                                    element={
                                        <PatientAppointmentDetails />
                                    }
                                />


                                {/* PATIENT PRESCRIPTIONS */}

                                <Route
                                    path="/patient/prescriptions"
                                    element={
                                        <MyPrescriptions />
                                    }
                                />


                                {/* PATIENT BILLING */}

                                <Route
                                    path="/patient/billing"
                                    element={
                                        <MyBills />
                                    }
                                />


                                {/* PATIENT PROFILE */}

                                <Route
                                    path="/patient/profile"
                                    element={
                                        <PatientProfile />
                                    }
                                />


                                {/* PATIENT EMERGENCY */}

                                <Route
                                    path="/patient/emergency"
                                    element={
                                        <EmergencyServices />
                                    }
                                />

                            </Route>

                        </Route>


                        {/* =================================================
                            FALLBACK
                        ================================================= */}

                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="/"
                                    replace
                                />
                            }
                        />

                    </Routes>

                </AuthProvider>

            </BrowserRouter>

        </div>

    );

}


export default App;