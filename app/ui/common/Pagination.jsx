import React from "react";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    indexOfFirstItem,
    indexOfLastItem
}) => {
    if (totalItems === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-500">
                Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, totalItems)}</span> of <span className="font-semibold">{totalItems}</span> Results
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                        pageNum = currentPage - 3 + i;
                    }
                    // Adjust if pageNum exceeds totalPages due to shifting logic near the end
                    if (pageNum > totalPages) {
                        pageNum = totalPages - (4 - i); // fallback to keep showing 5 items if possible, or just don't render invalid ones? 
                        // actually the original logic was a bit simpler:
                        // if (pageNum > totalPages) return null; 
                        // preventing rendering if > totalPages
                    }
                    if (pageNum <= 0) return null; // sanity check 
                    if (pageNum > totalPages) return null;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${currentPage === pageNum
                                ? "bg-[#7F375E] text-white"
                                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                }).filter(Boolean)}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
