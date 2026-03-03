/**
 * Design System Utility Functions
 */

import { colors, spacing, borderRadius, typography } from './constants'

/**
 * Get color value from design system
 * @param {string} path - Color path (e.g., 'base.foreground')
 * @returns {string} Color value
 */
export function getColor(path) {
  const keys = path.split('.')
  let value = colors
  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) {
      return '#000000'
    }
  }
  return value
}

/**
 * Get spacing value
 * @param {string|number} key - Spacing key
 * @returns {string} Spacing value
 */
export function getSpacing(key) {
  return spacing[key] || `${key}px`
}

/**
 * Get border radius value
 * @param {string} key - Border radius key ('md' | 'xl')
 * @returns {string} Border radius value
 */
export function getBorderRadius(key) {
  return borderRadius[key] || borderRadius.md
}

/**
 * Get typography style
 * @param {string} variant - Typography variant
 * @returns {object} Typography style object
 */
export function getTypography(variant) {
  return typography.fontSize[variant] || typography.fontSize['body-base']
}

/**
 * CSS variable helpers for inline styles
 */
export const cssVars = {
  '--base-background': colors.base.background,
  '--base-foreground': colors.base.foreground,
  '--base-muted': colors.base.muted,
  '--base-muted-foreground': colors.base['muted-foreground'],
  '--base-muted-foreground-plus': colors.base['muted-foreground+'],
  '--base-secondary': colors.base.secondary,
  '--base-secondary-foreground': colors.base['secondary-foreground'],
  '--base-border': colors.base.border,
  '--base-card-foreground': colors.base['card-foreground'],
  '--spacing-1': spacing[1],
  '--spacing-2': spacing[2],
  '--spacing-3': spacing[3],
  '--spacing-4': spacing[4],
  '--spacing-6': spacing[6],
  '--spacing-8': spacing[8],
  '--border-radius-md': borderRadius.md,
  '--border-radius-xl': borderRadius.xl,
}

