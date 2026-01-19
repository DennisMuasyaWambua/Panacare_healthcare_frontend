"use client";
import React from "react";
import DataTable from "react-data-table-component";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomTableProps {
  columns: any[];
  data: any[];
  isLoading?: boolean;
  error?: string | null;

  paginationServer?: boolean;
  paginationTotalRows?: number;
  paginationPerPage?: number;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (newPageSize: number, page: number) => void;
  customStyles?: any;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  data,
  isLoading = false,
  error = null,
  paginationServer = false,
  paginationTotalRows = 0,
  paginationPerPage = 10,
  onChangePage,
  onChangeRowsPerPage,
  customStyles = {},
}) => {
  const CustomPagination = ({ rowsPerPage, rowCount, onChangePage, currentPage }) => {
    const totalPages = Math.ceil(rowCount / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, rowCount);

    const handlePrevious = () => {
      if (currentPage > 1) onChangePage(currentPage - 1);
    };

    const handleNext = () => {
      if (currentPage < totalPages) onChangePage(currentPage + 1);
    };

    // Simple page numbers logic
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return (
      <div className="px-6 py-5 flex items-center justify-between border-t border-gray-100 bg-white">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{rowCount > 0 ? start : 0}</span> to <span className="font-medium">{end}</span> of <span className="font-medium">{rowCount}</span> Results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          {pages.map((page, index) => (
            page === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onChangePage(page as number)}
                className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition ${currentPage === page
                    ? "bg-[#7F375E] text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            )
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    );
  };
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
        paginationPerPage={paginationPerPage}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationComponent={CustomPagination}
        customStyles={{
          table: {
            style: {
              backgroundColor: "transparent",
            },
          },
          headCells: {
            style: {
              fontWeight: "bold",
              color: "#29AAE1",
              fontSize: "12px",
              textTransform: "uppercase",
              padding: "22px 8px",
              ...customStyles?.headCells?.style,
            },
          },
          ...customStyles,
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
