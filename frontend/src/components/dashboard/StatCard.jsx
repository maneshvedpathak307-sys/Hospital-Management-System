import React from "react";

function StatCard({
    icon,
    title,
    value = 0,
    description = ""
}) {

    return (
        <div className="stat-card">

            <div className="stat-icon">
                {icon}
            </div>

            <div className="stat-content">

                <span className="stat-title">
                    {title}
                </span>

                <h2 className="stat-value">
                    {value}
                </h2>

                {description && (
                    <small className="stat-description">
                        {description}
                    </small>
                )}

            </div>

        </div>
    );
}

export default StatCard;