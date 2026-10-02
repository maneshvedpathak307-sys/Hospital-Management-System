import React from "react";

function EmptyState({
    icon = "📋",
    title = "No data found",
    message = "There is no information available at the moment.",
    action = null
}) {

    return (
        <div className="empty-state">

            <div className="empty-icon">
                {icon}
            </div>

            <h3>
                {title}
            </h3>

            <p>
                {message}
            </p>

            {action && (
                <div className="empty-action">
                    {action}
                </div>
            )}

        </div>
    );
}

export default EmptyState;