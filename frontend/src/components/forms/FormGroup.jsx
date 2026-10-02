import React from "react";

function FormGroup({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false,
    children,
    fullWidth = false,
    disabled = false
}) {

    return (
        <div
            className={`form-group ${
                fullWidth ? "full-width" : ""
            }`}
        >

            <label htmlFor={name}>
                {label}

                {required && (
                    <span>*</span>
                )}
            </label>


            {children ? (

                children

            ) : (

                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                />

            )}

        </div>
    );
}

export default FormGroup;