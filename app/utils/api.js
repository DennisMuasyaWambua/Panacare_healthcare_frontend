"use client";

import { get } from 'http';
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
const apiRequest = async (endpoint, { timeout = 30000, ...options } = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    // Default headers
    let headers = {
      ...getAuthHeader(),
      ...options.headers,
    };

    // If body is FormData, delete Content-Type to let browser set it with boundary
    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    } else if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // Add console log for debugging
    console.log(`Making API request to: ${url}`);

    // Set a timeout of 30 seconds for APIs (increased for slow operations like registration)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("Request timed out"), timeout);

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

      // Handle API errors
      if (!response.ok) {
        console.warn(`API error (${response.status} ${response.statusText}):`, data);

        // Construct a meaningful error message
        let errorMessage = data.detail || data.message || data.error;

        // If no structured error, check for plain text response
        if (!errorMessage && data.text) {
          errorMessage = data.text.length < 200 ? data.text : `Server Error (${response.status})`;
        }

        // Final fallback
        if (!errorMessage) {
          errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.statusText = response.statusText;
        error.response = data; // Attach full response data for field-specific errors

        throw error;
      }

      return data;
    } catch (fetchError) {
      // Handle fetch errors (timeout, network issues, etc.)
      clearTimeout(timeoutId);

      // Handle timeout specifically
      if (fetchError.name === 'AbortError') {
        throw new Error("Request timed out. Please check your connection or try again.");
      }

      // Don't log if we just threw it above
      if (!fetchError.status) {
        console.error("Fetch error:", fetchError);
      }
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

// Users management API calls
export const usersAPI = {
  register: async (userData) => {
    return await apiRequest("/api/users/register/", {
      method: "POST",
      body: JSON.stringify(userData),
      timeout: 90000 // Increase timeout to 90 seconds for registration
    });
  },

  getUsers: async () => {
    return await apiRequest("/api/users/", { method: "GET" }); // Assuming a list endpoint exists or uses a filter on generic list
  },

  createUser: async (userData) => {
    return await apiRequest("/api/users/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  resendVerification: async (email) => {
    return await apiRequest("/api/users/resend-verification/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
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
      timeout: 60000 // Increase timeout to 60 seconds
    });
  },

  createDoctorProfile: async (profileData) => {
    return await apiRequest("/api/doctors/", {
      method: "POST",
      body: JSON.stringify(profileData),
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

  verifyDoctor: async (id, data = { is_verified: true }) => {
    return await apiRequest(`/api/doctors/${id}/verify_doctor/`, {
      method: "PATCH",
      body: JSON.stringify(data)
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
    return await apiRequest("/api/users/", {
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

  getAllAppointmentsenhanced: async (params) => {
    return await apiRequest("/api/enhanced-appointments/", { method: "GET" });
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
  getAllArticles: async (params) => {
    return await apiRequest("/api/articles/", { method: "GET", params });
  },

  getArticleById: async (id) => {
    return await apiRequest(`/api/articles/${id}/`, { method: "GET" });
  },

  createArticle: async (articleData) => {
    const isFormData = articleData instanceof FormData;
    return await apiRequest("/api/articles/", {
      method: "POST",
      body: isFormData ? articleData : JSON.stringify(articleData),
    });
  },

  updateArticle: async (id, articleData) => {
    const isFormData = articleData instanceof FormData;
    return await apiRequest(`/api/articles/${id}/`, {
      method: "PATCH",
      body: isFormData ? articleData : JSON.stringify(articleData),
    });
  },

  deleteArticle: async (id) => {
    return await apiRequest(`/api/articles/${id}/`, {
      method: "DELETE",
    });
  },

  Approvearticle: async (id, data = {}) => {
    return await apiRequest(`/api/articles/${id}/approve/`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  Rejectarticle: async (id, data) => {
    return await apiRequest(`/api/articles/${id}/reject/`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  Publisharticle: async (id, data = {}) => {
    return await apiRequest(`/api/articles/${id}/publish/`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  Unpublisharticle: async (id) => {
    return await apiRequest(`/api/articles/${id}/unpublish/`, {
      method: "POST"
    });
  },

  Viewarticle: async (id) => {
    return await apiRequest(`/api/articles/${id}/view/`, {
      method: "POST"
    });
  },

  exportArticlesToCsv: async () => {
    return await apiRequest("/api/articles/export/", {
      method: "GET",
      responseType: 'blob'
    });
  },
};

export const subscriptions = {
  getAllSubs: async () => {
    return await apiRequest("/api/subscriptions/", { method: "GET" });
  },
};


export const packageTracker = {
  getAllPackages: async (params) => {
    return await apiRequest("/api/package-payment-tracker/subscriptions/", {
      method: "GET",
      params,
    });
  },

  getAllPackageSummary: async () => {
    return await apiRequest("/api/package-payment-tracker/dashboard/", { method: "GET" });
  },
};

export const teleconsulatationAPI = {
  getAllTeleconsulatations: async (params) => {
    return await apiRequest("/api/teleconsultation-logs/", {
      method: "GET",
      params
    });
  },
};

export const followupAPI = {
  getAllFollowups: async (params) => {
    return await apiRequest("/api/follow-up-compliance/", {
      method: "GET",
      params
    });
  },
  getFollowupSummary: async () => {
    return await apiRequest("/api/follow-up-compliance/statistics/", { method: "GET" });
  }
}
// Notifications API calls
export const notificationsAPI = {
  registerFcmToken: async (tokenData) => {
    return await apiRequest("/api/notifications/fcm/register/token/", {
      method: "POST",
      body: JSON.stringify(tokenData),
    });
  },

  sendNotification: async (notificationData) => {
    return await apiRequest("/api/notifications/send/", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  },

  sendToDoctors: async (notificationData) => {
    return await apiRequest("/api/notifications/send/doctors/", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  },

  sendToPatients: async (notificationData) => {
    return await apiRequest("/api/notifications/send/patients/", {
      method: "POST",
      body: JSON.stringify(notificationData),
    });
  },

  getHistory: async (params) => {
    let url = "/api/notifications/history/";
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url += `?${queryParams}`;
    }
    return await apiRequest(url, { method: "GET" });
  },

  markAsRead: async (id) => {
    return await apiRequest(`/api/notifications/${id}/mark_read/`, {
      method: "PATCH",
    });
  },

  markAllAsRead: async () => {
    return await apiRequest("/api/notifications/mark-all-read/", {
      method: "POST",
    });
  },

  getPreferences: async () => {
    return await apiRequest("/api/notifications/preferences/", {
      method: "GET",
    });
  },

  updatePreferences: async (preferencesData) => {
    return await apiRequest("/api/notifications/update_preferences/", {
      method: "PUT",
      body: JSON.stringify(preferencesData),
    });
  },

  subscribeToTopic: async (topicData) => {
    return await apiRequest("/api/topics/subscribe/", {
      method: "POST",
      body: JSON.stringify(topicData),
    });
  },
};


export default {
  authAPI,
  usersAPI,
  doctorsAPI,
  patientsAPI,
  healthcareFacilitiesAPI,
  assignmentAPI,
  appointmentsAPI,
  packagesAPI,
  notificationsAPI,
  articlesAPI,
  subscriptions,
  packageTracker,
  teleconsulatationAPI,
  followupAPI,
};