"use client";
import React, { use } from 'react';
import AddDoctor from '../../../../ui/Doctors/addDoctor/AddDoctor';

const EditDoctorPage = ({ params }) => {
    // Newer Next.js versions require params to be unwrapped with use() in client components
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;

    return (
        <AddDoctor doctorId={id} />
    );
};

export default EditDoctorPage;
