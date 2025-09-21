// Centralized API service for SehatSathi
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types for API responses
export interface User {
  id: number;
  username: string;
  email: string;
  user_type: string;
  is_approved: boolean;
  pharmacy_name?: string;
  license_number?: string;
  address?: string;
  phone?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  user: User;
}

export interface PharmacyStock {
  id: number;
  pharmacy_id: number;
  medicine_name: string;
  quantity: number;
  price: number;
  expiry_date: string;
  batch_number: string;
  created_at: string;
}

export interface GovernmentDashboard {
  statistics: {
    total_pharmacies: number;
    pending_approvals: number;
    total_medicines: number;
    low_stock_count: number;
    expiring_soon_count: number;
  };
  recent_pharmacies: User[];
  low_stock_medicines: Array<{
    medicine_name: string;
    quantity: number;
    pharmacy_name: string;
    address: string;
  }>;
  expiring_medicines: Array<{
    medicine_name: string;
    expiry_date: string;
    pharmacy_name: string;
    address: string;
  }>;
  top_medicines: Array<{
    medicine_name: string;
    total_quantity: number;
    pharmacy_count: number;
  }>;
}

export interface PharmacySignupData {
  name: string;
  owner: string;
  location: string;
  license: string;
  phone: string;
  email: string;
}

export interface AddStockData {
  medicine_name: string;
  quantity: number;
  price: number;
  expiry_date: string;
  batch_number: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    const user = JSON.parse(userData);
    return user.access_token || null;
  } catch {
    return null;
  }
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Network error: Unable to connect to server. Please check if the backend is running.',
      0,
      error
    );
  }
};

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    user_type: string;
    pharmacy_name?: string;
    license_number?: string;
    address?: string;
    phone?: string;
  }): Promise<{ message: string; requires_approval: boolean }> => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Pharmacy API
export const pharmacyApi = {
  signup: async (data: PharmacySignupData): Promise<{
    message: string;
    credentials: {
      username: string;
      password: string;
      pharmacy_name: string;
    };
  }> => {
    return apiRequest('/pharmacy/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getStocks: async (): Promise<PharmacyStock[]> => {
    return apiRequest<PharmacyStock[]>('/api/pharmacy/stocks');
  },
  
  addStock: async (stockData: AddStockData): Promise<{ message: string }> => {
    return apiRequest('/api/pharmacy/stocks', {
      method: 'POST',
      body: JSON.stringify(stockData),
    });
  },
};

// Government API
export const governmentApi = {
  getDashboard: async (): Promise<GovernmentDashboard> => {
    return apiRequest<GovernmentDashboard>('/api/government/dashboard');
  },
  
  getPendingUsers: async (): Promise<User[]> => {
    return apiRequest<User[]>('/api/users/pending');
  },
  
  approveUser: async (userId: number): Promise<{ message: string }> => {
    return apiRequest(`/api/users/${userId}/approve`, {
      method: 'POST',
    });
  },
  
  getAllStocks: async (): Promise<Array<PharmacyStock & { pharmacy_name: string; address: string }>> => {
    return apiRequest('/api/admin/all-stocks');
  },
};

// Utility functions
export const apiUtils = {
  isAuthenticated: (): boolean => {
    return getAuthToken() !== null;
  },
  
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
      const user = JSON.parse(userData);
      return user.user || null;
    } catch {
      return null;
    }
  },
  
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  },
  
  setUser: (userData: LoginResponse): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  },
};
