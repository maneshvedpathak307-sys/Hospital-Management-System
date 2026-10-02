import React from "react";

function PageHeader({
    title,
    description,
    action = null
}) {

    return (
        <div className="page-header">

            <div className="page-header-content">

                <h2>
                    {title}
                </h2>

                {description && (
                    <p>
                        {description}
                    </p>
                )}

            </div>

            {action && (
                <div className="page-header-action">
                    {action}
                </div>
            )}

        </div>
    );
}

export default PageHeader;