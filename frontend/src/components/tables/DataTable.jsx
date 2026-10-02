import React from "react";

function DataTable({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No records found",
    getRowKey = (row) => row.id
}) {

    return (
        <div className="table-wrapper">

            <table className="data-table">

                {/* =========================
                    TABLE HEADER
                ========================= */}

                <thead>
                    <tr>

                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}

                    </tr>
                </thead>


                {/* =========================
                    TABLE BODY
                ========================= */}

                <tbody>

                    {loading ? (

                        <tr>

                            <td
                                colSpan={columns.length}
                                className="table-message"
                            >
                                <div className="table-loading">
                                    <div className="loading-spinner"></div>
                                    <span>
                                        Loading...
                                    </span>
                                </div>
                            </td>

                        </tr>

                    ) : data.length === 0 ? (

                        <tr>

                            <td
                                colSpan={columns.length}
                                className="table-message"
                            >
                                {emptyMessage}
                            </td>

                        </tr>

                    ) : (

                        data.map((row, index) => (

                            <tr
                                key={
                                    getRowKey(row) ??
                                    index
                                }
                            >

                                {columns.map((column) => (

                                    <td
                                        key={column.key}
                                    >
                                        {column.render
                                            ? column.render(
                                                row,
                                                index
                                            )
                                            : row[column.key] ?? "-"
                                        }
                                    </td>

                                ))}

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default DataTable;