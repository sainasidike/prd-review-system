const API_KEY_STORAGE_KEY = 'prd_review_api_key';
const REMEMBER_KEY_STORAGE_KEY = 'prd_review_remember_key';

export function saveAPIKey(apiKey: string, remember: boolean): void {
  if (remember) {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    localStorage.setItem(REMEMBER_KEY_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.setItem(REMEMBER_KEY_STORAGE_KEY, 'false');
  }
}

export function loadAPIKey(): string | null {
  const remember = localStorage.getItem(REMEMBER_KEY_STORAGE_KEY);
  if (remember === 'true') {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }
  return null;
}

export function clearAPIKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(REMEMBER_KEY_STORAGE_KEY);
}

export function isAPIKeyRemembered(): boolean {
  return localStorage.getItem(REMEMBER_KEY_STORAGE_KEY) === 'true';
}
