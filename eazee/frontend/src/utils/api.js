import { supabase } from './supabase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const getToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

export const api = {
  async get(path) {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  async post(path, body) {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async postForm(path, formData) {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  async put(path, body) {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  async delete(path) {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  async publicGet(path) {
    const res = await fetch(`${API_URL}${path}`);
    return res.json();
  }
};
