# 🏥 Hospital Management System

A modern full-stack **Hospital Management System** that helps hospitals manage patients, doctors, departments, appointments, prescriptions, medicines, billing, reports, and emergency services through a centralized web application.

The system provides separate portals for **Admin, Doctor, and Patient** users with secure JWT-based authentication and role-based access control.

---

## 🚀 Project Overview

The Hospital Management System provides an easy-to-use platform for managing hospital operations digitally.

Administrators can manage doctors, patients, departments, appointments, medicines, billing, reports, and hospital activities.

Doctors can manage appointments, view patients, create prescriptions, and access reports.

Patients can register, log in, book appointments, view appointments, view prescriptions, view bills, manage their profile, and access emergency information.

The application follows a role-based architecture with separate **Admin, Doctor, and Patient portals**.

---

# ✨ Features

## 🔐 Authentication

- Admin Login
- Doctor Login
- Patient Registration
- Patient Login
- JWT Authentication
- Role-Based Authentication
- Forgot Password
- Reset Password
- Secure API Access
- Token-Based Authorization
- Logout
- Duplicate Login Email Validation

---

# 👨‍💼 Admin Module

The Admin module provides complete control over hospital operations.

## 📊 Admin Dashboard

Admin can view:

- Total Doctors
- Total Patients
- Total Departments
- Appointment Statistics
- Prescription Information
- Billing Information
- Hospital Overview
- Reports
- Analytics

---

## 👨‍⚕️ Doctor Management

Admin can:

- Add Doctor
- View Doctors
- Search Doctors
- Edit Doctor
- Delete Doctor
- View Doctor Details
- Assign Department
- Manage Doctor Specialization
- Manage Doctor Contact Information
- Manage Doctor Login Account

---

## 👥 Patient Management

Admin can:

- View Patients
- Search Patients
- View Patient Details
- Manage Patient Information
- View Patient Contact Information
- View Patient Medical Information
- Manage Patient Records

---

## 🏢 Department Management

Admin can:

- Add Department
- View Departments
- Edit Department
- Delete Department
- Search Departments
- Manage Department Information

---

## 📅 Appointment Management

Admin can:

- View Appointments
- Search Appointments
- Filter Appointments by Status
- View Today's Appointments
- View Appointment Details
- Monitor Appointment Status
- Manage Hospital Appointments

### Appointment Status

```text
PENDING
APPROVED
REJECTED
COMPLETED
CANCELLED
```

---

## 💊 Medicine Management

Admin can:

- Add Medicines
- View Medicines
- Search Medicines
- Edit Medicines
- Delete Medicines
- Manage Medicine Information

### Medicine Information

- Medicine Name
- Generic Name
- Dosage
- Frequency
- Instructions

---

## 💳 Billing Management

Admin can:

- Create Bills
- View Bills
- View Patient Bills
- View Doctor Information
- View Treatment Information
- Manage Consultation Charges
- Manage Medicine Charges
- Manage Test Charges
- Calculate Total Amount
- Track Payment Status
- Track Paid Amount
- Track Payment Method
- Track Payment Date

### Bill Calculation

```text
Total Amount =
Consultation Fee
+ Medicine Charge
+ Test Charge
```

Payment information is maintained for each bill.

---

## 📄 Reports

Admin can:

- Generate Reports
- View Hospital Reports
- View Appointment Reports
- View Billing Reports
- View Prescription Information
- View Summary Information
- Generate Report PDFs

---

## 📈 Analytics

Admin can view:

- Hospital Statistics
- Patient Statistics
- Doctor Statistics
- Department Statistics
- Appointment Statistics
- Prescription Statistics
- Billing Information
- Dashboard Analytics

---

## 👤 Admin Profile

Admin can:

- View Profile
- View Account Information
- Manage Profile Information
- Logout Securely

---

# 👨‍⚕️ Doctor Module

Doctors have a separate portal for managing their appointments, patients, and prescriptions.

## 📊 Doctor Dashboard

Doctors can view:

- My Patients
- Today's Appointments
- Pending Appointments
- Prescriptions
- Upcoming Appointment Information

The dashboard focuses on today's and upcoming appointment activities.

