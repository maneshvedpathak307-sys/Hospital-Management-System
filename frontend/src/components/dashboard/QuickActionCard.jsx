import React from "react";
import { Link } from "react-router-dom";

function QuickActionCard({
    icon,
    title,
    description,
    to,
    disabled = false
}) {

    if (disabled) {
        return (
            <div className="quick-card quick-card-disabled">

                <div className="quick-icon">
                    {icon}
                </div>

                <h3>
                    {title}
                </h3>

                <p>
                    {description}
                </p>

            </div>
        );
    }

    return (
        <Link
            to={to}
            className="quick-card"
        >

            <div className="quick-icon">
                {icon}
            </div>

            <h3>
                {title}
            </h3>

            <p>
                {description}
            </p>

        </Link>
    );
}

export default QuickActionCard;