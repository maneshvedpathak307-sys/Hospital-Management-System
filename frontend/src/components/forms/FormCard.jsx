import React from "react";

function FormCard({
    title,
    subtitle,
    icon,
    children,
    onSubmit
}) {

    return (
        <div className="form-card">

            {/* =========================
                FORM HEADER
            ========================= */}

            {(title || subtitle || icon) && (

                <div className="form-card-header">

                    {icon && (
                        <div className="form-card-icon">
                            {icon}
                        </div>
                    )}

                    <div>

                        {title && (
                            <h3>
                                {title}
                            </h3>
                        )}

                        {subtitle && (
                            <p>
                                {subtitle}
                            </p>
                        )}

                    </div>

                </div>

            )}


            {/* =========================
                FORM CONTENT
            ========================= */}

            <form onSubmit={onSubmit}>

                <div className="form-card-body">

                    {children}

                </div>

            </form>

        </div>
    );
}

export default FormCard;