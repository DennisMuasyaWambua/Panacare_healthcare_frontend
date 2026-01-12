"use client";
import React, { useState, useEffect } from "react";
import { Search, MoreVertical, X, AlertCircle, FileText, Download, Eye, UserPlus, Trash2, Edit } from "lucide-react";
import { assignmentAPI, patientsAPI, doctorsAPI } from "../../../utils/api";
import { toast } from "react-toastify";

const ListOfAssignments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalAssignment, setModalAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewAssignmentModalOpen, setIsNewAssignmentModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    patient_id: "",
    doctor_id: "",
    notes: ""
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all required data in parallel
        const [assignmentsData, patientsData, doctorsData] = await Promise.all([
          assignmentAPI.getAllAssignments(),
          patientsAPI.getAllPatients(),
          doctorsAPI.getAllDoctors()
        ]);
        
        console.log("Assignments data:", assignmentsData);
        setAssignments(assignmentsData || []);
        setPatients(patientsData || []);
        setDoctors(doctorsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load assignments and related data");
        toast.error("Failed to load assignments list");
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const openModal = (assignment) => {
    // Find the full patient and doctor objects
    const patient = patients.find(p => p.id === assignment.patient_id);
    const doctor = doctors.find(d => d.id === assignment.doctor_id);
    
    // Enhance assignment with full patient and doctor data
    const enhancedAssignment = {
      ...assignment,
      patient,
      doctor
    };
    
    setModalAssignment(enhancedAssignment);
  };

  const closeModal = () => {
    setModalAssignment(null);
  };
  
  const openNewAssignmentModal = () => {
    setIsNewAssignmentModalOpen(true);
  };
  
  const closeNewAssignmentModal = () => {
    setIsNewAssignmentModalOpen(false);
    setNewAssignment({
      patient_id: "",
      doctor_id: "",
      notes: ""
    });
  };
  
  const handleNewAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const createAssignment = async (e) => {
    e.preventDefault();
    
    try {
      const response = await assignmentAPI.assignPatientToDoctor(newAssignment);
      console.log("Assignment created:", response);
      
      // Add the new assignment to the list
      const patient = patients.find(p => p.id.toString() === newAssignment.patient_id);
      const doctor = doctors.find(d => d.id.toString() === newAssignment.doctor_id);
      
      const newAssignmentWithDetails = {
        ...response,
        patient,
        doctor
      };
      
      setAssignments(prev => [...prev, newAssignmentWithDetails]);
      
      toast.success("Patient successfully assigned to doctor");
      closeNewAssignmentModal();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to assign patient to doctor");
    }
  };
  
  const deleteAssignment = async (id) => {
    try {
      await assignmentAPI.deleteAssignment(id);
      
      // Remove the deleted assignment from the list
      setAssignments(prev => prev.filter(a => a.id !== id));
      
      toast.success("Assignment deleted successfully");
      
      // If assignment is in modal, close the modal
      if (modalAssignment && modalAssignment.id === id) {
        closeModal();
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
    }
  };

  // Filter assignments based on search query
  const filteredAssignments = (Array.isArray(assignments) ? assignments : []).filter((assignment) => {
    const patientName = assignment.patient?.user 
      ? `${assignment.patient.user.first_name} ${assignment.patient.user.last_name}`.toLowerCase()
      : '';
      
    const doctorName = assignment.doctor?.user
      ? `${assignment.doctor.user.first_name} ${assignment.doctor.user.last_name}`.toLowerCase()
      : '';
    
    return patientName.includes(searchQuery.toLowerCase()) || 
           doctorName.includes(searchQuery.toLowerCase());
  });

  // Get patient name from ID
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.user 
      ? `${patient.user.first_name} ${patient.user.last_name}`
      : 'Unknown Patient';
  };
  
  // Get doctor name from ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor?.user 
      ? `${doctor.user.first_name} ${doctor.user.last_name}`
      : 'Unknown Doctor';
  };

  // Render content based on loading/error state
  let contentToRender;
  
  if (isLoading) {
    contentToRender = (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29AAE1]"></div>
        <p className="ml-4 text-gray-500">Loading assignments...</p>
      </div>
    );
  } else if (error) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-red-500">
        <AlertCircle className="mr-2" />
        {error}
      </div>
    );
  } else if (filteredAssignments.length === 0) {
    contentToRender = (
      <div className="flex justify-center items-center p-8 text-gray-500">
        No assignments found matching your search
      </div>
    );
  } else {
    contentToRender = (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-lg border-gray-300"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Doctor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Assignment Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Notes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#29AAE1] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => (
              <tr key={assignment.id} className={selectedRows.includes(assignment.id) ? "bg-[#29AAE140]" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(assignment.id)}
                    onChange={() => handleRowSelect(assignment.id)}
                    className="w-4 h-4 rounded-lg border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getPatientName(assignment.patient_id)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getDoctorName(assignment.doctor_id)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(assignment.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {assignment.notes || "No notes"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModal(assignment)}
                      className="text-[#29AAE1] hover:text-blue-700"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => deleteAssignment(assignment.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Assignment"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Title and Add Assignment Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#7F375E]">Patient-Doctor Assignments</h1>
        <button
          onClick={openNewAssignmentModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#29AAE1] text-white rounded-lg hover:bg-blue-600"
        >
          <UserPlus size={18} />
          New Assignment
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <label htmlFor="assignmentSearch" className="block text-black mb-2">
            Search by Patient or Doctor Name
          </label>
          <input
            id="assignmentSearch"
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
          />
          <Search className="absolute right-3 top-10 text-gray-400" size={20} />
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {contentToRender}
      </div>

      {/* Assignment Details Modal */}
      {modalAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#7F375E]">Assignment Details</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            {/* Assignment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 border-b pb-3">
                <h3 className="text-lg font-semibold text-[#29AAE1] mb-2">Patient Information</h3>
                <p className="text-black">
                  <span className="font-medium">Name:</span> {getPatientName(modalAssignment.patient_id)}
                </p>
                {modalAssignment.patient?.user && (
                  <>
                    <p className="text-black">
                      <span className="font-medium">Email:</span> {modalAssignment.patient.user.email || "Not provided"}
                    </p>
                    <p className="text-black">
                      <span className="font-medium">Phone:</span> {modalAssignment.patient.user.phone_number || "Not provided"}
                    </p>
                  </>
                )}
              </div>
              
              <div className="col-span-2 border-b pb-3">
                <h3 className="text-lg font-semibold text-[#29AAE1] mb-2">Doctor Information</h3>
                <p className="text-black">
                  <span className="font-medium">Name:</span> {getDoctorName(modalAssignment.doctor_id)}
                </p>
                {modalAssignment.doctor?.user && (
                  <>
                    <p className="text-black">
                      <span className="font-medium">Email:</span> {modalAssignment.doctor.user.email || "Not provided"}
                    </p>
                    <p className="text-black">
                      <span className="font-medium">Phone:</span> {modalAssignment.doctor.user.phone_number || "Not provided"}
                    </p>
                    <p className="text-black">
                      <span className="font-medium">Specialty:</span> {modalAssignment.doctor.specialty || "Not specified"}
                    </p>
                  </>
                )}
              </div>
              
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-[#29AAE1] mb-2">Assignment Details</h3>
                <p className="text-black">
                  <span className="font-medium">Date Assigned:</span> {new Date(modalAssignment.created_at).toLocaleDateString()}
                </p>
                <p className="text-black">
                  <span className="font-medium">Notes:</span> {modalAssignment.notes || "No notes provided"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => deleteAssignment(modalAssignment.id)}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
              >
                Delete Assignment
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {isNewAssignmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#7F375E]">Assign Patient to Doctor</h2>
              <button onClick={closeNewAssignmentModal} className="text-gray-600 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={createAssignment}>
              <div className="mb-4">
                <label htmlFor="patient_id" className="block text-gray-700 font-medium mb-2">
                  Patient
                </label>
                <select
                  id="patient_id"
                  name="patient_id"
                  value={newAssignment.patient_id}
                  onChange={handleNewAssignmentChange}
                  required
                  className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.user ? `${patient.user.first_name} ${patient.user.last_name}` : `Patient ${patient.id}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="doctor_id" className="block text-gray-700 font-medium mb-2">
                  Doctor
                </label>
                <select
                  id="doctor_id"
                  name="doctor_id"
                  value={newAssignment.doctor_id}
                  onChange={handleNewAssignmentChange}
                  required
                  className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
                >
                  <option value="">Select a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.user ? `${doctor.user.first_name} ${doctor.user.last_name}` : `Doctor ${doctor.id}`}
                      {doctor.specialty ? ` (${doctor.specialty})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={newAssignment.notes}
                  onChange={handleNewAssignmentChange}
                  rows="3"
                  className="w-full px-4 py-2 bg-[#F1F8FD] border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Add any notes about this assignment"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeNewAssignmentModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#29AAE1] text-white rounded"
                >
                  Assign Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfAssignments;
