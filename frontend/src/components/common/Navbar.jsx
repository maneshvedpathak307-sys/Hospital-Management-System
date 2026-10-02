import React, {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    UserRound,
    LogOut,
    ChevronDown
} from "lucide-react";

import {
    useAuth
} from "../../context/AuthContext";

import ProfileService from "../../services/ProfileService";

import "../../styles/navbar.css";


function Navbar({ role = "ADMIN" }) {

    const navigate = useNavigate();

    const {
        logout,
        user
    } = useAuth();


    /* =========================================
       PROFILE
    ========================================= */

    const [profile, setProfile] =
        useState(null);


    /* =========================================
       DROPDOWN
    ========================================= */

    const [dropdownOpen, setDropdownOpen] =
        useState(false);


    /* =========================================
       DROPDOWN REF
    ========================================= */

    const dropdownRef =
        useRef(null);


    /* =========================================
       DATE & TIME
    ========================================= */

    const [currentDateTime, setCurrentDateTime] =
        useState(new Date());


    /* =========================================
       UPDATE DATE & TIME EVERY SECOND
    ========================================= */

    useEffect(() => {

        const timer =
            setInterval(() => {

                setCurrentDateTime(
                    new Date()
                );

            }, 1000);


        return () => {

            clearInterval(timer);

        };

    }, []);


    /* =========================================
       LOAD PROFILE
    ========================================= */

    useEffect(() => {

        const loadProfile = async () => {

            try {

                let response = null;


                /* =================================
                   ADMIN
                ================================= */

                if (role === "ADMIN") {

                    response =
                        await ProfileService
                            .getAdminProfile();

                }


                /* =================================
                   DOCTOR
                ================================= */

                else if (role === "DOCTOR") {

                    response =
                        await ProfileService
                            .getDoctorProfile();

                }


                /* =================================
                   PATIENT
                ================================= */

                else if (role === "PATIENT") {

                    response =
                        await ProfileService
                            .getPatientProfile();

                }


                /*
                 * Handle both:
                 *
                 * response.data
                 *
                 * and
                 *
                 * response
                 */

                const profileData =
                    response?.data ??
                    response;


                if (profileData) {

                    setProfile(
                        profileData
                    );

                }

            } catch (error) {

                console.error(
                    "Navbar profile loading error:",
                    error
                );

                setProfile(null);

            }

        };


        if (user) {

            loadProfile();

        }

    }, [role, user]);


    /* =========================================
       CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    ========================================= */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {

                setDropdownOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    /* =========================================
       CLOSE DROPDOWN WITH ESCAPE
    ========================================= */

    useEffect(() => {

        const handleEscape = (event) => {

            if (
                event.key === "Escape"
            ) {

                setDropdownOpen(false);

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    /* =========================================
       DATE / TIME LOCALE
    ========================================= */

    const locale = "en-IN";


    /* =========================================
       FORMAT DAY
    ========================================= */

    const day =
        currentDateTime.toLocaleDateString(
            locale,
            {
                weekday: "long"
            }
        );


    /* =========================================
       FORMAT DATE
    ========================================= */

    const date =
        currentDateTime.toLocaleDateString(
            locale,
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    /* =========================================
       FORMAT TIME
    ========================================= */

    const time =
        currentDateTime.toLocaleTimeString(
            locale,
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );


    /* =========================================
       ROLE NAMES
    ========================================= */

    const roleNames = {

        ADMIN: "Administrator",

        DOCTOR: "Doctor",

        PATIENT: "Patient"

    };


    const roleName =
        roleNames[role] ||
        "Patient";


    /* =========================================
       DISPLAY NAME
    ========================================= */

    const getDisplayName = () => {


        /* =====================================
           DOCTOR
        ===================================== */

        if (role === "DOCTOR") {

            const doctorName =
                profile?.doctorName ||
                profile?.name ||
                profile?.fullName;


            if (!doctorName) {

                return roleName;

            }


            /*
             * Remove existing Dr. prefix.
             *
             * Example:
             *
             * Dr. Priya Sharma
             *
             * becomes:
             *
             * Priya Sharma
             */

            const cleanName =
                String(doctorName)
                    .replace(
                        /^dr\.?\s+/i,
                        ""
                    )
                    .trim();


            return `Dr. ${cleanName}`;

        }


        /* =====================================
           PATIENT
        ===================================== */

        if (role === "PATIENT") {

            const patientName =
                profile?.patientName ||
                profile?.name ||
                profile?.fullName;


            if (!patientName) {

                return roleName;

            }


            /*
             * Remove existing English title.
             */

            const cleanName =
                String(patientName)
                    .replace(
                        /^(mr\.?|mrs\.?|ms\.?)\s+/i,
                        ""
                    )
                    .trim();


            /* =================================
               FEMALE
            ================================= */

            if (
                String(
                    profile?.gender || ""
                ).toUpperCase() === "FEMALE"
            ) {

                return `Mrs. ${cleanName}`;

            }


            /* =================================
               MALE
            ================================= */

            if (
                String(
                    profile?.gender || ""
                ).toUpperCase() === "MALE"
            ) {

                return `Mr. ${cleanName}`;

            }


            return cleanName;

        }


        /* =====================================
           ADMIN
        ===================================== */

        if (role === "ADMIN") {

            const adminName =
                profile?.name ||
                profile?.fullName;


            if (adminName) {

                return adminName;

            }


            return roleName;

        }


        return roleName;

    };


    const displayName =
        getDisplayName();


    /* =========================================
       USER ICON
    ========================================= */

    const userIcon =

        role === "ADMIN"

            ? "👨‍💼"

            : role === "DOCTOR"

                ? "👨‍⚕️"

                : "🙍‍♂️";


    /* =========================================
       PROFILE ROUTE
    ========================================= */

    const getProfileRoute = () => {

        if (role === "ADMIN") {

            return "/admin/profile";

        }


        if (role === "DOCTOR") {

            return "/doctor/profile";

        }


        if (role === "PATIENT") {

            return "/patient/profile";

        }


        return "/";

    };


    /* =========================================
       OPEN PROFILE
    ========================================= */

    const handleProfile = () => {

        setDropdownOpen(false);

        navigate(
            getProfileRoute()
        );

    };


    /* =========================================
       LOGOUT
    ========================================= */

    const handleLogout = () => {

        setDropdownOpen(false);

        logout();

        navigate(
            "/",
            {
                replace: true
            }
        );

    };


    /* =========================================
       EMERGENCY
    ========================================= */

    const handleEmergency = () => {

        if (role === "ADMIN") {

            navigate(
                "/admin/emergency"
            );

            return;

        }


        if (role === "DOCTOR") {

            navigate(
                "/doctor/emergency"
            );

            return;

        }


        if (role === "PATIENT") {

            navigate(
                "/patient/emergency"
            );

            return;

        }

    };


    /* =========================================
       NAVBAR
    ========================================= */

    return (

        <header className="navbar">


            {/* =================================
                LEFT
            ================================= */}

            <div className="navbar-left">


                {/* MOBILE MENU */}

                <button
                    className="mobile-menu-button"
                    type="button"
                >

                    ☰

                </button>


                {/* DATE & TIME */}

                <div className="navbar-datetime">


                    <div className="navbar-date">

                        <strong>
                            {day}
                        </strong>

                        <span>
                            {date}
                        </span>

                    </div>


                    <div className="navbar-time">

                        🕒 {time}

                    </div>

                </div>

            </div>


            {/* =================================
                RIGHT
            ================================= */}

            <div className="navbar-right">


                {/* EMERGENCY */}

                <button
                    type="button"
                    className="emergency-navbar-button"
                    title="Emergency"
                    onClick={
                        handleEmergency
                    }
                >

                    🚨

                </button>


                {/* PROFILE */}

                <div
                    className="navbar-profile-wrapper"
                    ref={dropdownRef}
                >


                    {/* PROFILE BUTTON */}

                    <button
                        type="button"
                        className="navbar-profile-trigger"
                        onClick={() =>
                            setDropdownOpen(
                                previous =>
                                    !previous
                            )
                        }
                        aria-expanded={
                            dropdownOpen
                        }
                        aria-haspopup="menu"
                    >


                        <div className="navbar-avatar">

                            {userIcon}

                        </div>


                        <div className="navbar-profile-name">

                            <strong>
                                {displayName}
                            </strong>

                        </div>


                        <ChevronDown
                            className={
                                dropdownOpen
                                    ? "navbar-chevron navbar-chevron-open"
                                    : "navbar-chevron"
                            }
                            size={17}
                        />

                    </button>


                    {/* DROPDOWN */}

                    {dropdownOpen && (

                        <div
                            className="navbar-dropdown"
                            role="menu"
                        >


                            {/* MY PROFILE */}

                            <button
                                type="button"
                                className="navbar-dropdown-item"
                                onClick={
                                    handleProfile
                                }
                                role="menuitem"
                            >

                                <UserRound
                                    size={19}
                                />

                                <span>

                                    My Profile

                                </span>

                            </button>


                            {/* DIVIDER */}

                            <div
                                className="navbar-dropdown-divider"
                            />


                            {/* LOGOUT */}

                            <button
                                type="button"
                                className="navbar-dropdown-item navbar-dropdown-logout"
                                onClick={
                                    handleLogout
                                }
                                role="menuitem"
                            >

                                <LogOut
                                    size={19}
                                />

                                <span>

                                    Logout

                                </span>

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );

}


export default Navbar;