"use client";
import React from 'react';
import AddUserForm from '../../../ui/users/add-user-form';
import Link from 'next/link';

const AddUserPage = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Breadcrumb / Header */}
            <div className="flex items-center gap-2 mb-8 text-sm">
                <Link href="/dashboard/manage-users" className="text-gray-400 hover:text-gray-600">
                    List of users
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-[#7F375E] font-medium">New User</span>
            </div>

            <div className="max-w-5xl mx-auto">
                <h2 className="text-[#7F375E] text-lg font-medium mb-4">User Details</h2>

                <h3 className="text-[#29AAE1] text-sm font-medium mb-3">Enter User Information</h3>

                <AddUserForm />
            </div>
        </div>
    );
};

export default AddUserPage;
