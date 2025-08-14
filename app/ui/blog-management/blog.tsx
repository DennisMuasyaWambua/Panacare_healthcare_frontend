"use client";
import React, { useState, useEffect } from "react";
import { Search, X, AlertCircle, Download, Eye, MoreVertical } from "lucide-react";
import { articlesAPI } from "../../utils/api";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [articles, setArticles] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalArticle, setModalArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await articlesAPI.getAllArticles();
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles");
        toast.error("Failed to load articles list");
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleCategoryFilter = (e) => setCategoryFilter(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);

  const handleApprove = (article) => {
    toast.success(`Approved: ${article.title}`);
  };

  const handleReject = (article) => {
    toast.error(`Rejected: ${article.title}`);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const openModal = (article) => setModalArticle(article);
  const closeModal = () => setModalArticle(null);

  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      // Assume API exists for articles export
      const response = await articlesAPI.exportArticlesToCsv();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `articles_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Articles data exported successfully");
    } catch (error) {
      console.error("Error exporting articles data:", error);
      toast.error("Failed to export articles data");
    } finally {
      setIsExporting(false);
    }
  };

  const filteredArticles = (Array.isArray(articles) ? articles : []).filter(
    (article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" ||
        article.category_display === categoryFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && article.is_published) ||
        (statusFilter === "Draft" && !article.is_published);
      return matchesSearch && matchesCategory && matchesStatus;
    }
  );

  const columns = [
    {
      name: "",
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.id)}
          onChange={() => handleRowSelect(row.id)}
          className="w-4 h-4 rounded-lg border-gray-300"
        />
      ),
      width: "60px",
      ignoreRowClick: true,
    },
    {
      name: "Article Title",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <div className="ml-2 text-sm font-medium text-gray-900">
            {row.title}
          </div>
        </div>
      ),
    },
    {
      name: "Author",
      selector: (row) => row.author_name || "Unknown",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category_display || "Not specified",
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.is_published
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {row.is_published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      name: "Views",
      selector: (row) => row.view_count || 0,
      sortable: true,
    },
    {
      name: "Created",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString() || "Not specified",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="relative">
          <button
            onClick={() =>
              setOpenDropdownId(openDropdownId === row.id ? null : row.id)
            }
            className="p-1"
          >
            <MoreVertical size={18} />
          </button>

          {openDropdownId === row.id && (
            <div
              className="absolute right-0 mt-1 bg-white border border-purple-400 rounded shadow z-50"
              style={{
                borderStyle: "dashed",
                minWidth: "120px",
              }}
            >
              {["View", "Approve", "Reject"].map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (action === "View") openModal(row);
                    if (action === "Approve") handleApprove(row);
                    if (action === "Reject") handleReject(row);
                    setOpenDropdownId(null);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-purple-50"
                  style={{
                    borderBottom: i < 2 ? "1px dashed #A855F7" : "none",
                    color: "#4B0082",
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  let contentToRender;
  if (isLoading) {
    contentToRender = (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading articles...</p>
      </div>
    );
  } else if (error) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );
  } else if (filteredArticles.length === 0) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No articles found matching your filters
      </div>
    );
  } else {
    contentToRender = (
      <CustomTable
        columns={columns}
        data={filteredArticles}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-2xl font-bold text-[#7F375E] mb-6">
        Blog Management
      </h1>

      {/* Filters + Export */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-black mb-2">
            Search by Title
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Enter title..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-black mb-2">
            Filter by Category
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="All">All</option>
            <option value="General Health">General Health</option>
            <option value="Wellness">Wellness</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-black mb-2">
            Filter by Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={exportToCsv}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#29AAE1] text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            disabled={isExporting}
          >
            <Download className="mr-2" size={18} />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {contentToRender}
      </div>

      {modalArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#7F375E]">
                {modalArticle.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <p className="mb-4 text-gray-500">{modalArticle.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Author</p>
                <p className="font-semibold">{modalArticle.author_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-semibold">
                  {modalArticle.category_display || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Tags</p>
                <p className="font-semibold">
                  {modalArticle.tags || "None"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Published</p>
                <p className="font-semibold">
                  {modalArticle.is_published
                    ? new Date(modalArticle.publish_date).toLocaleDateString()
                    : "Draft"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Views</p>
                <p className="font-semibold">{modalArticle.view_count}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
