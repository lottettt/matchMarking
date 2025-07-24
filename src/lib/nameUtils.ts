/**
 * Utility functions for handling player names
 */

/**
 * Truncates a name to fit within a certain character limit
 * @param name - The full name
 * @param maxLength - Maximum number of characters (default: 12)
 * @returns Truncated name with ellipsis if needed
 */
export const truncateName = (name: string, maxLength: number = 12): string => {
  if (name.length <= maxLength) {
    return name
  }
  return name.substring(0, maxLength - 1) + '…'
}

/**
 * Formats a name for display in small spaces by showing initials + last name
 * @param name - The full name
 * @returns Formatted name (e.g., "John Smith" -> "J. Smith")
 */
export const formatNameCompact = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return truncateName(parts[0], 12)
  }
  
  if (parts.length === 2) {
    const [first, last] = parts
    return `${first.charAt(0)}. ${last}`
  }
  
  // For names with more than 2 parts, use first initial + last part
  const first = parts[0]
  const last = parts[parts.length - 1]
  return `${first.charAt(0)}. ${last}`
}

/**
 * Formats a name for display in very small spaces (badges/tags)
 * @param name - The full name
 * @param maxLength - Maximum length for the result (default: 10)
 * @returns Ultra-compact name
 */
export const formatNameUltraCompact = (name: string, maxLength: number = 10): string => {
  const parts = name.trim().split(' ')
  
  if (parts.length === 1) {
    return truncateName(parts[0], maxLength)
  }
  
  // Try first initial + last name
  const compact = formatNameCompact(name)
  if (compact.length <= maxLength) {
    return compact
  }
  
  // If still too long, truncate the last name
  const [first, last] = parts
  const maxLastLength = maxLength - 3 // Account for "X. "
  return `${first.charAt(0)}. ${truncateName(last, maxLastLength)}`
}

/**
 * Gets initials from a name (for avatars)
 * @param name - The full name
 * @returns Initials (max 2 characters)
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
