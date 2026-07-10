import axios from 'axios';

// Create a configured Axios instance
const API_URL = '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('welcare_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  signup: async (userData: any) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem('welcare_token', response.data.token);
      localStorage.setItem('welcare_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('welcare_token', response.data.token);
      localStorage.setItem('welcare_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  adminLogin: async (credentials: any) => {
    const response = await api.post('/admin/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('welcare_token', response.data.token);
      localStorage.setItem('welcare_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('welcare_token');
    localStorage.removeItem('welcare_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('welcare_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('welcare_token');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.success) {
      localStorage.setItem('welcare_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  changePassword: async (passwordData: any) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  }
};

// Doctors endpoints
export const doctorService = {
  getDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },
  
  getDoctorById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  createDoctor: async (doctorData: any) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  },

  updateDoctor: async (id: string, doctorData: any) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },

  deleteDoctor: async (id: string) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  }
};

// Departments endpoints
export const departmentService = {
  getDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  createDepartment: async (deptData: any) => {
    const response = await api.post('/departments', deptData);
    return response.data;
  },

  updateDepartment: async (id: string, deptData: any) => {
    const response = await api.put(`/departments/${id}`, deptData);
    return response.data;
  },

  deleteDepartment: async (id: string) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  }
};

// Appointments endpoints
export const appointmentService = {
  book: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await api.get('/appointments/my');
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.put(`/appointments/${id}`, { status: 'cancelled' });
    return response.data;
  }
};

// Admin endpoints
export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await api.get('/admin/appointments');
    return response.data;
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/appointments/${id}`, { status });
    return response.data;
  }
};

// Contact endpoint
export const contactService = {
  submit: async (contactData: any) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  }
};
