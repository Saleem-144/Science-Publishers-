/**
 * API Client for Academic Journal Publishing Platform
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          // Only redirect to login if we're currently in the admin section
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        }
      } else {
        // No refresh token but got 401, clear whatever we have
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          // Only redirect to login if we're currently in the admin section
          if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// =============================================================================
// Auth API
// =============================================================================

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  },
  
  logout: async (refreshToken: string) => {
    const response = await api.post('/auth/logout/', { refresh: refreshToken });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
  
  changePassword: async (data: { old_password: string; new_password: string; confirm_password: string }) => {
    const response = await api.post('/auth/password/change/', data);
    return response.data;
  },
};

// =============================================================================
// Journals API
// =============================================================================

export const journalsApi = {
  list: async (params?: { 
    subject?: string;
    subjects__slug?: string; 
    search?: string; 
    issn?: string;
    is_active?: boolean;
    is_featured?: boolean;
    page?: number 
  }) => {
    // Map 'subject' to 'subjects__slug' if needed, but the backend also has a custom get_queryset
    const response = await api.get('/journals/', { params });
    return response.data;
  },
  
  featured: async () => {
    const response = await api.get('/journals/featured/');
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/journals/by-slug/${slug}/`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/journals/admin/${id}/`);
    return response.data;
  },

  get: async (id: string | number) => {
    const response = await api.get(`/journals/admin/${id}/`);
    return response.data;
  },
  
  subjects: async () => {
    const response = await api.get('/journals/subjects/');
    return response.data;
  },
  
  // Admin
  adminList: async (params?: any) => {
    const response = await api.get('/journals/admin/', { params });
    return response.data;
  },

  createSubject: async (data: any) => {
    const response = await api.post('/journals/admin/subjects/create/', data);
    return response.data;
  },

  updateSubject: async (id: number, data: any) => {
    const response = await api.patch(`/journals/admin/subjects/${id}/`, data);
    return response.data;
  },

  deleteSubject: async (id: number) => {
    const response = await api.delete(`/journals/admin/subjects/${id}/`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/journals/admin/create/', data);
    return response.data;
  },

  createWithImage: async (formData: FormData) => {
    const response = await api.post('/journals/admin/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.patch(`/journals/admin/${id}/`, data);
    return response.data;
  },

  updateWithImage: async (id: number, formData: FormData) => {
    const response = await api.patch(`/journals/admin/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/journals/admin/${id}/`);
    return response.data;
  },
};

// =============================================================================
// Volumes API
// =============================================================================

export const volumesApi = {
  listByJournal: async (journalSlug: string) => {
    const response = await api.get(`/volumes/by-journal/${journalSlug}/`);
    return response.data;
  },
  
  getByNumber: async (journalSlug: string, volumeNumber: number) => {
    const response = await api.get(`/volumes/by-journal/${journalSlug}/${volumeNumber}/`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/volumes/admin/${id}/`);
    return response.data;
  },
  
  // Admin
  create: async (data: any) => {
    const response = await api.post('/volumes/admin/create/', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.patch(`/volumes/admin/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/volumes/admin/${id}/`);
    return response.data;
  },
};

// =============================================================================
// Issues API
// =============================================================================

export const issuesApi = {
  getCurrentIssue: async (journalSlug: string) => {
    const response = await api.get(`/issues/by-journal/${journalSlug}/current/`);
    return response.data;
  },
  
  getByNumber: async (journalSlug: string, issueNumber: number) => {
    const response = await api.get(`/issues/by-journal/${journalSlug}/${issueNumber}/`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/issues/admin/${id}/`);
    return response.data;
  },
  
  listByVolume: async (volumeId: number) => {
    const response = await api.get(`/issues/by-volume/${volumeId}/`);
    return response.data;
  },
  
  // Admin
  create: async (data: any) => {
    const response = await api.post('/issues/admin/create/', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.patch(`/issues/admin/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/issues/admin/${id}/`);
    return response.data;
  },
};

// =============================================================================
// Articles API
// =============================================================================

export const articlesApi = {
  list: async (params?: { 
    journal?: number; 
    volume?: number;
    issue?: number; 
    search?: string; 
    page?: number; 
    is_special_issue?: boolean 
  }) => {
    const response = await api.get('/articles/', { params });
    return response.data;
  },
  
  specialIssues: async (journalSlug?: string) => {
    const params = journalSlug ? { journal_slug: journalSlug } : {};
    const response = await api.get('/articles/special-issues/', { params });
    return response.data;
  },
  
  search: async (query: string) => {
    const response = await api.get('/articles/search/', { params: { q: query } });
    return response.data;
  },
  
  featured: async () => {
    const response = await api.get('/articles/featured/');
    return response.data;
  },
  
  recent: async (journalSlug?: string) => {
    const params = journalSlug ? { journal: journalSlug } : {};
    const response = await api.get('/articles/recent/', { params });
    return response.data;
  },
  
  getBySlug: async (journalSlug: string, articleSlug: string) => {
    const response = await api.get(`/articles/by-journal/${journalSlug}/${articleSlug}/`);
    return response.data;
  },
  
  getAbstract: async (journalSlug: string, articleSlug: string) => {
    const response = await api.get(`/articles/by-journal/${journalSlug}/${articleSlug}/abstract/`);
    return response.data;
  },
  
  getFullText: async (journalSlug: string, articleSlug: string) => {
    const response = await api.get(`/articles/by-journal/${journalSlug}/${articleSlug}/fulltext/`);
    return response.data;
  },
  
  getPdfUrl: (journalSlug: string, articleSlug: string) => {
    return `${API_BASE_URL}/articles/by-journal/${journalSlug}/${articleSlug}/pdf/`;
  },
  
  getXmlUrl: (journalSlug: string, articleSlug: string) => {
    return `${API_BASE_URL}/articles/by-journal/${journalSlug}/${articleSlug}/xml/`;
  },
  
  getHtmlDownloadUrl: (journalSlug: string, articleSlug: string) => {
    return `${API_BASE_URL}/articles/by-journal/${journalSlug}/${articleSlug}/html-download/`;
  },
  
  listByIssue: async (issueId: number) => {
    const response = await api.get(`/articles/by-issue/${issueId}/`);
    return response.data;
  },
  
  // Admin
  get: async (id: string | number) => {
    const response = await api.get(`/articles/admin/${id}/`);
    return response.data;
  },

  adminList: async (params?: any) => {
    const response = await api.get('/articles/admin/', { params });
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/articles/admin/create/', data);
    return response.data;
  },

  createWithFiles: async (formData: FormData) => {
    const response = await api.post('/articles/admin/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.patch(`/articles/admin/${id}/`, data);
    return response.data;
  },

  updateWithFiles: async (id: number, formData: FormData) => {
    const response = await api.patch(`/articles/admin/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/articles/admin/${id}/`);
    return response.data;
  },
  
  updateAuthors: async (id: number, authors: any[]) => {
    const response = await api.put(`/articles/admin/${id}/authors/`, { authors });
    return response.data;
  },
  
  uploadFile: async (id: number, file: File, fileType: string, isPrimary: boolean = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);
    formData.append('is_primary', String(isPrimary));
    
    const response = await api.post(`/articles/admin/${id}/files/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// =============================================================================
// Authors API
// =============================================================================

export const authorsApi = {
  list: async (params?: { search?: string; page?: number }) => {
    const response = await api.get('/articles/authors/', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/articles/authors/${id}/`);
    return response.data;
  },
  
  getArticles: async (id: number) => {
    const response = await api.get(`/articles/authors/${id}/articles/`);
    return response.data;
  },
  
  // Admin
  create: async (data: any) => {
    const response = await api.post('/articles/admin/authors/create/', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.patch(`/articles/admin/authors/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/articles/admin/authors/${id}/`);
    return response.data;
  },
};

// =============================================================================
// Site API
// =============================================================================

export const siteApi = {
  getSettings: async () => {
    const response = await api.get('/site/settings/');
    return response.data;
  },
  
  updateSettings: async (data: any) => {
    const response = await api.patch('/site/settings/', data);
    return response.data;
  },
  
  getPages: async (params?: { journal?: string | number; nav?: boolean }) => {
    const response = await api.get('/site/pages/', { params });
    return response.data;
  },
  
  getPage: async (slug: string, journalSlug?: string) => {
    const params = journalSlug ? { journal: journalSlug } : {};
    const response = await api.get(`/site/pages/${slug}/`, { params });
    return response.data;
  },
  
  getDashboardStats: async () => {
    const response = await api.get('/site/admin/stats/');
    return response.data;
  },
};

// =============================================================================
// XML API
// =============================================================================

export const xmlApi = {
  upload: async (articleId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/xml/upload/${articleId}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  process: async (articleId: number, xmlContent?: string) => {
    const data = xmlContent ? { xml_content: xmlContent } : {};
    const response = await api.post(`/xml/process/${articleId}/`, data);
    return response.data;
  },
  
  reparse: async (articleId: number) => {
    const response = await api.post(`/xml/reparse/${articleId}/`);
    return response.data;
  },
  
  getStatus: async (articleId: number) => {
    const response = await api.get(`/xml/status/${articleId}/`);
    return response.data;
  },
  
  getPreview: async (articleId: number) => {
    const response = await api.get(`/xml/preview/${articleId}/`);
    return response.data;
  },
};

// =============================================================================
// Announcements/News API
// =============================================================================

export const announcementsApi = {
  // Public - get all published announcements
  list: async () => {
    const response = await api.get('/journals/announcements/');
    return response.data;
  },
  
  // Public - get announcements for homepage (limited to 5)
  homepage: async () => {
    const response = await api.get('/journals/announcements/homepage/');
    return response.data;
  },
  
  // Public - get single announcement by slug
  getBySlug: async (slug: string) => {
    const response = await api.get(`/journals/announcements/by-slug/${slug}/`);
    return response.data;
  },
  
  // Admin - get all announcements
  adminList: async () => {
    const response = await api.get('/journals/admin/announcements/');
    return response.data;
  },
  
  // Admin - create announcement
  create: async (formData: FormData) => {
    const response = await api.post('/journals/admin/announcements/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Admin - update announcement
  update: async (id: number, formData: FormData) => {
    const response = await api.patch(`/journals/admin/announcements/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Admin - delete announcement
  delete: async (id: number) => {
    const response = await api.delete(`/journals/admin/announcements/${id}/`);
    return response.data;
  },
};

// =============================================================================
// Corporate Affiliations API
// =============================================================================

export const affiliationsApi = {
  // Public - get all active affiliations
  list: async () => {
    const response = await api.get('/journals/affiliations/');
    return response.data;
  },
  
  // Admin - get all affiliations (including inactive)
  adminList: async () => {
    const response = await api.get('/journals/admin/affiliations/');
    return response.data;
  },
  
  // Admin - get single affiliation
  get: async (id: number) => {
    const response = await api.get(`/journals/admin/affiliations/${id}/`);
    return response.data;
  },
  
  // Admin - create affiliation with logo
  create: async (formData: FormData) => {
    const response = await api.post('/journals/admin/affiliations/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Admin - update affiliation
  update: async (id: number, formData: FormData) => {
    const response = await api.patch(`/journals/admin/affiliations/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Admin - delete affiliation
  delete: async (id: number) => {
    const response = await api.delete(`/journals/admin/affiliations/${id}/`);
    return response.data;
  },
};

// =============================================================================
// Editorial Board API
// =============================================================================

export const editorialBoardApi = {
  list: async (journalId: number) => {
    const response = await api.get('/journals/admin/editorial-board/', {
      params: { journal: journalId }
    });
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await api.post('/journals/admin/editorial-board/create/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id: number, data: FormData) => {
    const response = await api.patch(`/journals/admin/editorial-board/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/journals/admin/editorial-board/${id}/`);
    return response.data;
  }
};

// =============================================================================
// CTA Cards API
// =============================================================================

export const ctaCardsApi = {
  // Public - get all active cards
  list: async () => {
    const response = await api.get('/journals/cta-cards/');
    return response.data;
  },
  
  // Admin - get all cards
  adminList: async () => {
    const response = await api.get('/journals/admin/cta-cards/');
    return response.data;
  },
  
  // Admin - create card
  create: async (formData: FormData) => {
    const response = await api.post('/journals/admin/cta-cards/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Admin - update card
  update: async (id: number, formData: FormData) => {
    const response = await api.patch(`/journals/admin/cta-cards/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Admin - delete card
  delete: async (id: number) => {
    const response = await api.delete(`/journals/admin/cta-cards/${id}/`);
    return response.data;
  },
};

// =============================================================================
// Journal Indexing API
// =============================================================================

export const indexingApi = {
  list: async (journalId: number) => {
    const response = await api.get('/journals/admin/indexing/', {
      params: { journal: journalId }
    });
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await api.post('/journals/admin/indexing/create/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id: number, data: FormData) => {
    const response = await api.patch(`/journals/admin/indexing/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/journals/admin/indexing/${id}/`);
    return response.data;
  }
};

// =============================================================================
// CTA Buttons & Forms API
// =============================================================================

export const ctaButtonsApi = {
  // Public
  list: async () => {
    const response = await api.get('/journals/cta-buttons/');
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/journals/cta-buttons/by-slug/${slug}/`);
    return response.data;
  },
  
  submitForm: async (formData: FormData) => {
    const response = await api.post('/journals/cta-buttons/submit/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Admin
  adminList: async () => {
    const response = await api.get('/journals/admin/cta-buttons/');
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await api.patch(`/journals/admin/cta-buttons/${id}/`, data);
    return response.data;
  },
  
  submissions: async () => {
    const response = await api.get('/journals/admin/cta-submissions/');
    return response.data;
  },
};

export default api;



