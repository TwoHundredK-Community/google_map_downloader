import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
  password2: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login/', {
      email: credentials.email,  // Backend expects username field
      password: credentials.password
    });
    if (response.data.tokens) {
      localStorage.setItem('token', response.data.tokens.access);
      localStorage.setItem('refreshToken', response.data.tokens.refresh);
      localStorage.setItem('userEmail', credentials.email);
    }
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register/', {
      username: credentials.email,  // Backend expects username field
      email: credentials.email,
      name: credentials.name,
      password: credentials.password,
      password2: credentials.password2
    });
    if (response.data.tokens) {
      localStorage.setItem('token', response.data.tokens.access);
      localStorage.setItem('refreshToken', response.data.tokens.refresh);
      localStorage.setItem('userEmail', credentials.email);
    }
    return response.data;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.post('/api/auth/logout/', {
          refresh: refreshToken
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
  }

  getCurrentUser(): { email: string; token: string } | null {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (!token || !email) return null;
    
    return {
      email,
      token
    };
  }
}

export default new AuthService(); 