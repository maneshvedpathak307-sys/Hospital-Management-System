import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

function PatientLayout() {

    return (

        <div className="app-layout">

            <Sidebar role="PATIENT" />

            <div className="main-area">

                <Navbar role="PATIENT" />

                <main className="page-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default PatientLayout;