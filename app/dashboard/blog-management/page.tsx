"use client";
import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import Blog from '../../ui/blog-management/blog';

const BlogManagementPage = () => {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_page', 'blog-management');
      localStorage.setItem('blog-management_page_loaded', 'true');
    }

    return () => {
      if (typeof window !== 'undefined') {
        console.log('blog-management page unmounted');
      }
    };
  }, []);

  return (
    <Blog />
  )
}

export default BlogManagementPage