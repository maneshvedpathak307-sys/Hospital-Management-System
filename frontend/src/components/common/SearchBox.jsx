import React from "react";

function SearchBox({
    value,
    onChange,
    placeholder = "Search..."
}) {

    return (
        <div className="search-box">

            <span className="search-icon">
                🔍
            </span>

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />

        </div>
    );
}

export default SearchBox;