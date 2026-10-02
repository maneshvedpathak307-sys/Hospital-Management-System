import React from "react";

function Loading({ message = "Loading..." }) {

    return (
        <div className="loading-page">

            <div className="loading-spinner"></div>

            <p>
                {message}
            </p>

        </div>
    );
}

export default Loading;