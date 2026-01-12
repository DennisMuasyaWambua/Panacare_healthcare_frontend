"use client";
import React, { useState, useEffect } from "react";
import {
    Eye,
    MessageSquare,
    ThumbsUp,
    ArrowLeft,
    Upload,
    RefreshCw,
    EyeOff,
    Undo,
    Redo,
    ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { articlesAPI } from "../../utils/api";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-gray-50 animate-pulse rounded-lg" />
});
import 'react-quill-new/dist/quill.snow.css';

const BlogDetails = ({ id }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [article, setArticle] = useState(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [visibility, setVisibility] = useState("");
    const [summary, setSummary] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setIsLoading(true);
                const data = await articlesAPI.getArticleById(id);
                setArticle(data);
                setTitle(data.title);
                setContent(data.content);
                setCategory(data.category);
                setVisibility(data.visibility);
                setSummary(data.summary || "");

                let currentStatus = "Pending Approval";
                if (data.is_approved) currentStatus = "Approved";
                if (data.is_rejected) currentStatus = "Rejected";
                setStatus(currentStatus);
            } catch (error) {
                console.error("Error fetching article:", error);
                toast.error("Failed to load article details");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchArticle();
    }, [id]);

    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("category", category);
            formData.append("visibility", visibility);
            formData.append("summary", summary);
            if (featuredImage) {
                formData.append("featured_image", featuredImage);
            }

            // 1. Update general article data
            await articlesAPI.updateArticle(id, formData);

            // 2. Handle Status Changes if any
            let currentStatus = "Pending Approval";
            if (article.is_approved) currentStatus = "Approved";
            if (article.is_rejected) currentStatus = "Rejected";

            if (status !== currentStatus) {
                if (status === "Approved") {
                    await articlesAPI.Approvearticle(id);
                } else if (status === "Rejected") {
                    await articlesAPI.Rejectarticle(id, { rejection_reason: "Updated status by administrator" });
                }
            }

            toast.success("Changes saved successfully!");

            // Refresh data
            const updatedData = await articlesAPI.getArticleById(id);
            setArticle(updatedData);
        } catch (error: any) {
            console.error("Error updating article:", error);
            // Provide more descriptive error if available from backend
            const detail = error.response?.data?.detail || error.message;
            toast.error(detail && detail.length < 100 ? `Failed: ${detail}` : "Failed to save changes. Please check permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        router.push('/dashboard/blog-management');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="text-[#7F375E] hover:text-purple-800 transition"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <h1 className="text-2xl font-medium text-[#7F375E]">
                        Blog Details
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    className="px-10 py-2.5 bg-[#29AAE1] text-white rounded-md font-medium hover:bg-blue-500 transition shadow-sm"
                >
                    Save Changes
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Views */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-gray-50 rounded-lg">
                            <Eye className="text-gray-400" size={28} />
                        </div>
                        <div className="flex items-center text-green-500 text-xs font-bold">
                            ↑ 10%
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Article Views</h3>
                    <p className="text-3xl font-bold text-gray-800">{article?.view_count || 129}</p>
                </div>

                {/* Comments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-gray-50 rounded-lg">
                            <MessageSquare className="text-gray-400" size={28} />
                        </div>
                        <div className="flex items-center text-green-500 text-xs font-bold">
                            ↑ 10%
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Comments</h3>
                    <p className="text-3xl font-bold text-gray-800">{article?.comments?.length || 12}</p>
                </div>

                {/* Likes */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-gray-50 rounded-lg">
                            <ThumbsUp className="text-gray-400" size={28} />
                        </div>
                        <div className="flex items-center text-green-500 text-xs font-bold">
                            ↑ 10%
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Likes</h3>
                    <p className="text-3xl font-bold text-gray-800">129</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column */}
                    <div className="space-y-10">
                        <div>
                            <label className="block text-gray-900 font-medium mb-3">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Managing Blood Pressure"
                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-900 font-medium mb-3">Upload Image</label>
                            <div className="w-full h-[320px] bg-orange-50 rounded-lg mb-6 overflow-hidden relative border border-gray-100 flex items-center justify-center">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : article?.featured_image ? (
                                    <img
                                        src={article.featured_image}
                                        alt="Article"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center">
                                        <Upload size={64} strokeWidth={1.5} />
                                        <span className="mt-2 text-sm">No image available</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <input
                                    type="file"
                                    id="featured_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => document.getElementById('featured_image')?.click()}
                                    className="flex items-center px-6 py-2.5 bg-[#D5F0FD] text-[#29AAE1] rounded-md text-sm font-medium hover:bg-blue-200 transition"
                                >
                                    Upload Image <Upload className="ml-2" size={16} />
                                </button>
                                <button
                                    onClick={() => document.getElementById('featured_image')?.click()}
                                    className="flex items-center px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    Change Image <Upload className="ml-2" size={16} />
                                </button>
                                <button
                                    className="flex items-center px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    Hide Image <EyeOff className="ml-2" size={16} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-900 font-medium mb-3">Summary</label>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Enter a brief summary of the article..."
                                className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-600 h-28 resize-none"
                            />
                        </div>
                    </div>

                    {/* Right Column - Editor */}
                    <div>
                        <label className="block text-gray-900 font-medium mb-3">Article Content</label>
                        <div className="border border-gray-200 text-gray-900 rounded-lg overflow-hidden h-[450px] shadow-sm">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                placeholder="Enter Text"
                                className="h-full"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'image'],
                                        ['clean']
                                    ],
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Settings Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                    <div>
                        <label className="block text-gray-900 font-medium mb-3 text-sm">Categories</label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-400 text-sm appearance-none"
                            >
                                <option value="">Select Category</option>
                                <option value="general_health">General Health</option>
                                <option value="nutrition">Nutrition</option>
                                <option value="fitness">Fitness</option>
                                <option value="mental_health">Mental Health</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-900 font-medium mb-3 text-sm">Who can view this article?</label>
                        <div className="relative">
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-400 text-sm appearance-none"
                            >
                                <option value="public">All Users</option>
                                <option value="subscribers">Subscribers Only</option>
                                <option value="private">Only Author and Admin</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-900 font-medium mb-3 text-sm">Enable Comments?</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-400 text-sm appearance-none"
                            >
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-900 font-medium mb-3 text-sm">Status <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-400 text-sm appearance-none"
                            >
                                <option value="Pending Approval">Pending Aproval</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-16">
                    <h3 className="text-lg font-medium text-gray-900 mb-6 font-sans">Comments</h3>
                    <div className="border-t border-gray-100 pt-8">
                        {article?.comments?.length > 0 ? (
                            <div className="space-y-6">
                                {article.comments.map((comment, index) => (
                                    <div key={index} className="p-4 bg-white rounded-lg border border-gray-50 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-[#7F375E] text-sm">{comment.user_name || "User"}</span>
                                            <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 font-normal">No Comments Yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