---

## 👥 Doctor Patients

Doctors can:

- View Patients
- Search Patients
- View Patient Information
- View Patient Contact Information
- View Patient Medical Information
- View Patient Appointment Information

---

## 📅 Doctor Appointments

Doctors can:

- View Today's Appointments
- View Upcoming Pending Appointments
- View Appointment Details
- Approve Appointments
- Reject Appointments
- Complete Appointments

### Appointment Workflow

```text
PENDING
   ↓
APPROVED
   ↓
COMPLETED
```

Appointments can also be:

```text
PENDING
   ↓
REJECTED
```

or:

```text
PENDING
   ↓
CANCELLED
```

---

## 💊 Prescription Management

Doctors can:

- Create Prescriptions
- View Prescriptions
- Edit Prescriptions
- View Prescription Details
- Select Medicines
- Add Diagnosis
- Add General Instructions
- Add Medicine Instructions
- Manage Prescription Information

---

## 📄 Doctor Reports

Doctors can:

- View Reports
- View Appointment Information
- View Patient Information
- View Prescription Information
- Generate Reports
- Generate Report PDFs

---

## 👤 Doctor Profile

Doctors can:

- View Profile
- View Personal Information
- View Department
- View Specialization
- View Contact Information
- View Login Information

---

# 👤 Patient Module

Patients have a separate portal for managing their healthcare information.

## 📝 Patient Registration

New patients can register by providing:

- Patient Name
- Email
- Phone
- Age
- Gender
- Address
- Disease / Medical Information
- Login Email
- Password

The system validates the login email to prevent duplicate accounts.

---

## 📊 Patient Dashboard

Patients can view:

- Total Appointments
- Upcoming Appointments
- Prescriptions
- Pending Bills
- Next Appointment

### My Overview

```text
Total Appointments
Upcoming Appointments
Prescriptions
Pending Bills
```

---

## 👨‍⚕️ Find Doctors

Patients can:

- View Available Doctors
- Search Doctors
- View Doctor Details
- View Doctor Specialization
- View Department Information

Doctors are displayed with pagination for easier navigation.

---

## 📅 Patient Appointments

Patients can:

- Book Appointments
- View Appointments
- View Appointment Details
- View Doctor Information
- View Department Information
- View Appointment Status
- Cancel Appointments where applicable

---

## 💊 Patient Prescriptions

Patients can:

- View Prescriptions
- View Prescription Details
- View Diagnosis
- View General Instructions
- View Prescribed Medicines
- View Medicine Dosage
- View Medicine Frequency
- View Medicine Instructions
- View Prescription PDFs

---

## 💳 Patient Billing

Patients can:

- View Bills
- View Bill Details
- View Treatment
- View Consultation Fee
- View Medicine Charges
- View Test Charges
- View Total Amount
- View Paid Amount
- View Pending Amount
- View Payment Status
- View Payment Method
- View Payment Date

---

## 👤 Patient Profile

Patients can:

- View Profile
- View Personal Information
- View Contact Information
- View Age
- View Gender
- View Address
- View Medical Information
- Manage Profile Information

---

# 🚨 Emergency Services

The application provides an emergency information page for quick access to hospital emergency-related information.

Patients and users can access the emergency page directly from the application.

---

# 🔄 Application Flow

The complete application flow is:

```text
Login / Registration
        ↓
Authentication
        ↓
Check User Role
        ↓
        ├── ADMIN
        │     ↓
        │   Admin Dashboard
        │     ↓
        │   ├── Doctors
        │   ├── Patients
        │   ├── Departments
        │   ├── Appointments
        │   ├── Medicines
        │   ├── Billing
        │   ├── Reports
        │   └── Analytics
        │
        ├── DOCTOR
        │     ↓
        │   Doctor Dashboard
        │     ↓
        │   ├── Patients
        │   ├── Appointments
        │   ├── Prescriptions
        │   ├── Reports
        │   └── Profile
        │
        └── PATIENT
              ↓
            Patient Dashboard
              ↓
              ├── Doctors
              ├── Appointments
              ├── Prescriptions
              ├── Billing
              ├── Profile
              └── Emergency
```

