import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ role = "ADMIN" }) {

    return (

        <div className="app-layout">

            {/* =================================
                SIDEBAR
            ================================= */}

            <Sidebar role={role} />


            {/* =================================
                MAIN AREA
            ================================= */}

            <div className="main-area">

                <Navbar role={role} />

                <main className="page-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default Layout;