import React from "react";

function FormActions({
    onCancel,
    submitText = "Save",
    cancelText = "Cancel",
    loading = false,
    loadingText = "Saving..."
}) {

    return (
        <div className="form-actions">

            {onCancel && (
                <button
                    type="button"
                    className="cancel-button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    {cancelText}
                </button>
            )}

            <button
                type="submit"
                className="primary-button"
                disabled={loading}
            >
                {loading ? loadingText : submitText}
            </button>

        </div>
    );
}

export default FormActions;