---

# 🏗️ Project Architecture

The Hospital Management System is developed using a full-stack architecture.

```text
Hospital Management System
│
├── Frontend
│   └── React.js
│
├── Backend
│   └── Spring Boot
│
└── Database
    └── MySQL
```

The application uses a REST API architecture for communication between the React frontend and Spring Boot backend.

---

# 🛠️ Technology Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Axios
- React Icons

## Backend

- Java 21
- Spring Boot 3.5.4
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- Hibernate
- Maven
- REST API

## Database

- MySQL 8
- MySQL Connector/J

## Development Tools

- Visual Studio Code
- Eclipse / Spring Tool Suite
- Postman
- MySQL
- Git
- GitHub

---

# 📂 Project Structure

```text
Hospital-Management-System/
│
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   │
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/hms/
│       │   │       ├── config/
│       │   │       ├── controller/
│       │   │       ├── dto/
│       │   │       ├── entity/
│       │   │       ├── repository/
│       │   │       ├── security/
│       │   │       └── service/
│       │   │
│       │   └── resources/
│       │       └── application.properties
│       │
│       └── test/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── package-lock.json
│
├── screenshots/
│   ├── 01-Login_Page.jpeg
│   ├── 02-Create_Account.jpeg
│   ├── 03-Forgot_Password.jpeg
│   ├── 04-Update_Password.jpeg
│   ├── 05-Admin_Dashboard.jpeg
│   ├── 06-Admin_Doctors.jpeg
│   ├── 07-Admin_Patients.jpeg
│   ├── 08-Admin_Departments.jpeg
│   ├── 09-Admin_Appointments.jpeg
│   ├── 10-Admin_Medicines.jpeg
│   ├── 11-Admin_Billing.jpeg
│   ├── 12-Admin_Bill_pdf.jpeg
│   ├── 13-Admin_Reports.jpeg
│   ├── 14-Admin_Report_pdf.jpeg
│   ├── 15-Admin_Profile.jpeg
│   ├── 16-Doctor_Dashboard.jpeg
│   ├── 17-Doctor_Patients.jpeg
│   ├── 18-Doctor_Appointments.jpeg
│   ├── 19-Doctor_Prescription.jpeg
│   ├── 20-Doctor_Report.jpeg
│   ├── 21-Doctor_Report_pdf.jpeg
│   ├── 22-Doctor_Profile.jpeg
│   ├── 23-Patient_Dashboard.jpeg
│   ├── 24-Patient_Doctors.jpeg
│   ├── 25-Patient_Appointments.jpeg
│   ├── 26-Patient_Prescription.jpeg
│   ├── 27-Patient_Prescription_pdf.jpeg
│   ├── 28-Patient_Bill.jpeg
│   ├── 29-Patient_Profile.jpeg
│   └── 30-Emergency_Page.jpeg
│
├── .gitignore
└── README.md
```

---

# 🗄️ Database

The application uses MySQL to store hospital and user information.

## Main Database Entities

```text
users
patients
doctors
departments
appointments
medicines
prescriptions
bills
```

## Database Relationship

```text
User
 │
 ├── Admin
 │
 ├── Doctor
 │     │
 │     ├── Department
 │     ├── Appointments
 │     ├── Prescriptions
 │     └── Bills
 │
 └── Patient
       │
       ├── Appointments
       ├── Prescriptions
       └── Bills

Department
    │
    └── Doctors

Appointment
    │
    ├── Patient
    ├── Doctor
    └── Department

Prescription
    │
    ├── Patient
    ├── Doctor
    └── Medicines

Bill
    │
    ├── Patient
    ├── Doctor
    └── Appointment
```

---

# 🔌 Backend API

## Base URL

```text
http://localhost:8080/api
```

## 🔐 Authentication

```text
POST /auth/login
POST /auth/register/patient
```

The authentication system uses JWT tokens for securing protected APIs.

---

## 👨‍⚕️ Doctor Management

The application provides APIs for:

- Doctor creation
- Doctor listing
- Doctor details
- Doctor update
- Doctor deletion
- Doctor profile

---

## 👥 Patient Management

