"use client";
import React from "react";
import DataTable from "react-data-table-component";

interface CustomTableProps {
  columns: any[];
  data: any[];
  isLoading?: boolean;
  error?: string | null;

  paginationServer?: boolean;
  paginationTotalRows?: number;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (newPageSize: number, page: number) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  isLoading = false,
  error = null,
  paginationServer = false,
  paginationTotalRows = 0,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  let content;

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex justify-center items-center p-8 text-red-500">
        {error}
      </div>
    );
  } else if (!data || data.length === 0) {
    content = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No records found
      </div>
    );
  } else {
    content = (
      <DataTable
        columns={columns}
        data={data}
        highlightOnHover
        pointerOnHover
        dense
        pagination
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        customStyles={{
          headCells: {
            style: {
              fontWeight: "bold",
              color: "#29AAE1",
              fontSize: "12px",
              textTransform: "uppercase",
              padding: "22px 8px",
            },
          },
        }}
      />
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {content}
    </div>
  );
};

export default CustomTable;
