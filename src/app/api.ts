const BASE_URL = 'http://101.201.173.122:5000/api';

export async function login(username: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

export async function getUsers(token: string) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function createUser(token: string, data: { name: string; age?: number; email?: string }) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}