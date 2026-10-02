import React from "react";

function TableToolbar({
    title,
    count,
    searchValue = "",
    onSearch,
    searchPlaceholder = "Search..."
}) {

    return (
        <div className="table-toolbar">

            {/* =========================
                LEFT SIDE
            ========================= */}

            <div className="table-toolbar-info">

                <h3>
                    {title}
                </h3>

                {count !== undefined && (
                    <span>
                        {count} record
                        {count !== 1 ? "s" : ""}
                    </span>
                )}

            </div>


            {/* =========================
                SEARCH
            ========================= */}

            {onSearch && (
                <div className="search-box">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={searchValue}
                        onChange={onSearch}
                        placeholder={searchPlaceholder}
                    />

                </div>
            )}

        </div>
    );
}

export default TableToolbar;