The application provides APIs for:

- Patient registration
- Patient listing
- Patient details
- Patient profile
- Patient information

---

## 🏢 Department Management

```text
GET    /admin/departments
POST   /admin/departments
PUT    /admin/departments/{id}
DELETE /admin/departments/{id}
```

---

## 📅 Appointment Management

The application provides APIs for:

- Book Appointment
- View Appointments
- Appointment Details
- Approve Appointment
- Reject Appointment
- Complete Appointment
- Cancel Appointment

---

## 💊 Prescription Management

The application provides APIs for:

- Create Prescription
- View Prescriptions
- View Prescription Details
- Update Prescription
- Manage Prescription Medicines

---

## 💳 Billing

The application provides APIs for:

- Create Bill
- View Bills
- View Patient Bills
- View Bill Details
- Manage Payment Status
- Manage Payment Information

---

## 📄 Reports

The application provides reporting functionality for:

- Hospital Reports
- Appointment Reports
- Billing Reports
- Doctor Reports
- Prescription Information
- Report PDFs

> API endpoints may vary depending on the controller implementation and application configuration.

---

# 🔐 JWT Authentication Flow

The application uses JWT-based authentication to secure protected APIs.

```text
User Login
    ↓
Frontend Sends Login Email + Password
    ↓
Backend Validates Credentials
    ↓
Spring Security Authentication
    ↓
JWT Token Generated
    ↓
Frontend Receives JWT Token
    ↓
Token Stored in Frontend
    ↓
Token Added to API Requests
    ↓
JWT Authentication Filter
    ↓
Token Validated
    ↓
User Role Identified
    ↓
Protected API Access
```

---

# 👥 Role-Based Access

The system provides different access levels based on user roles.

## ADMIN

```text
Dashboard
Doctors
Patients
Departments
Appointments
Medicines
Billing
Reports
Analytics
Profile
```

## DOCTOR

```text
Dashboard
Patients
Appointments
Prescriptions
Reports
Profile
```

## PATIENT

```text
Dashboard
Doctors
Appointments
Prescriptions
Billing
Profile
Emergency
```

---

# 💳 Billing Calculation

The system calculates the total bill using:

```text
Total Amount =
Consultation Fee
+ Medicine Charge
+ Test Charge
```

### Example

```text
Consultation Fee = ₹500
Medicine Charge  = ₹300
Test Charge      = ₹200

Total Amount     = ₹1,000
```

The system also tracks:

```text
Total Amount
Paid Amount
Pending Amount
Payment Status
Payment Method
Payment Date
```

A bill with an amount greater than the paid amount is considered pending.

---

# 📅 Appointment Management Flow

```text
Patient Books Appointment
          ↓
       PENDING
          ↓
    Doctor Reviews
       ↙       ↘
  APPROVED    REJECTED
      ↓
  COMPLETED
```

Patients can also cancel applicable appointments.

---

# 💊 Prescription Flow

```text
Doctor Opens Appointment
          ↓
     Patient Details
          ↓
       Diagnosis
          ↓
 General Instructions
          ↓
   Select Medicines
          ↓
 Medicine Instructions
          ↓
 Create Prescription
          ↓
 Patient Views Prescription
          ↓
 Download Prescription PDF
```

---

# ▶️ How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/maneshvedpathak307-sys/Hospital-Management-System.git
cd Hospital-Management-System
```

## 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE hospital_db;
```

Configure your MySQL username, password, and connection details in:

```text
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_db
spring.datasource.username=root
spring.datasource.password=your_password
```

Update the database port, username, and password according to your local MySQL configuration.

## 3. Run Backend

Open a terminal:

