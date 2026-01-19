"use client";
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, CheckCircle, XCircle, Trash2, Layout, FileX, FileText, UserPlus, Plus, AlertCircle, MoreVertical, Monitor, ChevronLeft, ChevronRight } from "lucide-react";
import { articlesAPI } from "../../utils/api";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable";
import { useRouter } from "next/navigation";

const Blog = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingpdf, setIsExportingpdf] = useState(false);
  const [activeActionRow, setActiveActionRow] = useState(null);

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

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleCategoryFilter = (e) => setCategoryFilter(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);

  const handleApprove = async (article) => {
    try {
      const response = await articlesAPI.Approvearticle(article.id);
      if (response?.error) {
        toast.error(`Error: ${response.error}`);
        return;
      }
      fetchArticles();
      toast.success("Approved Successfully");
    } catch (error: any) {
      console.error("Approval error:", error);
      toast.error(error?.message || "Failed to approve article");
    }
  };

  const handleReject = async (article: any) => {
    const reason = prompt(`Enter rejection reason for "${article.title}":`);
    if (!reason) return;

    try {
      const response = await articlesAPI.Rejectarticle(article.id, { rejection_reason: reason });
      if (response?.error) {
        toast.error(`Error: ${response.error}`);
        return;
      }
      fetchArticles();
      toast.success("Rejected Successfully");
    } catch (error: any) {
      console.error("Rejection error:", error);
      toast.error(error?.message || "Failed to reject article");
    }
  };

  const handlePublish = async (article: any) => {
    try {
      await articlesAPI.Publisharticle(article.id);
      fetchArticles();
      toast.success("Published Successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to publish article");
    }
  };

  const handleUnpublish = async (article: any) => {
    try {
      await articlesAPI.Unpublisharticle(article.id);
      fetchArticles();
      toast.success("Unpublished Successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to unpublish article");
    }
  };

  const handleDelete = async (article: any) => {
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      try {
        await articlesAPI.deleteArticle(article.id);
        setArticles(prev => prev.filter((a: any) => a.id !== article.id));
        toast.success("Article deleted successfully");
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete article");
      }
    }
  };

  const handleView = (article) => {
    router.push(`/dashboard/blog-management/${article.id}`);
  };

  const exportToCsv = async () => {
    try {
      setIsExporting(true);
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

  const exportToPdf = async () => {
    try {
      setIsExportingpdf(true);
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
      setIsExportingpdf(false);
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

  // Stats Calculations
  const publishedCount = articles.filter((a: any) => a.is_published).length;
  const rejectedCount = articles.filter((a: any) => a.is_rejected).length;
  const pendingCount = articles.filter((a: any) => !a.is_approved && !a.is_rejected).length;
  const totalViews = articles.reduce((acc: number, a: any) => acc + (a.view_count || 0), 0);

  const columns = [
    {
      name: "Article Title",
      sortable: true,
      cell: (row) => (
        <div className="font-medium text-gray-900">
          {row.title}
        </div>
      ),
      width: "18%",
    },
    {
      name: "Author",
      selector: (row) => row.author_name || "Unknown",
      sortable: true,
      width: "12%",
    },
    {
      name: "Category",
      selector: (row) => row.category_display || "Not specified",
      sortable: true,
      width: "10%",
    },
    {
      name: "Access",
      cell: () => "Premium",
      sortable: false,
      width: "9%",
    },
    {
      name: "Status",
      sortable: true,
      width: "9%",
      cell: (row) => (
        <span className="font-medium text-gray-800">
          {row.is_approved ? "Approved" : "Pending"}
        </span>
      ),
    },
    {
      name: "Created",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) || "Not specified",
      sortable: true,
      width: "10%",
    },
    {
      name: "Actions",
      width: "30%",
      sortable: false,
      cell: (row) => (
        <>
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => handleView(row)} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs font-medium">
              <Eye size={16} /> View
            </button>
            {!row.is_approved && (
              <button onClick={() => handleApprove(row)} className="flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium">
                <CheckCircle size={16} className="text-green-500" /> Approve
              </button>
            )}
            {!row.is_approved && !row.is_rejected && (
              <button onClick={() => handleReject(row)} className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium">
                <XCircle size={16} className="text-red-500" /> Reject
              </button>
            )}
            <button onClick={() => handleDelete(row)} className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-medium">
              <Trash2 size={16} className="text-red-400" /> Delete
            </button>
          </div>

          {/* Mobile/Tablet View */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setActiveActionRow(activeActionRow === row.id ? null : row.id)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical size={20} className="text-gray-500" />
            </button>

            {activeActionRow === row.id && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border border-gray-100 py-1">
                <button
                  onClick={() => { handleView(row); setActiveActionRow(null); }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye size={14} className="mr-2" /> View
                </button>
                {!row.is_approved && (
                  <button
                    onClick={() => { handleApprove(row); setActiveActionRow(null); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-50"
                  >
                    <CheckCircle size={14} className="mr-2" /> Approve
                  </button>
                )}
                {!row.is_approved && !row.is_rejected && (
                  <button
                    onClick={() => { handleReject(row); setActiveActionRow(null); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <XCircle size={14} className="mr-2" /> Reject
                  </button>
                )}
                <button
                  onClick={() => { handleDelete(row); setActiveActionRow(null); }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                >
                  <Trash2 size={14} className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        color: "#6B7280", // Gray-500
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "none",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    cells: {
      style: {
        fontSize: "13px",
        color: "#111827", // Gray-900
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "16px",
        paddingBottom: "16px",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        borderBottom: "1px solid #F3F4F6",
      }
    }
  };

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
        customStyles={customStyles}
      />
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-2xl font-medium text-[#7F375E] mb-8">
        Blog Management
      </h1>

      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-wrap">
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Name"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none text-sm text-gray-700 w-full md:w-48"
          >
            <option value="All">Filter by Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <select
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none text-sm text-gray-700 w-full md:w-48"
          >
            <option value="All">Filter by Category</option>
            <option value="General Health">General Health</option>
            <option value="Nutrition">Nutrition</option>
            <option value="Fitness">Fitness</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Children's Health">Children's Health</option>
            <option value="Chronic Conditions">Chronic Conditions</option>
            <option value="Preventive Care">Preventive Care</option>
            <option value="Medical Research">Medical Research</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-start lg:justify-end flex-wrap">
          <button
            onClick={exportToPdf}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition whitespace-nowrap"
            disabled={isExportingpdf}
          >
            Export PDF <Download className="ml-2" size={16} />
          </button>
          <button
            onClick={exportToCsv}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition whitespace-nowrap"
            disabled={isExporting}
          >
            Export CSV <Download className="ml-2" size={16} />
          </button>
          <button
            onClick={() => router.push('/dashboard/blog-management/new')}
            className="flex items-center px-6 py-2.5 bg-[#29AAE1] text-white rounded-md text-sm font-medium hover:bg-blue-500 transition whitespace-nowrap"
          >
            Add Blog +
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <Layout className="text-gray-600" size={24} />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center">
              <Plus size={12} className="mr-0.5" /> 10%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Published Articles</p>
          <p className="text-3xl font-bold text-gray-800">{publishedCount || 129}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <FileText className="text-gray-600" size={24} />
            </div>
            <span className="text-green-500 text-xs font-bold flex items-center">
              <Plus size={12} className="mr-0.5" /> 65%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Rejected Articles</p>
          <p className="text-3xl font-bold text-gray-800">{rejectedCount || 16}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <Monitor className="text-gray-600" size={24} />
            </div>
            <span className="text-red-500 text-xs font-bold flex items-center font-bold">
              ↓ 15%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Pending Reviews</p>
          <p className="text-3xl font-bold text-gray-800">{pendingCount || 20}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <UserPlus className="text-[#29AAE1]" size={24} />
            </div>
            <span className="text-red-500 text-xs font-bold flex items-center font-bold">
              ↓ 15%
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Over 100 Likes</p>
          <p className="text-3xl font-bold text-gray-800">{totalViews || 100}</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 p-2">
        {contentToRender}
      </div>
    </div>
  );
};

export default Blog;
