"use client";
import React, { useState } from "react";
import {
    ArrowLeft,
    Upload,
    RefreshCw,
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

const CreateBlog = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("general");
    const [visibility, setVisibility] = useState("public");
    const [summary, setSummary] = useState("");

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

    const handleCreate = async () => {
        if (!title || !content) {
            toast.error("Title and Content are required");
            return;
        }

        try {
            setIsLoading(true);

            // Use FormData for image upload
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("category", category);
            formData.append("visibility", visibility);
            formData.append("summary", summary);
            if (featuredImage) {
                formData.append("featured_image", featuredImage);
            }

            await articlesAPI.createArticle(formData);
            toast.success("Article created successfully!");
            router.push('/dashboard/blog-management');
        } catch (error: any) {
            console.error("Error creating article:", error);
            toast.error(error?.message || "Failed to create article");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        router.push('/dashboard/blog-management');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-[#7F375E]">
                        Create New Blog
                    </h1>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="px-6 py-2 bg-[#29AAE1] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                >
                    {isLoading ? "Creating..." : "Create Article"}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <div>
                            <label className="block text-gray-900 font-medium mb-2">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter article title"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-900 font-medium mb-2">Summary</label>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Brief summary of the article"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#29AAE1] text-gray-700 h-24 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-900 font-medium mb-2">Featured Image</label>
                            <div className="w-full h-64 bg-gray-50 rounded-lg mb-4 overflow-hidden relative border border-gray-200 border-dashed flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <Upload size={48} />
                                        <span>Upload Featured Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="file"
                                    id="featured_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => document.getElementById('featured_image')?.click()}
                                    className="flex items-center px-4 py-2 bg-[#D0EBF9] text-[#29AAE1] rounded-md text-sm font-medium hover:bg-blue-100 transition"
                                >
                                    {imagePreview ? "Change Image" : "Upload Image"} <Upload className="ml-2" size={14} />
                                </button>
                                {imagePreview && (
                                    <button
                                        onClick={() => { setFeaturedImage(null); setImagePreview(null); }}
                                        className="flex items-center px-4 py-2 bg-white border border-gray-200 text-red-500 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                                    >
                                        Remove Image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Editor */}
                    <div>
                        <label className="block text-gray-900 font-medium mb-2">Article Content <span className="text-red-500">*</span></label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[600px]">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                placeholder="Enter article content here..."
                                className="flex-1 h-full overflow-hidden"
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

                {/* Settings Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                        <label className="block text-gray-900 font-medium mb-2 text-sm">Category</label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none text-gray-500 text-sm appearance-none"
                            >
                                <option value="general">General Health</option>
                                <option value="nutrition">Nutrition</option>
                                <option value="fitness">Fitness</option>
                                <option value="mental">Mental Health</option>
                                <option value="children">Children's Health</option>
                                <option value="chronic">Chronic Conditions</option>
                                <option value="prevention">Preventive Care</option>
                                <option value="research">Medical Research</option>
                                <option value="other">Other</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-900 font-medium mb-2 text-sm">Visibility</label>
                        <div className="relative">
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none text-gray-500 text-sm appearance-none"
                            >
                                <option value="public">Public</option>
                                <option value="subscribers">Subscribers Only</option>
                                <option value="private">Private</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;