```bash
cd backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

## 4. Run Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

---

# 📸 Project Screenshots

All project screenshots are stored in the `screenshots` folder.

## 🔐 Authentication Screens

### 1. Login Page

![Hospital Login Page](./screenshots/01-Login_Page.jpeg)

### 2. Create Account

![Hospital Create Account](./screenshots/02-Create_Account.jpeg)

### 3. Forgot Password

![Hospital Forgot Password](./screenshots/03-Forgot_Password.jpeg)

### 4. Update Password

![Hospital Update Password](./screenshots/04-Update_Password.jpeg)

---

# 👨‍💼 Admin Screens

### 5. Admin Dashboard

![Hospital Admin Dashboard](./screenshots/05-Admin_Dashboard.jpeg)

### 6. Manage Doctors

![Hospital Manage Doctors](./screenshots/06-Admin_Doctors.jpeg)

### 7. Manage Patients

![Hospital Manage Patients](./screenshots/07-Admin_Patients.jpeg)

### 8. Manage Departments

![Hospital Manage Departments](./screenshots/08-Admin_Departments.jpeg)

### 9. Manage Appointments

![Hospital Manage Appointments](./screenshots/09-Admin_Appointments.jpeg)

### 10. Manage Medicines

![Hospital Manage Medicines](./screenshots/10-Admin_Medicines.jpeg)

### 11. Admin Billing

![Hospital Admin Billing](./screenshots/11-Admin_Billing.jpeg)

### 12. Admin Bill PDF

![Hospital Admin Bill PDF](./screenshots/12-Admin_Bill_pdf.jpeg)

### 13. Admin Reports

![Hospital Admin Reports](./screenshots/13-Admin_Reports.jpeg)

### 14. Admin Report PDF

![Hospital Admin Report PDF](./screenshots/14-Admin_Report_pdf.jpeg)

### 15. Admin Profile

![Hospital Admin Profile](./screenshots/15-Admin_Profile.jpeg)

---

# 👨‍⚕️ Doctor Screens

### 16. Doctor Dashboard

![Hospital Doctor Dashboard](./screenshots/16-Doctor_Dashboard.jpeg)

### 17. Doctor Patients

![Hospital Doctor Patients](./screenshots/17-Doctor_Patients.jpeg)

### 18. Doctor Appointments

![Hospital Doctor Appointments](./screenshots/18-Doctor_Appointments.jpeg)

### 19. Doctor Prescription

![Hospital Doctor Prescription](./screenshots/19-Doctor_Prescription.jpeg)

### 20. Doctor Report

![Hospital Doctor Report](./screenshots/20-Doctor_Report.jpeg)

### 21. Doctor Report PDF

![Hospital Doctor Report PDF](./screenshots/21-Doctor_Report_pdf.jpeg)

### 22. Doctor Profile

![Hospital Doctor Profile](./screenshots/22-Doctor_Profile.jpeg)

---

# 👤 Patient Screens

### 23. Patient Dashboard

![Hospital Patient Dashboard](./screenshots/23-Patient_Dashboard.jpeg)

### 24. Patient Doctors

![Hospital Patient Doctors](./screenshots/24-Patient_Doctors.jpeg)

### 25. Patient Appointments

![Hospital Patient Appointments](./screenshots/25-Patient_Appointments.jpeg)

### 26. Patient Prescription

![Hospital Patient Prescription](./screenshots/26-Patient_Prescription.jpeg)

### 27. Patient Prescription PDF

![Hospital Patient Prescription PDF](./screenshots/27-Patient_Prescription_pdf.jpeg)

### 28. Patient Billing

![Hospital Patient Billing](./screenshots/28-Patient_Bill.jpeg)

### 29. Patient Profile

![Hospital Patient Profile](./screenshots/29-Patient_Profile.jpeg)

---

# 🚨 Emergency

### 30. Emergency Page

![Hospital Emergency Page](./screenshots/30-Emergency_Page.jpeg)

---

# 🎯 Future Enhancements

- Online Payment Integration
- Email Notifications
- SMS Notifications
- Advanced Hospital Analytics
- Online Doctor Consultation
- Medical Document Upload
- Patient Medical History
- Lab Test Management
- Pharmacy Management
- Hospital Staff Management
- Advanced Appointment Scheduling
- Cloud Deployment
- Docker Support
- Production Database Configuration
- Mobile Application
- Advanced Security Improvements

---

# 👨‍💻 Author

**Manesh Vedpathak**

Full Stack Java Developer

**React.js + Spring Boot + MySQL**

---

# ⭐ Project

If you find this project useful, consider giving it a star on GitHub.