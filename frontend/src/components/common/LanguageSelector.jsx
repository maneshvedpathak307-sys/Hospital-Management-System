import React, {
    useState,
    useEffect,
    useRef
} from "react";

import {
    useTranslation
} from "react-i18next";

import {
    Globe,
    ChevronDown
} from "lucide-react";


function LanguageSelector() {

    const {
        i18n
    } = useTranslation();


    const [open, setOpen] =
        useState(false);


    const dropdownRef =
        useRef(null);


    /* =========================================
       AVAILABLE LANGUAGES
    ========================================= */

    const languages = [

        {
            code: "en",
            label: "English"
        },

        {
            code: "hi",
            label: "हिंदी"
        },

        {
            code: "mr",
            label: "मराठी"
        }

    ];


    /* =========================================
       CURRENT LANGUAGE
    ========================================= */

    const currentLanguage =
        languages.find(
            (language) =>
                language.code ===
                i18n.language
        ) || languages[0];


    /* =========================================
       CHANGE LANGUAGE
    ========================================= */

    const handleLanguageChange = (
        languageCode
    ) => {

        i18n.changeLanguage(
            languageCode
        );


        localStorage.setItem(
            "hms-language",
            languageCode
        );


        setOpen(false);

    };


    /* =========================================
       CLOSE WHEN CLICKING OUTSIDE
    ========================================= */

    useEffect(() => {

        const handleClickOutside = (
            event
        ) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {

                setOpen(false);

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
       CLOSE WITH ESCAPE
    ========================================= */

    useEffect(() => {

        const handleEscape = (
            event
        ) => {

            if (
                event.key === "Escape"
            ) {

                setOpen(false);

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
       RETURN
    ========================================= */

    return (

        <div
            className="language-selector"
            ref={dropdownRef}
        >


            {/* =================================
                SELECTOR BUTTON
            ================================= */}

            <button
                type="button"
                className="language-selector-button"
                onClick={() =>
                    setOpen(
                        previous =>
                            !previous
                    )
                }
                aria-expanded={open}
                aria-haspopup="menu"
            >

                <Globe
                    size={18}
                />


                <span>
                    {currentLanguage.label}
                </span>


                <ChevronDown
                    size={16}
                    className={
                        open
                            ? "language-chevron language-chevron-open"
                            : "language-chevron"
                    }
                />

            </button>


            {/* =================================
                DROPDOWN
            ================================= */}

            {open && (

                <div
                    className="language-dropdown"
                    role="menu"
                >

                    {languages.map(
                        (language) => (

                            <button
                                key={
                                    language.code
                                }
                                type="button"
                                className={
                                    currentLanguage.code ===
                                    language.code
                                        ? "language-option language-option-active"
                                        : "language-option"
                                }
                                onClick={() =>
                                    handleLanguageChange(
                                        language.code
                                    )
                                }
                                role="menuitem"
                            >

                                <span>
                                    {
                                        language.label
                                    }
                                </span>


                                {currentLanguage.code ===
                                    language.code && (

                                    <span className="language-check">
                                        ✓
                                    </span>

                                )}

                            </button>

                        )
                    )}

                </div>

            )}

        </div>

    );
}


export default LanguageSelector;