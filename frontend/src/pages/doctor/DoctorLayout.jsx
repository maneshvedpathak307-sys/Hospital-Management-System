import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

function DoctorLayout() {

    return (

        <div className="app-layout">

            <Sidebar role="DOCTOR" />

            <div className="main-area">

                <Navbar role="DOCTOR" />

                <main className="page-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default DoctorLayout;