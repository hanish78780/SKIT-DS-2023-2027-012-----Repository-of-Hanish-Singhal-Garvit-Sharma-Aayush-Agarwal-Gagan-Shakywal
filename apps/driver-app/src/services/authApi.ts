import {getApiBaseUrl} from './tripLocationApi';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'student' | 'admin';
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}

export async function loginDriver(
  email: string,
  password: string,
): Promise<AuthSession> {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: email.trim().toLowerCase(), password}),
  });

  const result = (await response.json()) as LoginResponse;

  if (!response.ok || !result.success || !result.token || !result.user) {
    throw new Error(result.message || 'Unable to sign in. Please try again.');
  }

  if (result.user.role !== 'driver') {
    throw new Error(
      'This account is not authorized to access the Driver Portal.',
    );
  }

  return {
    token: result.token,
    user: result.user,
  };
}