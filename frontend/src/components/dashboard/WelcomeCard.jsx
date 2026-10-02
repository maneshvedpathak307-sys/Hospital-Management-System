import React from "react";

function WelcomeCard({
    name = "User",
    role = "",
    message = "Manage your hospital activities from one powerful dashboard."
}) {

    return (
        <div className="welcome-card">

            <div className="welcome-content">

                <span className="welcome-small">
                    Welcome back 👋
                </span>

                <h1>
                    {name}
                </h1>

                {role && (
                    <span className="welcome-role">
                        {role}
                    </span>
                )}

                <p>
                    {message}
                </p>

            </div>

            <div className="welcome-icon">
                🏥
            </div>

        </div>
    );
}

export default WelcomeCard;