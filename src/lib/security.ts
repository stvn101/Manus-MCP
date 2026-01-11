/**
 * Security utility functions for input validation and sanitization
 */

// Maximum lengths for various input types
export const INPUT_LIMITS = {
  SERVER_NAME: 100,
  SERVER_URL: 500,
  CHAT_MESSAGE: 10000,
  GENERIC_TEXT: 1000,
} as const;

/**
 * Validates a WebSocket or HTTP URL
 * @param url - The URL string to validate
 * @returns true if valid, false otherwise
 */
export function isValidServerUrl(url: string): boolean {
  if (!url || url.length > INPUT_LIMITS.SERVER_URL) {
    return false;
  }

  try {
    const parsed = new URL(url);
    // Only allow ws, wss, http, https protocols
    const allowedProtocols = ['ws:', 'wss:', 'http:', 'https:'];
    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitizes text input by removing potentially dangerous characters
 * @param input - The input string to sanitize
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string
 */
export function sanitizeTextInput(input: string, maxLength: number = INPUT_LIMITS.GENERIC_TEXT): string {
  if (!input) return '';
  
  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);
  
  // Remove null bytes and control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
}

/**
 * Escapes HTML entities to prevent XSS
 * @param str - The string to escape
 * @returns Escaped string safe for HTML rendering
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Validates server name format
 * @param name - The server name to validate
 * @returns true if valid, false otherwise
 */
export function isValidServerName(name: string): boolean {
  if (!name || name.length > INPUT_LIMITS.SERVER_NAME) {
    return false;
  }
  
  // Allow alphanumeric, spaces, hyphens, underscores
  const validPattern = /^[\w\s\-]+$/;
  return validPattern.test(name.trim());
}

/**
 * Sets a secure cookie
 * @param name - Cookie name
 * @param value - Cookie value
 * @param maxAge - Max age in seconds
 */
export function setSecureCookie(name: string, value: string, maxAge: number): void {
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict${secureFlag}`;
}
