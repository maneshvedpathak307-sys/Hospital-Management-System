import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

function AdminLayout() {

    return (

        <div className="app-layout">

            <Sidebar role="ADMIN" />

            <div className="main-area">

                <Navbar role="ADMIN" />

                <main className="page-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default AdminLayout;