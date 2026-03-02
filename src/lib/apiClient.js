/**
 * Mock API Client for Frontend-Only Site
 * This client intercepts calls that would normally go to the backend
 * and returns successful mock responses.
 */

const mockResponse = (data = {}, message = 'Success') => ({
  success: true,
  data,
  message
});

export const apiClient = {
  get: async (endpoint) => {
    console.log(`[MOCK API] GET: ${endpoint}`);
    // Handle specific mock data if needed
    if (endpoint === '/speakers') return mockResponse([]);
    return mockResponse({});
  },

  post: async (endpoint, data) => {
    console.log(`[MOCK API] POST: ${endpoint}`, data);
    return mockResponse({}, 'Action completed successfully');
  },

  patch: async (endpoint, data) => {
    console.log(`[MOCK API] PATCH: ${endpoint}`, data);
    return mockResponse({});
  },

  put: async (endpoint, data) => {
    console.log(`[MOCK API] PUT: ${endpoint}`, data);
    return mockResponse({});
  },

  delete: async (endpoint) => {
    console.log(`[MOCK API] DELETE: ${endpoint}`);
    return mockResponse({});
  },
};

// Specialized API functions (empty implementations)
export const attendeeSignIn = async () => mockResponse({});
export const registerAttendee = async () => mockResponse({});

export default apiClient;
