/**
 * Strips undefined, null, and empty-string values from an object.
 * Only includes keys whose values are "meaningful".
 * Booleans (including false) and 0 are preserved.
 */
export function cleanPayload(raw: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(raw)) {
    // Keep booleans (even false)
    if (typeof value === 'boolean') {
      cleaned[key] = value;
      continue;
    }
    // Keep numbers (even 0)
    if (typeof value === 'number' && !isNaN(value)) {
      cleaned[key] = value;
      continue;
    }
    // Keep non-empty arrays
    if (Array.isArray(value)) {
      if (value.length > 0) cleaned[key] = value;
      continue;
    }
    // Keep non-empty strings
    if (typeof value === 'string' && value.trim() !== '') {
      cleaned[key] = value.trim();
      continue;
    }
    // Keep objects (non-null)
    if (value !== null && value !== undefined && typeof value === 'object') {
      cleaned[key] = value;
      continue;
    }
    // Skip null, undefined, empty strings
  }
  return cleaned;
}