const API_KEY_STORAGE_KEY = 'prd_review_api_key';
const REMEMBER_KEY_STORAGE_KEY = 'prd_review_remember_key';

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function saveAPIKey(apiKey: string, remember: boolean): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  if (remember) {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    localStorage.setItem(REMEMBER_KEY_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.setItem(REMEMBER_KEY_STORAGE_KEY, 'false');
  }
}

export function loadAPIKey(): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  const remember = localStorage.getItem(REMEMBER_KEY_STORAGE_KEY);
  if (remember === 'true') {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }
  return null;
}

export function clearAPIKey(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(REMEMBER_KEY_STORAGE_KEY);
}

export function isAPIKeyRemembered(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  return localStorage.getItem(REMEMBER_KEY_STORAGE_KEY) === 'true';
}
