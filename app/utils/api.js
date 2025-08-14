"use client";

import authUtils from './authUtils';

// API base URL
const API_BASE_URL = "https://panacaredjangobackend-production.up.railway.app";

// Helper function to get the authorization header
const getAuthHeader = () => {
  if (typeof window !== "undefined") {
    // Use authUtils to get auth headers with our consistent token naming
    const headers = authUtils.getAuthHeaders();
    
    if (headers.Authorization) {
      const token = headers.Authorization.split(' ')[1];
      console.debug("Using token for auth:", token.substring(0, 10) + "...");
    }
    
    return {
      ...headers,
      "Content-Type": "application/json"
    };
  }
  return { "Content-Type": "application/json" };
};

// Function to refresh the token
const refreshAccessToken = async () => {
  try {
    const refreshToken = authUtils.getRefreshToken();
    if (!refreshToken) return null;
    
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.access) {
        authUtils.updateAuthToken(data.access);
        return data.access;
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// Generic API request function with error handling and token refresh
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default headers
    let headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...options.headers,
    };

    // Add console log for debugging
    console.log(`Making API request to: ${url}`);

    // Set a timeout of 8 seconds for APIs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
      // First attempt with current token
      let response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      
      // If unauthorized, try to refresh the token
      if (response.status === 401) {
        console.warn("Unauthorized - trying to refresh token...");
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Update headers with new token
          headers = {
            ...headers,
            "Authorization": `Bearer ${newToken}`
          };
          
          // Retry the request with new token
          response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal
          });
        } else {
          // If token refresh fails, initiate a controlled logout
          console.warn("Token refresh failed, marking for logout");
          
          // Start the logout process
          authUtils.startLogout();
          
          // Let the AuthContext handle the redirect in a controlled manner
          throw new Error('Authentication failed - token refresh error');
        }
      }
      
      clearTimeout(timeoutId);

      // Parse JSON response - handle non-JSON responses
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          // Try to parse as JSON anyway
          data = JSON.parse(text);
        } catch {
          // If it's not JSON, wrap in a text property
          data = { text };
        }
      }

      // Handle API errors but return data for further processing
      if (!response.ok) {
        console.warn(`API error (${response.status}):`, data);
        data.error = data.detail || data.message || "API returned error status";
      }

      return data;
    } catch (fetchError) {
      // Handle fetch errors (timeout, network issues, etc.)
      clearTimeout(timeoutId);
      console.error("Fetch error:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      const result = await apiRequest("/api/users/login/", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      
      // Store authentication data using authUtils
      if (result && result.access) {
        authUtils.storeAuthData(result);
      }
      
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  logout: async () => {
    if (typeof window !== "undefined") {
      // Start logout process
      authUtils.startLogout();
      
      try {
        // Cleanup all tokens (both old and new)
        authUtils.cleanupConflictingTokens();
        
        // Complete the logout process
        authUtils.completeLogout();
        
        // Force a clean navigation to login
        window.location.href = '/login';
      } catch (error) {
        console.warn("Logout process failed:", error);
        // Force navigation anyway
        window.location.href = '/login';
      }
    }
  },
  
  checkAuth: () => {
    if (typeof window !== "undefined") {
      return authUtils.isAuthenticated();
    }
    return false;
  },
};

// API will provide real doctor data
const sampleDoctors = [];

// Doctors API calls
export const doctorsAPI = {
  getAllDoctors: async (isVerified) => {
    const url = isVerified !== undefined 
      ? `/api/doctors/admin_list_doctors/?is_verified=${isVerified}` 
      : "/api/doctors/admin_list_doctors/";
    return await apiRequest(url, { method: "GET" });
  },
  
  getDoctorById: async (id) => {
    return await apiRequest(`/api/doctors/admin_view_doctor/${id}/`, { method: "GET" });
  },
  
  addDoctor: async (doctorData) => {
    return await apiRequest("/api/doctors/admin_add_doctor/", {
      method: "POST",
      body: JSON.stringify(doctorData),
    });
  },
  
  updateDoctor: async (id, doctorData) => {
    return await apiRequest(`/api/doctors/admin_update_doctor/${id}/`, {
      method: "PUT",
      body: JSON.stringify(doctorData),
    });
  },
  
  deleteDoctor: async (id) => {
    return await apiRequest(`/api/doctors/admin_delete_doctor/${id}/`, {
      method: "DELETE",
    });
  },
  
  verifyDoctor: async (id) => {
    return await apiRequest(`/api/doctors/${id}/verify_doctor/`, {
      method: "PATCH"
    });
  },
  
  exportDoctorsToCsv: async () => {
    return await apiRequest("/api/doctors/export/", { 
      method: "GET",
      responseType: 'blob' 
    });
  },
};

// API will provide real patient data
const samplePatients = [];

// Patients API calls
export const patientsAPI = {
  getAllPatients: async () => {
    return await apiRequest("/api/patients/", { method: "GET" });
  },
  
  getPatientById: async (id) => {
    return await apiRequest(`/api/patients/${id}/`, { method: "GET" });
  },
  
  addPatient: async (patientData) => {
    return await apiRequest("/api/patients/", {
      method: "POST",
      body: JSON.stringify(patientData),
    });
  },
  
  updatePatient: async (id, patientData) => {
    return await apiRequest(`/api/patients/${id}/`, {
      method: "PUT",
      body: JSON.stringify(patientData),
    });
  },
  
  deletePatient: async (id) => {
    return await apiRequest(`/api/patients/${id}/`, {
      method: "DELETE",
    });
  },
  
  exportPatientsToCsv: async () => {
    return await apiRequest("/api/patients/export/", { 
      method: "GET",
      responseType: 'blob' 
    });
  },
};

// Healthcare Facilities API calls
export const healthcareFacilitiesAPI = {
  getAllFacilities: async () => {
    return await apiRequest("/api/healthcare/", { method: "GET" });
  },
  
  getFacilityById: async (id) => {
    return await apiRequest(`/api/healthcare/${id}/`, { method: "GET" });
  },
  
  addFacility: async (facilityData) => {
    return await apiRequest("/api/healthcare/", {
      method: "POST",
      body: JSON.stringify(facilityData),
    });
  },
  
  updateFacility: async (id, facilityData) => {
    return await apiRequest(`/api/healthcare/${id}/`, {
      method: "PUT",
      body: JSON.stringify(facilityData),
    });
  },
  
  deleteFacility: async (id) => {
    return await apiRequest(`/api/healthcare/${id}/`, {
      method: "DELETE",
    });
  },
  
  exportFacilitiesToCsv: async () => {
    return await apiRequest("/api/healthcare/export/", { 
      method: "GET", 
      responseType: 'blob' 
    });
  },
};

// Patient-Doctor Assignment API calls
export const assignmentAPI = {
  getAllAssignments: async () => {
    return await apiRequest("/api/healthcare/list_patient_doctor_assignments/", { method: "GET" });
  },
  
  getAssignmentById: async (id) => {
    return await apiRequest(`/api/healthcare/view_assignment/${id}/`, { method: "GET" });
  },
  
  assignPatientToDoctor: async (assignmentData) => {
    return await apiRequest("/api/healthcare/assign_patient_to_doctor/", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    });
  },
  
  updateAssignment: async (id, assignmentData) => {
    return await apiRequest(`/api/healthcare/update_assignment/${id}/`, {
      method: "PUT",
      body: JSON.stringify(assignmentData),
    });
  },
  
  deleteAssignment: async (id) => {
    return await apiRequest(`/api/healthcare/delete_assignment/${id}/`, {
      method: "DELETE",
    });
  },
};

