import { API_CONFIG } from '../constants/api';
import { getSessionId } from './session';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export const api = {
  request: async (endpoint: string, options: RequestOptions = {}) => {
    const { params, ...requestOptions } = options;
    
    // Build URL with query parameters
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    try {
      const response = await fetch(url.toString(), requestOptions);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  get: (endpoint: string, options: RequestOptions = {}) => {
    return api.request(endpoint, { ...options, method: 'GET' });
  },
  
  post: (endpoint: string, data: unknown, options: RequestOptions = {}) => {
    if (data instanceof FormData) {
      // Handle FormData
      data.append('sessionId', getSessionId());
      return api.request(endpoint, {
        ...options,
        method: 'POST',
        body: data, // Don't set Content-Type for FormData, browser will set it with boundary
      });
    }
    
    // Handle JSON data
    return api.request(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify({
        ...data,
        sessionId: getSessionId()
      }),
    });
  },
};