// Appointments API calls
export const appointmentsAPI = {
  getAllAppointments: async () => {
    return await apiRequest("/api/appointments/", { method: "GET" });
  },
  
  getAppointmentById: async (id) => {
    return await apiRequest(`/api/appointments/${id}/`, { method: "GET" });
  },
  
  createAppointment: async (appointmentData) => {
    return await apiRequest("/api/appointments/", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },
  
  updateAppointment: async (id, appointmentData) => {
    return await apiRequest(`/api/appointments/${id}/`, {
      method: "PUT",
      body: JSON.stringify(appointmentData),
    });
  },
  
  cancelAppointment: async (id) => {
    return await apiRequest(`/api/appointments/${id}/cancel_appointment/`, {
      method: "POST"
    });
  },
  
  rescheduleAppointment: async (id, rescheduleData) => {
    return await apiRequest(`/api/appointments/${id}/patient_reschedule/`, {
      method: "POST",
      body: JSON.stringify(rescheduleData),
    });
  },
  
  exportAppointmentsToCsv: async () => {
    return await apiRequest("/api/appointments/export/", { 
      method: "GET", 
      responseType: 'blob' 
    });
  },
};

// Helper function to handle API errors consistently
const withFallback = async (apiCall, fallbackData, errorMessage = "API error") => {
  try {
    // Try the API call with a short timeout
    const result = await Promise.race([
      apiCall(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("API timeout")), 3000)
      )
    ]);
    return result;
  } catch (error) {
    console.warn(errorMessage, error);
    // Return an empty array or object instead of mock data
    return Array.isArray(fallbackData) ? [] : {};
  }
};

// Subscription Packages API calls
export const packagesAPI = {
  getAllPackages: async () => {
    return await apiRequest("/api/packages/", { method: "GET" });
  },
  
  getPackageById: async (id) => {
    return await apiRequest(`/api/packages/${id}/`, { method: "GET" });
  },
  
  addPackage: async (packageData) => {
    return await apiRequest("/api/packages/", {
      method: "POST",
      body: JSON.stringify(packageData),
    });
  },
  
  updatePackage: async (id, packageData) => {
    return await apiRequest(`/api/packages/${id}/`, {
      method: "PUT",
      body: JSON.stringify(packageData),
    });
  },
  
  deletePackage: async (id) => {
    return await apiRequest(`/api/packages/${id}/`, {
      method: "DELETE",
    });
  },
  
  exportPackagesToPdf: async () => {
    return await apiRequest("/api/packages/export/pdf/", { 
      method: "GET", 
      responseType: 'blob' 
    });
  },
  
  exportPackagesToCsv: async () => {
    return await apiRequest("/api/packages/export/csv/", { 
      method: "GET", 
      responseType: 'blob' 
    });
  },
};


export const articlesAPI = {
  getAllArticles: async () => {
    return await apiRequest("/api/articles/", { method: "GET" });
  },
  
  
  exportPatientsToCsv: async () => {
    return await apiRequest("/api/patients/export/", { 
      method: "GET",
      responseType: 'blob' 
    });
  },
};

export default {
  authAPI,
  doctorsAPI,
  patientsAPI,
  healthcareFacilitiesAPI,
  assignmentAPI,
  appointmentsAPI,
  packagesAPI,
};